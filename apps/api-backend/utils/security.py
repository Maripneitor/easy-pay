from fastapi import Header, HTTPException
from user.infrastructure.security.auth_handler import decode_token

async def get_current_user_id(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token inválido")
    token = authorization.split(" ")[1]
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token expirado o inválido")
    return payload.get("sub")
