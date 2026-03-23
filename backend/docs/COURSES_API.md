# API Курсов — полная документация

Базовый URL: `http://localhost:8000`  
Префикс API: `/api`

---

## 1. Публичные эндпоинты (без авторизации)

### 1.1. Получить список курсов

**GET** `/api/courses`

Возвращает все доступные курсы для выбора в форме регистрации.

**Заголовки:** не требуются

**Пример запроса:**
```http
GET /api/courses HTTP/1.1
Host: localhost:8000
```

**Пример ответа (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Python для начинающих",
    "created_at": "2025-03-16T12:00:00"
  },
  {
    "id": 2,
    "title": "Веб-разработка",
    "created_at": "2025-03-16T12:00:00"
  }
]
```

---

### 1.2. Регистрация на курс

**POST** `/api/courses/register`

Сохраняет заявку в БД и отправляет на email пользователя письмо со ссылками на Telegram-каналы.

**Content-Type:** `application/json`

**Тело запроса (JSON):**
```json
{
  "full_name": "Иванов Иван Иванович",
  "phone": "+7 (999) 123-45-67",
  "email": "user@example.com",
  "course_id": 1,
  "support_type": "basic"
}
```

| Поле | Тип | Обязательный | Описание |
|------|-----|--------------|----------|
| `full_name` | string | ✅ | ФИО |
| `phone` | string | ✅ | Номер телефона |
| `email` | string | ✅ | Email (на него придёт письмо) |
| `course_id` | integer | ✅ | ID курса из GET /api/courses |
| `support_type` | string | ✅ | `"basic"` — 1 ссылка на TG; `"with_support"` — 2 ссылки на TG |

**Пример запроса (cURL):**
```bash
curl -X POST "http://localhost:8000/api/courses/register" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Иванов Иван Иванович",
    "phone": "+7 (999) 123-45-67",
    "email": "user@example.com",
    "course_id": 1,
    "support_type": "basic"
  }'
```

**Пример ответа (200 OK):**
```json
{
  "detail": "Заявка принята. Письмо со ссылками отправлено на указанный email.",
  "id": 42
}
```

**Ошибки:**
| Код | Причина |
|-----|---------|
| 400 | `support_type` не `"basic"` или `"with_support"` |
| 404 | Курс с указанным `course_id` не найден |
| 422 | Ошибка валидации (неверный формат JSON, пропущены поля) |

---

## 2. Админ-эндпоинты (требуют авторизации)

**Заголовок:** `Authorization: Bearer <access_token>`

Получить токен: POST `/api/auth/login` (email + password).

---

### 2.1. Список курсов (админ)

**GET** `/api/admin/courses`

Возвращает все курсы (то же, что публичный, но с проверкой прав).

**Заголовки:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Пример ответа (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Python для начинающих",
    "created_at": "2025-03-16T12:00:00"
  }
]
```

---

### 2.2. Создать курс

**POST** `/api/admin/courses`

**Content-Type:** `application/x-www-form-urlencoded` или `multipart/form-data`

**Параметры (Form):**
| Параметр | Тип | Описание |
|----------|-----|----------|
| `title` | string | Название курса |

**Пример запроса (cURL):**
```bash
curl -X POST "http://localhost:8000/api/admin/courses" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "title=Новый курс"
```

**Пример ответа (200 OK):**
```json
{
  "id": 3,
  "title": "Новый курс",
  "created_at": "2025-03-16T14:30:00"
}
```

---

### 2.3. Обновить курс

**PUT** `/api/admin/courses/{course_id}`

**Content-Type:** `application/x-www-form-urlencoded` или `multipart/form-data`

**Параметры (Form):**
| Параметр | Тип | Описание |
|----------|-----|----------|
| `title` | string | Новое название курса |

**Пример запроса (cURL):**
```bash
curl -X PUT "http://localhost:8000/api/admin/courses/3" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "title=Обновлённое название"
```

