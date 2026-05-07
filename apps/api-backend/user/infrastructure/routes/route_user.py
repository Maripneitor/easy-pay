from fastapi import APIRouter, HTTPException, Header, Depends
from user.domain.models.user import UserCreate, UserLogin, PasswordChange, PasswordResetRequest, UserUpdate
from user.application.register_user import RegisterUser
from user.application.login_user import LoginUserUseCase
from user.application.update_user import UpdateUserUseCase
from user.infrastructure.repository.user_repository import MongoUserRepository
from user.application.setup_2fa import Setup2FAUseCase
from user.application.verify_2fa import Verify2FAUseCase
from user.application.change_password import ChangePasswordUseCase
from user.infrastructure.services.email_service import EmailService
from user.infrastructure.security.auth_handler import decode_token

# Ruta especifica para AUTH
user_router = APIRouter(prefix="/api/auth", tags=["Auth"])

# --- Inyección de dependencias ---
repo = MongoUserRepository()

@user_router.get("/ping")
async def ping():
    return {"status": "ok", "message": "Pong from Auth Service"}

@user_router.get("/profile/{user_id}")
async def get_user_profile(user_id: str):
    user = await repo.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    return {
        "id": str(user["_id"]),
        "nombre": user.get("nombre"),
        "email": user.get("email"),
        "phone": user.get("phone"),
        "birth_date": user.get("birth_date"),
        "address": user.get("address"),
        "bank_accounts": user.get("bank_accounts", []),
        "is_verified": user.get("is_verified", False),
        "2fa_enabled": user.get("two_factor", {}).get("enabled", False) or user.get("is_verified", False),
        "financial_profile": user.get("financial_profile") or {}
    }

@user_router.get("/search")
async def search_users(query: str, limit: int = 5):
    """Busca usuarios registrados por nombre o email"""
    if len(query) < 2:
        return []
    users = await repo.search_users(query, limit)
    return users
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
    
    # Si el email ya está registrado, retornar 409 Conflict
    if result["status"] == "error" and result["message"] == "El usuario ya existe":
        raise HTTPException(
            status_code=409, 
            detail="Este correo electrónico ya está registrado. Intenta iniciar sesión."
        )

    if result["status"] == "error":
        raise HTTPException(status_code=400, detail=result.get("message", "Error en registro"))
    
    # --- AUTO-ENVIAR CÓDIGO DE VERIFICACIÓN ---
    user_id = result.get("user_id")
    if user_id:
        try:
            await setup_2fa_use_case.execute(user_id, user_data.email)
        except Exception as e:
            # Si el correo falla, no abortamos el registro; el usuario podrá reenviar
            print(f"⚠️ Registro exitoso pero falló envío de verificación: {e}")
        
    return result

@user_router.post("/login")
async def login(login_data: UserLogin):
    try:
        result = await login_use_case.execute(
            identifier=login_data.identifier,
            password=login_data.password
        )
        
        # --- AUTO-ENVIAR CÓDIGO SI NO ESTÁ VERIFICADO ---
        if result.get("status") == "not_verified":
            try:
                await setup_2fa_use_case.execute(result["user_id"], result["email"])
            except Exception as e:
                print(f"⚠️ Login OK pero falló envío de verificación: {e}")

        if result["status"] == "error":
            raise HTTPException(status_code=401, detail=result["message"])
        return result
    except HTTPException as he:
        raise he
    except Exception as e:
        import traceback
        print(f"💥 Error crítico en login: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(
            status_code=500, 
            detail=f"Error interno en el servidor de autenticación: {str(e)}"
        )


from utils.security import get_current_user_id

@user_router.put("/update")
async def update_user(data: UserUpdate, user_id: str = Depends(get_current_user_id)):
    update_dict = data.dict(exclude_unset=True)

    # Nunca guardar el campo verification_code en el perfil
    update_dict.pop("verification_code", None)

    # Enforce max 3 bank accounts
    if "bank_accounts" in update_dict and len(update_dict["bank_accounts"]) > 3:
        raise HTTPException(status_code=400, detail="Solo se permiten hasta 3 cuentas bancarias.")

    # Serializar bank_accounts a dict si vienen como objetos Pydantic
    if "bank_accounts" in update_dict and update_dict["bank_accounts"]:
        update_dict["bank_accounts"] = [
            acc if isinstance(acc, dict) else acc.dict()
            for acc in update_dict["bank_accounts"]
        ]

    result = await update_user_use_case.execute(user_id, update_dict)
    if result["status"] == "success":
        return result
    raise HTTPException(status_code=400, detail=result["message"])

@user_router.put("/update/{user_id}")
async def update_user_compat(user_id: str, data: UserUpdate, auth_user_id: str = Depends(get_current_user_id)):
    """Endpoint de compatibilidad — usa el user_id del JWT por seguridad."""
    update_dict = data.dict(exclude_unset=True)

    # Nunca guardar el campo verification_code en el perfil
    update_dict.pop("verification_code", None)

    if "bank_accounts" in update_dict and len(update_dict.get("bank_accounts", [])) > 3:
        raise HTTPException(status_code=400, detail="Solo se permiten hasta 3 cuentas bancarias.")

    if "bank_accounts" in update_dict and update_dict["bank_accounts"]:
        update_dict["bank_accounts"] = [
            acc if isinstance(acc, dict) else acc.dict()
            for acc in update_dict["bank_accounts"]
        ]

    result = await update_user_use_case.execute(auth_user_id, update_dict)
    if result["status"] == "success":
        return result
    raise HTTPException(status_code=400, detail=result["message"])

# --- SETUP 2FA ---
@user_router.post("/2fa/setup/{user_id}")
async def setup_2fa(user_id: str):
    user = await repo.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    result = await setup_2fa_use_case.execute(user_id, user['email'])
    if result["status"] == "error":
        raise HTTPException(status_code=400, detail=result["message"])
    return result

@user_router.post("/2fa/verify/{user_id}")
async def verify_2fa(user_id: str, data: dict):
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
        
# --- GESTIÓN DE TARJETAS ---
@user_router.get("/cards/{user_id}")
async def get_user_cards(user_id: str):
    cards = await repo.get_cards(user_id)
    return cards

@user_router.post("/cards/{user_id}")
async def add_user_card(user_id: str, card: dict):
    success = await repo.add_card(user_id, card)
    if success:
        return {"message": "Tarjeta agregada"}
    raise HTTPException(status_code=400, detail="No se pudo agregar la tarjeta")

@user_router.delete("/cards/{user_id}/{card_id}")
async def remove_user_card(user_id: str, card_id: str):
    success = await repo.remove_card(user_id, card_id)
    if success:
        return {"message": "Tarjeta eliminada"}
    raise HTTPException(status_code=400, detail="No se pudo eliminar la tarjeta")

@user_router.patch("/cards/{user_id}/{card_id}/default")
async def set_default_card(user_id: str, card_id: str):
    success = await repo.set_default_card(user_id, card_id)
    if success:
        return {"message": "Tarjeta predeterminada actualizada"}
    raise HTTPException(status_code=400, detail="No se pudo actualizar la tarjeta predeterminada")