from fastapi import APIRouter, HTTPException
from user.domain.models.user import UserCreate, UserLogin
from user.application.register_user import RegisterUser
from user.application.login_user import LoginUserUseCase
from user.application.update_user import UpdateUserUseCase
from user.infrastructure.repository.user_repository import MongoUserRepository

#Ruta especifica para AUTH
user_router = APIRouter(prefix="/api/auth", tags=["Auth"])

#Inyeccion de dependencias
repo = MongoUserRepository()
resgister_use_case = RegisterUser(repo)
login_use_case = LoginUserUseCase(repo)
update_user_use_case = UpdateUserUseCase(repo)

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
    