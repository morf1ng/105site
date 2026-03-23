-- ============================================
-- SQL для создания БД softstudio_db в pgAdmin
-- ============================================
-- Инструкция: 
-- 1. Подключитесь к PostgreSQL в pgAdmin
-- 2. Создайте БД: ПКМ на Databases -> Create -> Database -> Имя: softstudio_db
-- 3. Выберите БД softstudio_db и откройте Query Tool
-- 4. Выполните этот скрипт
-- ============================================

-- Удаление таблиц (если нужно пересоздать с нуля, раскомментируйте)
-- DROP TABLE IF EXISTS project_result_image CASCADE;
-- DROP TABLE IF EXISTS project_result CASCADE;
-- DROP TABLE IF EXISTS project_progress CASCADE;
-- DROP TABLE IF EXISTS project_stage CASCADE;
-- DROP TABLE IF EXISTS project_about_company CASCADE;
-- DROP TABLE IF EXISTS project CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;
-- DROP TABLE IF EXISTS roles CASCADE;

-- ============================================
-- Таблица project (проекты)
-- ============================================
CREATE TABLE IF NOT EXISTS project (
    id SERIAL PRIMARY KEY,
    title VARCHAR,
    url VARCHAR,
    preview_img TEXT,
    main_img TEXT,
    notebook_img TEXT,
    target TEXT,
    task TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Таблица roles (роли пользователей)
-- ============================================
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR UNIQUE NOT NULL
);

-- ============================================
-- Таблица users (пользователи)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    fullname VARCHAR,
    role_ids VARCHAR NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Таблица project_about_company (о компании)
-- ============================================
CREATE TABLE IF NOT EXISTS project_about_company (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL UNIQUE REFERENCES project(id) ON DELETE CASCADE,
    title VARCHAR,
    description TEXT
);

-- ============================================
-- Таблица project_stage (этапы проекта)
-- ============================================
CREATE TABLE IF NOT EXISTS project_stage (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES project(id) ON DELETE CASCADE,
    title VARCHAR,
    description TEXT,
    img TEXT
);

-- ============================================
-- Таблица project_result (результаты проекта)
-- ============================================
CREATE TABLE IF NOT EXISTS project_result (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL UNIQUE REFERENCES project(id) ON DELETE CASCADE,
    description TEXT
);

-- ============================================
-- Таблица project_result_image (изображения результатов)
-- ============================================
CREATE TABLE IF NOT EXISTS project_result_image (
    id SERIAL PRIMARY KEY,
    result_id INTEGER NOT NULL REFERENCES project_result(id) ON DELETE CASCADE,
    type VARCHAR,
    img TEXT
);

-- ============================================
-- Таблица project_progress (прогресс проекта)
-- ============================================
CREATE TABLE IF NOT EXISTS project_progress (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES project(id) ON DELETE CASCADE,
    text VARCHAR,
    digit INTEGER
);

-- ============================================
-- Триггер для auto-update updated_at (PostgreSQL)
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_project_updated_at ON project;
CREATE TRIGGER update_project_updated_at
    BEFORE UPDATE ON project
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ============================================
-- Начальные роли (опционально)
-- ============================================
INSERT INTO roles (id, name) VALUES 
    (1, 'admin'),
    (2, 'user'),
    (3, 'manager')
ON CONFLICT (id) DO NOTHING;

-- Сброс последовательности для roles (если вставляли с фиксированными id)
SELECT setval('roles_id_seq', (SELECT COALESCE(MAX(id), 1) FROM roles));

-- ============================================
-- Таблица courses (курсы, управление в админке)
-- ============================================
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Таблица course_registrations (заявки на курсы)
-- support_type: 'basic' = базовый, 'with_support' = с поддержкой
-- ============================================
CREATE TABLE IF NOT EXISTS course_registrations (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR NOT NULL,
    phone VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    support_type VARCHAR(20) NOT NULL CHECK (support_type IN ('basic', 'with_support')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_course_registrations_course_id ON course_registrations(course_id);
CREATE INDEX IF NOT EXISTS idx_course_registrations_email ON course_registrations(email);

-- ============================================
-- Готово! Все таблицы созданы.
-- ============================================
