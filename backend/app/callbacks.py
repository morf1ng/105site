"""Публичные заявки на обратный звонок."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .database import get_session
from .models import CallbackRequest
from .schemas import CallbackRequestIn

router = APIRouter(prefix="/callback-requests", tags=["Callbacks"])


@router.post("")
def create_callback_request(data: CallbackRequestIn, session: Session = Depends(get_session)):
    """Сохраняет заявку «Заказать звонок»."""
    row = CallbackRequest(
        full_name=data.full_name.strip(),
        phone=data.phone.strip(),
        email=data.email.strip(),
    )
    session.add(row)
    session.commit()
    session.refresh(row)
    return {"detail": "Заявка принята. Мы свяжемся с вами в ближайшее время.", "id": row.id}
