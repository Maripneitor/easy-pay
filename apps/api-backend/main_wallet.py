"""
main_wallet.py — Microservicio de Wallet (tarjetas bancarias de destino)
Puerto: 8006
Base de datos: EasyPay_Wallet → Colección: Cards
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from wallet.infrastructure.routes.route_wallet import wallet_router

app = FastAPI(
    title="Easy-Pay Wallet Service",
    description="Microservicio para gestión de tarjetas/cuentas bancarias de destino",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_origin_regex=".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(wallet_router)


@app.get("/")
def read_root():
    return {
        "mensaje": "Easy-Pay Wallet Service",
        "docs": "/docs",
        "status": "active",
        "database": "EasyPay_Wallet"
    }


@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "wallet-service"}
