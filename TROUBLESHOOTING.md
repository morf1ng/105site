# 🔧 Troubleshooting - Решение проблем

Сборник решений типичных проблем при развертывании.

## 🗄️ PostgreSQL

### Ошибка: "Peer authentication failed for user postgres"

**Проблема:** PostgreSQL использует peer authentication, которая требует совпадения имени пользователя системы с именем пользователя PostgreSQL.

**Решение 1 (рекомендуется):**
```bash
# Используйте sudo для подключения от имени пользователя postgres
sudo -u postgres psql

# Затем выполните команды создания БД
CREATE DATABASE softstudio_db;
CREATE USER softstudio_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE softstudio_db TO softstudio_user;
\q
```

**Решение 2:**
```bash
# Используйте пароль для подключения
psql -U postgres -h localhost -W
# Введите пароль, который вы установили при установке PostgreSQL
```

**Решение 3: Изменить метод аутентификации**

```bash
# 1. Найдите файл pg_hba.conf
sudo find /etc -name pg_hba.conf
# Обычно: /etc/postgresql/15/main/pg_hba.conf

# 2. Отредактируйте файл
sudo nano /etc/postgresql/15/main/pg_hba.conf

# 3. Найдите строку:
# local   all             postgres                                peer
# Измените на:
# local   all             postgres                                md5

# 4. Перезапустите PostgreSQL
sudo systemctl restart postgresql

# 5. Теперь можно подключаться с паролем
psql -U postgres -h localhost -W
```

### Ошибка: "database does not exist"

**Решение:**
```bash
# Создайте базу данных
sudo -u postgres psql -c "CREATE DATABASE softstudio_db;"
```

### Ошибка: "role does not exist"

**Решение:**
```bash
# Создайте пользователя
sudo -u postgres psql -c "CREATE USER softstudio_user WITH PASSWORD 'your_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE softstudio_db TO softstudio_user;"
```

### Ошибка: "password authentication failed"

**Решение:**
1. Проверьте правильность пароля в `.env` файле
2. Убедитесь, что пользователь существует:
   ```bash
   sudo -u postgres psql -c "\du"
   ```
3. Если нужно изменить пароль:
   ```bash
   sudo -u postgres psql -c "ALTER USER softstudio_user WITH PASSWORD 'new_password';"
   ```

---

## 🐍 Python / Backend

### Ошибка: "ModuleNotFoundError: No module named 'app'"

**Решение:**
```bash
# Убедитесь, что вы в директории backend
cd backend

# Активируйте виртуальное окружение
source venv/bin/activate  # Linux/Mac
# или
venv\Scripts\activate    # Windows

# Установите зависимости
pip install -r requirements.txt
```

### Ошибка: "psycopg2: Error: pg_config executable not found"

**Решение (Linux):**
```bash
sudo apt-get install libpq-dev python3-dev
pip install psycopg2-binary
```

**Решение (macOS):**
```bash
brew install postgresql
pip install psycopg2-binary
```

**Решение (Windows):**
```bash
# Скачайте предкомпилированный wheel с:
# https://www.lfd.uci.edu/~gohlke/pythonlibs/#psycopg
# Или используйте psycopg2-binary
pip install psycopg2-binary
```

### Ошибка: "Connection refused" при подключении к БД

**Решение:**
1. Проверьте, что PostgreSQL запущен:
   ```bash
   sudo systemctl status postgresql
   ```

2. Проверьте правильность DATABASE_URL в `.env`:
   ```env
   DATABASE_URL=postgresql+psycopg2://softstudio_user:password@localhost:5432/softstudio_db
   ```

3. Проверьте, что PostgreSQL слушает на правильном порту:
   ```bash
   sudo netstat -tlnp | grep 5432
   ```

### Ошибка: "Table already exists" при миграции

**Решение:**
Это нормально, если таблицы уже созданы. Миграция просто пропустит существующие таблицы.

