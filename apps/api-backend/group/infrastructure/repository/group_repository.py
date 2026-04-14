from bson import ObjectId
from database import db_instance

class MongoGroupRepository:
    def __init__(self):
        # Usamos la base de datos de grupos independiente
        self.db = db_instance.get_db("EasyPay_Groups")
        self.collection = self.db.get_collection("Groups")

    # 🛠️ FUNCIÓN DE APOYO: Convierte ObjectId a String y limpia para FastAPI
    def _map_group(self, group):
        if group:
            group["id"] = str(group["_id"])
            if "_id" in group:
                del group["_id"]
        return group

    async def save_group(self, group_data: dict):
        """Guarda un grupo y retorna el ID como string"""
        result = await self.collection.insert_one(group_data)
        return str(result.inserted_id)

    async def find_by_id(self, group_id: str):
        """Busca un grupo por ID"""
        if not ObjectId.is_valid(group_id):
            return None
            
        group = await self.collection.find_one({"_id": ObjectId(group_id)})
        return self._map_group(group)

    async def find_by_code(self, code: str):
        """
        Busca un grupo por su código de invitación.
        Ajustado para que coincida con el campo 'codigo_invitacion' en MongoDB.
        """
        # ⚠️ CAMBIO CLAVE: Usamos 'codigo_invitacion' como está en tu Mongo
        group = await self.collection.find_one({"codigo_invitacion": code})
        return self._map_group(group)

    async def add_member(self, group_id: str, user_id: str):
        """Añade un usuario a la lista de integrantes del grupo evitando duplicados"""
        if not ObjectId.is_valid(group_id):
            return False
            
        result = await self.collection.update_one(
            {"_id": ObjectId(group_id)},
            {"$addToSet": {"integrantes": user_id}}
        )
        return result.modified_count > 0 or result.matched_count > 0

    async def find_by_user(self, user_id: str):
        """Busca todos los grupos donde el usuario es integrante"""
        cursor = self.collection.find({"integrantes": user_id})
        groups = await cursor.to_list(length=100)
        return [self._map_group(g) for g in groups]

    async def get_all_groups(self):
        """Recupera todos los grupos registrados"""
        cursor = self.collection.find({})
        groups = await cursor.to_list(length=100)
        return [self._map_group(g) for g in groups]