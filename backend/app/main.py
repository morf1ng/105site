from fastapi import FastAPI, Depends, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy import text
from .database import get_session
from fastapi.staticfiles import StaticFiles
from .projects import router as projects_router
from .auth import router as auth_router
from .admin import router as admin_router

app = FastAPI(title="105 SOFT STUDIO Backend",
    description="MAIN SITE API FOR WORK DATABASE",
    version="1.0.8"
    )

# Add exception handler for validation errors to see what's failing
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    print(f"[VALIDATION ERROR] Path: {request.url.path}")
    print(f"[VALIDATION ERROR] Method: {request.method}")
    print(f"[VALIDATION ERROR] Errors: {exc.errors()}")
    print(f"[VALIDATION ERROR] Body: {exc.body}")
    
    # Log form data if available
    try:
        if hasattr(request, '_form') and request._form:
            print(f"[VALIDATION ERROR] Form data keys: {list(request._form.keys())}")
    except Exception:
        pass
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": exc.errors(),
            "body": str(exc.body) if exc.body else None
        },
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене лучше заменить на ["https://105dev.online"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    # expose_headers=["Authorization", "X-Refresh-Token"],
)

@app.get("/tables", summary="Список таблиц БД", description="Выводит названия всех таблиц БД", tags=["Debug"])
def get_tables(session=Depends(get_session)):
    result = session.execute(text(
        "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname='public'"
    ))
    tables = [row[0] for row in result.fetchall()]
    return {"tables": tables}

app.include_router(projects_router, prefix="/api", tags=["Projects"])
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth_router, prefix="/api")

app.include_router(admin_router, prefix="/api")