**Пример ответа (200 OK):**
```json
{
  "id": 3,
  "title": "Обновлённое название",
  "created_at": "2025-03-16T14:30:00"
}
```

**Ошибки:**
| Код | Причина |
|-----|---------|
| 404 | Курс не найден |

---

### 2.4. Удалить курс

**DELETE** `/api/admin/courses/{course_id}`

**Пример запроса (cURL):**
```bash
curl -X DELETE "http://localhost:8000/api/admin/courses/3" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Пример ответа (200 OK):**
```json
{
  "detail": "Deleted"
}
```

---

### 2.5. Список заявок на курсы

**GET** `/api/admin/course-registrations`

Возвращает все заявки, отсортированные по дате (новые первые).

**Пример ответа (200 OK):**
```json
[
  {
    "id": 1,
    "full_name": "Иванов Иван Иванович",
    "phone": "+7 (999) 123-45-67",
    "email": "user@example.com",
    "course_id": 1,
    "course_title": "Python для начинающих",
    "support_type": "basic",
    "created_at": "2025-03-16T15:00:00"
  },
  {
    "id": 2,
    "full_name": "Петрова Мария",
    "phone": "+7 (999) 555-12-34",
    "email": "maria@example.com",
    "course_id": 2,
    "course_title": "Веб-разработка",
    "support_type": "with_support",
    "created_at": "2025-03-16T14:00:00"
  }
]
```

---

### 2.6. Экспорт заявок в Excel

**GET** `/api/admin/export/course-registrations`

Скачивает файл Excel (.xlsx) со всеми заявками.

**Заголовки:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Ответ:**
- Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Content-Disposition: `attachment; filename=course_registrations.xlsx`

**Колонки в Excel:**
| Колонка | Описание |
|---------|----------|
| ID | ID заявки |
| ФИО | ФИО пользователя |
| Телефон | Номер телефона |
| Email | Email |
| Курс | Название курса |
| Тип | Базовый / С поддержкой |
| Дата регистрации | Timestamp |

**Пример запроса (cURL):**
```bash
curl -X GET "http://localhost:8000/api/admin/export/course-registrations" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -o course_registrations.xlsx
```

---

## 3. Схемы данных

### Course (Курс)
```json
{
  "id": 1,
  "title": "Название курса",
  "created_at": "2025-03-16T12:00:00"
}
```

### CourseRegistrationIn (запрос на регистрацию)
```json
{
  "full_name": "string",
  "phone": "string",
  "email": "string",
  "course_id": 0,
  "support_type": "basic"
}
```

### CourseRegistration (заявка в ответе)
```json
{
  "id": 1,
  "full_name": "string",
  "phone": "string",
  "email": "string",
  "course_id": 1,
  "course_title": "string",
  "support_type": "basic",
  "created_at": "2025-03-16T12:00:00"
}
```

---

## 4. Типы support_type

| Значение | Описание | Письмо пользователю |
|----------|----------|---------------------|
| `basic` | Базовый режим | 1 ссылка (TG_LINK_BASIC) |
| `with_support` | С поддержкой | 2 ссылки (TG_LINK_SUPPORT_1, TG_LINK_SUPPORT_2) |

Ссылки настраиваются в `.env`:
```
TG_LINK_BASIC=https://t.me/your_channel
TG_LINK_SUPPORT_1=https://t.me/support_channel_1
TG_LINK_SUPPORT_2=https://t.me/support_channel_2
```

---

## 5. Коды ответов

| Код | Описание |
|-----|----------|
| 200 | Успех |
| 201 | Ресурс создан (POST) |
| 400 | Неверный запрос (например, неверный support_type) |
| 401 | Не авторизован (нет или неверный Bearer токен) |
| 403 | Доступ запрещён (нет роли admin) |
| 404 | Ресурс не найден (курс, заявка) |
| 422 | Ошибка валидации (тело запроса) |

---

## 6. Интерактивная документация

Swagger/Scalar: `http://localhost:8000/docs`
