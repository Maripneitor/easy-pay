from bson import ObjectId
from database import db_instance

class MongoGroupRepository:
    def __init__(self):
        # Base de datos de grupos
        self.db = db_instance.get_db("EasyPay_Groups")
        self.collection = self.db.get_collection("Groups")
        
        # 🚩 AGREGADO: Referencia a la base de datos de usuarios para obtener los nombres
        self.db_auth = db_instance.get_db("EasyPay_Auth")
        self.users_collection = self.db_auth.get_collection("Users")

    def _map_group(self, group):
        if group:
            group["id"] = str(group["_id"])
            if "_id" in group:
                del group["_id"]
        return group

    async def save_group(self, group_data: dict):
        result = await self.collection.insert_one(group_data)
        return str(result.inserted_id)

    # 🛠️ NUEVA FUNCIÓN: Obtiene el grupo con los nombres de los integrantes
    async def find_by_id_detailed(self, group_id: str):
        """Busca un grupo y reemplaza los IDs de integrantes por objetos {id, nombre}"""
        if not ObjectId.is_valid(group_id):
            return None
            
        group = await self.collection.find_one({"_id": ObjectId(group_id)})
        if not group:
            return None

        # 1. Extraer la lista de IDs (strings)
        integrantes_ids = group.get("integrantes", [])

        # 2. Buscar nombres en la base de datos de Auth
        # Solo traemos los campos que nos interesan: nombre y _id
        usuarios_cursor = self.users_collection.find(
            {"_id": {"$in": [ObjectId(uid) for uid in integrantes_ids]}},
            {"nombre": 1}
        )
        
        # 3. Mapear a una lista de objetos {id, nombre}
        miembros_detallados = []
        async for user in usuarios_cursor:
            miembros_detallados.append({
                "id": str(user["_id"]),
                "nombre": user.get("nombre") or "Usuario sin nombre"
            })

        # 4. Limpiar el grupo y meter la nueva lista detallada
        group = self._map_group(group)
        group["integrantes"] = miembros_detallados
        return group

    async def find_by_id(self, group_id: str):
        """Busca un grupo por ID (Versión simple)"""
        if not ObjectId.is_valid(group_id):
            return None
        group = await self.collection.find_one({"_id": ObjectId(group_id)})
        return self._map_group(group)

    async def find_by_code(self, code: str):
        group = await self.collection.find_one({"codigo_invitacion": code})
        return self._map_group(group)

    async def add_member(self, group_id: str, user_id: str):
        if not ObjectId.is_valid(group_id):
            return False
        result = await self.collection.update_one(
            {"_id": ObjectId(group_id)},
            {"$addToSet": {"integrantes": user_id}}
        )
        return result.modified_count > 0 or result.matched_count > 0

    async def find_by_user(self, user_id: str):
        cursor = self.collection.find({"integrantes": user_id})
        groups = await cursor.to_list(length=100)
        return [self._map_group(g) for g in groups]

    async def get_all_groups(self):
        cursor = self.collection.find({})
        groups = await cursor.to_list(length=100)
        return [self._map_group(g) for g in groups]