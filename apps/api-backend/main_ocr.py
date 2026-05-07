from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from ocr.infrastructure.routes.route_ocr import router as ocr_router

app = FastAPI(title="Easy-Pay OCR Service", version="1.0.0")
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ocr_router)

@app.get("/")
def read_root():
    return {"service": "OCR Service", "status": "active"}

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

import logging
logger = logging.getLogger(__name__)

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    import traceback
    logger.error(f"Global exception in OCR Service: {str(exc)}")
    logger.error(traceback.format_exc())
    from fastapi.responses import JSONResponse
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error", "error": str(exc)}
    )
