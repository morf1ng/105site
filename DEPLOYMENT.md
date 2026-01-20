# 🚀 Инструкция по развертыванию Soft Studio

Полное руководство по развертыванию проекта Soft Studio на сервере.

## 📋 Содержание

1. [Требования](#требования)
2. [Быстрый старт с Docker Compose](#быстрый-старт-с-docker-compose)
3. [Ручное развертывание](#ручное-развертывание)
4. [Настройка переменных окружения](#настройка-переменных-окружения)
5. [Настройка для продакшн](#настройка-для-продакшн)
6. [Troubleshooting](#troubleshooting)

---

## 🔧 Требования

- **Docker** версии 20.10 или выше
- **Docker Compose** версии 2.0 или выше
- **Git** для клонирования репозитория
- **Минимум 2GB RAM** на сервере
- **Минимум 10GB свободного места** на диске

Для ручного развертывания дополнительно:
- **Python 3.12+**
- **Node.js 20+** и npm
- **PostgreSQL 15+**

---

## 🐳 Быстрый старт с Docker Compose

### Шаг 1: Подготовка

1. Клонируйте репозиторий:
```bash
git clone <your-repo-url>
cd softstudio
```

2. Создайте файл `.env` на основе примера:
```bash
cp env.example .env
```

3. Отредактируйте `.env` файл и установите безопасные значения:
```bash
# Обязательно измените эти значения!
POSTGRES_PASSWORD=your_secure_password_here
SECRET_KEY=your-very-secure-secret-key-change-this-in-production
```

### Шаг 2: Запуск

Запустите все сервисы одной командой:
```bash
docker-compose up -d
```

Эта команда:
- Создаст и запустит PostgreSQL базу данных
- Соберет и запустит Backend API (FastAPI)
- Соберет и запустит Frontend (Next.js)
- Выполнит миграции базы данных автоматически

### Шаг 3: Проверка

Проверьте статус контейнеров:
```bash
docker-compose ps
```

Все сервисы должны быть в статусе `Up`:
- `softstudio_postgres` - база данных
- `softstudio_backend` - API сервер (порт 8000)
- `softstudio_frontend` - веб-приложение (порт 3000)

### Шаг 4: Доступ к приложению

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Документация**: http://localhost:8000/docs

---

## 🛠️ Ручное развертывание

Если вы предпочитаете развертывать без Docker:

### Backend

1. Перейдите в директорию backend:
```bash
cd backend
```

2. Создайте виртуальное окружение:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# или
venv\Scripts\activate  # Windows
```

3. Установите зависимости:
```bash
pip install -r requirements.txt
```

4. Создайте файл `.env` в директории `backend`:
```env
DATABASE_URL=postgresql+psycopg2://postgres:password@localhost:5432/softstudio_db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=14
```

5. Убедитесь, что PostgreSQL запущен и создана база данных:
```bash
createdb softstudio_db
```

6. Выполните миграции:
```bash
python -m app.migration
```

7. Запустите сервер:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Frontend

1. Перейдите в директорию front:
```bash
cd front
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env.local`:
```env
API_BASE_URL=http://localhost:8000
```

4. Соберите приложение:
```bash
npm run build
```

5. Запустите сервер:
```bash
npm start
```

---

## ⚙️ Настройка переменных окружения

### Backend (.env в директории backend/)

| Переменная | Описание | Значение по умолчанию |
|------------|----------|----------------------|
| `DATABASE_URL` | URL подключения к PostgreSQL | `postgresql+psycopg2://postgres:postgres@localhost:5433/dagcode_db` |
| `SECRET_KEY` | Секретный ключ для JWT токенов | **Обязательно измените!** |
| `ALGORITHM` | Алгоритм шифрования JWT | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Время жизни access токена | `15` |
| `REFRESH_TOKEN_EXPIRE_DAYS` | Время жизни refresh токена | `14` |

### Frontend (.env.local в директории front/)

| Переменная | Описание | Значение по умолчанию |
|------------|----------|----------------------|
| `API_BASE_URL` | URL backend API | `http://localhost:8000` |

### Docker Compose (.env в корне проекта)

Все переменные из `env.example` можно настроить в корневом `.env` файле.

---

## 🌐 Настройка для продакшн

### 1. Безопасность

**КРИТИЧЕСКИ ВАЖНО:**

- ✅ Измените `POSTGRES_PASSWORD` на сложный пароль
- ✅ Измените `SECRET_KEY` на случайную строку (минимум 32 символа)
- ✅ Не коммитьте `.env` файлы в Git
- ✅ Используйте HTTPS для продакшн

Сгенерируйте безопасный SECRET_KEY:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 2. Reverse Proxy (Nginx)

Рекомендуется использовать Nginx как reverse proxy:

```nginx
# /etc/nginx/sites-available/softstudio
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        rewrite ^/api/(.*) /$1 break;
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 3. SSL сертификат (Let's Encrypt)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### 4. Обновление API_BASE_URL для Frontend

В продакшн измените `API_BASE_URL` в `.env`:
```env
API_BASE_URL=https://api.yourdomain.com
# или если API на том же домене:
API_BASE_URL=https://yourdomain.com/api
```

### 5. Оптимизация Docker Compose для продакшн

Измените `docker-compose.yml`:

```yaml
backend:
  # Уберите --reload для продакшн
  command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4

frontend:
  # Next.js уже оптимизирован для продакшн
  environment:
    NODE_ENV: production
```

### 6. Мониторинг и логи

Просмотр логов:
```bash
# Все сервисы
docker-compose logs -f

# Конкретный сервис
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### 7. Резервное копирование базы данных

Создайте скрипт для бэкапа:
```bash
#!/bin/bash
docker-compose exec postgres pg_dump -U postgres softstudio_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

Восстановление:
```bash
docker-compose exec -T postgres psql -U postgres softstudio_db < backup.sql
```

---

## 🔍 Troubleshooting

### Проблема: Контейнеры не запускаются

**Решение:**
```bash
# Проверьте логи
docker-compose logs

# Пересоберите контейнеры
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Проблема: База данных не подключается

**Решение:**
1. Проверьте, что PostgreSQL контейнер запущен:
```bash
docker-compose ps postgres
```

2. Проверьте переменные окружения в `.env`:
```bash
cat .env | grep POSTGRES
```

3. Проверьте логи PostgreSQL:
```bash
docker-compose logs postgres
```

### Проблема: Frontend не может подключиться к Backend

**Решение:**
1. Проверьте `API_BASE_URL` в `.env` файле
2. Убедитесь, что backend запущен:
```bash
curl http://localhost:8000/docs
```

3. Проверьте CORS настройки в backend (если есть)

### Проблема: Миграции не выполняются

**Решение:**
```bash
# Выполните миграции вручную
docker-compose exec backend python -m app.migration
```

### Проблема: Порты заняты

**Решение:**
Измените порты в `.env`:
```env
POSTGRES_PORT=5433
BACKEND_PORT=8001
FRONTEND_PORT=3001
```

---

## 📚 Полезные команды

```bash
# Остановить все сервисы
docker-compose down

# Остановить и удалить volumes (ОСТОРОЖНО: удалит данные БД!)
docker-compose down -v

# Перезапустить конкретный сервис
docker-compose restart backend

# Просмотр использования ресурсов
docker stats

# Войти в контейнер
docker-compose exec backend bash
docker-compose exec postgres psql -U postgres -d softstudio_db
```

---

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи: `docker-compose logs`
2. Проверьте документацию в `backend/docs/`
3. Убедитесь, что все переменные окружения установлены правильно

---

**Успешного развертывания! 🚀**
