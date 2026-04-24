from user.domain.models.user import PasswordChange
from user.infrastructure.repository.user_repository import MongoUserRepository
from user.infrastructure.security.security import verify_password, get_password_hash

class ChangePasswordUseCase:
    def __init__(self, repository: MongoUserRepository):
        self.repository = repository

    async def execute(self, user_id: str, data: PasswordChange):
        user = await self.repository.get_user_by_id(user_id)
        if not user:
            return {"status": "error", "message": "Usuario no encontrado"}


        #2. Hashear la nueva contraseña
        new_hash = get_password_hash(data.new_password)

        # 3. Actualizar en el repositorio
        success = await self.repository.update_user(user_id, {"password_hash": new_hash}) # Simulado
        
        if success:
            return {"status": "success", "message": "Contraseña actualizada correctamente"}
        return {"status": "error", "message": "No se pudo actualizar la contraseña"}