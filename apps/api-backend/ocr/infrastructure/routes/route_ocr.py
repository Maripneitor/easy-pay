from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from typing import Optional
from utils.security import get_current_user_id
from group.infrastructure.repository.group_repository import MongoGroupRepository
import httpx
import os
import re
from bson import ObjectId

router = APIRouter(prefix="/api/ocr", tags=["OCR"])

# ── Configuración ─────────────────────────────────────────────────────────────
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "easypay")
OCR_API_KEY = os.getenv("OCR_API_KEY", "K88694858788957")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]
ocr_collection = db["OsrMG"]
group_repo = MongoGroupRepository()

# ── Modelos ───────────────────────────────────────────────────────────
class TicketItem(BaseModel):
    name: str
    price: float
    quantity: int = 1

class OcrRequest(BaseModel):
    image_base64: str           # Imagen en base64
    group_id: Optional[str] = None
    user_id: Optional[str] = None

# ── Helpers de parseo ─────────────────────────────────────────────────────────
def clean_price(text: str) -> float:
    # Remove currency symbols and common OCR noise
    text = re.sub(r"[^\d.,]", "", text)
    # Handle European/Latin American comma as decimal separator
    if "," in text and "." in text:
        text = text.replace(",", "")
    elif "," in text:
        text = text.replace(",", ".")
    try:
        return float(text)
    except:
        return 0.0

def title_case(text: str) -> str:
    return " ".join([w.capitalize() for w in text.split()])

def parse_ticket_text(raw_text: str) -> dict:
    lines = [l.strip() for l in raw_text.split("\n") if l.strip()]

    meta_pattern = re.compile(
        r"folio|orden|fecha|hora|cajero|mesero|ticket|mesa|persona|\d{2}/\d{2}|\d{2}:\d{2}",
        re.IGNORECASE
    )
    restaurant_name = "Restaurante"
    for line in lines[:10]:
        if not meta_pattern.search(line) and len(line) >= 4 and not any(c.isdigit() for c in line):
            restaurant_name = title_case(line)
            break

    skip_pattern = re.compile(
        r"total|subtotal|sub\s*total|iva|impuesto|propina|tip|descuento|cambio|"
        r"efectivo|tarjeta|pago|gracias|thank|folio|orden|cajero|mesero|fecha|hora|"
        r"son:|este no es|comprobante|fiscal|rfc|direcci|tel[ef]|whatsapp|"
        r"facebook|instagram|www\.|\.com|wow!|muy bien|\d+%|si requiere|"
        r"facturaci|soft restaurant|cant\.|descripcion|importe",
        re.IGNORECASE
    )

    items = []
    # Patterns for different receipt layouts
    # 1. Quantity - Description - Price (common)
    p1 = re.compile(r"^(\d{1,2})\s+([a-zA-Z\s]{2,40}?)\s+[\$]?([\d,]+\.?\d{0,2})$")
    # 2. Description - Price (no quantity)
    p2 = re.compile(r"^([a-zA-Z\s]{2,45}?)\s{2,}[\$]?([\d,]+\.?\d{0,2})$")
    # 3. Description - $ - Price
    p3 = re.compile(r"^([a-zA-Z\s]{2,40}?)\s+[\$]([\d,]+\.?\d{0,2})$")

    for line in lines:
        if skip_pattern.search(line):
            continue

        # Try Pattern 1
        m = p1.match(line)
        if m:
            qty = int(m.group(1))
            name = title_case(m.group(2).strip())
            price = clean_price(m.group(3))
            if 0 < qty <= 50 and 0 < price < 50000:
                items.append({"name": name, "price": price, "quantity": qty})
                continue

        # Try Pattern 2
        m = p2.match(line)
        if m:
            name = title_case(m.group(1).strip())
            price = clean_price(m.group(2))
            if 0 < price < 50000 and not any(kw in name.lower() for kw in ["total", "iva", "pago"]):
                items.append({"name": name, "price": price, "quantity": 1})
                continue

        # Try Pattern 3
        m = p3.match(line)
        if m:
            name = title_case(m.group(1).strip())
            price = clean_price(m.group(2))
            if 0 < price < 50000:
                items.append({"name": name, "price": price, "quantity": 1})

    # Totals extraction
    total = subtotal = tax = tip = 0.0
    for line in lines:
        # Search for lines containing "Total"
        if re.search(r"total", line, re.IGNORECASE):
            nums = re.findall(r"[\d,]+\.\d{2}", line)
            if nums:
                val = clean_price(nums[-1])
                if val > total: total = val
        
        # Search for subtotal
        if re.search(r"subtotal|sub\s*total", line, re.IGNORECASE):
            nums = re.findall(r"[\d,]+\.\d{2}", line)
            if nums:
                val = clean_price(nums[-1])
                if val > subtotal: subtotal = val

        # Search for tax
        if re.search(r"iva|impuesto", line, re.IGNORECASE):
            nums = re.findall(r"[\d,]+\.\d{2}", line)
            if nums:
                val = clean_price(nums[-1])
                if val > tax: tax = val

        # Search for tip
        if re.search(r"propina|tip", line, re.IGNORECASE):
            nums = re.findall(r"[\d,]+\.\d{2}", line)
            if nums:
                val = clean_price(nums[-1])
                if val > tip: tip = val

    if total == 0 and items:
        total = round(sum(i["price"] * i["quantity"] for i in items), 2)

    return {
        "restaurant_name": restaurant_name,
        "items": items,
        "subtotal": subtotal,
        "tax": tax,
        "tip": tip,
        "total": total,
        "raw_text": raw_text,
    }

# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/scan")
async def scan_ticket(request: OcrRequest, current_user_id: str = Depends(get_current_user_id)):
    if request.user_id and request.user_id != current_user_id:
        raise HTTPException(status_code=403, detail="No puedes procesar tickets para otro usuario")
    
    if request.group_id:
        group = await group_repo.find_by_id(request.group_id)
        if not group or current_user_id not in group.get("integrantes", []):
            raise HTTPException(status_code=403, detail="No tienes acceso a este grupo")

    try:
        async with httpx.AsyncClient(timeout=30) as client_http:
            response = await client_http.post(
                "https://api.ocr.space/parse/image",
                headers={"apikey": OCR_API_KEY},
                data={
                    "base64Image": f"data:image/jpeg;base64,{request.image_base64}",
                    "language": "spa",
                    "isOverlayRequired": "false",
                    "detectOrientation": "true",
                    "scale": "true",
                    "isTable": "true",
                    "OCREngine": "2",
                }
            )
        
        ocr_data = response.json()
        raw_text = ocr_data.get("ParsedResults", [{}])[0].get("ParsedText", "")

        if not raw_text or len(raw_text.strip()) < 10:
            raise HTTPException(status_code=422, detail="No se pudo extraer texto del ticket.")

        parsed = parse_ticket_text(raw_text)

        doc = {
            **parsed,
            "group_id": request.group_id,
            "user_id": current_user_id,
            "created_at": datetime.utcnow(),
            "status": "processed",
        }
        result = await ocr_collection.insert_one(doc)
        doc["_id"] = str(result.inserted_id)

        return {
            "success": True,
            "scan_id": str(result.inserted_id),
            "data": parsed,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error procesando ticket: {str(e)}")

@router.get("/history/{group_id}")
async def get_scan_history(group_id: str, current_user_id: str = Depends(get_current_user_id)):
    group = await group_repo.find_by_id(group_id)
    if not group or current_user_id not in group.get("integrantes", []):
        raise HTTPException(status_code=403, detail="No tienes acceso a este grupo")

    cursor = ocr_collection.find(
        {"group_id": group_id},
        {"raw_text": 0}
    ).sort("created_at", -1).limit(20)

    results = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        results.append(doc)

    return {"group_id": group_id, "scans": results}

@router.get("/scan/{scan_id}")
async def get_scan(scan_id: str, current_user_id: str = Depends(get_current_user_id)):
    try:
        doc = await ocr_collection.find_one({"_id": ObjectId(scan_id)})
        if not doc:
            raise HTTPException(status_code=404, detail="Escaneo no encontrado.")
        
        if doc.get("user_id") != current_user_id:
            # Si tiene group_id, verificar si el usuario está en el grupo
            if doc.get("group_id"):
                group = await group_repo.find_by_id(doc["group_id"])
                if not group or current_user_id not in group.get("integrantes", []):
                    raise HTTPException(status_code=403, detail="No tienes acceso a este escaneo")
            else:
                raise HTTPException(status_code=403, detail="No tienes acceso a este escaneo")

        doc["_id"] = str(doc["_id"])
        return doc
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=400, detail="ID inválido.")

@router.delete("/scan/{scan_id}")
async def delete_scan(scan_id: str, current_user_id: str = Depends(get_current_user_id)):
    try:
        doc = await ocr_collection.find_one({"_id": ObjectId(scan_id)})
        if not doc:
            raise HTTPException(status_code=404, detail="Escaneo no encontrado.")
        
        if doc.get("user_id") != current_user_id:
             raise HTTPException(status_code=403, detail="No tienes permiso para eliminar este escaneo")

        result = await ocr_collection.delete_one({"_id": ObjectId(scan_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Escaneo no encontrado.")
        return {"success": True, "deleted_id": scan_id}
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=400, detail="ID inválido.")
