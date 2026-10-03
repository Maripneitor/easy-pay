import random
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any, List

from core.base_controller import BaseController
from models.user_model import UserModel
from models.role_model import RoleModel
from schemas.user_schema import User, UserCreate, PasswordChange
from services.auth_service import AuthService
from services.email_service import EmailService
from services.audit_service import AuditService

class UserController(BaseController):
    """
    Controlador OOP para la gestión de usuarios y autenticación.
    Hereda de BaseController y orquesta los modelos y servicios,
    garantizando el registro de auditoría en cada acción crítica.
    """
    def __init__(self):
        super().__init__()
        self._user_model = UserModel()
        self._role_model = RoleModel()
        self._auth_service = AuthService()
        self._email_service = EmailService()
        self._audit_service = AuditService()

    async def register(self, data: UserCreate, ip_address: str = "127.0.0.1", user_agent: str = "Unknown") -> Dict[str, Any]:
        """Registra un nuevo usuario con rol predeterminado 'Usuario Regular'"""
        existing = await self._user_model.find_by_identifier(data.email)
        if existing:
            if not existing.get("is_verified", False):
                # Permitir re-registro si no fue verificado
                await self._user_model.delete_user_by_email(existing["email"])
            else:
                return self.error("Este correo electrónico ya está registrado. Intenta iniciar sesión.", code="USER_EXISTS")

        password_hash = self._auth_service.hash_password(data.password)

        new_user = User(
            nombre=data.nombre,
            email=data.email,
            password_hash=password_hash,
            roles=["Usuario Regular"]
        )

        user_id = await self._user_model.save_user(new_user.model_dump())

        # Registrar en auditoría
        await self._audit_service.log_access(
            action="USER_REGISTER",
            user_id=user_id,
            user_email=data.email,
            resource="users",
            details={"nombre": data.nombre, "initial_role": "Usuario Regular"},
            ip_address=ip_address,
            user_agent=user_agent
        )

        # Enviar código de verificación de forma automática
        try:
            await self.setup_2fa(user_id=user_id, email=data.email)
        except Exception as e:
            self.logger.warning(f"⚠️ Error al auto-enviar código OTP de registro: {e}")

        return self.success(
            "Usuario registrado exitosamente",
            user_id=user_id,
            email=data.email
        )

    async def login(self, identifier: str, password: str, ip_address: str = "127.0.0.1", user_agent: str = "Unknown") -> Dict[str, Any]:
        """Inicia sesión, verifica credenciales y registra el acceso al sistema en auditoría"""
        user = await self._user_model.find_by_identifier(identifier)
        if not user:
            await self._audit_service.log_access(
                action="LOGIN_FAILED",
                user_email=identifier,
                resource="auth",
                details={"reason": "Usuario no encontrado"},
                ip_address=ip_address,
                user_agent=user_agent
            )
            return self.error("Credenciales incorrectas", code="INVALID_CREDENTIALS")

        password_hash = user.get("password_hash")
        if not password_hash or not self._auth_service.verify_password(password, password_hash):
            await self._audit_service.log_access(
                action="LOGIN_FAILED",
                user_id=str(user["_id"]),
                user_email=user.get("email"),
                resource="auth",
                details={"reason": "Contraseña incorrecta"},
                ip_address=ip_address,
                user_agent=user_agent
            )
            return self.error("Credenciales incorrectas", code="INVALID_CREDENTIALS")

        user_id_str = str(user["_id"])
        user_email = user.get("email")

        # Verificar si la cuenta fue validada por correo
        if not user.get("is_verified", False):
            try:
                await self.setup_2fa(user_id_str, user_email)
            except Exception:
                pass
            return {
                "status": "not_verified",
                "message": "Debes verificar tu correo antes de iniciar sesión.",
                "user_id": user_id_str,
                "email": user_email
            }

        # Verificar si requiere 2FA
        two_factor = user.get("two_factor", {})
        if two_factor.get("enabled", False):
            return {
                "status": "2fa_required",
                "message": "Autenticación de dos pasos requerida",
                "user_id": user_id_str
            }

        # Cargar roles y permisos dinámicos asignados
        roles = user.get("roles", ["Usuario Regular"])
        permissions = list(await self._role_model.get_permissions_for_roles(roles))

        # Generar Token JWT con claims completos
        token = self._auth_service.create_access_token(
            user_id=user_id_str,
            email=user_email,
            nombre=user.get("nombre", ""),
            roles=roles,
            permissions=permissions
        )

        # Registrar acceso exitoso en la auditoría del sistema
        await self._audit_service.log_access(
            action="LOGIN_SUCCESS",
            user_id=user_id_str,
            user_email=user_email,
            resource="auth",
            details={"roles": roles},
            ip_address=ip_address,
            user_agent=user_agent
        )

        return self.success(
            "Login exitoso",
            access_token=token,
            user={
                "id": user_id_str,
                "nombre": user.get("nombre"),
                "email": user_email,
                "roles": roles,
                "permissions": permissions,
                "2fa_enabled": two_factor.get("enabled", False) or user.get("is_verified", False)
            }
        )

    async def setup_2fa(self, user_id: str, email: str, is_recovery: bool = False) -> Dict[str, Any]:
        """Genera un código OTP seguro y lo envía al correo"""
        code = str(random.randint(100000, 999999))
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)

        await self._user_model.save_otp_code(user_id, code, expires_at)
        await self._email_service.send_otp(email, code, is_recovery=is_recovery)

        return self.success("Código de verificación enviado", user_id=user_id)

    async def verify_2fa(self, user_id: str, code: str, ip_address: str = "127.0.0.1", user_agent: str = "Unknown") -> Dict[str, Any]:
        """Verifica el código OTP y activa la cuenta / genera sesión"""
        otp_data = await self._user_model.get_otp_data(user_id)
        if not otp_data or not otp_data.get("otp_code"):
            return self.error("No hay un código pendiente de verificación", code="NO_PENDING_OTP")

        saved_code = str(otp_data.get("otp_code"))
        expires_at = otp_data.get("otp_expires")

        if expires_at and expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)

        if expires_at and datetime.now(timezone.utc) > expires_at:
            return self.error("El código de verificación ha expirado", code="OTP_EXPIRED")

        if saved_code != str(code).strip():
            return self.error("Código de verificación incorrecto", code="INVALID_OTP")

        # Activar usuario y limpiar código OTP
        await self._user_model.enable_2fa(user_id)
        user = await self._user_model.get_user_by_id(user_id)

        roles = user.get("roles", ["Usuario Regular"]) if user else ["Usuario Regular"]
        permissions = list(await self._role_model.get_permissions_for_roles(roles))

        token = self._auth_service.create_access_token(
            user_id=user_id,
            email=user.get("email", ""),
            nombre=user.get("nombre", ""),
            roles=roles,
            permissions=permissions
        )

        await self._audit_service.log_access(
            action="OTP_VERIFIED",
            user_id=user_id,
            user_email=user.get("email"),
            resource="auth",
            details={"roles": roles},
            ip_address=ip_address,
            user_agent=user_agent
        )

        return self.success(
            "Verificación exitosa",
            access_token=token,
            user={
                "id": user_id,
                "nombre": user.get("nombre") if user else "",
                "email": user.get("email") if user else "",
                "roles": roles,
                "permissions": permissions
            }
        )

    async def request_password_reset(self, email: str, ip_address: str = "127.0.0.1") -> Dict[str, Any]:
        """Solicitud de restablecimiento de contraseña"""
        user = await self._user_model.find_by_identifier(email)
        if not user:
            # Prevenir enumeración de correos
            return self.success("Si el correo está registrado, recibirás un código de recuperación.")

        user_id = str(user["_id"])
        await self.setup_2fa(user_id, email, is_recovery=True)

        await self._audit_service.log_access(
            action="PASSWORD_RESET_REQUESTED",
            user_id=user_id,
            user_email=email,
            resource="auth",
            ip_address=ip_address
        )

        return self.success("Si el correo está registrado, recibirás un código de recuperación.", user_id=user_id)

    async def change_password(self, user_id: str, data: PasswordChange, ip_address: str = "127.0.0.1") -> Dict[str, Any]:
        """Cambio de contraseña con hashing bcrypt"""
        if data.new_password != data.confirm_password:
            return self.error("Las nuevas contraseñas no coinciden", code="PASSWORD_MISMATCH")

        new_hash = self._auth_service.hash_password(data.new_password)
        success = await self._user_model.update_user(user_id, {"password_hash": new_hash})

        if success:
            await self._audit_service.log_access(
                action="PASSWORD_CHANGED",
                user_id=user_id,
                resource="auth",
                ip_address=ip_address
            )
            return self.success("Contraseña actualizada con éxito")
        return self.error("No se pudo actualizar la contraseña", code="UPDATE_FAILED")

    async def get_profile(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Obtiene los datos del perfil de usuario"""
        user = await self._user_model.get_user_by_id(user_id)
        if not user:
            return None
        roles = user.get("roles", ["Usuario Regular"])
        return {
            "id": str(user["_id"]),
            "nombre": user.get("nombre"),
            "email": user.get("email"),
            "phone": user.get("phone"),
            "birth_date": user.get("birth_date"),
            "address": user.get("address"),
            "bank_accounts": user.get("bank_accounts", []),
            "roles": roles,
            "is_verified": user.get("is_verified", False),
            "2fa_enabled": user.get("two_factor", {}).get("enabled", False) or user.get("is_verified", False),
            "financial_profile": user.get("financial_profile") or {}
        }

    async def update_profile(self, user_id: str, update_dict: Dict[str, Any]) -> Dict[str, Any]:
        """Actualiza la información de perfil"""
        update_dict.pop("verification_code", None)
        update_dict.pop("roles", None)  # El usuario no puede auto-cambiarse los roles

        if "bank_accounts" in update_dict and len(update_dict["bank_accounts"]) > 3:
            return self.error("Solo se permiten hasta 3 cuentas bancarias.", code="LIMIT_EXCEEDED")

        success = await self._user_model.update_user(user_id, update_dict)
        if success:
            return self.success("Perfil actualizado correctamente")
        return self.error("Error al actualizar el perfil", code="UPDATE_FAILED")
