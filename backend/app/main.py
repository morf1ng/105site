from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from sqlalchemy import text
from .database import get_session
from fastapi.staticfiles import StaticFiles
from scalar_fastapi import get_scalar_api_reference
from .projects import router as projects_router
from .auth import router as auth_router
from .admin import router as admin_router
from .courses import router as courses_router

app = FastAPI(title="105 SOFT STUDIO Backend",
    description="MAIN SITE API FOR WORK DATABASE",
    version="1.0.8",
    docs_url=None,
    redoc_url=None,
)

@app.get("/docs", include_in_schema=False)
async def scalar_html() -> HTMLResponse:
    return get_scalar_api_reference(
        openapi_url=app.openapi_url,
        title=app.title + " — API",
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене лучше заменить на ["https://105dev.online"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Authorization", "X-Refresh-Token"],
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
app.include_router(courses_router, prefix="/api")

