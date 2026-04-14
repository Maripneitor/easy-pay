from bson import ObjectId
from database import db_instance

class MongoItemRepository:
    def __init__(self):
        # Conexión a la base de datos de grupos/gastos
        self.db = db_instance.get_db("EasyPay_Groups")
        self.collection = self.db.get_collection("Items")

    async def save_item(self, item_data: dict):
        """Guarda un gasto y retorna su ID"""
        result = await self.collection.insert_one(item_data)
        return str(result.inserted_id)

    async def find_by_group(self, group_id: str):
        """
        Recupera todos los ítems de un grupo y convierte los ObjectIds 
        a strings para que FastAPI no lance Error 500.
        """
        cursor = self.collection.find({"group_id": group_id})
        items = await cursor.to_list(length=100)
        
        # ✅ PROCESAMIENTO: Limpieza de IDs para compatibilidad con JSON
        for item in items:
            if "_id" in item:
                item["id"] = str(item["_id"])
                del item["_id"]
        
        return items