from datetime import datetime
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
        pipeline = [
            {"$match": {"participantes_ids": user_id}},
            {"$addFields": {
                "num_participantes": {"$max": [1, {"$size": {"$ifNull": ["$participantes_ids", []]}}]},
                "costo_total_item": {"$multiply": [{"$ifNull": ["$precio", 0]}, {"$ifNull": ["$cantidad", 1]}]},
                "safe_date": {"$ifNull": ["$fecha_registro", datetime.utcnow()]}
            }},
            {"$addFields": {
                "user_share": {"$divide": ["$costo_total_item", "$num_participantes"]},
                "month_num": {"$month": "$safe_date"},
                "year_num": {"$year": "$safe_date"}
            }},
            {"$group": {
                "_id": {"month": "$month_num", "year": "$year_num"},
                "total": {"$sum": "$user_share"}
            }},
            {"$sort": {"_id.year": 1, "_id.month": 1}},
            {"$limit": 6}
        ]
        cursor = self.expenses.aggregate(pipeline)
        results = await cursor.to_list(length=None)
        
        month_names = {1: "Ene", 2: "Feb", 3: "Mar", 4: "Abr", 5: "May", 6: "Jun", 7: "Jul", 8: "Ago", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dic"}
        formatted_trend = []
        for r in results:
            if r["_id"].get("month"):
                month_str = month_names.get(r["_id"]["month"], "Mes")
                formatted_trend.append({"month": month_str, "total": round(r["total"], 2)})
        
        return formatted_trend

    async def get_income_vs_expenses(self, user_id: str):
        pipeline = [
            {"$match": {
                "$or": [
                    {"participantes_ids": user_id},
                    {"comprador_id": user_id}
                ]
            }},
            {"$addFields": {
                "num_participantes": {"$max": [1, {"$size": {"$ifNull": ["$participantes_ids", []]}}]},
                "costo_total_item": {"$multiply": [{"$ifNull": ["$precio", 0]}, {"$ifNull": ["$cantidad", 1]}]},
                "safe_date": {"$ifNull": ["$fecha_registro", datetime.utcnow()]},
                "is_participant": {"$in": [user_id, {"$ifNull": ["$participantes_ids", []]}]},
                "is_buyer": {"$eq": ["$comprador_id", user_id]}
            }},
            {"$addFields": {
                "user_share": {"$cond": [{"$eq": ["$is_participant", True]}, {"$divide": ["$costo_total_item", "$num_participantes"]}, 0]},
            }},
            {"$addFields": {
                "gastos": "$user_share",
                "ingresos": {"$cond": [{"$eq": ["$is_buyer", True]}, {"$subtract": ["$costo_total_item", "$user_share"]}, 0]},
                "month_num": {"$month": "$safe_date"},
                "year_num": {"$year": "$safe_date"}
            }},
            {"$group": {
                "_id": {"month": "$month_num", "year": "$year_num"},
                "gastos": {"$sum": "$gastos"},
                "ingresos": {"$sum": "$ingresos"}
            }},
            {"$sort": {"_id.year": 1, "_id.month": 1}},
            {"$limit": 6}
        ]
        cursor = self.expenses.aggregate(pipeline)
        results = await cursor.to_list(length=None)
        
        month_names = {1: "Ene", 2: "Feb", 3: "Mar", 4: "Abr", 5: "May", 6: "Jun", 7: "Jul", 8: "Ago", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dic"}
        formatted = []
        for r in results:
            if r["_id"].get("month"):
                month_str = month_names.get(r["_id"]["month"], "Mes")
                formatted.append({
                    "month": month_str, 
                    "ingresos": round(r["ingresos"], 2),
                    "gastos": round(r["gastos"], 2)
                })
        
        return formatted

    async def get_user_transactions(self, user_id: str):
        """
        Obtiene el historial real de transacciones (pagos liquidados e ítems pagados).
        """
        transactions_col = self.db.get_collection("Transactions")
        # Buscamos transacciones donde el usuario sea pagador o receptor
        cursor = transactions_col.find({
            "$or": [{"payer_id": user_id}, {"receiver_id": user_id}]
        }).sort("date", -1)
        
        transactions = await cursor.to_list(length=50)
        result = []
        
        for t in transactions:
            group = await self.groups.find_one({"_id": ObjectId(t["group_id"])}) if t.get("group_id") else None
            result.append({
                "id": str(t["_id"]),
                "type": t.get("type", "payment"),
                "group_name": group.get("nombre", "Individual") if group else "Individual",
                "amount": t["amount"],
                "date": t["date"].isoformat() if t.get("date") else None,
                "status": t.get("status", "completed"),
                "is_incoming": t.get("receiver_id") == user_id
            })
            
        return result