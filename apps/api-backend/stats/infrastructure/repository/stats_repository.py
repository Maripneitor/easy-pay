from bson import ObjectId
from group.infrastructure.repository.group_repository import MongoGroupRepository
from group.infrastructure.repository.item_repository import MongoItemRepository
from group.application.get_balance import GetGroupBalancesUseCase

class StatsRepository:
    def __init__(self, db):
        self.db = db
        self.expenses = db["Items"]
        self.groups = db["Groups"]
        # Usamos los nuevos repositorios centralizados
        self.group_repo = MongoGroupRepository()
        self.item_repo = MongoItemRepository()
        self.balance_uc = GetGroupBalancesUseCase(self.item_repo, self.group_repo)

    async def get_user_expenses_by_category(self, user_id: str):
        # En una app real, los items tendrían un campo 'categoria'. 
        # Si no existe, agruparemos por nombre de grupo como fallback o usaremos una lógica de inferencia.
        pipeline = [
            {"$match": {"participantes_ids": user_id}},
            {"$addFields": {
                "num_participantes": {"$max": [1, {"$size": {"$ifNull": ["$participantes_ids", []]}}]},
                "costo_total_item": {"$multiply": [{"$ifNull": ["$precio", 0]}, {"$ifNull": ["$cantidad", 1]}]},
                "categoria_final": {"$ifNull": ["$categoria", "Otros"]}
            }},
            {"$group": {
                "_id": "$categoria_final",
                "total": {"$sum": {"$divide": ["$costo_total_item", "$num_participantes"]}}
            }},
            {"$project": {
                "category": "$_id",
                "amount": {"$round": ["$total", 2]},
                "_id": 0
            }},
            {"$sort": {"amount": -1}}
        ]
        cursor = self.expenses.aggregate(pipeline)
        return await cursor.to_list(length=None)

    async def get_user_balances(self, user_id: str):
        """
        Calcula cuánto le deben y cuánto debe el usuario a través de todos sus grupos.
        """
        # 1. Buscamos todos los grupos donde el usuario es integrante
        groups_cursor = self.groups.find({"integrantes": user_id})
        groups = await groups_cursor.to_list(length=None)
        
        owed_to_user = 0.0
        user_owes = 0.0
        
        for g in groups:
            g_id = str(g["_id"])
            try:
                # Usamos el caso de uso existente para consistencia matemática
                balances_res = await self.balance_uc.execute(g_id)
                if balances_res.get("status") == "success":
                    detalle = balances_res.get("balance_detallado", [])
                    # Buscamos el balance específico de este usuario en este grupo
                    for entry in detalle:
                        if entry["usuario_id"] == user_id:
                            bal = entry["balance"]
                            if bal > 0:
                                owed_to_user += bal
                            else:
                                user_owes += abs(bal)
            except Exception as e:
                print(f"Error calculando balance para grupo {g_id}: {e}")
                
        return {
            "owed_to_user": round(owed_to_user, 2),
            "user_owes": round(user_owes, 2)
        }

    async def get_monthly_trend(self, user_id: str):
        # Mock de tendencia para el demo, en producción se usaría el campo 'fecha'
        return [
            {"month": "Abr", "total": 450.0},
            {"month": "May", "total": 890.0},
            {"month": "Jun", "total": 1200.0},
            {"month": "Jul", "total": 750.0}
        ]