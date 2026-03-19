from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

# Definimos primero el modelo de Dos Factores (para que User lo encuentre)
class TwoFactorConfig(BaseModel):
    enabled: bool = False
    secret: Optional[str] = None
    recovery_codes: Optional[List[str]] = None

# Definimos el modelo base del Usuario (Lo que vive en la DB)
class User(BaseModel):
    nombre: str
    email: EmailStr
    password_hash: str
    two_factor: TwoFactorConfig = Field(default_factory=TwoFactorConfig)
    roles: List[str] = ["user"]
    fecha_registro: datetime = Field(default_factory=datetime.utcnow)

# Clases para el SWAGGER (Entrada de datos)
class UserCreate(BaseModel):
    nombre: str
    email: EmailStr
    password: str
  
# Clase para Login
class UserLogin(BaseModel):
    identifier: str
    password: str 
   