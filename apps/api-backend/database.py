import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

# Aquí jalamos la URL de Atlas que pusimos en el .env
MONGO_URL = os.getenv("MONGO_URL")

class DatabaseConnector:
    def __init__(self):
        # Usamos el cliente de Motor para Atlas
        self.client = AsyncIOMotorClient(MONGO_URL)

    def get_db(self, db_name: str):
        return self.client[db_name]

db_instance = DatabaseConnector()