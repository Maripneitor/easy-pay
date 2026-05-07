from fastapi import APIRouter, HTTPException
from wallet.infrastructure.repository.wallet_repository import WalletRepository
from wallet.domain.models.card import BankCardCreate
import uuid

wallet_router = APIRouter(prefix="/api/wallet", tags=["Wallet"])

repo = WalletRepository()


# ── GET: Todas las tarjetas de un usuario ─────────────────────────────────────
@wallet_router.get("/cards/{user_id}")
async def get_cards(user_id: str):
    """Obtiene las tarjetas/cuentas bancarias del usuario"""
    return await repo.get_cards(user_id)


# ── GET: Tarjeta predeterminada ───────────────────────────────────────────────
@wallet_router.get("/cards/{user_id}/default")
async def get_default_card(user_id: str):
    """Obtiene la tarjeta marcada como predeterminada del usuario"""
    card = await repo.get_default_card(user_id)
    if not card:
        raise HTTPException(status_code=404, detail="No hay tarjeta predeterminada registrada")
    return card


# ── POST: Agregar nueva tarjeta ───────────────────────────────────────────────
@wallet_router.post("/cards/{user_id}")
async def add_card(user_id: str, card: BankCardCreate):
    """Agrega una nueva tarjeta/cuenta bancaria al wallet del usuario"""
    card_dict = card.dict()
    card_dict["user_id"] = user_id
    card_dict["id"] = str(uuid.uuid4())

    card_id = await repo.add_card(card_dict)
    return {"id": card_id, "message": "Tarjeta agregada correctamente", "status": "success"}


# ── DELETE: Eliminar tarjeta ──────────────────────────────────────────────────
@wallet_router.delete("/cards/{user_id}/{card_id}")
async def delete_card(user_id: str, card_id: str):
    """Elimina una tarjeta del wallet del usuario"""
    success = await repo.delete_card(user_id, card_id)
    if not success:
        raise HTTPException(status_code=404, detail="Tarjeta no encontrada")
    return {"message": "Tarjeta eliminada correctamente", "status": "success"}


# ── PATCH: Marcar como predeterminada ─────────────────────────────────────────
@wallet_router.patch("/cards/{user_id}/{card_id}/default")
async def set_default_card(user_id: str, card_id: str):
    """Marca una tarjeta como predeterminada para recibir pagos"""
    success = await repo.set_default(user_id, card_id)
    if not success:
        raise HTTPException(status_code=404, detail="No se pudo actualizar la tarjeta predeterminada")
    return {"message": "Tarjeta predeterminada actualizada", "status": "success"}
