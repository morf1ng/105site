#!/bin/bash

# Скрипт для настройки PostgreSQL для Soft Studio

echo "🗄️  Настройка PostgreSQL для Soft Studio..."

# Проверка, запущен ли PostgreSQL
if ! systemctl is-active --quiet postgresql; then
    echo "⚠️  PostgreSQL не запущен. Запускаю..."
    sudo systemctl start postgresql
fi

# Запрашиваем пароль для нового пользователя
read -sp "Введите пароль для пользователя softstudio_user: " DB_PASSWORD
echo ""
read -sp "Повторите пароль: " DB_PASSWORD_CONFIRM
echo ""

if [ "$DB_PASSWORD" != "$DB_PASSWORD_CONFIRM" ]; then
    echo "❌ Пароли не совпадают!"
    exit 1
fi

# Создаем базу данных и пользователя
echo "📦 Создание базы данных и пользователя..."

sudo -u postgres psql <<EOF
-- Создаем базу данных (если не существует)
SELECT 'CREATE DATABASE softstudio_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'softstudio_db')\gexec

-- Создаем пользователя (если не существует)
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'softstudio_user') THEN
        CREATE USER softstudio_user WITH PASSWORD '$DB_PASSWORD';
    ELSE
        ALTER USER softstudio_user WITH PASSWORD '$DB_PASSWORD';
    END IF;
END
\$\$;

-- Даем права
GRANT ALL PRIVILEGES ON DATABASE softstudio_db TO softstudio_user;
\q
EOF

if [ $? -eq 0 ]; then
    echo "✅ База данных и пользователь успешно созданы!"
    echo ""
    echo "📝 Информация для .env файла:"
    echo "DATABASE_URL=postgresql+psycopg2://softstudio_user:$DB_PASSWORD@localhost:5432/softstudio_db"
    echo ""
    echo "✅ Теперь можно настроить backend!"
else
    echo "❌ Ошибка при создании базы данных"
    exit 1
fi
