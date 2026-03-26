# Настройка API фронтенда → бэкенд

## Как это работает

Фронт (Next.js) ходит к FastAPI по HTTP. Все запросы идут через `src/lib/api.ts`.

```
┌─────────────────┐          HTTP/JSON           ┌─────────────────┐
│   Frontend      │  ─────────────────────────► │   Backend       │
│   Next.js       │  GET /api/projects           │   FastAPI       │
│   порт 3000     │  POST /api/auth/login        │   порт 8000     │
│                 │  POST /api/courses/register  │                 │
└─────────────────┘                              └─────────────────┘
```

**Цепочка:**
1. `api.ts` формирует полный URL: `BASE_URL` + путь (например `http://localhost:8000/api/projects`)
2. `BASE_URL` берётся из `NEXT_PUBLIC_API_BASE_URL` или по умолчанию `http://localhost:8000`
3. Для картинок из uploads используется `${BASE_URL}/uploads/…`

---

## Настройка

### 1. Локальная разработка

Backend запущен на `localhost:8000`. Ничего настраивать не нужно — используется значение по умолчанию.

Если backend на другом хосте/порту — создайте `front/.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://192.168.1.100:8000
```

### 2. Продакшен (деплой)

Перед сборкой задайте URL бэкенда:

```bash
cd front
export NEXT_PUBLIC_API_BASE_URL=https://api.105dev.online
npm run build
npm run start
```

Или создайте `.env.production`:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.105dev.online
```

> Переменные с `NEXT_PUBLIC_` встраиваются в клиентский код при сборке. Важно задать их **до** `npm run build`.

---

## Эндпоинты, которые использует фронт

| Метод | Путь | Описание |
|-------|------|----------|
| GET | /api/projects | Список проектов |
| GET | /api/projects/{id} | Проект по ID |
| POST | /api/projects | Создать проект (multipart) |
| PUT | /api/projects/{id} | Обновить проект |
| DELETE | /api/projects/{id} | Удалить проект |
| POST | /api/auth/login | Вход (form-urlencoded) |
| POST | /api/auth/refresh | Обновить токен |
| GET | /api/admin/roles | Роли |
| GET | /api/admin/users | Пользователи |
| GET | /api/courses | Список курсов |
| POST | /api/courses/register | Регистрация на курс |
| GET | /uploads/{path} | Статика (картинки) |

---

## Авторизация

После логина токены сохраняются в `localStorage`. Все защищённые запросы идут с заголовком:

```
Authorization: Bearer <access_token>
```

`api.ts` сам добавляет этот заголовок через `getAccessToken()`.

---

## CORS

Backend допускает запросы с любого origin (`allow_origins=["*"]`). В продакшене лучше ограничить:

```python
allow_origins=["https://105dev.online", "https://www.105dev.online"]
```
