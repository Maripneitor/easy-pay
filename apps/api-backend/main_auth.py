from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from user.infrastructure.routes.route_user import user_router 

app = FastAPI(title="Easy-Pay Auth/User Service", version="1.0.0")
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)

@app.get("/")
def read_root():
    return {"service": "Auth/User Service", "status": "active"}

import logging
logger = logging.getLogger(__name__)

@app.get("/api/health")
def health_check():
    return {"status": "ok", "system": "Easy Pay Auth Service"}

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    import traceback
    logger.error(f"Global exception in Auth Service: {str(exc)}")
    logger.error(traceback.format_exc())
    from fastapi.responses import JSONResponse
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error", "error": str(exc)}
    )
