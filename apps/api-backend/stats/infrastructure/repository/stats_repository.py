from bson import ObjectId

class StatsRepository:
    def __init__(self, db):
        self.expenses = db["Items"] # La colección donde se guardan los gastos

    async def get_user_expenses_by_category(self, user_id: str):
        pipeline = [
            # 1. Filtramos los gastos donde el usuario es participante (lo que realmente consumió)
            {"$match": {
                "participantes_ids": user_id
            }},
            # 2. Calculamos el total del ítem y lo dividimos entre el número de participantes
            {"$addFields": {
                "num_participantes": {"$max": [1, {"$size": {"$ifNull": ["$participantes_ids", []]}}]},
                "costo_total_item": {"$multiply": ["$precio", {"$ifNull": ["$cantidad", 1]}]},
                "group_obj_id": {"$toObjectId": "$group_id"}
            }},
            {"$addFields": {
                "mi_parte": {"$divide": ["$costo_total_item", "$num_participantes"]}
            }},
            # 3. JOIN con la colección Groups para obtener el nombre del grupo
            {"$lookup": {
                "from": "Groups",
                "localField": "group_obj_id",
                "foreignField": "_id",
                "as": "group_info"
            }},
            {"$unwind": {
                "path": "$group_info",
                "preserveNullAndEmptyArrays": True
            }},
            # 4. Agrupamos por el nombre del grupo y sumamos solo la parte del usuario
            {"$group": {
                "_id": {"$ifNull": ["$group_info.nombre", "Grupo Eliminado o Desconocido"]},
                "total": {
                    "$sum": "$mi_parte"
                }
            }},
            # 5. Formateamos la salida
            {"$project": {
                "category": "$_id",
                "amount": "$total",
                "_id": 0
            }}
        ]
        cursor = self.expenses.aggregate(pipeline)
        return await cursor.to_list(length=None)