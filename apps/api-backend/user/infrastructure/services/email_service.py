from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from dotenv import load_dotenv
import os
import logging

# Cargar variables de entorno desde la raíz
# apps/api-backend/user/infrastructure/services/email_service.py -> ../../../../../.env
load_dotenv(os.path.join(os.path.dirname(__file__), "../../../../../.env"))

logger = logging.getLogger("email_service")

def get_email_config():
    user = os.getenv("MAIL_USERNAME")
    password = os.getenv("MAIL_PASSWORD")
    mail_from = os.getenv("MAIL_FROM", user)
    
    return ConnectionConfig(
        MAIL_USERNAME = user or "",
        MAIL_PASSWORD = password or "",
        MAIL_FROM = mail_from or "noreply@easypay.com",
        MAIL_PORT = int(os.getenv("MAIL_PORT", 587)),
        MAIL_SERVER = os.getenv("MAIL_SERVER", "smtp.gmail.com"),
        MAIL_STARTTLS = os.getenv("MAIL_STARTTLS", "True") == "True",
        MAIL_SSL_TLS = os.getenv("MAIL_SSL_TLS", "False") == "True",
        USE_CREDENTIALS = True,
        VALIDATE_CERTS = True
    )

class EmailService:
    async def send_otp(self, email_to: str, code: str, is_recovery: bool = False):
        # Verificar que las credenciales SMTP están configuradas dinámicamente
        if not os.getenv("MAIL_USERNAME") or not os.getenv("MAIL_PASSWORD"):
            logger.error(f"❌ No se puede enviar correo a {email_to}: credenciales SMTP no configuradas")
            raise ValueError("Credenciales SMTP no configuradas en las variables de entorno")
        
        try:
            subject = "🔐 Recuperación de Contraseña - Easy-Pay" if is_recovery else "🔐 Código de Seguridad - Easy-Pay"
            title = "Recuperación de Contraseña" if is_recovery else "Verificación de Identidad"
            desc = "Tu código para restablecer tu contraseña es:" if is_recovery else "Tu código de seguridad es:"
            
            message = MessageSchema(
                subject=subject,
                recipients=[email_to],
                body=f"""
                    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #4f46e5;">{title}</h2>
                        <p>Te damos la bienvenida a <b>GP Easy-Pay</b>.</p>
                        <p>{desc}</p>
                        <div style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #1f2937; border-radius: 8px;">
                            {code}
                        </div>
                        <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">Este código expirará en 5 minutos.</p>
                    </div>
                """,
                subtype="html"
            )
            fm = FastMail(get_email_config())
            await fm.send_message(message)
            logger.info(f"✅ Correo de verificación enviado a {email_to}")
            return True
        except Exception as e:
            logger.error(f"❌ Error al enviar correo a {email_to}: {type(e).__name__}: {e}")
            raise e