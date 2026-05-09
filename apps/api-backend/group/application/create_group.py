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

        # Si vienen items (ej. de OCR), los guardamos
        if group_create_data.items:
            from group.infrastructure.repository.item_repository import MongoItemRepository
            item_repo = MongoItemRepository()
            for item in group_create_data.items:
                item["group_id"] = group_id
                item["comprador_id"] = group_create_data.admin_id
                item["participantes_ids"] = [group_create_data.admin_id] # Por defecto asignado al admin
                await item_repo.save_item(item)
        
        return {
            "status": "success",
            "message": "Grupo creado con éxito",
            "group_id": group_id,
            "invite_code": nuevo_grupo.codigo_invitacion
        }