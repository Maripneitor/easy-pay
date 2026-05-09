from user.infrastructure.security.auth_handler import create_access_token

class UpdateUserUseCase:
    def __init__(self, user_repository):
        self.repository = user_repository

    async def execute(self, user_id: str, new_data: dict):
        # 1. Obtener el usuario actual
        current_user = await self.repository.get_user_by_id(user_id)
        if not current_user:
            return {"status": "error", "message": "Usuario no encontrado"}

        # 2. Validar colisiones (si el email cambió)
        new_email = new_data.get("email")
        if new_email and new_email != current_user.get("email"):
            existing = await self.repository.find_by_identifier(new_email)
            if existing:
                return {"status": "error", "message": "El correo electrónico ya está en uso"}

        # 3. Validar colisiones (si el teléfono cambió)
        new_phone = new_data.get("phone")
        if new_phone and new_phone != current_user.get("phone"):
            # Opcional: validación de duplicados de teléfono
            pass

        # 4. Validar colisiones de cuentas bancarias
        new_accounts = new_data.get("bank_accounts")
        if new_accounts:
            for acc in new_accounts:
                clabe = acc.get("clabe") if isinstance(acc, dict) else acc.clabe
                if clabe:
                    existing_user_with_bank = await self.repository.find_by_bank_account(clabe)
                    if existing_user_with_bank and str(existing_user_with_bank["_id"]) != user_id:
                        return {
                            "status": "error", 
                            "message": f"La CLABE {clabe} ya está registrada por otro usuario."
                        }

        # 5. Prohibir cambio de contraseña en este flujo
        if "password" in new_data:
            del new_data["password"]

        # 5. Ejecutar la actualización en MongoDB
        success = await self.repository.update_user(user_id, new_data)
        if not success:
            return {"status": "error", "message": "No hubo cambios o error en la base de datos"}

        # 6. Generar nuevo Token si los claims cambiaron
        token_changed = (
            (new_email and new_email != current_user.get("email")) or
            (new_data.get("nombre") and new_data.get("nombre") != current_user.get("nombre"))
        )

        new_token = None
        if token_changed:
            new_token = create_access_token(
                user_id=user_id,
                email=new_data.get("email", current_user.get("email")),
                nombre=new_data.get("nombre", current_user.get("nombre"))
            )

        # 7. Obtener usuario actualizado para devolverlo completo
        updated_user = await self.repository.get_user_by_id(user_id)

        return {
            "status": "success",
            "message": "Perfil actualizado",
            "new_token": new_token,
            "user": {
                "id": user_id,
                "nombre": updated_user.get("nombre"),
                "email": updated_user.get("email"),
                "phone": updated_user.get("phone"),
                "birth_date": updated_user.get("birth_date"),
                "address": updated_user.get("address"),
                "bank_accounts": updated_user.get("bank_accounts", []),
                "2fa_enabled": updated_user.get("two_factor", {}).get("enabled", False) or updated_user.get("is_verified", False),
                "is_verified": updated_user.get("is_verified", False)
            }
        }