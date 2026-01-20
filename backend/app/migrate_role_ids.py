"""
Миграция для изменения поля role_id на role_ids (строка с ID через запятую)
Этот скрипт:
1. Переименовывает колонку role_id в role_ids
2. Преобразует тип данных в String
"""
from sqlalchemy import text
from .database import engine

async def migrate():
    async with engine.begin() as conn:
        # Проверяем, существует ли колонка role_id
        result = await conn.execute(text("""
            SELECT COUNT(*) as cnt 
            FROM pragma_table_info('users') 
            WHERE name='role_id'
        """))
        has_role_id = result.scalar() > 0
        
        # Проверяем, существует ли колонка role_ids
        result = await conn.execute(text("""
            SELECT COUNT(*) as cnt 
            FROM pragma_table_info('users') 
            WHERE name='role_ids'
        """))
        has_role_ids = result.scalar() > 0
        
        if has_role_id and not has_role_ids:
            print("Миграция: преобразование role_id -> role_ids")
            
            # SQLite не поддерживает ALTER COLUMN, нужно пересоздать таблицу
            await conn.execute(text("""
                CREATE TABLE users_new (
                    id INTEGER PRIMARY KEY,
                    email VARCHAR NOT NULL UNIQUE,
                    password_hash TEXT NOT NULL,
                    fullname VARCHAR,
                    role_ids VARCHAR NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """))
            
            # Копируем данные, преобразуя role_id в строку
            await conn.execute(text("""
                INSERT INTO users_new (id, email, password_hash, fullname, role_ids, created_at, updated_at)
                SELECT id, email, password_hash, fullname, CAST(role_id AS TEXT), created_at, updated_at
                FROM users
            """))
            
            await conn.execute(text("DROP TABLE users"))
            await conn.execute(text("ALTER TABLE users_new RENAME TO users"))
            
            print("Миграция успешно завершена!")
        elif has_role_ids:
            print("Колонка role_ids уже существует, миграция не требуется")
        else:
            print("Создание новой таблицы users с role_ids")
            # Если таблица users не существует, создаем её
            await conn.execute(text("""
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY,
                    email VARCHAR NOT NULL UNIQUE,
                    password_hash TEXT NOT NULL,
                    fullname VARCHAR,
                    role_ids VARCHAR NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """))
            print("Таблица создана!")

if __name__ == "__main__":
    import asyncio
    asyncio.run(migrate())
