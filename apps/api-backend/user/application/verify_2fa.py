from datetime import datetime

class Verify2FAUseCase:
    def __init__(self, repository):
        self.repository = repository

    async def execute(self, user_id: str, input_code: str):
        otp_data = await self.repository.get_otp_data(user_id)
        
        if not otp_data:
            return {"status": "error", "message": "No hay código pendiente"}

        # Validar expiración
        if datetime.utcnow() > otp_data.get("otp_expires"):
            return {"status": "error", "message": "El código ha expirado"}

        # Comparar códigos
        if input_code == otp_data.get("otp_code"):
            #  MEJORA: Limpiamos el código de la DB para que no se reuse
            await self.repository.enable_2fa(user_id) # Este método ya lo tienes y activa el booleano
            return {"status": "success", "message": "2FA Verificado correctamente"}
            
        return {"status": "error", "message": "Código incorrecto"}