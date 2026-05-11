from fastapi import HTTPException

class LiquidateGroupUseCase:
    def __init__(self, group_repository, balance_service):
        self.group_repository = group_repository
        self.balance_service = balance_service # Servicio que calcula deudas

    async def execute(self, group_id: str, user_id: str):
        # 1. Buscar el grupo
        group = await self.group_repository.find_by_id(group_id)
        if not group:
            raise HTTPException(status_code=404, detail="Grupo no encontrado")

        # 2. Validar que el usuario sea el ADMIN
        if group.get("admin_id") != user_id and group.get("administrador_id") != user_id:
            raise HTTPException(status_code=403, detail="Solo el administrador puede liquidar el grupo")

        # 3. Validar que la cuenta esté saldada (Total deudas == 0)
        balances_res = await self.balance_service.execute(group_id)
        balance_detallado = balances_res.get("balance_detallado", [])
        
        # Alguien tiene deuda pendiente si su balance es menor a -0.01
        total_debt = sum(abs(member['balance']) for member in balance_detallado if member.get('balance', 0) < -0.01)

        if total_debt > 0.01:
            raise HTTPException(
                status_code=400, 
                detail=f"No se puede liquidar. Aún hay deudas pendientes por un total de ${round(total_debt, 2)}"
            )

        # 4. Cambiar estado y guardar
        updated_status = {"status": "liquidated", "estado": "liquidated"}
        success = await self.group_repository.update_group(group_id, updated_status)
        
        return {"message": "Grupo liquidado exitosamente", "status": "liquidated"}