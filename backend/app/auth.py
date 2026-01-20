from fastapi import APIRouter, Depends, HTTPException, status, Form, Response

from sqlalchemy.orm import Session
from sqlalchemy import select
from jose import JWTError, jwt
from .utils import verify_password, create_access_token, create_refresh_token, SECRET_KEY, ALGORITHM
from .schemas import Token
from .models import User
from .database import get_session

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/login")
def login(
    response: Response,
    session: Session = Depends(get_session),
    email: str = Form(...),
    password: str = Form(...),
):

    user = session.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Получаем имена ролей из ID
    roles = user.get_roles(session)
    role_names = [role.name for role in roles]
    
    access_token = create_access_token({"user_id": user.id, "roles": role_names})
    refresh_token = create_refresh_token({"user_id": user.id, "roles": role_names})

    # токены в заголовках ответа
    response.headers["Authorization"] = f"Bearer {access_token}"
    response.headers["X-Refresh-Token"] = refresh_token

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

    

@router.post("/refresh")
def refresh_token_func(response: Response, refresh_token: str = Form(...)):

    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    user_id = payload.get("user_id")
    roles = payload.get("roles", [])
    access_token = create_access_token({"user_id": user_id, "roles": roles})
    new_refresh_token = create_refresh_token({"user_id": user_id, "roles": roles})

    # обновлённые токены в заголовках
    response.headers["Authorization"] = f"Bearer {access_token}"
    response.headers["X-Refresh-Token"] = new_refresh_token

   