# group/application/get_balances.py

class GetGroupBalancesUseCase:
    def __init__(self, item_repository, group_repository):
        self.item_repository = item_repository
        self.group_repository = group_repository

    async def execute(self, group_id: str):
        # 1. Obtener el grupo para validar integrantes
        group = await self.group_repository.find_by_id(group_id)
        if not group:
            return {"status": "error", "message": "Grupo no encontrado"}

        integrantes = group.get("integrantes", [])
        
        # 2. Traer todos los gastos del grupo
        items = await self.item_repository.find_by_group(group_id)
        
        # Diccionario para rastrear el balance neto de cada usuario
        # Positivo: Le deben | Negativo: Debe
        balances_netos = {u_id: 0.0 for u_id in integrantes}
        total_grupo = 0.0

        for item in items:
            costo_total = item.get("precio", 0) * item.get("cantidad", 1)
            total_grupo += costo_total
            
            comprador = item.get("comprador_id")
            participantes = item.get("participantes_ids", [])

            # A) Al que compró se le abona el total (porque él ya puso el dinero)
            if comprador in balances_netos:
                balances_netos[comprador] += costo_total

            # B) A cada participante se le resta su parte proporcional
            if participantes:
                cuota_item = costo_total / len(participantes)
                for p_id in participantes:
                    if p_id in balances_netos:
                        balances_netos[p_id] -= cuota_item

        # 3. Formatear la respuesta para el Frontend
        detalle = []
        for u_id, balance in balances_netos.items():
            detalle.append({
                "usuario_id": u_id,
                "balance": round(balance, 2),
                "estado": "favor" if balance >= 0 else "deuda"
            })

        return {
            "status": "success",
            "total_gastado_en_grupo": round(total_grupo, 2),
            "balances": detalle
        }