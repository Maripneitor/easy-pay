from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Asegúrate de que esta carpeta y archivo existan para que no truene el import
from group.infrastructure.routes.route_group import group_router


app = FastAPI(
    title="Easy-Pay Group API",
    description="Microservicio para la gestión de grupos y saldos",
    version="1.0.0"
)

# Configurar CORS (Puerto del Frontend: 5173)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# ✅ CORREGIDO: 'app' en lugar de 'add'
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registramos el router de grupos
app.include_router(group_router)

@app.get("/")
def read_root():
    return {
        "mensaje": "Bienvenido al Microservicio de Grupos 👥",
        "docs": "/docs",
        "status": "active"
    }

@app.get("/api/health")
def health_check():
    return {"status": "ok", "system": "Easy Pay Group Service"}