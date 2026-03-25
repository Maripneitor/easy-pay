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
    fecha_registro: datetime = Field(default_factory=datetime.utcnow)

class ItemCreate(BaseModel):
    group_id: str
    nombre: str
    precio: float
    cantidad: int = 1
    comprador_id: str
    participantes_ids: List[str]