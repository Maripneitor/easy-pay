import bcrypt
import jwt
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta

load_dotenv()

class LoginUserUseCase:
    def __init__(self, user_repository):
        self.user_repository = user_repository
        self.secret_key = os.getenv("JWT_SECRET", "estoesporsiacasosoloemergencia")

    async def execute(self, identifier: str, password: str):
        #Busacamos el usuarios por el email en infrastructure
        user_data = await self.user_repository.find_by_identifier(identifier)
       
        #Valicion de usuario y Contraseña (si el usuario no exite no compara contraseñas)
        if not user_data or not bcrypt.checkpw(
            password.encode('utf-8'),
            user_data["password_hash"].encode('utf-8')
        ):
           return{"status": "error", "message": "Credenciales incorrectas"}
        
        #Validacion de que este verificado el usuasrio
        if not user_data.get("is_verified", False):
            return {
                "status": "not_verified", 
                "message": "Debes verificar tu correo antes de iniciar sesión.",
                "user_id": str(user_data["_id"]),
                "email": user_data["email"]
            }
        
        #Validacion si el 2FA esta activo
        two_factor = user_data.get("two_factor", {})
        if two_factor.get("enabled", False):
            # No generamos el token final aún, pedimos el segundo paso
            return {
                "status": "2fa_required",
                "message": "Autenticación de dos pasos requerida",
                "user_id": str(user_data["_id"])
            }

        #Definicion de la infomarcion para el token(Payload)
        payload = {
            "sub": str(user_data["_id"]),
            "email": user_data["email"],
            "nombre": user_data["nombre"],
            "exp": datetime.utcnow() + timedelta(hours=24)#Se usa para el tiempo que sera valido el token
        }

        token = jwt.encode(payload, self.secret_key, algorithm="HS256" )

        return {
            "status": "success",
            "message": "Login exitoso",
            "access_token": token,
            "user": {
                "id": str (user_data["_id"]),
                "nombre": user_data["nombre"],
                "email": user_data["email"]
            } 
        }
