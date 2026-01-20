# 🚀 Развертывание без Docker - Soft Studio

Пошаговая инструкция по развертыванию проекта без использования Docker.

## 📋 Требования

Перед началом убедитесь, что у вас установлено:

- **Python 3.12+** ([скачать](https://www.python.org/downloads/))
- **Node.js 20+** и npm ([скачать](https://nodejs.org/))
- **PostgreSQL 15+** ([скачать](https://www.postgresql.org/download/))
- **Git** ([скачать](https://git-scm.com/downloads))

---

## 🔧 Шаг 1: Клонирование репозитория

```bash
git clone <your-repo-url>
cd softstudio
```

---

## 🗄️ Шаг 2: Настройка PostgreSQL

### 2.1. Установка PostgreSQL

**Windows:**
- Скачайте установщик с [официального сайта](https://www.postgresql.org/download/windows/)
- Установите PostgreSQL, запомните пароль для пользователя `postgres`

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

### 2.2. Создание базы данных

**Если вы получили ошибку "Peer authentication failed":**

Используйте один из следующих способов:

#### Способ 1: Использование sudo (рекомендуется для Linux)

```bash
# Войдите в PostgreSQL от имени пользователя postgres
sudo -u postgres psql

# В консоли PostgreSQL выполните:
CREATE DATABASE softstudio_db;
CREATE USER softstudio_user WITH PASSWORD 'your_password_here';
GRANT ALL PRIVILEGES ON DATABASE softstudio_db TO softstudio_user;
\q
```

**Или одной командой:**
```bash
sudo -u postgres psql -c "CREATE DATABASE softstudio_db;"
sudo -u postgres psql -c "CREATE USER softstudio_user WITH PASSWORD 'your_password_here';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE softstudio_db TO softstudio_user;"
```

#### Способ 2: Использование пароля

```bash
# Подключитесь с паролем (PostgreSQL попросит ввести пароль)
psql -U postgres -h localhost -W

# Или укажите пароль в переменной окружения
PGPASSWORD=your_postgres_password psql -U postgres -h localhost -c "CREATE DATABASE softstudio_db;"
```

#### Способ 3: Изменение метода аутентификации

Если нужно изменить метод аутентификации, отредактируйте файл `pg_hba.conf`:

```bash
# Найдите файл конфигурации
sudo find /etc -name pg_hba.conf

# Обычно находится в:
# /etc/postgresql/15/main/pg_hba.conf
# или
# /var/lib/pgsql/data/pg_hba.conf

# Отредактируйте файл
sudo nano /etc/postgresql/15/main/pg_hba.conf

# Измените строку:
# local   all             postgres                                peer
# на:
# local   all             postgres                                md5

# Перезапустите PostgreSQL
sudo systemctl restart postgresql
```

**После изменения конфигурации используйте:**
```bash
psql -U postgres -h localhost -W
```

---

## 🐍 Шаг 3: Настройка Backend

### 3.1. Переход в директорию backend

```bash
cd backend
```

### 3.2. Создание виртуального окружения

**Windows:**
```powershell
python -m venv venv
venv\Scripts\activate
```

**Linux/Mac:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3.3. Установка зависимостей

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 3.4. Создание файла .env

Создайте файл `.env` в директории `backend/`:

**Способ 1: Автоматический (рекомендуется)**
```bash
# Используйте скрипт настройки
chmod +x setup_backend.sh
./setup_backend.sh
```

**Способ 2: Ручной**

Создайте файл `.env`:
```bash
nano .env
```

Добавьте содержимое (замените значения на свои):

```env
DATABASE_URL=postgresql+psycopg2://softstudio_user:ваш_пароль@localhost:5432/softstudio_db
SECRET_KEY=ваш_секретный_ключ_минимум_32_символа
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=14
```

**Важно:** 
- Замените `ваш_пароль` на пароль, который вы установили для пользователя `softstudio_user` в PostgreSQL
- Замените `ваш_секретный_ключ_минимум_32_символа` на случайную строку (минимум 32 символа)

**Генерация SECRET_KEY:**
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

**Пример создания .env одной командой:**
```bash
# Сгенерируйте SECRET_KEY
SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(32))")

# Создайте .env (замените 'your_password' на ваш пароль)
cat > .env <<EOF
DATABASE_URL=postgresql+psycopg2://softstudio_user:your_password@localhost:5432/softstudio_db
SECRET_KEY=$SECRET_KEY
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=14
EOF
```

### 3.5. Выполнение миграций

```bash
python -m app.migration
```

Вы должны увидеть:
```
✓ Все таблицы созданы/обновлены
```

### 3.6. Создание директории для загрузок

```bash
mkdir uploads
```

### 3.7. Запуск Backend сервера

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Сервер запустится на http://localhost:8000

**Проверка:** Откройте в браузере http://localhost:8000/docs

---

## ⚛️ Шаг 4: Настройка Frontend

Откройте **новый терминал** (backend должен продолжать работать).

### 4.1. Переход в директорию frontend

```bash
cd front
```

### 4.2. Установка зависимостей

```bash
npm install
```

### 4.3. Создание файла .env.local

Создайте файл `.env.local` в директории `front/`:

```env
API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### 4.4. Запуск Frontend в режиме разработки

```bash
npm run dev
```

Приложение запустится на http://localhost:3000

**Или для продакшн сборки:**

```bash
npm run build
npm start
```

---

## ✅ Шаг 5: Проверка

Откройте в браузере:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Документация**: http://localhost:8000/docs

---

## 🔄 Запуск в фоновом режиме (Linux/Mac)

Если вы хотите запустить сервисы в фоновом режиме:

### Backend:
```bash
cd backend
source venv/bin/activate
nohup uvicorn app.main:app --host 0.0.0.0 --port 8000 > backend.log 2>&1 &
```

### Frontend:
```bash
cd front
nohup npm run dev > frontend.log 2>&1 &
```

### Остановка фоновых процессов:
```bash
# Найти процессы
ps aux | grep uvicorn
ps aux | grep "npm run dev"

# Остановить (замените PID на номер процесса)
kill PID
```

---

## 🪟 Запуск в фоновом режиме (Windows)

### Backend (PowerShell):
```powershell
cd backend
.\venv\Scripts\activate
Start-Process python -ArgumentList "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000" -WindowStyle Hidden
```

### Frontend (PowerShell):
```powershell
cd front
Start-Process npm -ArgumentList "run", "dev" -WindowStyle Hidden
```

---

## 🛠️ Использование systemd (Linux - для автозапуска)

Создайте файл `/etc/systemd/system/softstudio-backend.service`:

```ini
[Unit]
Description=Soft Studio Backend API
After=network.target postgresql.service

[Service]
Type=simple
User=your_username
WorkingDirectory=/path/to/softstudio/backend
Environment="PATH=/path/to/softstudio/backend/venv/bin"
ExecStart=/path/to/softstudio/backend/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

Активация:
```bash
sudo systemctl daemon-reload
sudo systemctl enable softstudio-backend
sudo systemctl start softstudio-backend
sudo systemctl status softstudio-backend
```

---

## 🔧 Troubleshooting

### Проблема: Не могу подключиться к PostgreSQL

**Решение:**
1. Проверьте, что PostgreSQL запущен:
   ```bash
   # Windows
   services.msc  # Найдите PostgreSQL в списке
   
   # Linux
   sudo systemctl status postgresql
   
   # macOS
   brew services list
   ```

2. Проверьте правильность DATABASE_URL в `.env`
3. Убедитесь, что пользователь и база данных созданы

### Проблема: Ошибка при установке зависимостей Python

**Решение:**
```bash
# Обновите pip
pip install --upgrade pip

# Для psycopg2 на Windows может потребоваться:
# Скачайте предкомпилированный wheel с https://www.lfd.uci.edu/~gohlke/pythonlibs/#psycopg
# Или установите PostgreSQL development headers
```

### Проблема: Frontend не может подключиться к Backend

**Решение:**
1. Убедитесь, что backend запущен на порту 8000
2. Проверьте `API_BASE_URL` в `.env.local`
3. Проверьте CORS настройки (если backend на другом домене)

### Проблема: Порты заняты

**Решение:**
Измените порты в конфигурации:

**Backend:**
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8001
```

**Frontend (.env.local):**
```env
API_BASE_URL=http://localhost:8001
```

И в `package.json` добавьте:
```json
"scripts": {
  "dev": "next dev -p 3001"
}
```

---

## 📝 Полезные команды

### Backend:
```bash
# Активация виртуального окружения
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Запуск с перезагрузкой при изменениях
uvicorn app.main:app --reload

# Запуск на другом порту
uvicorn app.main:app --port 8001

# Выполнение миграций
python -m app.migration
```

### Frontend:
```bash
# Установка зависимостей
npm install

# Режим разработки
npm run dev

# Продакшн сборка
npm run build

# Запуск продакшн версии
npm start

# Линтинг
npm run lint
```

### PostgreSQL:
```bash
# Подключение к базе
psql -U softstudio_user -d softstudio_db

# Список баз данных
psql -U postgres -c "\l"

# Список таблиц
psql -U softstudio_user -d softstudio_db -c "\dt"
```

---

## 🌐 Развертывание на продакшн сервер

### 1. Используйте продакшн сборку Frontend

```bash
cd front
npm run build
npm start
```

### 2. Используйте production сервер для Backend

```bash
# Установите gunicorn
pip install gunicorn

# Запустите с несколькими воркерами
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### 3. Настройте Reverse Proxy (Nginx)

См. раздел в [DEPLOYMENT.md](./DEPLOYMENT.md#-настройка-для-продакшн)

---

## ✅ Готово!

Теперь ваш проект должен работать без Docker. 

Если возникли проблемы, проверьте:
1. Логи backend в терминале
2. Логи frontend в терминале
3. Статус PostgreSQL
4. Переменные окружения в `.env` файлах

**Успешного развертывания! 🚀**
