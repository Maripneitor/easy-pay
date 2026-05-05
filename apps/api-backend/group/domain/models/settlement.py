from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

class Settlement(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    group_id: str
    payer_id: str
    receiver_id: str
    amount: float
    status: str = "pending"  # pending, approved, rejected
    proof_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class SettlementCreate(BaseModel):
    group_id: str
    payer_id: str
    receiver_id: str
    amount: float
    proof_url: Optional[str] = None
