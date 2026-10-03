from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import (
    user_router,
    admin_router,
    wallet_router,
    group_router,
    stats_router,
    ocr_router,
    notification_router,
    reminder_worker
)
from models.role_model import RoleModel
import asyncio
import logging

logger = logging.getLogger(__name__)

app = FastAPI(
    title="Easy-Pay API",
    description="Sistema de gestión de gastos compartidos con arquitectura Modelo-Vista-Controlador (MVC) y POO",
    version="2.0.0"
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
    allow_origin_regex=".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registramos los routers de la arquitectura MVC
app.include_router(user_router)
app.include_router(admin_router)
app.include_router(wallet_router)
app.include_router(group_router)
app.include_router(stats_router)
app.include_router(ocr_router)
app.include_router(notification_router)

@app.on_event("startup")
async def startup_event():
    # Inicializar roles predeterminados (Administrador, Editor, Usuario Regular)
    try:
        role_model = RoleModel()
        await role_model.seed_default_roles()
        print("🛡️ [RBAC] Roles y permisos dinámicos listos en MongoDB")
    except Exception as e:
        print(f"⚠️ [RBAC] Advertencia inicializando roles: {e}")

    # Iniciar worker de recordatorios en segundo plano
    try:
        asyncio.create_task(reminder_worker())
        print("🚀 Unified API started - Reminder Worker active")
    except Exception as e:
        print(f"⚠️ Error iniciando worker de recordatorios: {e}")

@app.get("/")
def read_root():
    return {
        "mensaje": "Bienvenido a la API de Easy-Pay (Arquitectura MVC + POO) 🐍",
        "docs": "/docs",
        "status": "active",
        "version": "2.0.0"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "system": "Easy Pay Backend (MVC)",
        "version": "2.0.0"
    }

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    import traceback
    logger.error(f"Global exception in API: {str(exc)}")
    logger.error(traceback.format_exc())
    from fastapi.responses import JSONResponse
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error", "error": str(exc)}
    )