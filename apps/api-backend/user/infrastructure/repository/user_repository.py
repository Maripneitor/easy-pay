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
    
    async def get_user_by_id(self, user_id: str):
        # Validar el formato antes de buscar
        if not ObjectId.is_valid(user_id):
            return None
        user = await self.collection.find_one({"_id": ObjectId(user_id)})
        return user

    async def update_2fa_secret(self, user_id: str, secret: str):
        # Guardamos el secreto dentro del objeto anidado 'two_factor'
        # Usamos la notación de punto para entrar al objeto
        await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"two_factor.secret": secret}}
        )

    async def enable_2fa(self, user_id: str):
        # Activamos el booleano 'enabled' y podríamos limpiar códigos de recuperación
        await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"two_factor.enabled": True}}
        )