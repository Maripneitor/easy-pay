from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks, WebSocket, WebSocketDisconnect
import httpx
import os
import json
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
from group.application.liquidategroup import LiquidateGroupUseCase
from group.domain.models.settlement import SettlementCreate

group_router = APIRouter(prefix="/api/groups", tags=["Groups"], redirect_slashes=False)

group_repo = MongoGroupRepository()
item_repo = MongoItemRepository()

NOTIFICATION_SERVICE_URL = os.getenv("NOTIFICATION_SERVICE_URL", "http://notification-service:8000")

# WebSocket Connection Manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, group_id: str):
        await websocket.accept()
        if group_id not in self.active_connections:
            self.active_connections[group_id] = []
        self.active_connections[group_id].append(websocket)
        print(f"📡 Cliente conectado a grupo {group_id}. Total: {len(self.active_connections[group_id])}")

    def disconnect(self, websocket: WebSocket, group_id: str):
        if group_id in self.active_connections:
            self.active_connections[group_id].remove(websocket)
            if not self.active_connections[group_id]:
                del self.active_connections[group_id]
        print(f"📡 Cliente desconectado de grupo {group_id}")

    async def broadcast(self, group_id: str, message: dict):
        if group_id in self.active_connections:
            for connection in self.active_connections[group_id]:
                try:
                    await connection.send_json(message)
                except Exception as e:
                    print(f"⚠️ Error enviando broadcast: {e}")

manager = ConnectionManager()

@group_router.websocket("/ws/{group_id}")
async def websocket_endpoint(websocket: WebSocket, group_id: str, token: str = None):
    # En producción deberíamos validar el token aquí
    await manager.connect(websocket, group_id)
    try:
        while True:
            # Esperar mensajes del cliente (opcional, mayormente broadcast)
            data = await websocket.receive_text()
            # Podríamos procesar comandos aquí si fuera necesario
    except WebSocketDisconnect:
        manager.disconnect(websocket, group_id)
    except Exception as e:
        print(f"⚠️ WebSocket error: {e}")
        manager.disconnect(websocket, group_id)

async def notify_group_update(group_id: str, type: str, data: dict = None):
    """Notifica a todos los clientes conectados al grupo sobre un cambio"""
    await manager.broadcast(group_id, {
        "type": type,
        "group_id": group_id,
        "timestamp": datetime.utcnow().isoformat(),
        "data": data
    })

async def notify_payment(receiver_id: str, payer_id: str, group_id: str, amount: float, settlement_id: str = None):
    """Envía una notificación asíncrona al receptor del pago"""
    print(f"🚀 Intentando notificar pago: Receptor={receiver_id}, Pagador={payer_id}, Monto={amount}")
    
    # Notificar via WebSocket primero para actualización instantánea de la UI
    await notify_group_update(group_id, "payment_reported", {
        "payer_id": payer_id,
        "amount": amount,
        "settlement_id": settlement_id
    })
    
    try:
        # Intentar obtener el nombre del grupo para un mejor mensaje
        group = await group_repo.find_by_id(group_id)
        group_name = group.get("nombre", "un grupo") if group else "un grupo"
        
        url = f"{NOTIFICATION_SERVICE_URL}/api/notifications/send"
        print(f"📡 Llamando a: {url}")
        
        async with httpx.AsyncClient() as client:
            payload = {
                "user_id": receiver_id,
                "type": "payment_received",
                "title": "💰 Confirmación de pago pendiente",
                "body": f"Un miembro ha reportado un pago de ${amount:.2f} en '{group_name}'. Por favor, verifica y aprueba.",
                "group_id": group_id,
                "amount": amount,
                "from_user_id": payer_id,
                "data": {
                    "type": "settlement_request",
                    "settlement_id": settlement_id,
                    "group_id": group_id
                }
            }
            resp = await client.post(url, json=payload, timeout=5.0)
            print(f"✅ Respuesta del servicio de notificaciones: {resp.status_code} - {resp.text}")
    except Exception as e:
        print(f"⚠️ Error crítico al enviar notificación: {str(e)}")

