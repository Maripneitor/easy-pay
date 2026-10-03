import os
import jwt
import bcrypt
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET", "estoesporsiacasosoloemergencia")
ALGORITHM = "HS256"

class AuthService:
    """
    Servicio OOP de Autenticación y Criptografía.
    Responsable de la creación y verificación de tokens JWT,
    así como del hash seguro de contraseñas con bcrypt.
    """
    def __init__(self):
        self.secret_key = SECRET_KEY
        self.algorithm = ALGORITHM

    def hash_password(self, plain_password: str) -> str:
        """Genera un salt y hashea la contraseña usando bcrypt"""
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(plain_password.encode('utf-8'), salt).decode('utf-8')

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verifica una contraseña contra su hash"""
        try:
            return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
        except Exception:
            return False

    def create_access_token(
        self,
        user_id: str,
        email: str,
        nombre: str,
        roles: Optional[List[str]] = None,
        permissions: Optional[List[str]] = None,
        expires_delta: Optional[timedelta] = None
    ) -> str:
        """Genera un Token JWT firmado con claims del usuario, roles y permisos"""
        expire = datetime.utcnow() + (expires_delta or timedelta(hours=24))
        payload = {
            "sub": user_id,
            "email": email,
            "nombre": nombre,
            "roles": roles or ["Usuario Regular"],
            "permissions": permissions or [],
            "exp": expire
        }
        token = jwt.encode(payload, self.secret_key, algorithm=self.algorithm)
        return token

    def decode_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Decodifica y valida un token JWT"""
        try:
            return jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
