class DeleteGroupUseCase:
    def __init__(self, repository):
        self.repository = repository

    async def execute(self, group_id: str):
        # Aquí podrías agregar validaciones (ej. si el grupo tiene deudas pendientes)
        success = await self.repository.delete_group(group_id)
        
        if success:
            return {"status": "success", "message": "Grupo eliminado correctamente"}
        return {"status": "error", "message": "No se pudo eliminar el grupo o no existe"}