async def notify_settlement_status(payer_id: str, group_id: str, amount: float, status: str, reason: str = None):
    """Notifica al pagador sobre el resultado de su solicitud de liquidación"""
    print(f"🚀 Notificando status de pago: Payer={payer_id}, Status={status}")
    
    # Notificar via WebSocket
    await notify_group_update(group_id, "settlement_updated", {
        "payer_id": payer_id,
        "status": status,
        "amount": amount
    })
    
    try:
        group = await group_repo.find_by_id(group_id)
        group_name = group.get("nombre", "un grupo") if group else "un grupo"
        
        title = "✅ Pago aprobado" if status == "approved" else "❌ Pago rechazado"
        body = f"Tu pago de ${amount:.2f} en '{group_name}' fue aprobado." if status == "approved" else f"Tu pago de ${amount:.2f} en '{group_name}' fue rechazado. Razón: {reason or 'No especificada'}"
        
        url = f"{NOTIFICATION_SERVICE_URL}/api/notifications/send"
        async with httpx.AsyncClient() as client:
            resp = await client.post(url, json={
                "user_id": payer_id,
                "type": "payment_received" if status == "approved" else "reminder",
                "title": title,
                "body": body,
                "group_id": group_id,
                "amount": amount,
                "data": {"status": status, "reason": reason}
            }, timeout=5.0)
            print(f"✅ Respuesta status pago: {resp.status_code}")
    except Exception as e:
        print(f"⚠️ Error al notificar status de pago: {e}")



create_group_uc = CreateGroupUseCase(group_repo)
add_item_uc = AddItemUseCase(item_repo, group_repo)
get_balances_uc = GetGroupBalancesUseCase(item_repo, group_repo)
join_group_uc = JoinGroupUseCase(group_repo)
delete_group_uc = DeleteGroupUseCase(group_repo)
# ... rest of the code remains the same ...
# Note: I will only replace up to the start of the use cases to avoid breaking the file
# and I'll make sure to include the logic to notify on item assignments/additions later if needed.
# For now, let's just finish the replacement properly.


@group_router.post("/create")
async def create_group(data: GroupCreate, current_user_id: str = Depends(get_current_user_id)):
    if data.admin_id != current_user_id:
        raise HTTPException(status_code=403, detail="No puedes crear un grupo para otro usuario")
    return await create_group_uc.execute(data)

@group_router.post("/add-item")
async def add_item(data: ItemCreate, current_user_id: str = Depends(get_current_user_id)):
    # Validar que el usuario pertenece al grupo
    group = await group_repo.find_by_id(data.group_id)
    if not group or current_user_id not in group.get("integrantes", []):
        raise HTTPException(status_code=403, detail="No tienes permiso para agregar ítems a este grupo")
        
    result = await add_item_uc.execute(data)
    if result.get("status") == "error":
        raise HTTPException(status_code=400, detail=result["message"])
    return result

@group_router.post("/join")
async def join_group(data: GroupJoin, current_user_id: str = Depends(get_current_user_id)):
    if data.user_id != current_user_id:
        raise HTTPException(status_code=403, detail="No puedes unir a otro usuario")
        
    result = await join_group_uc.execute(data.codigo, data.user_id)
    if result["status"] == "error":
        msg = result["message"]
        if "Código" in msg:
            raise HTTPException(status_code=404, detail=msg)
        if "Ya eres parte" in msg:
            raise HTTPException(status_code=409, detail=msg)
        raise HTTPException(status_code=400, detail=msg)
    return result

@group_router.get("/{group_id}/items")
async def get_items(group_id: str, current_user_id: str = Depends(get_current_user_id)):
    # Validar acceso
    group = await group_repo.find_by_id(group_id)
    if not group or current_user_id not in group.get("integrantes", []):
        raise HTTPException(status_code=403, detail="No tienes acceso a este grupo")
        
    items = await item_repo.find_by_group(group_id)
    if items is None:
        return []
    return items

@group_router.get("/{group_id}/items/{item_id}")
async def get_item_by_id(group_id: str, item_id: str, current_user_id: str = Depends(get_current_user_id)):
    """Obtiene un gasto por su ID"""
    group = await group_repo.find_by_id(group_id)
    if not group or current_user_id not in group.get("integrantes", []):
        raise HTTPException(status_code=403, detail="No tienes acceso a este grupo")
        
    item = await item_repo.find_by_id(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Gasto no encontrado")
    return item

@group_router.get("/{group_id}/balances")
async def get_balances(group_id: str, current_user_id: str = Depends(get_current_user_id)):
    # Validar acceso
    group = await group_repo.find_by_id(group_id)
    if not group or current_user_id not in group.get("integrantes", []):
        raise HTTPException(status_code=403, detail="No tienes acceso a este grupo")
        
    result = await get_balances_uc.execute(group_id)
    if result.get("status") == "error":
        raise HTTPException(status_code=404, detail=result["message"])
    return result

@group_router.get("/user/{user_id}")
async def get_user_groups(user_id: str, current_user_id: str = Depends(get_current_user_id)):
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="No puedes consultar grupos de otro usuario")
        
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
        g["is_settled"] = (g.get("estado") in ["closed", "liquidated"] or g.get("status") in ["closed", "liquidated"])
        enriched_groups.append(g)
        
    return enriched_groups


