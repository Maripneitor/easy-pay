from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from user.infrastructure.routes.route_user import user_router 
from group.infrastructure.routes.route_group import group_router
from stats.infrastructure.routes.routes_stats import router as stats_router
from ocr.infrastructure.routes.route_ocr import router as ocr_router
from notification.infrastructure.routes.route_notification import router as notification_router, reminder_worker
from wallet.infrastructure.routes.route_wallet import wallet_router
import asyncio

app = FastAPI(
    title="Easy-Pay API",
    description="Sistema de gestión de gastos compartidos",
    version="1.0.0"
)

# Configurar CORS (Permitir orígenes de frontend web y móvil)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://10.12.138.36:5173",
    "http://localhost",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=".*", # Soporte dinámico para móviles en LAN y Expo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registramos los routers unificados
app.include_router(user_router)
app.include_router(group_router)
app.include_router(stats_router)
app.include_router(ocr_router)
app.include_router(notification_router)
app.include_router(wallet_router)


@app.on_event("startup")
async def startup_event():
    # Iniciar worker de recordatorios en segundo plano
    asyncio.create_task(reminder_worker())
    print("🚀 Unified API started - Reminder Worker active")


@app.get("/")
def read_root():
    return {
        "mensaje": "Bienvenido a la API Unificada de Easy-Pay 🐍",
        "docs": "/docs",
        "status": "active",
        "mode": "stable_rollback_v1"
    }

@app.get("/api/health")
def health_check():
    return {"status": "ok", "system": "Easy Pay Backend", "version": "1.0.0"}

import logging
logger = logging.getLogger(__name__)

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    import traceback
    logger.error(f"Global exception in User Service: {str(exc)}")
    logger.error(traceback.format_exc())
    from fastapi.responses import JSONResponse
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error", "error": str(exc)}
    )