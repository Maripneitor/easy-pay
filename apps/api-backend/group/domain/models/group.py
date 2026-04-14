from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

# Modelo base para la base de datos
class Group(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    admin_id: str
    integrantes: List[str] = []
    codigo_invitacion: str = Field(default_factory=lambda: str(uuid.uuid4())[:8].upper())
    fecha_creacion: datetime = Field(default_factory=datetime.utcnow)

# Modelo para crear grupo
class GroupCreate(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    admin_id: str

# Modelo para unirse
class GroupJoin(BaseModel):
    codigo: str
    user_id: str

# --- NUEVOS MODELOS DE SALIDA ---

class MemberOut(BaseModel):
    id: str
    nombre: str

class GroupDetailOut(BaseModel):
    id: str
    nombre: str
    descripcion: Optional[str]
    admin_id: str
    codigo_invitacion: str
    integrantes: List[MemberOut] # Aquí devolvemos objetos, no strings
    fecha_creacion: datetime