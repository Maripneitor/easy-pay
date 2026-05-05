from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from typing import Optional
import httpx
import base64
import re
import os
from bson import ObjectId

# ── Configuración ─────────────────────────────────────────────────────────────
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "easypay")
OCR_API_KEY = os.getenv("OCR_API_KEY", "K88694858788957")
PORT = int(os.getenv("PORT", 8004))

app = FastAPI(
    title="Easy-Pay OCR Microservice",
    description="Microservicio de escaneo y parseo de tickets",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── MongoDB ───────────────────────────────────────────────────────────────────
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]
ocr_collection = db["OsrMG"]

# ── Modelos ───────────────────────────────────────────────────────────────────
class TicketItem(BaseModel):
    name: str
    price: float
    quantity: int = 1

class OcrRequest(BaseModel):
    image_base64: str           # Imagen en base64
    group_id: Optional[str] = None
    user_id: Optional[str] = None

class OcrResult(BaseModel):
    restaurant_name: str
    items: list[TicketItem]
    subtotal: float
    tax: float
    tip: float
    total: float
    raw_text: str
    group_id: Optional[str] = None
    user_id: Optional[str] = None

# ── Helpers de parseo ─────────────────────────────────────────────────────────
def title_case(text: str) -> str:
    return text.lower().title()

def parse_ticket_text(raw_text: str) -> dict:
    lines = [l.strip() for l in raw_text.split("\n") if l.strip()]

    # Detectar nombre del restaurante
    meta_pattern = re.compile(
        r"folio|orden|fecha|hora|cajero|mesero|ticket|mesa|persona|\d{2}/\d{2}|\d{2}:\d{2}",
        re.IGNORECASE
    )
    restaurant_name = "Restaurante"
    for line in lines[:8]:
        if not meta_pattern.search(line) and len(line) >= 3 and not line.isdigit():
            restaurant_name = title_case(line)
            break

    # Palabras a ignorar
    skip_pattern = re.compile(
        r"total|subtotal|sub\s*total|iva|impuesto|propina|tip|descuento|cambio|"
        r"efectivo|tarjeta|pago|gracias|thank|folio|orden|cajero|mesero|fecha|hora|"
        r"son:|este no es|comprobante|fiscal|rfc|direcci|tel[ef]|whatsapp|"
        r"facebook|instagram|www\.|\.com|wow!|muy bien|\d+%|si requiere|"
        r"facturaci|soft restaurant|cant\.|descripcion|importe",
        re.IGNORECASE
    )

    items = []
    # Patrón 1: cantidad + nombre + precio
    p1 = re.compile(r"^(\d{1,2})\s+(.{2,40}?)\s+\$?([\d,]+\.?\d{0,2})$")
    # Patrón 2: nombre + precio (espacios múltiples)
    p2 = re.compile(r"^(.{2,45}?)\s{2,}\$?([\d,]+\.?\d{0,2})$")
    # Patrón 3: nombre + $precio
    p3 = re.compile(r"^(.{2,40}?)\s+\$([\d,]+\.?\d{0,2})$")

    for line in lines:
        if skip_pattern.search(line):
            continue

        m = p1.match(line)
        if m:
            qty = int(m.group(1))
            name = m.group(2).strip()
            price = float(m.group(3).replace(",", ""))
            if qty <= 20 and 0 < price < 99999 and len(name) > 1:
                items.append({"name": name, "price": price, "quantity": qty})
                continue

        m = p2.match(line)
        if m:
            name = m.group(1).strip()
            price = float(m.group(2).replace(",", ""))
            if 0 < price < 99999 and len(name) > 1 and not name.isdigit():
                items.append({"name": name, "price": price, "quantity": 1})
                continue

        m = p3.match(line)
        if m:
            name = m.group(1).strip()
            price = float(m.group(2).replace(",", ""))
            if 0 < price < 99999 and len(name) > 1:
                items.append({"name": name, "price": price, "quantity": 1})

    # Detectar totales
    total = subtotal = tax = tip = 0.0
    for line in lines:
        nums = re.findall(r"\$?([\d,]+\.\d{2})", line)
        last_num = float(nums[-1].replace(",", "")) if nums else 0

        sub_match = re.search(r"subtotal[:\s]*\$?([\d,]+\.?\d{0,2})", line, re.IGNORECASE)
        iva_match = re.search(r"iva[:\s]*\$?([\d,]+\.?\d{0,2})", line, re.IGNORECASE)

        if re.match(r"^total", line, re.IGNORECASE) and last_num > 0:
            total = last_num
        elif sub_match:
            subtotal = float(sub_match.group(1).replace(",", ""))
            if iva_match:
                tax = float(iva_match.group(1).replace(",", ""))
        elif re.match(r"^iva|^impuesto", line, re.IGNORECASE) and last_num > 0:
            tax = last_num
        elif re.match(r"^propina|^tip", line, re.IGNORECASE) and last_num > 0:
            tip = last_num

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

@app.get("/")
def root():
    return {"service": "Easy-Pay OCR", "status": "active", "port": PORT}

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "ocr", "port": PORT}

@app.post("/api/ocr/scan")
async def scan_ticket(request: OcrRequest):
    """
    Recibe imagen en base64, extrae texto con OCR.space,
    parsea el ticket y guarda el resultado en MongoDB.
    """
    try:
        # 1. Llamar a OCR.space
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
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

        # 2. Parsear el texto
        parsed = parse_ticket_text(raw_text)

        # 3. Guardar en MongoDB
        doc = {
            **parsed,
            "group_id": request.group_id,
            "user_id": request.user_id,
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


@app.get("/api/ocr/history/{group_id}")
async def get_scan_history(group_id: str):
    """Obtiene el historial de tickets escaneados de un grupo."""
    cursor = ocr_collection.find(
        {"group_id": group_id},
        {"raw_text": 0}  # Excluir texto crudo para aligerar la respuesta
    ).sort("created_at", -1).limit(20)

    results = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        results.append(doc)

    return {"group_id": group_id, "scans": results}


@app.get("/api/ocr/scan/{scan_id}")
async def get_scan(scan_id: str):
    """Obtiene un escaneo específico por ID."""
    try:
        doc = await ocr_collection.find_one({"_id": ObjectId(scan_id)})
        if not doc:
            raise HTTPException(status_code=404, detail="Escaneo no encontrado.")
        doc["_id"] = str(doc["_id"])
        return doc
    except Exception:
        raise HTTPException(status_code=400, detail="ID inválido.")


@app.delete("/api/ocr/scan/{scan_id}")
async def delete_scan(scan_id: str):
    """Elimina un escaneo por ID."""
    try:
        result = await ocr_collection.delete_one({"_id": ObjectId(scan_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Escaneo no encontrado.")
        return {"success": True, "deleted_id": scan_id}
    except Exception:
        raise HTTPException(status_code=400, detail="ID inválido.")


# ── Arrancar ──────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=PORT, reload=True)
