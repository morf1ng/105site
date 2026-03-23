# Развёртывание 105 Soft Studio на сервере

Домен: **105dev.online**
Стек: **Next.js 16 + FastAPI + PostgreSQL + Nginx + Docker**

---

## Оглавление

1. [Что такое Docker и зачем он нужен](#1-что-такое-docker-и-зачем-он-нужен)
2. [Требования к серверу](#2-требования-к-серверу)
3. [Подключение к серверу](#3-подключение-к-серверу)
4. [Установка Docker на сервер](#4-установка-docker-на-сервер)
5. [Настройка DNS домена](#5-настройка-dns-домена)
6. [Загрузка проекта на сервер](#6-загрузка-проекта-на-сервер)
7. [Настройка переменных окружения](#7-настройка-переменных-окружения)
8. [Первый запуск (без SSL)](#8-первый-запуск-без-ssl)
9. [Получение SSL-сертификата](#9-получение-ssl-сертификата)
10. [Переключение на HTTPS](#10-переключение-на-https)
11. [Проверка работоспособности](#11-проверка-работоспособности)
12. [Обновление проекта](#12-обновление-проекта)
13. [Полезные команды Docker](#13-полезные-команды-docker)
14. [Устранение проблем](#14-устранение-проблем)

---

## 1. Что такое Docker и зачем он нужен

**Docker** — это инструмент, который упаковывает приложение вместе со всеми его зависимостями в изолированные «контейнеры». Представь, что контейнер — это коробка, внутри которой лежит всё необходимое для работы программы: код, библиотеки, настройки.

**Зачем это нужно:**
- Не нужно вручную устанавливать Python, Node.js, PostgreSQL на сервер
- Одна команда — и весь проект запущен
- На любом сервере работает одинаково
- Легко обновлять и откатывать изменения

**Основные понятия:**
| Термин | Что это |
|--------|---------|
| **Image (образ)** | «Чертёж» контейнера. Создаётся из Dockerfile |
| **Container (контейнер)** | Запущенный экземпляр образа. Как запущенная программа |
| **Dockerfile** | Файл-инструкция, как собрать образ |
| **docker-compose.yml** | Файл, описывающий несколько контейнеров сразу |
| **Volume (том)** | Постоянное хранилище данных (чтобы данные не пропали при перезапуске) |

**Наш проект состоит из 5 контейнеров:**
```
┌─────────────────────────────────────────────────┐
│                  СЕРВЕР                          │
│                                                  │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐   │
│  │  Nginx   │───▶│ Frontend │    │ Certbot  │   │
│  │ :80/:443 │    │  :3000   │    │  (SSL)   │   │
│  │          │───▶│          │    │          │   │
│  │          │    └──────────┘    └──────────┘   │
│  │          │                                    │
│  │          │───▶┌──────────┐    ┌──────────┐   │
│  │          │    │ Backend  │───▶│PostgreSQL│   │
│  └──────────┘    │  :8000   │    │  :5432   │   │
│                  └──────────┘    └──────────┘   │
└─────────────────────────────────────────────────┘
```

- **Nginx** — принимает все запросы из интернета и направляет их куда нужно
- **Frontend** — Next.js сайт (то, что видит пользователь)
- **Backend** — FastAPI API (обрабатывает данные)
- **PostgreSQL** — база данных
- **Certbot** — автоматически получает и обновляет SSL-сертификат (замочек HTTPS)

---

## 2. Требования к серверу

- **ОС:** Ubuntu 22.04 / 24.04 (рекомендуется)
- **RAM:** минимум 2 ГБ (рекомендуется 4 ГБ)
- **Диск:** минимум 20 ГБ
- **Открытые порты:** 80 (HTTP), 443 (HTTPS), 22 (SSH)

---

## 3. Подключение к серверу

Открой терминал (PowerShell / Terminal) и подключись:

```bash
ssh root@IP_АДРЕС_СЕРВЕРА
```

Например:
```bash
ssh root@193.201.126.66
```

При первом подключении спросит «Are you sure?» — напиши `yes` и нажми Enter.
Затем введи пароль от сервера.

---

## 4. Установка Docker на сервер

Выполни эти команды **на сервере** по очереди:

### 4.1. Обновление системы

```bash
apt update && apt upgrade -y
```

### 4.2. Установка Docker

```bash
curl -fsSL https://get.docker.com | sh
```

### 4.3. Проверка установки

```bash
docker --version
docker compose version
```

Должно показать версии, например:
```
Docker version 27.x.x
Docker Compose version v2.x.x
```

Если `docker compose version` не работает, установи плагин отдельно:
```bash
apt install docker-compose-plugin -y
```

---

## 5. Настройка DNS домена

Зайди в панель управления DNS у своего регистратора домена (где покупал `105dev.online`) и добавь **A-записи**:

| Тип | Имя | Значение |
|-----|-----|----------|
| A | @ | IP_АДРЕС_СЕРВЕРА |
| A | www | IP_АДРЕС_СЕРВЕРА |

Замени `IP_АДРЕС_СЕРВЕРА` на реальный IP (например `193.201.126.66`).

**Проверка DNS** (подожди 5–15 минут после настройки):
```bash
ping 105dev.online
```

Если в ответе видишь свой IP — DNS настроен правильно.

---

## 6. Загрузка проекта на сервер

### Вариант A: Через Git (рекомендуется)

На сервере:
```bash
cd /root
git clone https://github.com/ТВОЙ_ЮЗЕРНЕЙМ/105site.git
cd 105site
```

### Вариант B: Через SCP (копирование файлов)

На **своём компьютере** (не на сервере):
```bash
scp -r "C:\Users\Ягияев Али\Desktop\105site" root@193.201.126.66:/root/105site
```

После загрузки зайди в папку проекта на сервере:
```bash
cd /root/105site
```

---

## 7. Настройка переменных окружения

На сервере, находясь в папке проекта (`/root/105site`):

### 7.1. Создай файл `.env`

```bash
cp .env.example .env
nano .env
```

### 7.2. Заполни значения

```env
# ===== PostgreSQL =====
POSTGRES_DB=softstudio_db
POSTGRES_USER=softstudio_user
POSTGRES_PASSWORD=ТУТ_ПРИДУМАЙ_СЛОЖНЫЙ_ПАРОЛЬ

# ===== Backend =====
SECRET_KEY=ТУТ_СЛУЧАЙНАЯ_СТРОКА
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=720
REFRESH_TOKEN_EXPIRE_DAYS=14

# ===== Frontend (build-time) =====
API_BASE_URL=https://105dev.online/api
```

### 7.3. Генерация безопасного SECRET_KEY

Выполни команду и скопируй результат в `.env`:
```bash
openssl rand -hex 32
```

### 7.4. Генерация безопасного пароля для PostgreSQL

```bash
openssl rand -base64 24
```

### 7.5. Сохранение файла

В nano: нажми `Ctrl+O` → `Enter` (сохранить) → `Ctrl+X` (выйти).

---

## 8. Первый запуск (без SSL)

SSL-сертификат нельзя получить, пока сайт не работает на порту 80. Поэтому сначала запускаем без HTTPS.

### 8.1. Подставь начальный конфиг Nginx (без SSL)

```bash
cp nginx.initial.conf nginx.conf
```

**Подожди!** Перед этим сохрани оригинальный nginx.conf с SSL:
```bash
cp nginx.conf nginx.ssl.conf
cp nginx.initial.conf nginx.conf
```

### 8.2. Запуск всех контейнеров

```bash
docker compose up -d --build
```

**Что происходит:**
- `docker compose` — управление несколькими контейнерами
- `up` — запустить
- `-d` — в фоновом режиме (detached), чтобы терминал не был занят
- `--build` — пересобрать образы из Dockerfile

Первый запуск займёт **5–10 минут** (скачиваются образы, устанавливаются зависимости).

### 8.3. Проверка

```bash
docker compose ps
```

Все контейнеры должны быть в статусе `Up` или `running`. Контейнер `certbot` может быть в статусе `Restarting` — это нормально, он заработает после получения сертификата.

Проверь, что сайт открывается: зайди в браузере на `http://105dev.online`

---

## 9. Получение SSL-сертификата

Когда сайт работает по HTTP, можно получить сертификат.

### 9.1. Получение сертификата

```bash
docker compose run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  -d 105dev.online \
  -d www.105dev.online \
  --email ТВОЯ_ПОЧТА@example.com \
  --agree-tos \
  --no-eff-email
```

Замени `ТВОЯ_ПОЧТА@example.com` на свою реальную почту (нужна для уведомлений об истечении сертификата).

Если всё прошло успешно, увидишь сообщение:
```
Successfully received certificate.
```

---

## 10. Переключение на HTTPS

### 10.1. Верни конфиг Nginx с SSL

```bash
cp nginx.ssl.conf nginx.conf
```

### 10.2. Перезапуск Nginx

```bash
docker compose restart nginx
```

### 10.3. Проверка

Открой в браузере: `https://105dev.online`

Должен быть замочек в адресной строке — значит SSL работает!

---

## 11. Проверка работоспособности

### Сайт (Frontend)
Открой `https://105dev.online` — должна загрузиться главная страница.

### API (Backend)
Открой `https://105dev.online/docs` — должна открыться документация API (Scalar UI).

### База данных
```bash
docker compose exec backend python -c "
from app.database import engine
from sqlalchemy import text
with engine.connect() as conn:
    result = conn.execute(text('SELECT 1'))
    print('DB OK:', result.scalar())
"
```

### Логи (если что-то не работает)
```bash
docker compose logs backend
docker compose logs frontend
docker compose logs nginx
docker compose logs db
```

---

## 12. Обновление проекта

Когда ты внёс изменения в код и хочешь обновить сайт на сервере:

### Вариант A: Через Git

На сервере:
```bash
cd /root/105site
git pull origin main
docker compose up -d --build
```

### Вариант B: Через SCP

На своём компьютере скопируй файлы, затем на сервере:
```bash
cd /root/105site
docker compose up -d --build
```

### Если изменения только в коде (без новых зависимостей)

Пересобрать только нужный контейнер:
```bash
# Только бэкенд
docker compose up -d --build backend

# Только фронтенд
docker compose up -d --build frontend
```

### Если изменения в .env

```bash
docker compose down
docker compose up -d
```

---

## 13. Полезные команды Docker

### Основные

| Команда | Что делает |
|---------|-----------|
| `docker compose up -d` | Запустить все контейнеры |
| `docker compose down` | Остановить все контейнеры |
| `docker compose ps` | Показать статус контейнеров |
| `docker compose logs -f` | Показать логи в реальном времени |
| `docker compose logs backend` | Логи конкретного контейнера |
| `docker compose restart nginx` | Перезапустить один контейнер |
| `docker compose up -d --build` | Пересобрать и запустить |

### Работа с базой данных

```bash
# Зайти в PostgreSQL
docker compose exec db psql -U softstudio_user -d softstudio_db

# Выполнить SQL-запрос
docker compose exec db psql -U softstudio_user -d softstudio_db -c "SELECT * FROM users;"

# Выйти из psql
\q
```

### Очистка

```bash
# Удалить неиспользуемые образы (освободить место)
docker image prune -f

# Полная очистка (ОСТОРОЖНО — удалит всё неиспользуемое)
docker system prune -f
```

### Бэкап базы данных

```bash
# Создать бэкап
docker compose exec db pg_dump -U softstudio_user softstudio_db > backup_$(date +%Y%m%d).sql

# Восстановить из бэкапа
docker compose exec -T db psql -U softstudio_user softstudio_db < backup_20260323.sql
```

---

## 14. Устранение проблем

### Контейнер не запускается

```bash
# Посмотри логи проблемного контейнера
docker compose logs backend
docker compose logs frontend

# Пересобери с нуля
docker compose down
docker compose up -d --build --force-recreate
```

### Ошибка «port already in use»

Кто-то уже занял порт. Проверь:
```bash
ss -tlnp | grep :80
ss -tlnp | grep :443
```

Убей процесс или останови другой сервер на этом порту.

### Ошибка подключения к БД

```bash
# Проверь, что контейнер БД запущен
docker compose ps db

# Проверь логи БД
docker compose logs db

# Проверь переменные окружения
docker compose exec backend env | grep DATABASE
```

### Frontend не видит Backend (ошибки CORS / Network Error)

1. Проверь, что в `.env` правильный `API_BASE_URL=https://105dev.online/api`
2. Пересобери фронтенд:
```bash
docker compose up -d --build frontend
```

### SSL-сертификат не получается

1. Убедись, что DNS настроен (пункт 5)
2. Убедись, что порт 80 открыт и сайт доступен по HTTP
3. Попробуй с флагом `--staging` для тестового сертификата:
```bash
docker compose run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  -d 105dev.online \
  --email ТВОЯ_ПОЧТА@example.com \
  --agree-tos \
  --no-eff-email \
  --staging
```

### Как полностью удалить всё и начать заново

```bash
docker compose down -v    # -v удаляет тома (ДАННЫЕ БУДУТ ПОТЕРЯНЫ!)
docker compose up -d --build
```

---

## Краткая шпаргалка (Quick Start)

```bash
# 1. Подключись к серверу
ssh root@193.201.126.66

# 2. Установи Docker
curl -fsSL https://get.docker.com | sh

# 3. Склонируй проект
git clone https://github.com/ЮЗЕРНЕЙМ/105site.git && cd 105site

# 4. Настрой .env
cp .env.example .env && nano .env

# 5. Сохрани SSL-конфиг и подставь начальный
cp nginx.conf nginx.ssl.conf && cp nginx.initial.conf nginx.conf

# 6. Запусти
docker compose up -d --build

# 7. Получи SSL
docker compose run --rm certbot certonly --webroot --webroot-path=/var/www/certbot -d 105dev.online -d www.105dev.online --email ПОЧТА@example.com --agree-tos --no-eff-email

# 8. Включи HTTPS
cp nginx.ssl.conf nginx.conf && docker compose restart nginx
```

Готово! Сайт доступен по адресу **https://105dev.online**
