from database import db_instance
from bson import ObjectId
from user.domain.models.user import User

class MongoUserRepository:
    def __init__(self):
        # Conexión a la base de datos y colección
        self.db = db_instance.get_db("EasyPay_Auth") 
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
        if not ObjectId.is_valid(user_id):
            return # Bypass para modo demo
            
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
    # --- GESTIÓN DE TARJETAS (PAYMENT METHODS) ---
    async def get_cards(self, user_id: str):
        """Recupera la lista de tarjetas guardadas del usuario"""
        user = await self.get_user_by_id(user_id)
        if user and "cards" in user:
            return user["cards"]
        return []

    async def add_card(self, user_id: str, card_data: dict):
        """Agrega una nueva tarjeta al perfil del usuario"""
        if not ObjectId.is_valid(user_id):
            return False
            
        # Si es la primera, la marcamos como default
        cards = await self.get_cards(user_id)
        if len(cards) == 0:
            card_data["is_default"] = True
        
        result = await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$push": {"cards": card_data}}
        )
        return result.modified_count > 0

    async def remove_card(self, user_id: str, card_id: str):
        """Elimina una tarjeta por su ID interno"""
        if not ObjectId.is_valid(user_id):
            return False
            
        result = await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$pull": {"cards": {"id": card_id}}}
        )
        return result.modified_count > 0

    async def set_default_card(self, user_id: str, card_id: str):
        """Cambia la tarjeta predeterminada"""
        if not ObjectId.is_valid(user_id):
            return False
            
        # 1. Quitamos default a todas
        await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"cards.$[].is_default": False}}
        )
        # 2. Ponemos default a la elegida
        result = await self.collection.update_one(
            {"_id": ObjectId(user_id), "cards.id": card_id},
            {"$set": {"cards.$.is_default": True}}
        )
        return result.modified_count > 0