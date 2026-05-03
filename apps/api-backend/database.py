import os
import logging
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

# Check multiple possible env var names for robustness (Atlas vs Local)
MONGO_URL = os.getenv("MONGO_URL") or os.getenv("MONGO_URI") or "mongodb://localhost:27017"

class DatabaseConnector:
    def __init__(self):
        try:
            logger.info(f"Conectando a MongoDB en: {MONGO_URL.split('@')[-1] if '@' in MONGO_URL else MONGO_URL}")
            self.client = AsyncIOMotorClient(
                MONGO_URL,
                serverSelectionTimeoutMS=5000,
                connectTimeoutMS=5000,
                retryWrites=True
            )
        except Exception as e:
            logger.error(f"❌ Error crítico al inicializar el cliente de MongoDB: {str(e)}")
            self.client = None

    def get_db(self, db_name: str = "EasyPay"):
        if self.client is None:
            logger.warning("Intentando acceder a DB con cliente no inicializado")
            return None
        return self.client[db_name]

# Singleton instance
db_instance = DatabaseConnector()