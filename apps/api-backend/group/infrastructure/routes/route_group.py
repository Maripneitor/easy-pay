from fastapi import APIRouter, HTTPException
from group.infrastructure.repository.group_repository import MongoGroupRepository
from group.infrastructure.repository.item_repository import MongoItemRepository
from group.domain.models.group import GroupCreate
from group.domain.models.item import ItemCreate
from group.domain.models.group import GroupJoin
from group.domain.models.item import ItemUpdate
from group.application.get_balance import GetGroupBalancesUseCase
from group.application.join_group import JoinGroupUseCase 
from group.application.delete_group import DeleteGroupUseCase
from group.application.create_group import CreateGroupUseCase
from group.application.add_item import AddItemUseCase

group_router = APIRouter(prefix="/api/groups", tags=["Groups"], redirect_slashes=False)

group_repo = MongoGroupRepository()
item_repo = MongoItemRepository()

create_group_uc = CreateGroupUseCase(group_repo)
add_item_uc = AddItemUseCase(item_repo, group_repo)
get_balances_uc = GetGroupBalancesUseCase(item_repo, group_repo)
join_group_uc = JoinGroupUseCase(group_repo)
delete_group_uc = DeleteGroupUseCase(group_repo)                    

@group_router.post("/create")
async def create_group(data: GroupCreate):
    return await create_group_uc.execute(data)

@group_router.post("/add-item")
async def add_item(data: ItemCreate):
    result = await add_item_uc.execute(data)
    if result.get("status") == "error":
        raise HTTPException(status_code=400, detail=result["message"])
    return result

@group_router.post("/join")
async def join_group(data: GroupJoin):
    result = await join_group_uc.execute(data.codigo, data.user_id)
    if result["status"] == "error":
        raise HTTPException(status_code=400, detail=result["message"])
    return result

@group_router.get("/{group_id}/items")
async def get_items(group_id: str):
    items = await item_repo.find_by_group(group_id)
    if items is None:
        return []
    return items

@group_router.get("/{group_id}/balances")
async def get_balances(group_id: str):
    result = await get_balances_uc.execute(group_id)
    if result.get("status") == "error":
        raise HTTPException(status_code=404, detail=result["message"])
    return result

@group_router.get("/user/{user_id}")
async def get_user_groups(user_id: str):
    groups = await group_repo.find_by_user(user_id)
    return groups if groups else []


@group_router.get("/{group_id}")
async def get_group_by_id(group_id: str):
    group = await group_repo.find_by_id_detailed(group_id)
    if not group:
        raise HTTPException(status_code=404, detail="Grupo no encontrado")
    return group

@group_router.put("/{group_id}/items/{item_id}")
async def edit_item(group_id: str, item_id: str, item_data: ItemUpdate):
    """
    Actualiza un gasto. Se usa group_id por estructura de URL, 
    pero la edición es directa por item_id.
    """
    # Convertimos el esquema a diccionario ignorando los campos que el usuario no envió
    update_dict = item_data.dict(exclude_unset=True)
    
    if not update_dict:
        raise HTTPException(status_code=400, detail="No se enviaron datos para actualizar")
    
    # Llamamos al repositorio (asegúrate de que el repo reciba el dict)
    success = await item_repo.update_item(item_id, update_dict)
    
    if not success:
        raise HTTPException(status_code=404, detail="Gasto no encontrado")
        
    return {"message": "Gasto actualizado correctamente", "status": "success"}

@group_router.delete("/{group_id}", tags=["Groups"])
@group_router.delete("/delete/{group_id}", include_in_schema=False)
async def delete_group_route(group_id: str):
    """
    Elimina un grupo permanentemente por su ID.
    """
    result = await delete_group_uc.execute(group_id)
    
    if result["status"] == "error":
        raise HTTPException(status_code=404, detail=result["message"])
        
    return result

@group_router.delete("/{group_id}/items/{item_id}")
async def remove_item(group_id: str, item_id: str):
    """
    Elimina un gasto de un grupo.
    """
    success = await item_repo.delete_item(item_id)
    if not success:
        raise HTTPException(status_code=404, detail="Gasto no encontrado")
    return {"message": "Gasto eliminado correctamente", "status": "success"}