from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# IMPORTANTE: Asegúrate de importar el router de usuarios también
from user.infrastructure.routes.route_user import user_router
from group.infrastructure.routes.route_group import group_router

app = FastAPI(
    title="Easy-Pay API",
    description="Sistema de gestión de gastos compartidos - UNACH 2026",
    version="1.0.0"
)

# Configurar CORS (Puerto del Frontend: 5173)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:8081", # Added for mobile local dev
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registramos los routers
app.include_router(user_router)
app.include_router(group_router)

@app.get("/")
def read_root():
    return {
        "mensaje": "Bienvenido a la API de Easy-Pay 🐍",
        "docs": "/docs",
        "status": "active"
    }

@app.get("/api/health")
def health_check():
    return {"status": "ok", "system": "Easy Pay Backend", "version": "1.0.0"}
