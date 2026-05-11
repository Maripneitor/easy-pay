import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os

async def list_users():
    # Usando la URL de Atlas directamente desde los logs/env
    mongo_url = "mongodb+srv://Gafero_db_user:Hongodb2026@easy-pay.on6eyit.mongodb.net/?retryWrites=true&w=majority&appName=easy-pay"
    client = AsyncIOMotorClient(mongo_url)
    db = client["EasyPay_Auth"] # Según el .env
    collection = db["users"]
    
    users = await collection.find({}, {"nombre": 1, "email": 1}).to_list(10)
    print("\n--- Usuarios Registrados en MongoDB Atlas ---")
    for u in users:
        print(f"Nombre: {u.get('nombre')} | Email: {u.get('email')}")
    print("---------------------------------------------\n")
    client.close()

if __name__ == "__main__":
    asyncio.run(list_users())
