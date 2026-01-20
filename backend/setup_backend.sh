#!/bin/bash

# Скрипт для настройки Backend

echo "🐍 Настройка Backend для Soft Studio..."

# Переход в директорию backend
cd "$(dirname "$0")" || exit 1

# Проверка Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 не установлен!"
    exit 1
fi

echo "✅ Python найден: $(python3 --version)"

# Создание виртуального окружения
if [ ! -d "venv" ]; then
    echo "📦 Создание виртуального окружения..."
    python3 -m venv venv
fi

# Активация виртуального окружения
echo "🔌 Активация виртуального окружения..."
source venv/bin/activate

# Обновление pip
echo "⬆️  Обновление pip..."
pip install --upgrade pip

# Установка зависимостей
echo "📥 Установка зависимостей..."
pip install -r requirements.txt

# Запрос данных для подключения к БД
echo ""
echo "📝 Настройка подключения к базе данных..."
read -p "Имя пользователя PostgreSQL (softstudio_user): " DB_USER
DB_USER=${DB_USER:-softstudio_user}

read -sp "Пароль пользователя PostgreSQL: " DB_PASSWORD
echo ""

read -p "Имя базы данных (softstudio_db): " DB_NAME
DB_NAME=${DB_NAME:-softstudio_db}

read -p "Хост (localhost): " DB_HOST
DB_HOST=${DB_HOST:-localhost}

read -p "Порт (5432): " DB_PORT
DB_PORT=${DB_PORT:-5432}

# Генерация SECRET_KEY
echo "🔑 Генерация SECRET_KEY..."
SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(32))")

# Создание .env файла
echo "📄 Создание .env файла..."
cat > .env <<EOF
DATABASE_URL=postgresql+psycopg2://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}
SECRET_KEY=${SECRET_KEY}
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=14
EOF

echo "✅ .env файл создан!"

# Создание директории для загрузок
if [ ! -d "uploads" ]; then
    echo "📁 Создание директории uploads..."
    mkdir uploads
fi

# Выполнение миграций
echo "🗄️  Выполнение миграций (создание таблиц)..."
python3 -m app.migration

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Backend успешно настроен!"
    echo ""
    echo "📝 Для запуска сервера выполните:"
    echo "   source venv/bin/activate"
    echo "   uvicorn app.main:app --reload"
    echo ""
else
    echo "❌ Ошибка при выполнении миграций"
    exit 1
fi
