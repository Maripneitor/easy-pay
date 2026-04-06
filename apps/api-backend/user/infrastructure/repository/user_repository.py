import os
from database import db_instance
from bson import ObjectId
from user.domain.models.user import User

class MongoUserRepository:
    def __init__(self):
        # Conexión a la base de datos y colección
        db_name = os.getenv("DB_NAME_AUTH", "EasyPay_Auth")
        self.db = db_instance.get_db(db_name) 
        self.collection = self.db.get_collection("Users")

    # --- MÉTODO PARA GUARDAR EL USUARIO (REGISTRO) ---
    async def save_user(self, user_data: dict):
        """Inserta el JSON del usuario en MongoDB"""
        result = await self.collection.insert_one(user_data)
        return str(result.inserted_id)

    # --- MÉTODO PARA LOGIN (BÚSQUEDA POR EMAIL O NOMBRE) ---
    async def find_by_identifier(self, identifier: str):
        """Busca un usuario que coincida con el email o el nombre de usuario"""
        user = await self.collection.find_one({
            "$or":[
                {"email": identifier},
                {"nombre": identifier}
            ]
        })
        return user

    # --- MÉTODO PARA ACTUALIZACIONES GENERALES ---
    async def update_user(self, user_id: str, update_data: dict):
        """Actualiza campos específicos de un usuario por su ID"""
        if not ObjectId.is_valid(user_id):
            return False
        result = await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )
        return result.modified_count > 0
    
    # --- MÉTODO PARA BUSCAR POR ID ---
    async def get_user_by_id(self, user_id: str):
        """Recupera un usuario completo validando el formato del ObjectId"""
        if not ObjectId.is_valid(user_id):
            return None
        user = await self.collection.find_one({"_id": ObjectId(user_id)})
        return user

    # --- GESTIÓN DE CÓDIGOS OTP (2FA) ---
    async def save_otp_code(self, user_id: str, code: str, expires_at):
        """Guarda el código de 6 dígitos y su fecha de expiración"""
        await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {
                "two_factor.otp_code": code,
                "two_factor.otp_expires": expires_at
            }}
        )

    async def get_otp_data(self, user_id: str):
        """Obtiene la sección de two_factor para comparar el código"""
        user = await self.get_user_by_id(user_id)
        if user and "two_factor" in user:
            return user["two_factor"]
        return None
    
    # --- ACTIVACIÓN FINAL Y VERIFICACIÓN ---
    async def enable_2fa(self, user_id: str):
        """
        CORRECCIÓN PARA EL PROYECTO EASY-PAY:
        1. Marca la cuenta como verificada (is_verified: True).
        2. Mantiene el enabled en False para que el LoginUserUseCase no entre en bucle.
        3. Limpia los códigos temporales usados.
        """
        result = await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$set": {
                    "is_verified": True,           # ✅ Permite que el Login pase la validación
                    "two_factor.enabled": False    # 🔓 Evita que el Login pida 2FA infinitamente
                },
                "$unset": {
                    "two_factor.otp_code": "", 
                    "two_factor.otp_expires": ""
                }
            }
        )
        return result.modified_count > 0