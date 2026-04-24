import bcrypt
import os
from dotenv import load_dotenv
from user.infrastructure.security.auth_handler import create_access_token

load_dotenv()

class LoginUserUseCase:
    def __init__(self, user_repository):
        self.user_repository = user_repository

    async def execute(self, identifier: str, password: str):
        # 1. Buscamos el usuario por el email o identifier
        user_data = await self.user_repository.find_by_identifier(identifier)
        
        # 2. Validación de existencia y Contraseña
        # checkpw requiere bytes, por eso usamos .encode('utf-8')
        if not user_data or not bcrypt.checkpw(
            password.encode('utf-8'),
            user_data["password_hash"].encode('utf-8')
        ):
            return {"status": "error", "message": "Credenciales incorrectas"}
        
        # 3. Validación de cuenta verificada (Email)
        if not user_data.get("is_verified", False):
            return {
                "status": "not_verified", 
                "message": "Debes verificar tu correo antes de iniciar sesión.",
                "user_id": str(user_data["_id"]),
                "email": user_data["email"]
            }
        
        # 4. Validación de Segundo Factor (2FA)
        two_factor = user_data.get("two_factor", {})
        if two_factor.get("enabled", False):
            # No generamos el token final aún, el frontend debe redirigir a la vista de código
            return {
                "status": "2fa_required",
                "message": "Autenticación de dos pasos requerida",
                "user_id": str(user_data["_id"])
            }

        # 5. Generación del Token usando nuestro AuthHandler
        # Delegamos la creación del payload y la firma al handler centralizado
        token = create_access_token(
            user_id=str(user_data["_id"]),
            email=user_data["email"],
            nombre=user_data["nombre"]
        )

        # 6. Respuesta exitosa
        return {
            "status": "success",
            "message": "Login exitoso",
            "access_token": token,
            "user": {
                "id": str(user_data["_id"]),
                "nombre": user_data["nombre"],
                "email": user_data["email"],
                "2fa_enabled": two_factor.get("enabled", False) or user_data.get("is_verified", False)
            } 
        }