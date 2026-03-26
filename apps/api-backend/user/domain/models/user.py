from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

class TwoFactorConfig(BaseModel):
    enabled: bool = False
    otp_code: Optional[str] = None
    otp_expires: Optional[datetime] = None

class User(BaseModel):
    nombre: str
    email: EmailStr
    password_hash: str
    two_factor: TwoFactorConfig = Field(default_factory=TwoFactorConfig)
    roles: List[str] = ["user"]
    fecha_registro: datetime = Field(default_factory=datetime.utcnow)
    is_verified: bool = False  

# Clases para el SWAGGER (Entrada de datos)
class UserCreate(BaseModel):
    nombre: str
    email: EmailStr
    password: str
  
# Clase para Login
class UserLogin(BaseModel):
    identifier: str
    password: str