Если нужно пересоздать таблицы:
```bash
# ВНИМАНИЕ: Это удалит все данные!
sudo -u postgres psql -d softstudio_db -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
python -m app.migration
```

---

## ⚛️ Node.js / Frontend

### Ошибка: "Cannot find module"

**Решение:**
```bash
cd front
rm -rf node_modules package-lock.json
npm install
```

### Ошибка: "Port 3000 is already in use"

**Решение:**
```bash
# Найдите процесс, использующий порт
lsof -i :3000  # Linux/Mac
netstat -ano | findstr :3000  # Windows

# Убейте процесс или используйте другой порт
npm run dev -- -p 3001
```

### Ошибка: "API_BASE_URL is not defined"

**Решение:**
1. Создайте файл `.env.local` в директории `front/`:
   ```env
   API_BASE_URL=http://localhost:8000
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   ```

2. Перезапустите dev сервер:
   ```bash
   npm run dev
   ```

### Ошибка: "Failed to fetch" при запросах к API

**Решение:**
1. Убедитесь, что backend запущен на порту 8000
2. Проверьте `API_BASE_URL` в `.env.local`
3. Проверьте CORS настройки в backend (если backend на другом домене)

---

## 🔐 Переменные окружения

### Проблема: Переменные окружения не загружаются

**Решение:**
1. Убедитесь, что файл `.env` находится в правильной директории:
   - Backend: `backend/.env`
   - Frontend: `front/.env.local`

2. Проверьте синтаксис файла (нет ли лишних пробелов, кавычек)

3. Перезапустите сервер после изменения `.env`

### Проблема: SECRET_KEY не установлен

**Решение:**
```bash
# Сгенерируйте новый SECRET_KEY
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Добавьте в backend/.env
echo "SECRET_KEY=your_generated_key_here" >> backend/.env
```

---

## 🌐 Сеть и порты

### Проблема: Не могу подключиться к серверу извне

**Решение:**
1. Проверьте firewall:
   ```bash
   sudo ufw status
   sudo ufw allow 8000/tcp  # Backend
   sudo ufw allow 3000/tcp  # Frontend
   ```

2. Убедитесь, что сервер слушает на `0.0.0.0`, а не только `127.0.0.1`:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```

### Проблема: Порты заняты

**Решение:**
Измените порты в конфигурации:

**Backend:**
```bash
uvicorn app.main:app --port 8001
```

**Frontend (.env.local):**
```env
API_BASE_URL=http://localhost:8001
```

---

## 📝 Полезные команды для диагностики

```bash
# Проверка статуса PostgreSQL
sudo systemctl status postgresql

# Проверка подключения к БД
psql -U softstudio_user -d softstudio_db -h localhost

# Просмотр логов PostgreSQL
sudo tail -f /var/log/postgresql/postgresql-15-main.log

# Проверка запущенных процессов Python
ps aux | grep uvicorn

# Проверка запущенных процессов Node
ps aux | grep node

# Проверка открытых портов
sudo netstat -tlnp | grep -E '8000|3000|5432'

# Проверка переменных окружения в Python
python -c "import os; from dotenv import load_dotenv; load_dotenv(); print(os.getenv('DATABASE_URL'))"
```

---

## 🆘 Если ничего не помогает

1. Проверьте логи:
   - Backend: вывод в терминале, где запущен uvicorn
   - Frontend: вывод в терминале, где запущен npm
   - PostgreSQL: `/var/log/postgresql/postgresql-15-main.log`

2. Убедитесь, что все зависимости установлены:
   ```bash
   # Backend
   cd backend
   pip list
   
   # Frontend
   cd front
   npm list
   ```

3. Проверьте версии:
   ```bash
   python --version  # Должно быть 3.12+
   node --version    # Должно быть 20+
   psql --version    # Должно быть 15+
   ```

4. Пересоздайте виртуальное окружение:
   ```bash
   cd backend
   rm -rf venv
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

---

**Если проблема не решена, опишите ошибку подробно и приложите логи!**
