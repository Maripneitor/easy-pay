class JoinGroupUseCase:
    def __init__(self, group_repo):
        self.group_repo = group_repo

    async def execute(self, codigo: str, user_id: str):
        # 1. Buscar grupo por código
        group = await self.group_repo.find_by_code(codigo)
        if not group:
            return {"status": "error", "message": "Código de grupo no válido"}

        # 2. Verificar si ya es miembro o admin
        if user_id == group.get("admin_id") or user_id in group.get("integrantes", []):
            return {"status": "success", "message": "Ya eres parte de este grupo"}

        # 3. Agregar al nuevo integrante
        success = await self.group_repo.add_member(group["id"], user_id)
        if success:
            return {"status": "success", "message": "Te has unido correctamente"}
        
        return {"status": "error", "message": "No se pudo completar la unión"}