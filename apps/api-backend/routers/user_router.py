from fastapi import APIRouter, HTTPException, Depends, Request
from typing import Dict, Any, Optional

from controllers.user_controller import UserController
from schemas.user_schema import UserCreate, UserLogin, UserUpdate, PasswordChange, PasswordResetRequest
from core.permissions import get_current_user_id

user_router = APIRouter(prefix="/api/auth", tags=["Auth"])
controller = UserController()

def get_client_info(request: Request):
    ip = request.client.host if request.client else "127.0.0.1"
    ua = request.headers.get("user-agent", "Unknown")
    return ip, ua

@user_router.get("/ping")
async def ping():
    return {"status": "ok", "message": "Pong from Auth Service (OOP-MVC)"}

@user_router.post("/register")
async def register(user_data: UserCreate, request: Request):
    ip, ua = get_client_info(request)
    result = await controller.register(user_data, ip_address=ip, user_agent=ua)
    if controller.is_error(result):
        status_code = 409 if result.get("error_code") == "USER_EXISTS" else 400
        raise HTTPException(status_code=status_code, detail=result.get("message"))
    return result

@user_router.post("/login")
async def login(login_data: UserLogin, request: Request):
    ip, ua = get_client_info(request)
    result = await controller.login(
        identifier=login_data.identifier,
        password=login_data.password,
        ip_address=ip,
        user_agent=ua
    )
    if result.get("status") == "not_verified":
        return result
    if result.get("status") == "2fa_required":
        return result
    if controller.is_error(result):
        raise HTTPException(status_code=401, detail=result.get("message"))
    return result

@user_router.get("/profile/{user_id}")
async def get_user_profile(user_id: str, current_user_id: str = Depends(get_current_user_id)):
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="No tienes permiso para ver este perfil")
    profile = await controller.get_profile(user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return profile

@user_router.get("/search")
async def search_users(query: str, limit: int = 5):
    if len(query) < 2:
        return []
    return await controller._user_model.search_users(query, limit)

@user_router.put("/update")
async def update_user(data: UserUpdate, user_id: str = Depends(get_current_user_id)):
    update_dict = data.dict(exclude_unset=True)
    result = await controller.update_profile(user_id, update_dict)
    if controller.is_error(result):
        raise HTTPException(status_code=400, detail=result.get("message"))
    return result

@user_router.put("/update/{user_id}")
async def update_user_compat(user_id: str, data: UserUpdate, auth_user_id: str = Depends(get_current_user_id)):
    update_dict = data.dict(exclude_unset=True)
    result = await controller.update_profile(auth_user_id, update_dict)
    if controller.is_error(result):
        raise HTTPException(status_code=400, detail=result.get("message"))
    return result

@user_router.post("/2fa/setup/{user_id}")
async def setup_2fa(user_id: str, current_user_id: str = Depends(get_current_user_id)):
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="No autorizado")
    profile = await controller.get_profile(user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    result = await controller.setup_2fa(user_id, profile["email"])
    return result

@user_router.post("/2fa/verify/{user_id}")
async def verify_2fa(user_id: str, data: dict, request: Request):
    code = data.get("code")
    if not code:
        raise HTTPException(status_code=400, detail="Código requerido")
    ip, ua = get_client_info(request)
    result = await controller.verify_2fa(user_id, str(code), ip_address=ip, user_agent=ua)
    if controller.is_error(result):
        raise HTTPException(status_code=400, detail=result.get("message"))
    if "token" in result and "access_token" not in result:
        result["access_token"] = result["token"]
    return result

@user_router.post("/request-password-reset")
async def request_password_reset(data: PasswordResetRequest, request: Request):
    ip, _ = get_client_info(request)
    result = await controller.request_password_reset(data.email, ip_address=ip)
    return result

@user_router.post("/change-password/{user_id}")
async def change_password(user_id: str, data: PasswordChange, request: Request, current_user_id: str = Depends(get_current_user_id)):
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="No autorizado")
    ip, _ = get_client_info(request)
    result = await controller.change_password(user_id, data, ip_address=ip)
    if controller.is_error(result):
        raise HTTPException(status_code=400, detail=result.get("message"))
    return result

# --- Rutas de Tarjetas ---
@user_router.get("/cards/{user_id}")
async def get_user_cards(user_id: str, current_user_id: str = Depends(get_current_user_id)):
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="No autorizado")
    return await controller._user_model.get_cards(user_id)

@user_router.post("/cards/{user_id}")
async def add_user_card(user_id: str, card: dict, current_user_id: str = Depends(get_current_user_id)):
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="No autorizado")
    success = await controller._user_model.add_card(user_id, card)
    if success:
        return {"message": "Tarjeta agregada", "status": "success"}
    raise HTTPException(status_code=400, detail="No se pudo agregar la tarjeta")

@user_router.delete("/cards/{user_id}/{card_id}")
async def remove_user_card(user_id: str, card_id: str, current_user_id: str = Depends(get_current_user_id)):
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="No autorizado")
    success = await controller._user_model.remove_card(user_id, card_id)
    if success:
        return {"message": "Tarjeta eliminada", "status": "success"}
    raise HTTPException(status_code=400, detail="No se pudo eliminar la tarjeta")

@user_router.patch("/cards/{user_id}/{card_id}/default")
async def set_default_card(user_id: str, card_id: str, current_user_id: str = Depends(get_current_user_id)):
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="No autorizado")
    success = await controller._user_model.set_default_card(user_id, card_id)
    if success:
        return {"message": "Tarjeta predeterminada actualizada", "status": "success"}
    raise HTTPException(status_code=400, detail="No se pudo actualizar la tarjeta")
