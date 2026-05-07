# group/application/get_balances.py

class GetGroupBalancesUseCase:
    def __init__(self, item_repository, group_repository):
        self.item_repository = item_repository
        self.group_repository = group_repository

    async def execute(self, group_id: str):
        group = await self.group_repository.find_by_id(group_id)
        if not group:
            return {"status": "error", "message": "Grupo no encontrado"}

        integrantes = [str(uid) for uid in group.get("integrantes", [])]
        items = await self.item_repository.find_by_group(group_id)
        
        # Diccionarios para rastrear balances y consumos
        balances_netos = {u_id: 0.0 for u_id in integrantes}
        consumos_individuales = {u_id: 0.0 for u_id in integrantes} # 🚩 NUEVO
        total_grupo = 0.0

        for item in items:
            # Soportamos 'monto' o 'precio' por si acaso
            precio_base = (item.get("precio") or item.get("monto") or 0)
            cantidad = item.get("cantidad", 1)
            
            # Aplicar impuestos y propina por ítem si existen
            impuesto_val = item.get("impuesto_porcentaje", 0) / 100
            propina_val = item.get("propina_porcentaje", 0) / 100
            
            precio_con_extra = precio_base * (1 + impuesto_val + propina_val)
            costo_total = precio_con_extra * cantidad
            
            total_grupo += costo_total # Ahora incluye impuestos y propinas para coincidir con los balances
            
            comprador = str(item.get("comprador_id"))
            participantes = [str(pid) for pid in item.get("participantes_ids", [])]

            # A) Al comprador se le abona el total que puso de su bolsa
            if comprador in balances_netos:
                balances_netos[comprador] += costo_total

            # B) A cada participante se le resta su parte y se suma a su consumo
            if participantes:
                cuota_item = costo_total / len(participantes)
                for p_id in participantes:
                    if p_id in balances_netos:
                        balances_netos[p_id] -= cuota_item
                        consumos_individuales[p_id] += cuota_item

        # --- AGREGADO: Liquidaciones (Settlements) ---
        # Si un usuario ya pagó y fue aprobado, su balance de deuda disminuye (se acerca a 0)
        # y el balance del receptor (líder) también disminuye (ya cobró).
        settlements_col = self.group_repository.db.get_collection("Settlements")
        approved_settlements_cursor = settlements_col.find({"group_id": group_id, "status": "approved"})
        async for s in approved_settlements_cursor:
            p_id = str(s["payer_id"])
            r_id = str(s["receiver_id"])
            amount = s["amount"]
            
            if p_id in balances_netos:
                balances_netos[p_id] += amount # El pagador ya no debe esto
            if r_id in balances_netos:
                balances_netos[r_id] -= amount # El receptor ya recibió esto

        
        propina_percent = 0.10 if total_grupo < 3000 else 0.05
        total_propina = total_grupo * propina_percent
        total_con_propina = total_grupo + total_propina

        # Distribuir la propina equitativamente entre los integrantes activos
        if integrantes:
            cuota_propina = total_propina / len(integrantes)
            for u_id in integrantes:
                balances_netos[u_id] -= cuota_propina
                consumos_individuales[u_id] += cuota_propina
            
            
            admin_id = str(group.get("admin_id") or group.get("administrador_id"))
            if admin_id in balances_netos:
                balances_netos[admin_id] += total_propina

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
            "propina_total": round(total_propina, 2),
            "total_con_propina": round(total_con_propina, 2),
            "balance_detallado": detalle # 🚩 Usamos este nombre para consistencia con el Front
        }