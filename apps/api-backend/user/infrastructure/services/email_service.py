from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
import os
import logging

logger = logging.getLogger("email_service")

# Pre-validación de configuración SMTP
_mail_user = os.getenv("MAIL_USERNAME")
_mail_pass = os.getenv("MAIL_PASSWORD")
_mail_from = os.getenv("MAIL_FROM", _mail_user)

if not _mail_user or not _mail_pass:
    logger.warning("⚠️ MAIL_USERNAME o MAIL_PASSWORD no están configurados. Los correos NO se enviarán.")

conf = ConnectionConfig(
    MAIL_USERNAME = _mail_user or "",
    MAIL_PASSWORD = _mail_pass or "",
    MAIL_FROM = _mail_from or "noreply@easypay.com",
    MAIL_PORT = int(os.getenv("MAIL_PORT", 587)),
    MAIL_SERVER = os.getenv("MAIL_SERVER", "smtp.gmail.com"),
    MAIL_STARTTLS = os.getenv("MAIL_STARTTLS", "True") == "True",
    MAIL_SSL_TLS = os.getenv("MAIL_SSL_TLS", "False") == "True",
    USE_CREDENTIALS = True,
    VALIDATE_CERTS = True
)

class EmailService:
    async def send_otp(self, email_to: str, code: str, is_recovery: bool = False):
        # Verificar que las credenciales SMTP están configuradas
        if not _mail_user or not _mail_pass:
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
            fm = FastMail(conf)
            await fm.send_message(message)
            logger.info(f"✅ Correo de verificación enviado a {email_to}")
            return True
        except Exception as e:
            # Log detallado del error para diagnóstico en Docker
            logger.error(f"❌ Error al enviar correo a {email_to}: {type(e).__name__}: {e}")
            raise e