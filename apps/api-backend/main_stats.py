from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from stats.infrastructure.routes.routes_stats import router as stats_router

app = FastAPI(title="Easy-Pay Statistics Service")

# Configuración de CORS para que tu React (5173) no se bloquee
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(stats_router)

@app.get("/")
def root():
    return {"service": "Statistics Service", "status": "online"}