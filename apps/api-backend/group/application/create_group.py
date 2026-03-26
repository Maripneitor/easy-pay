from group.domain.models.group import Group

class CreateGroupUseCase:
    def __init__(self, repository):
        self.repository = repository

    async def execute(self, group_create_data):
        nuevo_grupo = Group(
            nombre=group_create_data.nombre,
            descripcion=group_create_data.descripcion,
            admin_id=group_create_data.admin_id,
            integrantes=[group_create_data.admin_id] # Admin entra por defecto
        )

        group_id = await self.repository.save_group(nuevo_grupo.model_dump())
        
        return {
            "status": "success",
            "message": "Grupo creado en la nube",
            "group_id": group_id,
            "invite_code": nuevo_grupo.codigo_invitacion
        }