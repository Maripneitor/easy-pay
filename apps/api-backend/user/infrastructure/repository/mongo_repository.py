from user.database import db_instance 
from user.domain.user import User

class MongoUserRepository:
    def __init__(self):
        # Usamos la instancia global que ya tiene el nombre de la DB del .env
        self.collection = db_instance.get_collection("users")

    async def save_user(self, user: User):
        # Usamos model_dump() si usas Pydantic v2 (está perfecto)
        await self.collection.insert_one(user.model_dump())
        
    async def find_by_identifier(self, identifier: str):
        # Aquí es donde pondrías la lógica del $or que platicamos
        user_data = await self.collection.find_one({
            "$or": [
                {"email": identifier},
                {"nombre": identifier}
            ]
        })
        return user_data