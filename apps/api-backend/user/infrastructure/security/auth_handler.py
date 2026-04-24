import jwt
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET", "estoesporsiacasosoloemergencia")
ALGORITHM = "HS256"

def create_access_token(user_id: str, email: str, nombre: str) -> str:
    """
    Genera un Token JWT basado en la info del usuario.
    """
    payload = {
        "sub": user_id,
        "email": email,
        "nombre": nombre,
        "exp": datetime.utcnow() + timedelta(hours=24)
    }
    
    # Firmamos el token con el secreto del .env
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token

def decode_token(token: str):
    """
    Decodifica y valida el token.
    """
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        return None  # Token expirado
    except jwt.InvalidTokenError:
        return None  # Token falso o corrupto