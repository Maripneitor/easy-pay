from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timedelta
from typing import Optional, List
from enum import Enum
from bson import ObjectId
import os
import asyncio

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])

from dotenv import load_dotenv
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

# ── Configuración ─────────────────────────────────────────────────────────────
MONGO_URL = os.getenv("MONGO_URL") or os.getenv("MONGO_URI") or "mongodb://localhost:27017"
DB_NAME = os.getenv("DB_NAME", "easypay")
REMINDER_HOURS = int(os.getenv("REMINDER_HOURS", 24))

logger.info(f"Conectando Notification Service a: {MONGO_URL.split('@')[-1] if '@' in MONGO_URL else MONGO_URL}")
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]
notif_collection = db["notificaciones"]
debts_collection = db["deudas"]

# ── Enums y Modelos ───────────────────────────────────────────────────────────
class NotificationType(str, Enum):
    user_joined    = "user_joined"
    group_closed   = "group_closed"
    item_assigned  = "item_assigned"
    payment_due    = "payment_due"
    payment_received = "payment_received"
    invitation     = "invitation"
    reminder       = "reminder"

class NotificationCreate(BaseModel):
    user_id: str
    type: NotificationType
    title: str
    body: str
    group_id: Optional[str] = None
    amount: Optional[float] = None
    from_user_id: Optional[str] = None
    from_user_name: Optional[str] = None
    data: Optional[dict] = None

class DebtCreate(BaseModel):
    group_id: str
    group_name: str
    from_user_id: str
    from_user_name: str
    to_user_id: str
    to_user_name: str
    amount: float
    concept: str

# ── Helpers ───────────────────────────────────────────────────────────────────
def serialize(doc: dict) -> dict:
    doc["_id"] = str(doc["_id"])
    return doc

# ── Endpoints de Notificaciones ───────────────────────────────────────────────

@router.post("/send")
async def send_notification(notif: NotificationCreate):
    doc = {
        **notif.model_dump(),
        "read": False,
        "created_at": datetime.utcnow(),
    }
    result = await notif_collection.insert_one(doc)
    return {"success": True, "notification_id": str(result.inserted_id)}

@router.post("/send-bulk")
async def send_bulk(user_ids: List[str], notif: NotificationCreate):
    docs = []
    for uid in user_ids:
        docs.append({
            **notif.model_dump(),
            "user_id": uid,
            "read": False,
            "created_at": datetime.utcnow(),
        })
    if docs:
        await notif_collection.insert_many(docs)
    return {"success": True, "sent_to": len(docs)}

@router.get("/{user_id}")
async def get_notifications(user_id: str, limit: int = 30, unread_only: bool = False):
    query: dict = {"user_id": user_id}
    if unread_only:
        query["read"] = False

    cursor = notif_collection.find(query).sort("created_at", -1).limit(limit)
    results = [serialize(doc) async for doc in cursor]

    unread_count = await notif_collection.count_documents({"user_id": user_id, "read": False})
    return {"notifications": results, "unread_count": unread_count}

@router.patch("/{notification_id}/read")
async def mark_as_read(notification_id: str):
    try:
        result = await notif_collection.update_one(
            {"_id": ObjectId(notification_id)},
            {"$set": {"read": True, "read_at": datetime.utcnow()}}
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Notificación no encontrada.")
        return {"success": True}
    except Exception:
        raise HTTPException(status_code=400, detail="ID inválido.")

@router.patch("/{user_id}/read-all")
async def mark_all_read(user_id: str):
    await notif_collection.update_many(
        {"user_id": user_id, "read": False},
        {"$set": {"read": True, "read_at": datetime.utcnow()}}
    )
    return {"success": True}

@router.delete("/{notification_id}")
async def delete_notification(notification_id: str):
    try:
        result = await notif_collection.delete_one({"_id": ObjectId(notification_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Notificación no encontrada.")
        return {"success": True}
    except Exception:
        raise HTTPException(status_code=400, detail="ID inválido.")

# ── Endpoints de Deudas ───────────────────────────────────────────────────────

@router.post("/debts")
async def create_debt_route(debt: DebtCreate):
    # Nota: He renombrado este endpoint para evitar conflictos si se unifica con otros de deudas
    doc = {
        **debt.model_dump(),
        "status": "pending",
        "created_at": datetime.utcnow(),
        "remind_at": datetime.utcnow() + timedelta(hours=REMINDER_HOURS),
        "reminded": False,
    }
    result = await debts_collection.insert_one(doc)
    debt_id = str(result.inserted_id)

    await notif_collection.insert_one({
        "user_id": debt.from_user_id,
        "type": NotificationType.payment_due,
        "title": "💸 Deuda registrada",
        "body": f"Debes ${debt.amount:.2f} a {debt.to_user_name} por '{debt.group_name}'",
        "group_id": debt.group_id,
        "amount": debt.amount,
        "from_user_name": debt.to_user_name,
        "read": False,
        "created_at": datetime.utcnow(),
        "data": {"debt_id": debt_id},
    })

    return {"success": True, "debt_id": debt_id}

@router.get("/debts/{user_id}")
async def get_user_debts_route(user_id: str):
    cursor = debts_collection.find(
        {"from_user_id": user_id, "status": "pending"}
    ).sort("created_at", -1)
    results = [serialize(doc) async for doc in cursor]
    total = sum(d["amount"] for d in results)
    return {"debts": results, "total_owed": total}

@router.patch("/debts/{debt_id}/pay")
async def mark_debt_paid_route(debt_id: str):
    try:
        debt = await debts_collection.find_one({"_id": ObjectId(debt_id)})
        if not debt:
            raise HTTPException(status_code=404, detail="Deuda no encontrada.")

        await debts_collection.update_one(
            {"_id": ObjectId(debt_id)},
            {"$set": {"status": "paid", "paid_at": datetime.utcnow()}}
        )

        await notif_collection.insert_one({
            "user_id": debt["to_user_id"],
            "type": NotificationType.payment_received,
            "title": "✅ Pago recibido",
            "body": f"{debt['from_user_name']} pagó ${debt['amount']:.2f} por '{debt['group_name']}'",
            "group_id": debt["group_id"],
            "amount": debt["amount"],
            "from_user_name": debt["from_user_name"],
            "read": False,
            "created_at": datetime.utcnow(),
        })

        return {"success": True}
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=400, detail="ID inválido.")

# ── Worker de recordatorios automáticos (Lógica para ser llamada desde main.py) ──

async def reminder_worker():
    while True:
        try:
            now = datetime.utcnow()
            cursor = debts_collection.find({
                "status": "pending",
                "reminded": False,
                "remind_at": {"$lte": now},
            })

            async for debt in cursor:
                await notif_collection.insert_one({
                    "user_id": debt["from_user_id"],
                    "type": NotificationType.reminder,
                    "title": "⏰ Recordatorio de pago",
                    "body": f"Aún debes ${debt['amount']:.2f} a {debt['to_user_name']} por '{debt['group_name']}'",
                    "group_id": debt.get("group_id"),
                    "amount": debt["amount"],
                    "read": False,
                    "created_at": now,
                    "data": {"debt_id": str(debt["_id"])},
                })

                await debts_collection.update_one(
                    {"_id": debt["_id"]},
                    {"$set": {
                        "reminded": True,
                        "last_reminded_at": now,
                        "remind_at": now + timedelta(hours=REMINDER_HOURS),
                    }}
                )

            # print(f"[Reminder Worker] Corrida completada a las {now.strftime('%H:%M:%S')}")

        except Exception as e:
            print(f"[Reminder Worker] Error: {e}")

        await asyncio.sleep(3600)
