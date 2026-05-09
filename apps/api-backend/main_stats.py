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

@app.get("/api/health")
def health_check():
    return {"status": "ok", "system": "Easy Pay Statistics Service"}

@app.get("/")
def root():
    return {"service": "Statistics Service", "status": "online"}

import logging
logger = logging.getLogger(__name__)

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    import traceback
    logger.error(f"Global exception in Stats Service: {str(exc)}")
    logger.error(traceback.format_exc())
    from fastapi.responses import JSONResponse
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error", "error": str(exc)}
    )