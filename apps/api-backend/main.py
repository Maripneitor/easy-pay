from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# IMPORTANTE: Asegúrate de importar el router de usuarios también
from user.infrastructure.routes.route_user import user_router 
from group.infrastructure.routes.route_group import group_router
from stats.infrastructure.routes.routes_stats import router as stats_router

app = FastAPI(
    title="Easy-Pay API",
    description="Sistema de gestión de gastos compartidos",
    version="1.0.0"
)

# Configurar CORS (Permitir orígenes de frontend web y móvil)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://192.168.1.11:5173",
    "http://10.25.64.36:5173",
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