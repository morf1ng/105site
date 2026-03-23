# -*- coding: utf-8 -*-
from sqlalchemy import text, inspect
from database import engine
from models import Base

def create_tables():
    """Создает все таблицы в базе данных на основе моделей SQLAlchemy"""
    inspector = inspect(engine)
    
    # Проверяем, существует ли таблица users
    table_exists = inspector.has_table("users")
    
    if table_exists:
        # Проверяем структуру таблицы users для PostgreSQL
        with engine.connect() as conn:
            # Проверяем наличие колонки role_id (старая структура)
            result = conn.execute(text("""
                SELECT COUNT(*) as cnt 
                FROM information_schema.columns 
                WHERE table_name = 'users' AND column_name = 'role_id'
            """))
            has_old_role_id = result.scalar() > 0
            
            # Проверяем наличие колонки role_ids (новая структура)
            result = conn.execute(text("""
                SELECT COUNT(*) as cnt 
                FROM information_schema.columns 
                WHERE table_name = 'users' AND column_name = 'role_ids'
            """))
            has_new_role_ids = result.scalar() > 0
            
            # Если есть старая колонка role_id, мигрируем
            if has_old_role_id and not has_new_role_ids:
                print("Обнаружена старая структура таблицы users. Выполняется миграция...")
                
                # Создаем новую таблицу
                conn.execute(text("""
                    CREATE TABLE users_new (
                        id SERIAL PRIMARY KEY,
                        email VARCHAR NOT NULL UNIQUE,
                        password_hash TEXT NOT NULL,
                        fullname VARCHAR,
                        role_ids VARCHAR NOT NULL,
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                    )
                """))
                conn.commit()
                
                # Копируем данные, преобразуя role_id в строку
                conn.execute(text("""
                    INSERT INTO users_new (id, email, password_hash, fullname, role_ids, created_at, updated_at)
                    SELECT id, email, password_hash, fullname, CAST(role_id AS TEXT), created_at, updated_at
                    FROM users
                    WHERE role_id IS NOT NULL
                """))
                conn.commit()
                
                # Удаляем старую таблицу и переименовываем новую
                conn.execute(text("DROP TABLE users"))
                conn.execute(text("ALTER TABLE users_new RENAME TO users"))
                conn.commit()
                
                print("✓ Миграция таблицы users завершена успешно!")
    
    # Создаем все таблицы (или обновляем существующие)
    Base.metadata.create_all(bind=engine)
    print("✓ Все таблицы созданы/обновлены")

if __name__ == "__main__":
    create_tables()