from fastapi import Header, HTTPException
from user.infrastructure.security.auth_handler import decode_token

async def get_current_user_id(authorization: str | None = Header(None)):
    if not authorization:
        raise HTTPException(
            status_code=401, 
            detail="Se requiere token de sesión. Por favor, inicia sesión de nuevo."
        )
    
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Formato de token inválido")
        
    token = authorization.split(" ")[1]
    payload = decode_token(token)
    
    if not payload:
        raise HTTPException(status_code=401, detail="Sesión expirada o token inválido")
        
    return payload.get("sub")
