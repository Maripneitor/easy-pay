from database import db_instance
from bson import ObjectId
from datetime import datetime


class WalletRepository:
    def __init__(self):
        # Base de datos exclusiva para el wallet
        self.db = db_instance.get_db("EasyPay_Wallet")
        self.collection = self.db.get_collection("Cards")

    # ── Obtener tarjetas de un usuario ────────────────────────────────────────
    async def get_cards(self, user_id: str) -> list:
        cursor = self.collection.find({"user_id": user_id})
        cards = await cursor.to_list(length=50)
        for c in cards:
            c["id"] = str(c["_id"])
            del c["_id"]
        return cards

    # ── Agregar tarjeta ───────────────────────────────────────────────────────
    async def add_card(self, card_data: dict) -> str:
        # Si es la primera tarjeta del usuario, marcarla como default
        existing = await self.get_cards(card_data["user_id"])
        if len(existing) == 0:
            card_data["is_default"] = True

        card_data["created_at"] = datetime.utcnow()
        result = await self.collection.insert_one(card_data)
        return str(result.inserted_id)

    # ── Eliminar tarjeta ──────────────────────────────────────────────────────
    async def delete_card(self, user_id: str, card_id: str) -> bool:
        if not ObjectId.is_valid(card_id):
            return False
        result = await self.collection.delete_one(
            {"_id": ObjectId(card_id), "user_id": user_id}
        )
        return result.deleted_count > 0

    # ── Tarjeta predeterminada ────────────────────────────────────────────────
    async def set_default(self, user_id: str, card_id: str) -> bool:
        if not ObjectId.is_valid(card_id):
            return False
        # Quitar default a todas
        await self.collection.update_many(
            {"user_id": user_id},
            {"$set": {"is_default": False}}
        )
        # Poner default a la seleccionada
        result = await self.collection.update_one(
            {"_id": ObjectId(card_id), "user_id": user_id},
            {"$set": {"is_default": True}}
        )
        return result.modified_count > 0

    # ── Obtener tarjeta default ───────────────────────────────────────────────
    async def get_default_card(self, user_id: str) -> dict | None:
        card = await self.collection.find_one(
            {"user_id": user_id, "is_default": True}
        )
        if card:
            card["id"] = str(card["_id"])
            del card["_id"]
        return card
