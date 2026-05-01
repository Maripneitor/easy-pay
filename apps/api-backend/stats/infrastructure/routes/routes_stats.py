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

@router.get("/user/{user_id}")
async def get_user_stats(user_id: str):
    """
    Endpoint genérico de estadísticas para el Dashboard.
    """
    # Por ahora devolvemos un mock que satisfaga al frontend o datos reales si es posible
    expenses = await repo.get_user_expenses_by_category(user_id)
    total_spent = sum(e['amount'] for e in expenses)
    
    return {
        "total_spent": total_spent,
        "owed_to_user": 0, # Mock por ahora
        "user_owes": 0,    # Mock por ahora
        "expenses_by_category": expenses
    }

@router.get("/global")
async def get_global_stats():
    return {"total_users": 0, "total_groups": 0, "total_expenses": 0}