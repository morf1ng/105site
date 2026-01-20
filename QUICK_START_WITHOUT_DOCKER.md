# ⚡ Быстрый старт БЕЗ Docker - Soft Studio

Краткая инструкция для запуска проекта без Docker.

## 📋 Требования

- Python 3.12+
- Node.js 20+
- PostgreSQL 15+
- Git

## 🚀 Быстрый старт

### 1. Клонирование

```bash
git clone <your-repo-url>
cd softstudio
```

### 2. Настройка PostgreSQL

```bash
# Войдите в PostgreSQL от имени системного пользователя postgres
sudo -u postgres psql

# В консоли PostgreSQL выполните:
CREATE DATABASE softstudio_db;
CREATE USER softstudio_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE softstudio_db TO softstudio_user;
\q

# Или одной командой:
sudo -u postgres psql -c "CREATE DATABASE softstudio_db;"
sudo -u postgres psql -c "CREATE USER softstudio_user WITH PASSWORD 'your_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE softstudio_db TO softstudio_user;"
```

### 3. Backend

```bash
cd backend

# Создайте виртуальное окружение
python -m venv venv

# Активируйте его
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Установите зависимости
pip install -r requirements.txt

# Создайте .env файл (замените 'your_password' на ваш пароль)
SECRET_KEY=$(python3 -c 'import secrets; print(secrets.token_urlsafe(32))')
cat > .env <<EOF
DATABASE_URL=postgresql+psycopg2://softstudio_user:your_password@localhost:5432/softstudio_db
SECRET_KEY=$SECRET_KEY
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=14
EOF

# Выполните миграции
python -m app.migration

# Создайте директорию для загрузок
mkdir uploads

# Запустите сервер
uvicorn app.main:app --reload
```

### 4. Frontend (в новом терминале)

```bash
cd front

# Установите зависимости
npm install

# Создайте .env.local
echo "API_BASE_URL=http://localhost:8000" > .env.local
echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:8000" >> .env.local

# Запустите
npm run dev
```

### 5. Проверка

- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 📚 Подробная инструкция

См. [DEPLOYMENT_WITHOUT_DOCKER.md](./DEPLOYMENT_WITHOUT_DOCKER.md) для детальных шагов и troubleshooting.

---

**Готово! 🎉**
