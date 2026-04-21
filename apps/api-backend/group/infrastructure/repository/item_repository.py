from bson import ObjectId
from database import db_instance

class MongoItemRepository:
    def __init__(self):
        # 1. Conexión a la base de datos de grupos/gastos
        self.db_groups = db_instance.get_db("EasyPay_Groups")
        self.items_collection = self.db_groups.get_collection("Items")
        
        # 2. Conexión a la base de datos de Auth para traer los nombres
        self.db_auth = db_instance.get_db("EasyPay_Auth")
        self.users_collection = self.db_auth.get_collection("Users")

    async def save_item(self, item_data: dict):
        """Guarda un gasto y retorna su ID"""
        result = await self.items_collection.insert_one(item_data)
        return str(result.inserted_id)

    async def find_by_group(self, group_id: str):
        """
        Recupera los ítems de un grupo, trayendo el nombre del comprador
        y la lista de nombres de los participantes.
        """
        cursor = self.items_collection.find({"group_id": group_id})
        items = await cursor.to_list(length=100)
        
        for item in items:
            item["id"] = str(item["_id"])
            if "_id" in item:
                del item["_id"]
            
            # 1. BUSCAR NOMBRE DEL COMPRADOR
            comprador_id = item.get("comprador_id")
            if comprador_id and ObjectId.is_valid(comprador_id):
                user = await self.users_collection.find_one(
                    {"_id": ObjectId(comprador_id)}, 
                    {"nombre": 1}
                )
                item["nombre_comprador"] = user.get("nombre", "Usuario") if user else "Desconocido"
            
            # 2. 🚩 NUEVO: BUSCAR NOMBRES DE PARTICIPANTES (Para ver entre quiénes se divide)
            participantes_ids = item.get("participantes_ids", [])
            if participantes_ids:
                # Buscamos todos los nombres de los participantes de una sola vez
                # Convertimos strings a ObjectId
                obj_ids = [ObjectId(uid) for uid in participantes_ids if ObjectId.is_valid(uid)]
                
                users_cursor = self.users_collection.find(
                    {"_id": {"$in": obj_ids}},
                    {"nombre": 1}
                )
                
                # Creamos una lista de nombres limpia
                nombres = []
                async for u in users_cursor:
                    nombres.append(u.get("nombre", "Usuario"))
                
                item["nombres_participantes"] = nombres
            else:
                item["nombres_participantes"] = []
        
        return items

    async def update_item(self, item_id: str, item_data: dict):
        """Actualiza un gasto específico en la colección Items"""
        if not ObjectId.is_valid(item_id):
            return False
            
        result = await self.items_collection.update_one(
            {"_id": ObjectId(item_id)},
            {"$set": item_data}
        )
        return result.modified_count > 0

    async def delete_item(self, item_id: str):
        """Elimina un gasto específico de la colección Items"""
        if not ObjectId.is_valid(item_id):
            return False
            
        result = await self.items_collection.delete_one({"_id": ObjectId(item_id)})
        return result.deleted_count > 0