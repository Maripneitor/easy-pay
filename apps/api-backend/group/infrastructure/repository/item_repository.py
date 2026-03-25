from bson import ObjectId
from database import db_instance

class MongoItemRepository:
    def __init__(self):
        self.db = db_instance.get_db("EasyPay_Groups")
        self.collection = self.db.get_collection("items")

    async def save_item(self, item_data: dict):
        result = await self.collection.insert_one(item_data)
        return str(result.inserted_id)

    async def find_by_group(self, group_id: str):
        cursor = self.collection.find({"group_id": group_id})
        return await cursor.to_list(length=100)