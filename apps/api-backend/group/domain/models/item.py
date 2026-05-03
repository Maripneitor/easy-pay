from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

class Item(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    group_id: str  
    nombre: str    
    precio: float
    cantidad: int = 1
    comprador_id: str  
    participantes_ids: List[str]  
    categoria: Optional[str] = "Otros"
    fecha_registro: datetime = Field(default_factory=datetime.utcnow)

class ItemCreate(BaseModel):
    group_id: str
    nombre: str
    precio: float
    cantidad: int = 1
    comprador_id: str
    participantes_ids: List[str]
    categoria: Optional[str] = "Otros"

class ItemUpdate(BaseModel):
    nombre: Optional[str] = None
    precio: Optional[float] = None
    cantidad: Optional[int] = None
    comprador_id: Optional[str] = None
    participantes_ids: Optional[List[str]] = None