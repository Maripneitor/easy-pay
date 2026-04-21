from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# IMPORTANTE: Asegúrate de importar el router de usuarios también
from user.infrastructure.routes.route_user import user_router 
from group.infrastructure.routes.route_group import group_router

app = FastAPI(
    title="Easy-Pay API",
    description="Sistema de gestión de gastos compartidos",
    version="1.0.0"
)

# Configurar CORS (Puertos locales de desarrollo)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:8081", # Mobile local dev
    "http://localhost:19000", # Expo Go
    "http://localhost:19006", # Web Expo
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registramos los routers unificados
app.include_router(user_router)
app.include_router(group_router)


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