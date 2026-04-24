from fastapi import APIRouter, HTTPException
from stats.application.generate_user_charts import GenerateUserChartsUseCase
from stats.infrastructure.repository.stats_repository import StatsRepository
from stats.infrastructure.databases import db

router = APIRouter(prefix="/api/stats", tags=["Statistics"])

# Inyección de dependencias
repo = StatsRepository(db)
generate_charts_uc = GenerateUserChartsUseCase(repo)

@router.get("/user/{user_id}/charts")
async def get_user_charts(user_id: str):
    """
    Endpoint que devuelve datos formateados para PieCharts y BarCharts.
    """
    result = await generate_charts_uc.execute(user_id)
    return result