from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

class Group(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    admin_id: str
    integrantes: List[str] = []
    codigo_invitacion: str = Field(default_factory=lambda: str(uuid.uuid4())[:8].upper())
    fecha_creacion: datetime = Field(default_factory=datetime.utcnow)

class GroupCreate(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    admin_id: str

class GroupJoin(BaseModel):
    codigo: str
    user_id: str