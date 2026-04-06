from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
import os
from dotenv import load_dotenv

load_dotenv()

conf = ConnectionConfig(
    MAIL_USERNAME = os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD"),
    MAIL_FROM = os.getenv("MAIL_FROM"),
    MAIL_SERVER = os.getenv("MAIL_SERVER", "smtp.gmail.com"),
    MAIL_PORT = int(os.getenv("MAIL_PORT", 587)),
    MAIL_STARTTLS = True if os.getenv("MAIL_PORT") == "587" else False,
    MAIL_SSL_TLS = True if os.getenv("MAIL_PORT") == "465" else False,
    USE_CREDENTIALS = True,
    VALIDATE_CERTS = True
)

class EmailService:
    async def send_otp(self, email_to: str, code: str):
        try:
            message = MessageSchema(
                subject="🔐 Código de Seguridad - Easy-Pay",
                recipients=[email_to],
                body=f"""
                    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #4f46e5;">Verificación de Identidad</h2>
                        <p>Te damos la bienvenida a <b>GP Easy-Pay</b>.</p>
                        <p>Tu código de seguridad es:</p>
                        <div style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #1f2937; border-radius: 8px;">
                            {code}
                        </div>
                        <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">Este código expirará en 5 minutos.</p>
                    </div>
                """,
                subtype="html"
            )
            fm = FastMail(conf)
            await fm.send_message(message)
            return True
        except Exception as e:
            # Imprimimos el error en la consola de Docker para que lo veas
            print(f"❌ Error al enviar correo: {e}")
            raise e