from user.database import db_instance
from bson import ObjectId
from user.domain.models.user import User

class MongoUserRepository:
    def __init__(self):
        self.collection = db_instance.get_collection("Users")
    
    #Metodo para guardar el usuario
    async def save_user(self, user_data: dict):
        #Insetamos el json en MongoDB
        result = await self.collection.insert_one(user_data)
        return str(result.inserted_id)#Retomamos el ID como string para facilitar lectura en front

    #Metodo para cargar Login por Nombre/Email
    async def find_by_identifier(self, identifier: str):
        user = await self.collection.find_one({
            "$or":[
                {"email": identifier},
                {"nombre": identifier}
            ]
        })
        return user

    async def update_user(self, user_id: str, update_data: dict):
        
        result = await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )
        return result.modified_count > 0
    