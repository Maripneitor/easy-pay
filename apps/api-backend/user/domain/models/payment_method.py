from pydantic import BaseModel
from typing import List, Optional

class SavedCard(BaseModel):
    id: Optional[str] = None
    token: str
    last4: str
    brand: str
    holder: str
    expiry: str
    colors: List[str]
    is_default: bool = False
    created_at: Optional[float] = None
