import pyotp
from fastapi import HTTPException

class Verify2FAUseCase:
    def __init__(self, user_repository):
        self.user_repository = user_repository

    async def execute(self, user_id: str, code: str):
        # 1. Buscamos al usuario en el repositorio
        user_data = await self.user_repository.find_by_id(user_id)
        if not user_data:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        # 2. Obtenemos el secreto que guardamos previamente
        # Accedemos a través de la estructura que definiste en tu modelo
        secret = user_data.get("two_factor", {}).get("secret")
        
        if not secret:
            raise HTTPException(status_code=400, detail="El 2FA no ha sido configurado")

        # 3. Usamos pyotp para verificar si el código de 6 dígitos es válido
        totp = pyotp.TOTP(secret)
        
        if totp.verify(code):
            # 4. Si es válido, activamos formalmente el 2FA en la DB
            await self.user_repository.enable_2fa(user_id)
            return {"status": "success", "message": "2FA activado correctamente"}
        else:
            raise HTTPException(status_code=400, detail="Código de verificación inválido")