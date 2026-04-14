from fastapi import APIRouter, HTTPException
from group.infrastructure.repository.group_repository import MongoGroupRepository
from group.infrastructure.repository.item_repository import MongoItemRepository
from group.application.create_group import CreateGroupUseCase
from group.application.add_item import AddItemUseCase
from group.domain.models.group import GroupCreate
from group.domain.models.item import ItemCreate
from group.application.get_balance import GetGroupBalancesUseCase
from group.application.join_group import JoinGroupUseCase 
from group.domain.models.group import GroupJoin

# 1. Definimos el router
group_router = APIRouter(prefix="/api/groups", tags=["Groups"], redirect_slashes=False)

# 2. Instanciamos los repositorios
group_repo = MongoGroupRepository()
item_repo = MongoItemRepository()

# 3. Casos de Uso
create_group_uc = CreateGroupUseCase(group_repo)
add_item_uc = AddItemUseCase(item_repo, group_repo)
get_balances_uc = GetGroupBalancesUseCase(item_repo, group_repo)
join_group_uc = JoinGroupUseCase(group_repo)


# --- ENDPOINTS ---

@group_router.post("/create")
async def create_group(data: GroupCreate):
    """Crea un nuevo grupo de gastos"""
    return await create_group_uc.execute(data)

@group_router.post("/add-item")
async def add_item(data: ItemCreate):
    """Agrega un ticket/gasto a un grupo específico"""
    result = await add_item_uc.execute(data)
    if result.get("status") == "error":
        raise HTTPException(status_code=400, detail=result["message"])
    return result

@group_router.get("/{group_id}/items")
async def get_items(group_id: str):
    """Retorna la lista de gastos de un grupo."""
    items = await item_repo.find_by_group(group_id)
    if items is None:
        return []
    return items

@group_router.get("/{group_id}/balances")
async def get_balances(group_id: str):
    """Devuelve cuánto ha gastado cada integrante y saldos."""
    result = await get_balances_uc.execute(group_id)
    if result.get("status") == "error":
        raise HTTPException(status_code=404, detail=result["message"])
    return result

@group_router.get("/user/{user_id}")
async def get_user_groups(user_id: str):
    """Retorna todos los grupos a los que pertenece un usuario"""
    groups = await group_repo.find_by_user(user_id)
    return groups if groups else []

@group_router.post("/join")
async def join_group(data: GroupJoin):
    """Endpoint para unirse a un grupo vía código"""
    result = await join_group_uc.execute(data.codigo, data.user_id)
    if result["status"] == "error":
        raise HTTPException(status_code=400, detail=result["message"])
    return result

# 🚩 CAMBIO CLAVE AQUÍ:
@group_router.get("/{group_id}")
async def get_group_by_id(group_id: str):
    """Retorna el detalle del grupo con los NOMBRES reales de los integrantes"""
    # Usamos find_by_id_detailed para que haga el cruce con EasyPay_Auth
    group = await group_repo.find_by_id_detailed(group_id)
    if not group:
        raise HTTPException(status_code=404, detail="Grupo no encontrado")
    return group