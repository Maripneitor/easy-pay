from fastapi import APIRouter, HTTPException
from user.domain.models.user import UserCreate, UserLogin, PasswordChange, PasswordResetRequest
from user.application.register_user import RegisterUser
from user.application.login_user import LoginUserUseCase
from user.application.update_user import UpdateUserUseCase
from user.infrastructure.repository.user_repository import MongoUserRepository
from user.application.setup_2fa import Setup2FAUseCase
from user.application.verify_2fa import Verify2FAUseCase
from user.application.change_password import ChangePasswordUseCase
from user.infrastructure.services.email_service import EmailService

# Ruta especifica para AUTH
user_router = APIRouter(prefix="/api/auth", tags=["Auth"])

# --- Inyección de dependencias ---
repo = MongoUserRepository()
email_service = EmailService()

resgister_use_case = RegisterUser(repo)
login_use_case = LoginUserUseCase(repo)
update_user_use_case = UpdateUserUseCase(repo)
setup_2fa_use_case = Setup2FAUseCase(repo, email_service)
verify_2fa_use_case = Verify2FAUseCase(repo)
change_password_use_case = ChangePasswordUseCase(repo)

@user_router.post("/register")
async def register(user_data: UserCreate):
    result = await resgister_use_case.execute(user_data)
    
    if result["status"] == "error" and result["message"] == "El usuario ya existe":
        existing_user = await repo.find_by_identifier(user_data.email)
        if existing_user:
            return {
                "status": "success",
                "message": "Usuario existente (Bypass Desarrollo)",
                "user_id": str(existing_user["_id"]),
                "is_existing": True
            }

    if result["status"] == "error":
        raise HTTPException(status_code=400, detail=result.get("message", "Error en registro"))
    return result

@user_router.post("/login")
async def login(login_data: UserLogin):
    result = await login_use_case.execute(
        identifier=login_data.identifier,
        password=login_data.password
    )
    if result["status"] == "error":
        raise HTTPException(status_code=401, detail=result["message"])
    return result

@user_router.put("/update/{user_id}")
async def update_user(user_id: str, data: dict):
    success = await update_user_use_case.execute(user_id, data)
    if success:
        return {"message": "Perfil actualizado"}
    raise HTTPException(status_code=400, detail="No se pudo actualizar")

# --- SETUP 2FA ---
@user_router.post("/2fa/setup/{user_id}")
async def setup_2fa(user_id: str):
    if user_id == "demo-user-id" or user_id == "null":
        return {
            "status": "success",
            "message": "MODO DEMO: Código enviado (simulado)"
        }

    user = await repo.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    result = await setup_2fa_use_case.execute(user_id, user['email'])
    if result["status"] == "error":
        raise HTTPException(status_code=400, detail=result["message"])
    return result

@user_router.post("/2fa/verify/{user_id}")
async def verify_2fa(user_id: str, data: dict):
    if user_id == "demo-user-id" or user_id == "null":
        return {
            "status": "success",
            "message": "MODO DEMO: Verificación exitosa",
            "access_token": "demo-jwt-token",
            "user": { "id": "demo-user-id", "nombre": "Usuario Demo", "email": "demo@easypay.com" }
        }

    code = data.get("code")
    if not code:
        raise HTTPException(status_code=400, detail="Código requerido")
        
    result = await verify_2fa_use_case.execute(user_id, code)
    if result["status"] == "error":
        raise HTTPException(status_code=400, detail=result["message"])
    
    if "token" in result and "access_token" not in result:
        result["access_token"] = result["token"]
        
    return result

@user_router.post("/request-password-reset")
async def request_password_reset(data: PasswordResetRequest):
    user = await repo.find_by_identifier(data.email)
    if not user:
        # Prevent email enumeration by returning a success-like message even if not found
        return {"status": "success", "message": "Si el correo está registrado, recibirás un código."}
    
    user_id = str(user["_id"])
    result = await setup_2fa_use_case.execute(user_id, data.email, is_recovery=True)
    
    if result["status"] == "error":
        raise HTTPException(status_code=400, detail=result["message"])
        
    # Agregamos el user_id para que el frontend pueda continuar con el flujo
    result["user_id"] = user_id
    return result

@user_router.post("/change-password/{user_id}")
async def change_password_route(user_id: str, data: PasswordChange): # Usamos el modelo aquí
    # Validación extra de coincidencia
    if data.new_password != data.confirm_password:
        raise HTTPException(status_code=400, detail="Las nuevas contraseñas no coinciden")

    result = await change_password_use_case.execute(user_id, data)
    
    if result["status"] == "error":
        raise HTTPException(status_code=400, detail=result["message"])
        
    return result