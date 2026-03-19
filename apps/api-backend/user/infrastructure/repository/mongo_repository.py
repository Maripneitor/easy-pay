from bson import ObjectId # 1. IMPORTANTE: Agrega este import arriba
from user.database import db_instance 
from user.domain.user import User

class MongoUserRepository:
    def __init__(self):
        # Usamos la instancia global que ya tiene el nombre de la DB del .env
        self.collection = db_instance.get_collection("users")

    async def save_user(self, user: User):
        await self.collection.insert_one(user.model_dump())
        
    async def find_by_identifier(self, identifier: str):
        user_data = await self.collection.find_one({
            "$or": [
                {"email": identifier},
                {"nombre": identifier}
            ]
        })
        return user_data

    # 2. NUEVO MÉTODO PARA ACTUALIZAR
    async def update_user(self, user_id: str, update_data: dict):
        """
        Busca un usuario por su ID de MongoDB y actualiza sus campos.
        """
        # Validamos que el ID tenga el formato correcto de MongoDB (24 caracteres hex)
        if not ObjectId.is_valid(user_id):
            return False
            
        result = await self.collection.update_one(
            {"_id": ObjectId(user_id)}, # Convertimos el string a ObjectId
            {"$set": update_data}       # Usamos $set para actualizar solo lo que enviamos
        )
        
        # matched_count > 0 significa que encontró al usuario
        return result.matched_count > 0