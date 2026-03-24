import random
from datetime import datetime, timedelta

class Setup2FAUseCase:
    # 1. Inyectamos el email_service en el constructor
    def __init__(self, repository, email_service):
        self.repository = repository
        self.email_service = email_service

    async def execute(self, user_id: str, email: str):
        otp_code = f"{random.randint(100000, 999999)}"
        expires_at = datetime.utcnow() + timedelta(minutes=5)

        #Intenta enviar el correo 
        try: 
            await self.email_service.send_otp(email, otp_code)
        except Exception as e:
            #Si el correo no existe, se corta aqui
            print(f"Debug: Error real al enviar a {email}: {e}")
            return{
                "status": "error",
                "message": "No se pudo enviar el correo. Verifica que la direcion sea valida."
            }
        
        #Si el envio fue un exito, se guada en la DB
        await self.repository.save_otp_code(user_id, otp_code,expires_at)

        return{"status": "success", "message": f"Código enviado a {email}"}
        