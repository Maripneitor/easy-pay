from fastapi import APIRouter, HTTPException, Depends
from stats.application.generate_user_charts import GenerateUserChartsUseCase
from stats.infrastructure.repository.stats_repository import StatsRepository
from stats.infrastructure.databases import db
from utils.security import get_current_user_id

router = APIRouter(prefix="/api/stats", tags=["Statistics"])

# Inyección de dependencias
repo = StatsRepository(db)
generate_charts_uc = GenerateUserChartsUseCase(repo)

@router.get("/user/{user_id}/charts")
async def get_user_charts(user_id: str, current_user_id: str = Depends(get_current_user_id)):
    """
    Endpoint que devuelve datos formateados para PieCharts y BarCharts.
    """
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="No puedes consultar estadísticas de otro usuario")
        
    result = await generate_charts_uc.execute(user_id)
    return result

@router.get("/user/{user_id}")
async def get_user_stats(user_id: str, current_user_id: str = Depends(get_current_user_id)):
    """
    Endpoint genérico de estadísticas para el Dashboard.
    """
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="No puedes consultar estadísticas de otro usuario")
        
    try:
        expenses = await repo.get_user_expenses_by_category(user_id)
        # Aseguramos queexpenses sea una lista y tenga montos válidos
        total_spent = sum(float(e.get('amount', 0)) for e in expenses) if expenses else 0.0
        
        balances = await repo.get_user_balances(user_id)
        
        return {
            "total_spent": round(total_spent, 2),
            "owed_to_user": balances.get("owed_to_user", 0.0),
            "user_owes": balances.get("user_owes", 0.0),
            "by_category": expenses if expenses else []  # Match con el frontend ProfilePage.tsx
        }
    except Exception as e:
        print(f"Error en get_user_stats: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error interno al calcular estadísticas: {str(e)}")

@router.get("/global")
async def get_global_stats():
    return {"total_users": 0, "total_groups": 0, "total_expenses": 0}

@router.get("/user/{user_id}/transactions")
async def get_user_transactions(user_id: str, current_user_id: str = Depends(get_current_user_id)):
    """
    Endpoint que devuelve el historial de transacciones reales.
    """
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="No puedes consultar transacciones de otro usuario")
        
    return await repo.get_user_transactions(user_id)