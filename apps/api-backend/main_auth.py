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

@app.get("/api/health")
def health_check():
    return {"status": "ok"}
