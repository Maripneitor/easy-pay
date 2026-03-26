class AddItemUseCase:
    def __init__(self, item_repo, group_repo):
        self.item_repo = item_repo
        self.group_repo = group_repo

    async def execute(self, item_data):
        # 1. ¿Existe el grupo? (Consultamos EasyPay_Groups)
        group = await self.group_repo.find_by_id(item_data.group_id)
        if not group:
            return {"status": "error", "message": "El grupo no existe"}

        # 2. Guardamos el gasto (En EasyPay_Expenses)
        item_id = await self.item_repo.save_item(item_data.model_dump())
        
        return {
            "status": "success",
            "message": f"Gasto '{item_data.nombre}' registrado correctamente",
            "item_id": item_id
        }