@group_router.get("/{group_id}")
async def get_group_by_id(
    group_id: str, 
    current_user_id: str = Depends(get_current_user_id)
):
    group = await group_repo.find_by_id_detailed(group_id)
    if not group:
        raise HTTPException(status_code=404, detail="Grupo no encontrado")
        
    member_ids = [str(m.get("id")) for m in group.get("integrantes", [])]
    if current_user_id not in member_ids and group.get("admin_id") != current_user_id:
        raise HTTPException(
            status_code=403, 
            detail="Acceso denegado. No eres miembro de este grupo."
        )

    return group

@group_router.put("/{group_id}/items/{item_id}")
async def edit_item(group_id: str, item_id: str, item_data: ItemUpdate, current_user_id: str = Depends(get_current_user_id)):
    """
    Actualiza un gasto. Se usa group_id por estructura de URL, 
    pero la edición es directa por item_id.
    """
    group = await group_repo.find_by_id(group_id)
    if not group or current_user_id not in group.get("integrantes", []):
        raise HTTPException(status_code=403, detail="No tienes permiso para editar ítems en este grupo")

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
async def update_group(group_id: str, data: dict, current_user_id: str = Depends(get_current_user_id)):
    """
    Actualiza los detalles de un grupo (nombre, descripción).
    """
    group = await group_repo.find_by_id(group_id)
    if not group or group.get("admin_id") != current_user_id:
        raise HTTPException(status_code=403, detail="Solo el administrador puede actualizar el grupo")

    success = await group_repo.update_group(group_id, data)
    if not success:
        raise HTTPException(status_code=404, detail="Grupo no encontrado o sin cambios")
    return {"status": "success", "message": "Grupo actualizado correctamente"}

@group_router.delete("/{group_id}/items/{item_id}")
async def remove_item(group_id: str, item_id: str, current_user_id: str = Depends(get_current_user_id)):
    """
    Elimina un gasto de un grupo.
    """
    group = await group_repo.find_by_id(group_id)
    if not group or current_user_id not in group.get("integrantes", []):
        raise HTTPException(status_code=403, detail="No tienes permiso para eliminar ítems en este grupo")

    success = await item_repo.delete_item(item_id)
    if not success:
        raise HTTPException(status_code=404, detail="Gasto no encontrado")
    return {"message": "Gasto eliminado correctamente", "status": "success"}

@group_router.post("/{group_id}/members")
async def add_member(group_id: str, data: dict, current_user_id: str = Depends(get_current_user_id)):
    group = await group_repo.find_by_id(group_id)
    if not group or group.get("admin_id") != current_user_id:
        raise HTTPException(status_code=403, detail="Solo el administrador puede agregar miembros")

    user_id = data.get("user_id")
    if not user_id:
        raise HTTPException(status_code=400, detail="ID de usuario requerido")
    
    success = await group_repo.add_member(group_id, user_id)
    if not success:
        raise HTTPException(status_code=400, detail="No se pudo agregar al miembro")
    return {"status": "success", "message": "Miembro agregado"}

@group_router.post("/{group_id}/start-settlement")
async def start_settlement(group_id: str, data: dict, current_user_id: str = Depends(get_current_user_id)):
    """
    Inicia la fase de liquidación. El líder selecciona las cuentas bancarias.
    """
    group = await group_repo.find_by_id(group_id)
    if not group or group.get("admin_id") != current_user_id:
        raise HTTPException(status_code=403, detail="Solo el administrador puede iniciar la liquidación")

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
async def close_group(group_id: str, data: dict, current_user_id: str = Depends(get_current_user_id)):
    group = await group_repo.find_by_id(group_id)
    if not group or group.get("admin_id") != current_user_id:
        raise HTTPException(status_code=403, detail="Solo el administrador puede cerrar el grupo")

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

@group_router.post("/{group_id}/liquidate")
async def liquidate_group(group_id: str, current_user_id: str = Depends(get_current_user_id)):
    """Liquida el grupo manualmente (si las deudas están en 0)"""
    return await liquidate_group_uc.execute(group_id, current_user_id)

