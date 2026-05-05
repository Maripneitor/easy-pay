from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from utils.security import get_current_user_id
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
from group.domain.models.settlement import SettlementCreate

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
        status_code = 404 if "Código" in result["message"] else 400
        raise HTTPException(status_code=status_code, detail=result["message"])
    return result

@group_router.get("/{group_id}/items")
async def get_items(group_id: str):
    items = await item_repo.find_by_group(group_id)
    if items is None:
        return []
    return items

@group_router.get("/{group_id}/items/{item_id}")
async def get_item_by_id(group_id: str, item_id: str):
    """Obtiene un gasto por su ID"""
    item = await item_repo.find_by_id(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Gasto no encontrado")
    return item

@group_router.get("/{group_id}/balances")
async def get_balances(group_id: str):
    result = await get_balances_uc.execute(group_id)
    if result.get("status") == "error":
        raise HTTPException(status_code=404, detail=result["message"])
    return result

@group_router.get("/user/{user_id}")
async def get_user_groups(user_id: str):
    groups = await group_repo.find_by_user(user_id)
    if not groups:
        return []
    
    # Enriquecer cada grupo con el total gastado y estado
    enriched_groups = []
    for g in groups:
        group_id = g["id"]
        items = await item_repo.find_by_group(group_id)
        total = sum((item.get("precio") or item.get("monto") or 0) * item.get("cantidad", 1) for item in items)
        
        g["total_gastado"] = round(total, 2)
        # Soportamos tanto 'estado' como 'status' por compatibilidad
        g["is_settled"] = (g.get("estado") == "closed" or g.get("status") == "closed")
        enriched_groups.append(g)
        
    return enriched_groups


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
async def delete_group_route(group_id: str, current_user_id: str = Depends(get_current_user_id)):
    """
    Elimina un grupo permanentemente por su ID. Solo el líder puede hacerlo.
    """
    group = await group_repo.find_by_id(group_id)
    if not group:
        raise HTTPException(status_code=404, detail="Grupo no encontrado")
        
    if group.get("admin_id") != current_user_id:
        raise HTTPException(status_code=403, detail="Solo el administrador del grupo puede eliminarlo")
        
    result = await delete_group_uc.execute(group_id)
    
    if result["status"] == "error":
        raise HTTPException(status_code=404, detail=result["message"])
        
    return result

@group_router.put("/{group_id}")
async def update_group(group_id: str, data: dict):
    """
    Actualiza los detalles de un grupo (nombre, descripción).
    """
    success = await group_repo.update_group(group_id, data)
    if not success:
        raise HTTPException(status_code=404, detail="Grupo no encontrado o sin cambios")
    return {"status": "success", "message": "Grupo actualizado correctamente"}

@group_router.delete("/{group_id}/items/{item_id}")
async def remove_item(group_id: str, item_id: str):
    """
    Elimina un gasto de un grupo.
    """
    success = await item_repo.delete_item(item_id)
    if not success:
        raise HTTPException(status_code=404, detail="Gasto no encontrado")
    return {"message": "Gasto eliminado correctamente", "status": "success"}

@group_router.post("/{group_id}/members")
async def add_member(group_id: str, data: dict):
    user_id = data.get("user_id")
    if not user_id:
        raise HTTPException(status_code=400, detail="ID de usuario requerido")
    
    success = await group_repo.add_member(group_id, user_id)
    if not success:
        raise HTTPException(status_code=400, detail="No se pudo agregar al miembro")
    return {"status": "success", "message": "Miembro agregado"}

@group_router.post("/{group_id}/start-settlement")
async def start_settlement(group_id: str, data: dict):
    """
    Inicia la fase de liquidación. El líder selecciona las cuentas bancarias.
    """
    accounts = data.get("selected_bank_accounts", [])
    update_data = {
        "status": "settling",
        "selected_bank_accounts": accounts,
        "settlement_started_at": datetime.utcnow()
    }
    success = await group_repo.update_group(group_id, update_data)
    if not success:
        raise HTTPException(status_code=400, detail="No se pudo iniciar la liquidación")
    return {"status": "success", "message": "Fase de liquidación iniciada"}

@group_router.post("/{group_id}/close")
async def close_group(group_id: str, data: dict):
    from datetime import datetime
    final_data = {
        "tip_amount": data.get("tip_amount", 0),
        "final_total": data.get("final_total", 0),
        "fecha_cierre": datetime.utcnow().isoformat()
    }
    # Forzar el status a 'closed' en el repo
    success = await group_repo.close_group(group_id, final_data)
    if not success:
        raise HTTPException(status_code=400, detail="No se pudo cerrar el grupo")
    return {"status": "success", "message": "Grupo finiquitado correctamente"}

@group_router.delete("/{group_id}/members/{user_id}")
async def remove_member(group_id: str, user_id: str):
    # 1. Validar si el usuario tiene ítems asignados
    has_items = await item_repo.has_assigned_items(user_id, group_id)
    if has_items:
        raise HTTPException(
            status_code=400, 
            detail="No se puede eliminar al miembro porque tiene gastos asignados. Reasigna sus gastos primero."
        )
    
    success = await group_repo.remove_member(group_id, user_id)
    if not success:
        raise HTTPException(status_code=400, detail="No se pudo eliminar al miembro")
    return {"status": "success", "message": "Miembro eliminado"}

@group_router.post("/{group_id}/settlements")
async def create_settlement(group_id: str, settlement: SettlementCreate):
    """Crea una solicitud de liquidación (pago realizado)"""
    settlement_dict = settlement.dict()
    settlement_dict["status"] = "pending"
    settlement_dict["created_at"] = datetime.utcnow()
    settlement_dict["updated_at"] = datetime.utcnow()
    
    settlement_id = await group_repo.create_settlement(settlement_dict)
    return {"id": settlement_id, "status": "pending"}

@group_router.get("/{group_id}/settlements/pending")
async def get_pending_settlements(group_id: str):
    """Obtiene liquidaciones pendientes para que el líder las apruebe"""
    return await group_repo.get_pending_settlements(group_id)

@group_router.post("/{group_id}/settlements/{settlement_id}/approve")
async def approve_settlement(group_id: str, settlement_id: str, current_user_id: str):
    """Solo el líder puede aprobar una liquidación"""
    group = await group_repo.find_by_id(group_id)
    if not group:
        raise HTTPException(status_code=404, detail="Grupo no encontrado")
        
    if group.get("admin_id") != current_user_id:
        raise HTTPException(status_code=403, detail="Solo el administrador del grupo puede aprobar liquidaciones")
        
    success = await group_repo.approve_settlement(settlement_id)
    if not success:
        raise HTTPException(status_code=400, detail="No se pudo aprobar la liquidación")
        
    return {"message": "Liquidación aprobada correctamente"}

@group_router.post("/{group_id}/settlements/{settlement_id}/reject")
async def reject_settlement(group_id: str, settlement_id: str, current_user_id: str, data: dict):
    """Solo el líder puede rechazar una liquidación"""
    group = await group_repo.find_by_id(group_id)
    if not group:
        raise HTTPException(status_code=404, detail="Grupo no encontrado")
        
    if group.get("admin_id") != current_user_id:
        raise HTTPException(status_code=403, detail="Solo el administrador del grupo puede rechazar liquidaciones")
    
    reason = data.get("reason", "Pago no verificado")
    success = await group_repo.reject_settlement(settlement_id, reason)
    if not success:
        raise HTTPException(status_code=400, detail="No se pudo rechazar la liquidación")
        
    return {"message": "Liquidación rechazada. Se ha notificado al miembro.", "status": "rejected"}