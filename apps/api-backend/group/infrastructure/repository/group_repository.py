from bson import ObjectId
from database import db_instance

class MongoGroupRepository:
    def __init__(self):
        self.db = db_instance.get_db("EasyPay_Groups")
        self.collection = self.db.get_collection("Groups")

    async def save_group(self, group_data: dict):
        result = await self.collection.insert_one(group_data)
        return str(result.inserted_id)

    async def find_by_id(self, group_id: str):
        return await self.collection.find_one({"_id": ObjectId(group_id)})

    async def add_member(self, group_id: str, user_id: str):
        await self.collection.update_one(
            {"_id": ObjectId(group_id)},
            {"$addToSet": {"integrantes": user_id}}
        )