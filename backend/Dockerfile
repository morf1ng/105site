# Используем официальный образ Python версии 3.12
FROM python:3.12-slim

# Отключаем создание .pyc файлов и включаем небуферизованный ввод-вывод
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Установка зависимостей для сборки psycopg2
#  Error: pg_config executable not found
# Ошибка связана с тем, что psycopg2 требует наличия системной утилиты pg_config, 
# которая входит в состав библиотеки PostgreSQL. Поскольку вы используете базовый образ Python 
# (например, python:3.12-slim), этой зависимости может не быть.
# build-essential: Включает базовые инструменты компиляции, включая stdlib.h и другие стандартные библиотеки C.
# libpq-dev: предоставляет pg_config, необходимый для сборки psycopg2
# gcc: нужен для компиляции зависимостей
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    gcc \
    mc \
    nano \
    telnet \
    --no-install-recommends && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Копируем файл с зависимостями в контейнер
COPY ./requirements.txt ./

# Старые версии pip могут не поддерживать некоторые современные зависимости
# Добавьте шаг обновления pip перед установкой зависимостей
# Обновляем pip и далее устанавливаем зависимости
RUN pip install --no-cache-dir --upgrade pip

# Устанавливаем зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Копируем исходный код приложения в контейнер
COPY . .

# Устанавливаем переменную окружения PYTHONPATH, чтобы Python мог найти модуль app
ENV PYTHONPATH=/app

# Устанавливаем переменную окружения ENV (настройки для продакшн среды).
ENV ENV=production

# Открываем порт FastAPI
EXPOSE 8000

# Команда для запуска FastAPI с помощью uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

# Выполняем миграции и запускаем приложение
# Вместо прямого вызова uvicorn используется команда sh -c, которая сначала выполняет миграции alembic upgrade head, а затем запускает uvicorn.
# CMD ["sh", "-c", "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
