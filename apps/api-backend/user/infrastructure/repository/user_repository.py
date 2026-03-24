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

    async def save_otp_code(self, user_id: str, code: str, expires_at):
        """Guarda el código de 6 dígitos y su expiración"""
        await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {
                "two_factor.otp_code": code,
                "two_factor.otp_expires": expires_at,
                "two_factor.enabled": True 
            }}
        )

    async def get_otp_data(self, user_id: str):
        """Obtiene el código guardado para comparar"""
        user = await self.get_user_by_id(user_id)
        if user and "two_factor" in user:
            return user["two_factor"]
        return None
    
    async def enable_2fa(self, user_id: str):
        """
        Activa formalmente el 2FA en el perfil del usuario 
        y limpia los códigos temporales de la base de datos.
        """
        from bson import ObjectId
        await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$set": {"two_factor.enabled": True},
                "$unset": {
                    "two_factor.otp_code": "", 
                    "two_factor.otp_expires": ""
                }
            }
        )
        return True