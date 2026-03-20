from fastapi import APIRouter, HTTPException
from user.domain.models.user import UserCreate, UserLogin
from user.application.register_user import RegisterUser
from user.application.login_user import LoginUserUseCase
from user.application.update_user import UpdateUserUseCase
from user.infrastructure.repository.user_repository import MongoUserRepository
from user.application.setup_2fa import Setup2FAUseCase
from user.application.verify_2fa import Verify2FAUseCase
#Ruta especifica para AUTH
user_router = APIRouter(prefix="/api/auth", tags=["Auth"])

#Inyeccion de dependencias
repo = MongoUserRepository()
resgister_use_case = RegisterUser(repo)
login_use_case = LoginUserUseCase(repo)
update_user_use_case = UpdateUserUseCase(repo)
setup_2fa_use_case = Setup2FAUseCase(repo)
verify_2fa_use_case = Verify2FAUseCase(repo)

@user_router.post("/register")
async def register(user_data: UserCreate):
    result = await resgister_use_case.execute(user_data)

    if result["status"] == "error":
        raise HTTPException(status_code=400, detail=result["messege"])
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
    # Llamamos al caso de uso...
    success = await update_user_use_case.execute(user_id, data)
    if success:
        return {"message": "Perfil actualizado"}
    raise HTTPException(status_code=400, detail="No se pudo actualizar")

@user_router.post("/2fa/setup/{user_id}")
async def setup_2fa(user_id: str):
    user = await repo.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Generamos el secreto y la URI para el QR
    result = await setup_2fa_use_case.execute(user_id, user['email'])
    return result

# 2. Endpoint para confirmar que el usuario escaneó el QR correctamente
@user_router.post("/2fa/verify/{user_id}")
async def verify_2fa(user_id: str, data: dict):
    # 'data' debe contener el 'code' que el usuario ingresa (6 dígitos)
    code = data.get("code")
    if not code:
        raise HTTPException(status_code=400, detail="Código requerido")
        
    result = await verify_2fa_use_case.execute(user_id, code)
    return result
    