# group/application/get_balances.py

class GetGroupBalancesUseCase:
    def __init__(self, item_repository, group_repository):
        self.item_repository = item_repository
        self.group_repository = group_repository

    async def execute(self, group_id: str):
        group = await self.group_repository.find_by_id(group_id)
        if not group:
            return {"status": "error", "message": "Grupo no encontrado"}

        integrantes = group.get("integrantes", [])
        items = await self.item_repository.find_by_group(group_id)
        
        # Diccionarios para rastrear balances y consumos
        balances_netos = {u_id: 0.0 for u_id in integrantes}
        consumos_individuales = {u_id: 0.0 for u_id in integrantes} # 🚩 NUEVO
        total_grupo = 0.0

        for item in items:
            # Soportamos 'monto' o 'precio' por si acaso
            costo_total = (item.get("precio") or item.get("monto") or 0) * item.get("cantidad", 1)
            total_grupo += costo_total
            
            comprador = item.get("comprador_id")
            participantes = item.get("participantes_ids", [])

            # A) Al comprador se le abona el total que puso de su bolsa
            if comprador in balances_netos:
                balances_netos[comprador] += costo_total

            # B) A cada participante se le resta su parte y se suma a su consumo
            if participantes:
                cuota_item = costo_total / len(participantes)
                for p_id in participantes:
                    if p_id in balances_netos:
                        balances_netos[p_id] -= cuota_item
                        consumos_individuales[p_id] += cuota_item # 🚩 Registro de gasto real

        # 3. Formatear la respuesta
        detalle = []
        for u_id in integrantes:
            balance = balances_netos[u_id]
            detalle.append({
                "usuario_id": u_id,
                "balance": round(balance, 2),
                "cuota_correspondiente": round(consumos_individuales[u_id], 2), # 🚩 Esto es "Tu Gasto"
                "estado": "favor" if balance >= 0 else "deuda"
            })

        return {
            "status": "success",
            "total_gastado_en_grupo": round(total_grupo, 2),
            "balance_detallado": detalle # 🚩 Usamos este nombre para consistencia con el Front
        }