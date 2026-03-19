from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from user.infrastructure.routes.route_user import user_router

app = FastAPI(
    title="Easy-Pay API",
    description="Sistema de gestión de gastos compartidos - UNACH 2026",
    version="1.0.0"
)

# Configurar CORS (Puerto del Frontend: 5173)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Registramos el router de Usuarios (Auth)
# Esto habilitará automáticamente los endpoints /api/auth/register y /api/auth/login
app.include_router(user_router)

@app.get("/")
def read_root():
    return {
        "mensaje": "Bienvenido a la API de Easy-Pay 🐍",
        "docs": "/docs",
        "status": "active"
    }

@app.get("/api/health")
def health_check():
    # Aquí podrías agregar un check real de la conexión a Mongo
    return {"status": "ok", "system": "Easy Pay Backend", "version": "1.0.0"}

# --- Endpoints de Grupos (Provisionales hasta moverlos a su microservicio) ---
# Nota: Eventualmente estos deben ir en un router separado como el de User
@app.get("/api/groups", tags=["Groups"])
async def get_groups():
    return {"message": "Módulo de grupos en construcción para MongoDB"}