# user/database.py
import os
import asyncio
from urllib.parse import quote_plus
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

user = quote_plus(os.getenv("MONGO_USER", ""))
password = quote_plus(os.getenv("MONGO_PASS", ""))
cluster = os.getenv("MONGO_CLUSTER")
db_name = os.getenv("DB_NAME_AUTH") 

MONGO_URI = f"mongodb+srv://{user}:{password}@{cluster}/?retryWrites=true&w=majority"

class MongoDB:
    def __init__(self):
        self.client = AsyncIOMotorClient(MONGO_URI)
        self.db = self.client[db_name]

    def get_collection(self, name: str):
        # Esto usará la base de datos EasyPay_Auth que ya tienes
        return self.db[name]

    async def test_connection(self):
        try:
            # El comando 'ping' verifica si Atlas nos responde
            await self.client.admin.command('ping')
            print(f"✅ Conexión exitosa a MongoDB Atlas: Base de datos '{db_name}' lista.")
        except Exception as e:
            print(f"❌ Error conectando a MongoDB: {e}")

db_instance = MongoDB()

if __name__ == "__main__":
    asyncio.run(db_instance.test_connection())