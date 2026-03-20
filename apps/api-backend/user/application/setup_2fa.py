import pyotp
import qrcode
import io
import base64

class Setup2FAUseCase:
    def __init__(self, user_repository):
        self.repository = user_repository

    async def execute(self, user_id: str):
        # 1. Generamos un secreto único para el usuario
        secret = pyotp.random_base32()
        
        # 2. Guardamos el secreto temporalmente en el usuario (aún no activado)
        await self.repository.update_2fa_secret(user_id, secret)
        
        # 3. Creamos el URI para el código QR
        # 'Easy-Pay' es el nombre que aparecerá en Google Authenticator
        auth_url = pyotp.totp.TOTP(secret).provisioning_uri(
            name="erick@example.com", # Aquí iría el email del usuario
            issuer_name="Easy-Pay"
        )
        
        return {"secret": secret, "qr_uri": auth_url}