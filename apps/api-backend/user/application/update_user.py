class UpdateUserUseCase:
    def __init__(self, user_repository):
        self.repository = user_repository

    async def execute(self, user_id: str, new_data: dict):
        # Aquí podrías validar si el email nuevo ya existe, etc.
        return await self.repository.update_user(user_id, new_data)