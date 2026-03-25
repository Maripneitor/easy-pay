from fastapi import APIRouter, HTTPException
from group.infrastructure.repository.group_repository import MongoGroupRepository
from group.infrastructure.repository.item_repository import MongoItemRepository
from group.application.create_group import CreateGroupUseCase
from group.application.add_item import AddItemUseCase
from group.domain.models.group import GroupCreate
from group.domain.models.item import ItemCreate

group_router = APIRouter(prefix="/api/groups", tags=["Groups"])

# Inyectamos los repositorios (cada uno irá a su DB)
group_repo = MongoGroupRepository()
item_repo = MongoItemRepository()

# Inyectamos a los Casos de Uso
create_group_uc = CreateGroupUseCase(group_repo)
add_item_uc = AddItemUseCase(item_repo, group_repo)

@group_router.post("/create")
async def create_group(data: GroupCreate):
    return await create_group_uc.execute(data)

@group_router.post("/add-item")
async def add_item(data: ItemCreate):
    result = await add_item_uc.execute(data)
    if result["status"] == "error":
        raise HTTPException(status_code=404, detail=result["message"])
    return result

@group_router.get("/{group_id}/items")
async def get_items(group_id: str):
    # Retorna todos los gastos de un grupo para mostrarlos en el Front
    return await item_repo.find_by_group(group_id)