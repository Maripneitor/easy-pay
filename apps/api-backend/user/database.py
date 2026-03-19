import os
import asyncio
from urllib.parse import quote_plus
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()


env_uri = os.getenv("MONGO_URI")

if env_uri:
    MONGO_URI = env_uri
else:
    user = quote_plus(os.getenv("MONGO_USER", ""))
    password = quote_plus(os.getenv("MONGO_PASS", ""))
    cluster = os.getenv("MONGO_CLUSTER")
    MONGO_URI = f"mongodb+srv://{user}:{password}@{cluster}/?retryWrites=true&w=majority"


db_name = os.getenv("DB_NAME_AUTH", "EasyPay_Auth")

class MongoDB:
    def __init__(self):
        self.client = AsyncIOMotorClient(MONGO_URI)
        self.db = self.client[db_name]

    def get_collection(self, name: str):
        return self.db[name]

    async def test_connection(self):
        try:
            # El comando 'ping' verifica la conexión
            await self.client.admin.command('ping')
            print(f"Conexión exitosa ({'Local' if 'local' in MONGO_URI else 'Atlas'}): Base de datos '{db_name}' lista.")
        except Exception as e:
            print(f"Error conectando a MongoDB: {e}")

db_instance = MongoDB()

if __name__ == "__main__":
    asyncio.run(db_instance.test_connection())