from pydantic import BaseModel
from typing import List, Dict

class CategoryStat(BaseModel):
    category: str
    amount: float
    percentage: float

class MonthlyTrend(BaseModel):
    month: str
    total: float

class UserStatsResponse(BaseModel):
    total_spent: float
    by_category: List[CategoryStat]
    monthly_trend: List[MonthlyTrend]