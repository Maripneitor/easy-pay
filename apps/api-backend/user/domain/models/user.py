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

# Clase para cambio de contraseña (SWAGGER)
class PasswordChange(BaseModel):
    new_password: str = Field(..., min_length=8, description="La nueva contraseña (mínimo 8 caracteres)")
    confirm_password: str = Field(..., description="Confirmación de la nueva contraseña")

    # Opcional: Validación básica de coincidencia en el esquema
    def validate_matching(self):
        if self.new_password != self.confirm_password:
            raise ValueError("La nueva contraseña y la confirmación no coinciden")
        return True

# Clase para actualización de perfil
class UserUpdate(BaseModel):
    nombre: Optional[str] = None
    email: Optional[EmailStr] = None
    telefono: Optional[str] = None

# Clase para solicitar restablecimiento de contraseña
class PasswordResetRequest(BaseModel):
    email: EmailStr