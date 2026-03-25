import jwt
import os
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv

load_dotenv()

class Verify2FAUseCase:
    def __init__(self, repository):
        self.repository = repository
        # Usamos la misma secret key que en tu LoginUserUseCase para que el token sea válido
        self.secret_key = os.getenv("JWT_SECRET", "estoesporsiacasosoloemergencia")

    async def execute(self, user_id: str, input_code: str):
        # 1. Buscamos al usuario completo en MongoDB para obtener sus datos (email, nombre, etc.)
        user_data = await self.repository.get_user_by_id(user_id)
        
        if not user_data:
            return {"status": "error", "message": "Usuario no encontrado"}

        # Obtenemos la sección de two_factor del documento del usuario
        otp_data = user_data.get("two_factor", {})
        
        if not otp_data or "otp_code" not in otp_data:
            return {"status": "error", "message": "No hay un código pendiente de verificación"}

        # 2. Validar expiración del código
        # Usamos timezone.utc para evitar desfases horarios con la base de datos
        now = datetime.now(timezone.utc).replace(tzinfo=None)
        if now > otp_data.get("otp_expires"):
            return {"status": "error", "message": "El código ha expirado. Solicita uno nuevo."}

        # 3. Comparación de códigos
        if input_code == otp_data.get("otp_code"):
            # ✅ ACTIVACIÓN: Actualiza is_verified a True y limpia los códigos en el repositorio
            # Este método en tu user_repository.py ya debe tener el "$set": {"is_verified": True}
            await self.repository.enable_2fa(user_id) 
            
            # 🔥 GENERACIÓN DEL TOKEN DE ACCESO (JWT) 🔥
            # Esto es lo que permite que el Frontend entre al Dashboard sin escalas
            payload = {
                "sub": str(user_data["_id"]),
                "email": user_data["email"],
                "nombre": user_data["nombre"],
                # Token válido por 24 horas
                "exp": datetime.now(timezone.utc) + timedelta(hours=24)
            }

            token = jwt.encode(payload, self.secret_key, algorithm="HS256")

            # Retornamos éxito con el Token y los datos del usuario
            return {
                "status": "success", 
                "message": "Verificación exitosa. Bienvenido.",
                "access_token": token,
                "user": {
                    "id": str(user_data["_id"]),
                    "nombre": user_data["nombre"],
                    "email": user_data["email"]
                }
            }
            
        # Si el código no coincide
        return {"status": "error", "message": "El código ingresado es incorrecto"}