@group_router.delete("/{group_id}/members/{user_id}")
async def remove_member(group_id: str, user_id: str, current_user_id: str = Depends(get_current_user_id)):
    group = await group_repo.find_by_id(group_id)
    if not group or group.get("admin_id") != current_user_id:
        raise HTTPException(status_code=403, detail="Solo el administrador puede eliminar miembros")

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
async def create_settlement(group_id: str, settlement: SettlementCreate, background_tasks: BackgroundTasks, current_user_id: str = Depends(get_current_user_id)):
    """Crea una solicitud de liquidación (pago realizado)"""
    group = await group_repo.find_by_id(group_id)
    if not group or current_user_id not in group.get("integrantes", []):
        raise HTTPException(status_code=403, detail="No eres miembro de este grupo")

    settlement_dict = settlement.dict()
    settlement_dict["status"] = "pending"
    settlement_dict["created_at"] = datetime.utcnow()
    settlement_dict["updated_at"] = datetime.utcnow()
    
    settlement_id = await group_repo.create_settlement(settlement_dict)
    
    # Notificar al admin/acreedor en segundo plano
    background_tasks.add_task(
        notify_payment, 
        settlement.receiver_id, 
        settlement.payer_id, 
        settlement.group_id, 
        settlement.amount,
        settlement_id  # <--- Nuevo parámetro
    )
    
    return {"id": settlement_id, "status": "pending"}

@group_router.get("/{group_id}/settlements/pending")
async def get_pending_settlements(group_id: str, current_user_id: str = Depends(get_current_user_id)):
    """Obtiene liquidaciones pendientes para que el líder las apruebe"""
    group = await group_repo.find_by_id(group_id)
    if not group or current_user_id not in group.get("integrantes", []):
        raise HTTPException(status_code=403, detail="No tienes acceso a este grupo")

    return await group_repo.get_pending_settlements(group_id)

@group_router.post("/{group_id}/settlements/{settlement_id}/approve")
async def approve_settlement(group_id: str, settlement_id: str, background_tasks: BackgroundTasks, current_user_id: str = Depends(get_current_user_id)):
    """Solo el líder puede aprobar una liquidación"""
    group = await group_repo.find_by_id(group_id)
    if not group:
        raise HTTPException(status_code=404, detail="Grupo no encontrado")
        
    if group.get("admin_id") != current_user_id:
        raise HTTPException(status_code=403, detail="Solo el administrador del grupo puede aprobar liquidaciones")
        
    # Obtener info de la liquidación antes de aprobar para notificar
    settlements = await group_repo.get_pending_settlements(group_id)
    settlement = next((s for s in settlements if s.get("id") == settlement_id), None)
    
    success = await group_repo.approve_settlement(settlement_id)
    if not success:
        raise HTTPException(status_code=400, detail="No se pudo aprobar la liquidación")
    
    if settlement:
        background_tasks.add_task(
            notify_settlement_status, 
            settlement.get("payer_id"), 
            group_id, 
            settlement.get("amount"), 
            "approved"
        )
        
    return {"message": "Liquidación aprobada correctamente"}

@group_router.post("/{group_id}/settlements/{settlement_id}/reject")
async def reject_settlement(group_id: str, settlement_id: str, data: dict, background_tasks: BackgroundTasks, current_user_id: str = Depends(get_current_user_id)):
    """Solo el líder puede rechazar una liquidación"""
    group = await group_repo.find_by_id(group_id)
    if not group:
        raise HTTPException(status_code=404, detail="Grupo no encontrado")
        
    if group.get("admin_id") != current_user_id:
        raise HTTPException(status_code=403, detail="Solo el administrador del grupo puede rechazar liquidaciones")
    
    # Obtener info de la liquidación antes de rechazar
    settlements = await group_repo.get_pending_settlements(group_id)
    settlement = next((s for s in settlements if s.get("id") == settlement_id), None)
    
    reason = data.get("reason", "Pago no verificado")
    success = await group_repo.reject_settlement(settlement_id, reason)
    if not success:
        raise HTTPException(status_code=400, detail="No se pudo rechazar la liquidación")
    
    if settlement:
        background_tasks.add_task(
            notify_settlement_status, 
            settlement.get("payer_id"), 
            group_id, 
            settlement.get("amount"), 
            "rejected",
            reason
        )
        
    return {"message": "Liquidación rechazada. Se ha notificado al miembro.", "status": "rejected"}