import bcrypt
from user.domain.models.user import User

class RegisterUser:
    def __init__(self, repository):
        self.repository = repository
    
    async def execute(self, user_data):
        #Verificar si el usuario ya existe  
        user_exists = await self.repository.find_by_identifier(user_data.email)
        if user_exists:
            return{"status": "error", "message": "El usuario ya existe"}

        #Logica que Encripta la contraseña  
        salt = bcrypt.gensalt()
        hash_pw = bcrypt.hashpw(user_data.password.encode('utf-8'), salt)
        
        #Crear el usuario(entidad de dominio)
        nuevo_usuario = User(
            nombre = user_data.nombre,
            email = user_data.email,
            password_hash = hash_pw.decode('utf-8')
        )
        user_id = await self.repository.save_user(nuevo_usuario.model_dump())
        
        return {
            "status": "success", 
            "message": "Usuario registrado exitosamente",
            "user_id": user_id 
        }