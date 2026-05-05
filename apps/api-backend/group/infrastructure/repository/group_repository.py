from bson import ObjectId
from datetime import datetime
from database import db_instance

class MongoGroupRepository:
    def __init__(self):
        # Base de datos de grupos
        self.db = db_instance.get_db("EasyPay_Groups")
        self.collection = self.db.get_collection("Groups")
        
        # AGREGADO: Referencia a la base de datos de usuarios para obtener los nombres
        self.db_auth = db_instance.get_db("EasyPay_Auth")
        self.users_collection = self.db_auth.get_collection("Users")

    def _map_group(self, group):
        if group:
            group["id"] = str(group["_id"])
            if "_id" in group:
                del group["_id"]
        return group

    async def save_group(self, group_data: dict):
        result = await self.collection.insert_one(group_data)
        return str(result.inserted_id)

    async def find_by_id_detailed(self, group_id: str):
        """Busca un grupo y reemplaza los IDs de integrantes por objetos detallados"""
        if not ObjectId.is_valid(group_id):
            return None
            
        group = await self.collection.find_one({"_id": ObjectId(group_id)})
        if not group:
            return None

        # 1. Extraer la lista de IDs (strings)
        integrantes_ids = group.get("integrantes", [])

        # 2. Buscar nombres en la base de datos de Auth
        valid_uids = [ObjectId(uid) for uid in integrantes_ids if ObjectId.is_valid(uid)]
        
        usuarios_cursor = self.users_collection.find(
            {"_id": {"$in": valid_uids}},
            {"nombre": 1, "financial_profile": 1, "trust_score": 1, "fast_payments_count": 1}
        )
        
        # 3. Mapear a una lista de objetos
        miembros_detallados = []
        if "demo-user-id" in integrantes_ids:
            miembros_detallados.append({
                "id": "demo-user-id",
                "nombre": "Usuario Demo (Tú)",
                "financial_profile": {},
                "trust_score": 5,
                "fast_payments_count": 10
            })
            
        async for user in usuarios_cursor:
            miembros_detallados.append({
                "id": str(user["_id"]),
                "nombre": user.get("nombre") or "Usuario",
                "financial_profile": user.get("financial_profile") or {},
                "trust_score": user.get("trust_score", 0),
                "fast_payments_count": user.get("fast_payments_count", 0)
            })

        # 4. Limpiar el grupo y meter la nueva lista detallada
        group = self._map_group(group)
        group["integrantes"] = miembros_detallados
        group["status"] = group.get("status") or group.get("estado") or "active"
        group["selected_bank_accounts"] = group.get("selected_bank_accounts", [])
        return group

    async def find_by_id(self, group_id: str):
        """Busca un grupo por ID (Versión simple)"""
        if not ObjectId.is_valid(group_id):
            return None
        group = await self.collection.find_one({"_id": ObjectId(group_id)})
        return self._map_group(group)

    async def find_by_code(self, code: str):
        group = await self.collection.find_one({"codigo_invitacion": code})
        return self._map_group(group)

    async def add_member(self, group_id: str, user_id: str):
        if not ObjectId.is_valid(group_id):
            return False
        result = await self.collection.update_one(
            {"_id": ObjectId(group_id)},
            {"$addToSet": {"integrantes": user_id}}
        )
        return result.modified_count > 0 or result.matched_count > 0

    async def remove_member(self, group_id: str, user_id: str):
        if not ObjectId.is_valid(group_id):
            return False
        result = await self.collection.update_one(
            {"_id": ObjectId(group_id)},
            {"$pull": {"integrantes": user_id}}
        )
        return result.modified_count > 0

    async def find_by_user(self, user_id: str):
        cursor = self.collection.find({"integrantes": user_id})
        groups = await cursor.to_list(length=100)
        return [self._map_group(g) for g in groups]

    async def get_all_groups(self):
        cursor = self.collection.find({})
        groups = await cursor.to_list(length=100)
        return [self._map_group(g) for g in groups]
    
    async def delete_group(self, group_id: str) -> bool:
        result = await self.collection.delete_one({"_id": ObjectId(group_id)})
        return result.deleted_count > 0

    async def update_group(self, group_id: str, update_data: dict) -> bool:
        if not ObjectId.is_valid(group_id):
            return False
        result = await self.collection.update_one(
            {"_id": ObjectId(group_id)},
            {"$set": update_data}
        )
        return result.modified_count > 0 or result.matched_count > 0

    async def close_group(self, group_id: str, final_data: dict) -> bool:
        if not ObjectId.is_valid(group_id):
            return False
        result = await self.collection.update_one(
            {"_id": ObjectId(group_id)},
            {"$set": {
                "status": "settling",
                "estado": "settling",
                "fecha_inicio_liquidacion": datetime.utcnow(),
                "monto_final": final_data.get("final_total"),
                "propina_total": final_data.get("tip_amount")
            }}
        )
        return result.modified_count > 0

    # --- Settlement Methods ---
    async def create_settlement(self, settlement_data: dict):
        settlements_col = self.db.get_collection("Settlements")
        result = await settlements_col.insert_one(settlement_data)
        return str(result.inserted_id)

    async def get_pending_settlements(self, group_id: str):
        settlements_col = self.db.get_collection("Settlements")
        cursor = settlements_col.find({"group_id": group_id, "status": "pending"})
        settlements = await cursor.to_list(length=100)
        for s in settlements:
            s["id"] = str(s["_id"])
            del s["_id"]
        return settlements

    async def approve_settlement(self, settlement_id: str):
        settlements_col = self.db.get_collection("Settlements")
        settlement = await settlements_col.find_one({"_id": ObjectId(settlement_id)})
        if not settlement:
            return False

        # Marcar liquidación como aprobada
        result = await settlements_col.update_one(
            {"_id": ObjectId(settlement_id)},
            {"$set": {"status": "approved", "updated_at": datetime.utcnow()}}
        )

        if result.modified_count > 0:
            # Registrar como una transacción real
            transactions_col = self.db.get_collection("Transactions")
            await transactions_col.insert_one({
                "type": "settlement",
                "group_id": settlement["group_id"],
                "payer_id": settlement["payer_id"],
                "receiver_id": settlement["receiver_id"],
                "amount": settlement["amount"],
                "date": datetime.utcnow(),
                "status": "completed"
            })
            
            # --- Trust Score Logic ---
            created_at = settlement.get("created_at")
            if created_at:
                if isinstance(created_at, str):
                    try:
                        created_at = datetime.fromisoformat(created_at.replace("Z", ""))
                    except:
                        created_at = datetime.utcnow()
                
                diff = datetime.utcnow() - created_at
                if diff.total_seconds() < 86400: # 24 horas
                    users_col = self.db_auth.get_collection("Users")
                    await users_col.update_one(
                        {"_id": ObjectId(settlement["payer_id"])},
                        {
                            "$inc": {"trust_score": 1, "fast_payments_count": 1},
                            "$set": {"last_fast_payment": datetime.utcnow()}
                        }
                    )
            
            # Verificar si todos los pagos del grupo han sido aprobados
            group_id = settlement["group_id"]
            pending = await settlements_col.count_documents({
                "group_id": group_id, 
                "status": "pending"
            })
            
            if pending == 0:
                await self.collection.update_one(
                    {"_id": ObjectId(group_id)},
                    {"$set": {
                        "status": "closed", 
                        "estado": "closed",
                        "fecha_finiquito": datetime.utcnow()
                    }}
                )
            
            return True
            
        return False

    async def reject_settlement(self, settlement_id: str, reason: str = ""):
        settlements_col = self.db.get_collection("Settlements")
        result = await settlements_col.update_one(
            {"_id": ObjectId(settlement_id)},
            {"$set": {
                "status": "rejected", 
                "rejection_reason": reason,
                "updated_at": datetime.utcnow()
            }}
        )
        return result.modified_count > 0