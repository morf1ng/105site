"""API курсов и заявок на курсы."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .database import get_session
from .models import Course, CourseRegistration
from .schemas import CourseRegistrationIn
from .email_service import send_course_links_email

router = APIRouter(prefix="/courses", tags=["Courses"])


@router.get("")
def get_courses(session: Session = Depends(get_session)):
    """Список курсов (публичный)."""
    return session.query(Course).order_by(Course.id).all()


@router.post("/register")
def register_for_course(data: CourseRegistrationIn, session: Session = Depends(get_session)):
    """Регистрация на курс: сохраняем заявку и отправляем email со ссылками."""
    if data.support_type not in ("basic", "with_support"):
        raise HTTPException(status_code=400, detail="support_type должен быть 'basic' или 'with_support'")
    course = session.query(Course).get(data.course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Курс не найден")
    reg = CourseRegistration(
        full_name=data.full_name,
        phone=data.phone,
        email=data.email,
        course_id=data.course_id,
        support_type=data.support_type,
    )
    session.add(reg)
    session.commit()
    session.refresh(reg)
    send_course_links_email(data.email, data.full_name, course.title, data.support_type)
    return {"detail": "Заявка принята. Письмо со ссылками отправлено на указанный email.", "id": reg.id}
