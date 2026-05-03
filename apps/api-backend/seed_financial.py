
import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL") or os.getenv("MONGO_URI") or "mongodb://localhost:27017"

async def seed_financial_data():
    client = AsyncIOMotorClient(MONGO_URL)
    # Using the correct DB and Collection names found in the repository
    db = client["EasyPay_Auth"]
    users_collection = db["Users"]

    # Let's find a user that looks like the main user
    mario = await users_collection.find_one({"nombre": {"$regex": "Mario", "$options": "i"}})
    
    financial_data = {
        "financial_profile": {
            "beneficiario": "MARIO EFRAIN MOGUEL HERNANDEZ",
            "clabe": "638180000140716928",
            "entidad_financiera": "Nu México"
        }
    }

    if mario:
        print(f"Found user: {mario['nombre']} ({mario['_id']})")
        result = await users_collection.update_one(
            {"_id": mario["_id"]},
            {"$set": financial_data}
        )
        print(f"Update result: {result.modified_count} document(s) modified")
    else:
        # If no Mario found, update the first user as a fallback
        first_user = await users_collection.find_one({})
        if first_user:
            print(f"Mario not found. Updating first user: {first_user['nombre']} ({first_user['_id']})")
            result = await users_collection.update_one(
                {"_id": first_user["_id"]},
                {"$set": financial_data}
            )
            print(f"Update result: {result.modified_count} document(s) modified")
        else:
            print("No users found in database 'EasyPay_Auth.Users'.")

    client.close()

if __name__ == "__main__":
    asyncio.run(seed_financial_data())
