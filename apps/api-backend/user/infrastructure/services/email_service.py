from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr
import os

conf = ConnectionConfig(
    MAIL_USERNAME = os.getenv("MAIL_USERNAME", "tu_correo@gmail.com"),
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD", "tu_clave_de_aplicacion"),
    MAIL_FROM = os.getenv("MAIL_FROM", "tu_correo@gmail.com"),
    MAIL_PORT = 587,
    MAIL_SERVER = "smtp.gmail.com",
    MAIL_STARTTLS = True,
    MAIL_SSL_TLS = False,
    USE_CREDENTIALS = True
)

class EmailService:
    async def send_otp(self, email_to: str, code: str):
        message = MessageSchema(
            subject="🔐 Código de Seguridad - Easy-Pay",
            recipients=[email_to],
            body=f"""
                <h3>Verificación de Identidad</h3>
                <p>Te damos la Bienvenida a GP Easy-Pay tu código de seguridad para Easy-Pay es: <b>{code}</b></p>
                <p>Este código expirará en 5 minutos.</p>
            """,
            subtype="html"
        )
        fm = FastMail(conf)
        await fm.send_message(message)