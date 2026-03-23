# Деплой проекта на сервер (без Docker)

Полная инструкция по развёртыванию 105site на VPS с PostgreSQL, Nginx и доменом.

---

## 0. Ошибка SSH «REMOTE HOST IDENTIFICATION HAS CHANGED»

Если при подключении по SSH видите такое сообщение — это значит, что ключ сервера изменился (переустановка ОС, новый сервер под тем же IP).

**Решение — удалить старый ключ и принять новый:**

```powershell
ssh-keygen -R 193.201.126.66
```

После этого при первом подключении появится запрос принять новый ключ — введите `yes`.

```powershell
ssh root@193.201.126.66
```

---

## 1. Подготовка сервера

### 1.1. Обновление системы (Ubuntu/Debian)

```bash
apt update && apt upgrade -y
```

### 1.2. Установка зависимостей

```bash
# Python 3.11+, Node.js 20, PostgreSQL, Nginx, Git
apt install -y python3 python3-pip python3-venv nodejs npm postgresql postgresql-contrib nginx git
```

> Если `nodejs` старый — установите Node 20 через [NodeSource](https://github.com/nodesource/distributions):
> ```bash
> curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
> apt install -y nodejs
> ```

---

## 2. PostgreSQL

### 2.1. Создание БД и пользователя

```bash
sudo -u postgres psql
```

В консоли PostgreSQL:

```sql
CREATE USER softstudio_user WITH PASSWORD 'ваш_надёжный_пароль';
CREATE DATABASE softstudio_db OWNER softstudio_user;
\q
```

### 2.2. Включение и проверка PostgreSQL

```bash
systemctl enable postgresql
systemctl start postgresql
systemctl status postgresql
```

---

## 3. Приложение на сервере

### 3.1. Клонирование репозитория

```bash
cd /var/www
git clone https://github.com/YOUR_REPO/105site.git
cd 105site
```

Либо загрузка через `scp`/`rsync` (с локальной машины):

```powershell
# С локальной машины Windows:
scp -r "C:\Users\Ягияев Али\Desktop\105site\*" root@193.201.126.66:/var/www/105site/
```

### 3.2. Backend (FastAPI)

```bash
cd /var/www/105site/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**Создание `.env`:**

```bash
nano /var/www/105site/backend/.env
```

Содержимое:

```env
DATABASE_URL=postgresql+psycopg2://softstudio_user:ваш_пароль@localhost:5432/softstudio_db
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=app-password
SMTP_FROM=your-email@gmail.com
TG_LINK_BASIC=https://t.me/your_channel
TG_LINK_SUPPORT_1=https://t.me/support1
TG_LINK_SUPPORT_2=https://t.me/support2
```

> Gmail: нужен пароль приложения в аккаунте Google, а не обычный пароль.

**Инициализация БД:**

```bash
cd /var/www/105site
sudo -u postgres psql -d softstudio_db -f init_database.sql
```

**Проверка backend локально:**

```bash
cd /var/www/105site/backend
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Откройте `http://193.201.126.66:8000/docs`. Работает — останавливайте (`Ctrl+C`).

### 3.3. Frontend (Next.js)

```bash
cd /var/www/105site/front
npm install
```

**Переменные окружения при сборке** — API должен указывать на сервер:

```bash
export API_BASE_URL=https://api.105dev.online
npm run build
```

(Домен замените на свой. Должен быть тот же, что и для backend.)

**Проверка frontend:**

```bash
npm run start
```

Остановите `Ctrl+C` после проверки.

---

## 4. Systemd: автозапуск backend

Создайте unit-файл:

```bash
nano /etc/systemd/system/105site-backend.service
```

Содержимое:

```ini
[Unit]
Description=105site FastAPI backend
After=network.target postgresql.service

[Service]
User=root
WorkingDirectory=/var/www/105site/backend
Environment="PATH=/var/www/105site/backend/venv/bin"
ExecStart=/var/www/105site/backend/venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Запуск и включение автозапуска:

```bash
systemctl daemon-reload
systemctl enable 105site-backend
systemctl start 105site-backend
systemctl status 105site-backend
```

---

## 5. Systemd: автозапуск frontend

```bash
nano /etc/systemd/system/105site-frontend.service
```

Содержимое:

```ini
[Unit]
Description=105site Next.js frontend
After=network.target

[Service]
User=root
WorkingDirectory=/var/www/105site/front
Environment="NODE_ENV=production"
Environment="API_BASE_URL=https://api.105dev.online"
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

> `API_BASE_URL` должен совпадать с доменом backend.

```bash
systemctl daemon-reload
systemctl enable 105site-frontend
systemctl start 105site-frontend
systemctl status 105site-frontend
```

---

## 6. Папка uploads

Backend раздаёт статику из `uploads`. Создайте директорию:

```bash
mkdir -p /var/www/105site/backend/uploads
chmod 755 /var/www/105site/backend/uploads
```

---

## 7. Домен и Nginx

### 7.1. DNS

В панели управления доменом (Reg.ru, Cloudflare и т.п.) добавьте A-записи:

| Запись | Тип | Значение | TTL |
|--------|-----|----------|-----|
| `105dev.online` | A | 193.201.126.66 | 300 |
| `api.105dev.online` | A | 193.201.126.66 | 300 |
| `www.105dev.online` | A или CNAME | 105dev.online | 300 |

Подождите 5–15 минут распространения DNS.

### 7.2. Установка Certbot (SSL)

```bash
apt install -y certbot python3-certbot-nginx
```

### 7.3. Конфиг Nginx

Создайте конфиг:

```bash
nano /etc/nginx/sites-available/105site
```

Содержимое (подставьте свои домены):

```nginx
# Редирект HTTP -> HTTPS
server {
    listen 80;
    server_name 105dev.online www.105dev.online api.105dev.online;
    return 301 https://$host$request_uri;
}

# Frontend (основной сайт)
server {
    listen 443 ssl http2;
    server_name 105dev.online www.105dev.online;

    ssl_certificate /etc/letsencrypt/live/105dev.online/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/105dev.online/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Backend (API)
server {
    listen 443 ssl http2;
    server_name api.105dev.online;

    ssl_certificate /etc/letsencrypt/live/105dev.online/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/105dev.online/privkey.pem;

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 7.4. Получение SSL и включение сайта

1. Сначала без SSL, чтобы certbot смог подтвердить домен:

```bash
# Временно упростите конфиг — только один server блок на порт 80
nano /etc/nginx/sites-available/105site
```

Содержимое для первичного получения сертификата:

```nginx
server {
    listen 80;
    server_name 105dev.online www.105dev.online api.105dev.online;
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    location / {
        return 200 'ok';
        add_header Content-Type text/plain;
    }
}
```

```bash
ln -sf /etc/nginx/sites-available/105site /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

2. Получение сертификата:

```bash
certbot certonly --webroot -w /var/www/html -d 105dev.online -d www.105dev.online -d api.105dev.online
```

3. Верните полный конфиг (как в п. 7.3) и перезагрузите Nginx:

```bash
nano /etc/nginx/sites-available/105site
# вставьте полный конфиг из 7.3
nginx -t && systemctl reload nginx
```

### 7.5. Автообновление SSL

```bash
certbot renew --dry-run
```

Обычно через cron уже настроено.

---

## 8. Переменные окружения (сводка)

| Переменная | Где | Описание |
|------------|-----|----------|
| `DATABASE_URL` | backend/.env | `postgresql+psycopg2://user:pass@localhost:5432/softstudio_db` |
| `SMTP_*` | backend/.env | Для отправки писем |
| `TG_LINK_*` | backend/.env | Ссылки на Telegram при регистрации |
| `API_BASE_URL` | front (при `npm run build`) | `https://api.105dev.online` |

---

## 9. Полезные команды

```bash
# Логи backend
journalctl -u 105site-backend -f

# Логи frontend
journalctl -u 105site-frontend -f

# Перезапуск
systemctl restart 105site-backend 105site-frontend

# Проверка Nginx
nginx -t
systemctl status nginx
```

---

## 10. Checklist деплоя

- [ ] Исправить SSH (`ssh-keygen -R IP`)
- [ ] Установить PostgreSQL, Python, Node, Nginx
- [ ] Создать БД и пользователя
- [ ] Выполнить `init_database.sql`
- [ ] Настроить `.env` в backend
- [ ] Собрать frontend с `API_BASE_URL=https://api.yourdomain.com`
- [ ] Создать и запустить systemd-сервисы
- [ ] Добавить A-записи DNS
- [ ] Получить SSL (certbot)
- [ ] Настроить Nginx
- [ ] Открыть https://105dev.online и https://api.105dev.online/docs
