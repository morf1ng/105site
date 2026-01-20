# 🚀 Soft Studio - Full Stack Application

**Soft Studio** — Digital Development Studio - полнофункциональное веб-приложение для управления проектами.

## 📋 Описание проекта

Проект состоит из двух основных компонентов:

- **Backend** - FastAPI приложение на Python 3.12 с PostgreSQL
- **Frontend** - Next.js 16 приложение на React 19 с TypeScript

## 🏗️ Архитектура

```
softstudio/
├── backend/          # FastAPI Backend
│   ├── app/          # Основной код приложения
│   ├── docs/         # Документация
│   └── Dockerfile    # Docker образ для backend
├── front/            # Next.js Frontend
│   ├── src/          # Исходный код
│   └── Dockerfile    # Docker образ для frontend
├── docker-compose.yml # Оркестрация всех сервисов
└── DEPLOYMENT.md     # Подробная инструкция по развертыванию
```

## 🚀 Быстрый старт

### Вариант 1: Docker Compose (Рекомендуется)

1. **Клонируйте репозиторий:**
```bash
git clone <your-repo-url>
cd softstudio
```

2. **Создайте файл `.env`:**
```bash
cp env.example .env
```

3. **Отредактируйте `.env` и установите безопасные значения:**
```env
POSTGRES_PASSWORD=your_secure_password
SECRET_KEY=your-very-secure-secret-key
```

4. **Запустите приложение:**
```bash
# Linux/Mac
chmod +x deploy.sh
./deploy.sh

# Windows PowerShell
.\deploy.ps1

# Или вручную
docker-compose up -d
```

5. **Откройте в браузере:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Документация: http://localhost:8000/docs

### Вариант 2: Развертывание без Docker

**Для развертывания без Docker** см. подробную инструкцию:
- **[DEPLOYMENT_WITHOUT_DOCKER.md](./DEPLOYMENT_WITHOUT_DOCKER.md)** - Пошаговая инструкция без Docker

**Для развертывания с Docker** см.:
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Полная инструкция с Docker

## 📚 Документация

### Развертывание:
- **[DEPLOYMENT_WITHOUT_DOCKER.md](./DEPLOYMENT_WITHOUT_DOCKER.md)** - Развертывание БЕЗ Docker (пошаговая инструкция)
- **[QUICK_START_WITHOUT_DOCKER.md](./QUICK_START_WITHOUT_DOCKER.md)** - Быстрый старт БЕЗ Docker
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Развертывание с Docker
- **[QUICK_START.md](./QUICK_START.md)** - Быстрый старт с Docker

### Backend:
- **[backend/docs/](./backend/docs/)** - Документация по Backend API
- **[backend/docs/API_GUIDE.md](./backend/docs/API_GUIDE.md)** - Руководство по API
- **[backend/docs/DATABASE.md](./backend/docs/DATABASE.md)** - Структура базы данных

## 🛠️ Технологический стек

### Backend
- Python 3.12
- FastAPI
- SQLAlchemy
- PostgreSQL
- JWT Authentication
- Uvicorn

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS

## 📝 Переменные окружения

Основные переменные (см. `env.example`):

- `POSTGRES_USER` - пользователь PostgreSQL
- `POSTGRES_PASSWORD` - пароль PostgreSQL
- `POSTGRES_DB` - имя базы данных
- `SECRET_KEY` - секретный ключ для JWT (обязательно измените!)
- `API_BASE_URL` - URL backend API для frontend

## 🔧 Полезные команды

```bash
# Запуск всех сервисов
docker-compose up -d

# Просмотр логов
docker-compose logs -f

# Остановка всех сервисов
docker-compose down

# Перезапуск конкретного сервиса
docker-compose restart backend

# Пересборка контейнеров
docker-compose up -d --build

# Вход в контейнер
docker-compose exec backend bash
docker-compose exec postgres psql -U postgres -d softstudio_db
```

## 🌐 Развертывание на продакшн сервер

1. Настройте переменные окружения в `.env`
2. Используйте reverse proxy (Nginx) для HTTPS
3. Настройте SSL сертификат (Let's Encrypt)
4. Обновите `API_BASE_URL` для frontend

Подробная инструкция: [DEPLOYMENT.md](./DEPLOYMENT.md#-настройка-для-продакшн)

## 🔒 Безопасность

**ВАЖНО для продакшн:**
- ✅ Измените `SECRET_KEY` на случайную строку (минимум 32 символа)
- ✅ Используйте сложный пароль для PostgreSQL
- ✅ Не коммитьте `.env` файлы в Git
- ✅ Используйте HTTPS
- ✅ Настройте firewall

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи: `docker-compose logs`
2. Изучите [DEPLOYMENT.md](./DEPLOYMENT.md#-troubleshooting)
3. Проверьте документацию в `backend/docs/`

## 📄 Лицензия

[Укажите лицензию вашего проекта]

---

**Успешного развертывания! 🚀**
