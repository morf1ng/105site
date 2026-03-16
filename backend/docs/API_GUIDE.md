# REST API Документация

## Базовый URL

```
http://localhost:8000
```

## Интерактивная документация

Swagger UI доступен по адресу: `http://localhost:8000/docs`

## Аутентификация

В текущей версии аутентификация не требуется.

---

## Эндпоинты

### Projects

#### 1. Создать проект

**POST** `/projects`

Создание нового проекта со всеми вложенными сущностями.

**Content-Type**: `multipart/form-data`

**Параметры запроса:**

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| `title` | string | ✅ | Название проекта |
| `url` | string | ✅ | URL проекта |
| `target` | string | ✅ | Цель проекта |
| `task` | string | ✅ | Задача проекта |
| `preview_img` | file | ❌ | Превью изображение |
| `tablet_img` | file | ❌ | Изображение на планшете |
| `smartphone_img` | file | ❌ | Изображение на смартфоне |
| `main_img` | file | ❌ | Главное изображение |
| `about_company` | string (JSON) | ✅ | Информация о компании |
| `stages` | string (JSON) | ✅ | Массив этапов проекта |
| `result` | string (JSON) | ✅ | Результат проекта |
| `progress` | string (JSON) | ✅ | Массив показателей прогресса |
| `stage_imgs` | file[] | ❌ | Изображения этапов (порядок должен соответствовать массиву `stages`) |
| `result_imgs` | file[] | ❌ | Изображения результатов (соответствуют `result.images`) |

**Формат JSON-полей:**

**about_company:**
```json
{
  "title": "ООО DagCode",
  "description": "Описание компании"
}
```

**stages:**
```json
[
  {
    "title": "Этап 1",
    "description": "Описание этапа",
    "img": "image.png"
  }
]
```

**result:**
```json
{
  "title": "Результат проекта",
  "description": "Описание результата",
  "images": [
    {
      "type": "notebook",
      "img": "image.png"
    }
  ]
}
```

**progress:**
```json
[
  {
    "digit": 1,
    "text": "Начало проекта"
  }
]
```

**Пример ответа:**
```json
{
  "id": 1,
  "title": "Тестовый проект",
  "url": "https://example.com",
  "preview_img": "preview.png",
  "tablet_img": "tablet.png",
  "smartphone_img": "smartphone.png",
  "main_img": "main.png",
  "target": "Цель проекта",
  "task": "Задача проекта",
  "about_company": {
    "title": "ООО DagCode",
    "description": "Описание компании"
  },
  "stages": [
    {
      "title": "Этап 1",
      "description": "Описание этапа",
      "img": "stages/stage1.png"
    }
  ],
  "result": {
    "title": "Результат проекта",
    "description": "Описание результата",
    "images": [
      {
        "type": "notebook",
        "img": "results/result1.png"
      }
    ]
  },
  "progress": [
    {
      "digit": 1,
      "text": "Начало проекта"
    }
  ]
}
```

---

#### 2. Получить список проектов

**GET** `/projects`

Возвращает краткую информацию о всех проектах.

**Пример ответа:**
```json
[
  {
    "id": 1,
    "title": "Тестовый проект"
  },
  {
    "id": 2,
    "title": "Другой проект"
  }
]
```

---

#### 3. Получить проект по ID

**GET** `/projects/{project_id}`

Возвращает полную информацию о проекте со всеми вложенными сущностями.

**Параметры пути:**

| Параметр | Тип | Описание |
|----------|-----|----------|
| `project_id` | integer | ID проекта |

**Пример ответа:**
```json
{
  "id": 1,
  "title": "Тестовый проект",
  "url": "https://example.com",
  "preview_img": "preview.png",
  "tablet_img": "tablet.png",
  "smartphone_img": "smartphone.png",
  "main_img": "main.png",
  "target": "Цель проекта",
  "task": "Задача проекта",
  "about_company": {
    "title": "ООО DagCode",
    "description": "Описание компании"
  },
  "stages": [
    {
      "title": "Этап 1",
      "description": "Описание этапа",
      "img": "stage1.png"
    }
  ],
  "result": {
    "title": "Результат",
    "description": "Описание результата",
    "images": [
      {
        "type": "notebook",
        "img": "result1.png"
      }
    ]
  },
  "progress": [
    {
      "digit": 1,
      "text": "Начало проекта"
    }
  ]
}
```

---

#### 4. Обновить проект

**PUT** `/projects/{project_id}`

Полное обновление проекта со всеми вложенными сущностями. Все вложенные данные пересоздаются.

**Content-Type**: `multipart/form-data`

**Параметры пути:**

| Параметр | Тип | Описание |
|----------|-----|----------|
| `project_id` | integer | ID проекта |

**Параметры запроса:** (аналогично POST `/projects`)

**Пример ответа:**
```json
{
  "id": 1,
  "title": "Тестовый проект",
  "...": "см. структуру POST /projects"
}
```

---

#### 5. Удалить проект

**DELETE** `/projects/{project_id}`

Удаляет проект и все связанные данные (каскадное удаление).

**Параметры пути:**

| Параметр | Тип | Описание |
|----------|-----|----------|
| `project_id` | integer | ID проекта |

**Пример ответа:**
```json
{
  "detail": "Deleted"
}
```

---

## Courses (Курсы)

### 1. Получить список курсов (публичный)

**GET** `/api/courses`

Возвращает список всех курсов для выбора в форме регистрации. Аутентификация не требуется.

**Пример ответа:**
```json
[
  {"id": 1, "title": "Основы Python", "created_at": "2025-01-15T10:00:00"},
  {"id": 2, "title": "Веб-разработка", "created_at": "2025-01-16T11:00:00"}
]
```

---

### 2. Регистрация на курс (форма обратной связи)

**POST** `/api/courses/register`

**Content-Type**: `application/json`

**Тело запроса:**
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
| `email` | string | ✅ | Email (на него придёт письмо со ссылками) |
| `course_id` | integer | ✅ | ID курса из GET /api/courses |
| `support_type` | string | ✅ | `"basic"` — базовый (1 ссылка на TG) или `"with_support"` — с поддержкой (2 ссылки на TG) |

**При успехе:**
- Заявка сохраняется в БД
- На указанный email отправляется письмо:
  - при `basic` — 1 ссылка (TG_LINK_BASIC)
  - при `with_support` — 2 ссылки (TG_LINK_SUPPORT_1, TG_LINK_SUPPORT_2)

**Пример ответа (200):**
```json
{
  "detail": "Заявка принята. Письмо со ссылками отправлено на указанный email.",
  "id": 123
}
```

**Ошибки:**
- `400` — неверный `support_type` или `course_id`
- `404` — курс не найден

---

## Admin: Курсы (требуется авторизация admin)

### GET `/api/admin/courses`
Список курсов (как в публичном, но для админки).

### POST `/api/admin/courses`
**Content-Type**: `multipart/form-data`  
**Параметр:** `title` — название курса

### PUT `/api/admin/courses/{course_id}`
**Параметр:** `title` — новое название

### DELETE `/api/admin/courses/{course_id}`
Удаление курса.

### GET `/api/admin/course-registrations`
Список всех заявок на курсы (ФИО, телефон, email, курс, support_type, дата).

---

## Courses (Курсы)

### 1. Список курсов (публичный)

**GET** `/api/courses`

Возвращает список всех курсов.

**Пример ответа:**
```json
[
  {"id": 1, "title": "Python для начинающих", "created_at": "2025-01-15T10:00:00Z"},
  {"id": 2, "title": "Web-разработка", "created_at": "2025-01-16T10:00:00Z"}
]
```

---

### 2. Регистрация на курс

**POST** `/api/courses/register`

Регистрация на курс. Сохраняет заявку в БД и отправляет на email пользователя письмо со ссылками на Telegram-каналы.

- **Базовый режим** (`support_type: "basic"`) — 1 ссылка в письме
- **С поддержкой** (`support_type: "with_support"`) — 2 ссылки в письме

**Content-Type:** `application/json`

**Тело запроса:**
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
| `email` | string | ✅ | Email (на него уйдёт письмо) |
| `course_id` | integer | ✅ | ID курса |
| `support_type` | string | ✅ | `"basic"` или `"with_support"` |

**Пример ответа:**
```json
{
  "detail": "Заявка принята. Письмо со ссылками отправлено на указанный email.",
  "id": 1
}
```

---

## Admin — Курсы (требуется авторизация admin)

### 3. Список курсов (админ)

**GET** `/api/admin/courses`  
**Headers:** `Authorization: Bearer <access_token>`

### 4. Создать курс

**POST** `/api/admin/courses`  
**Content-Type:** `application/x-www-form-urlencoded` или `multipart/form-data`  
**Параметр:** `title` (string)

### 5. Обновить курс

**PUT** `/api/admin/courses/{course_id}`  
**Параметр:** `title` (string)

### 6. Удалить курс

**DELETE** `/api/admin/courses/{course_id}`

### 7. Список заявок на курсы

**GET** `/api/admin/course-registrations`  
Возвращает все заявки с полями: id, full_name, phone, email, course_id, course_title, support_type, created_at.

---

## Курсы и заявки

### 1. Получить список курсов (публичный)

**GET** `/api/courses`

Возвращает список всех курсов (без авторизации).

**Пример ответа:**
```json
[
  {"id": 1, "title": "Python для начинающих", "created_at": "2025-03-16T12:00:00Z"},
  {"id": 2, "title": "Веб-разработка", "created_at": "2025-03-16T12:00:00Z"}
]
```

---

### 2. Регистрация на курс

**POST** `/api/courses/register`

**Content-Type**: `application/json`

**Тело запроса:**
```json
{
  "full_name": "Иванов Иван Иванович",
  "phone": "+7 999 123-45-67",
  "email": "user@example.com",
  "course_id": 1,
  "support_type": "basic"
}
```

| Поле | Тип | Описание |
|------|-----|----------|
| `full_name` | string | ФИО |
| `phone` | string | Номер телефона |
| `email` | string | Email (на него придёт письмо со ссылками) |
| `course_id` | integer | ID курса |
| `support_type` | string | `"basic"` — базовый (1 ссылка на TG) или `"with_support"` — с поддержкой (2 ссылки) |

**Пример ответа:**
```json
{
  "detail": "Заявка принята. Письмо со ссылками отправлено на указанный email.",
  "id": 1
}
```

**Письмо пользователю:** при `support_type: "basic"` — одна ссылка (TG_LINK_BASIC), при `"with_support"` — две (TG_LINK_SUPPORT_1, TG_LINK_SUPPORT_2).

---

### 3. Админка: CRUD курсов

Все эндпоинты требуют авторизацию (Bearer token) и роль `admin`.

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/admin/courses` | Список курсов |
| POST | `/api/admin/courses` | Создать курс (`Form: title`) |
| PUT | `/api/admin/courses/{id}` | Обновить курс (`Form: title`) |
| DELETE | `/api/admin/courses/{id}` | Удалить курс |

### 4. Админка: Заявки на курсы

**GET** `/api/admin/course-registrations`

Список всех заявок (требуется admin).

**Пример ответа:**
```json
[
  {
    "id": 1,
    "full_name": "Иванов Иван",
    "phone": "+7 999 123-45-67",
    "email": "user@example.com",
    "course_id": 1,
    "course_title": "Python для начинающих",
    "support_type": "basic",
    "created_at": "2025-03-16T12:00:00"
  }
]
```

---

## Курсы и регистрация

### 1. Список курсов (публичный)

**GET** `/api/courses`

Возвращает все курсы для выбора в форме регистрации.

**Пример ответа:**
```json
[
  {"id": 1, "title": "Python для начинающих", "created_at": "2025-03-16T12:00:00"},
  {"id": 2, "title": "Веб-разработка", "created_at": "2025-03-16T12:00:00"}
]
```

---

### 2. Регистрация на курс

**POST** `/api/courses/register`

**Content-Type**: `application/json`

**Тело запроса:**
```json
{
  "full_name": "Иванов Иван Иванович",
  "phone": "+7 (999) 123-45-67",
  "email": "user@example.com",
  "course_id": 1,
  "support_type": "basic"
}
```

| Поле | Тип | Описание |
|------|-----|----------|
| `full_name` | string | ФИО |
| `phone` | string | Номер телефона |
| `email` | string | Email (на него отправится письмо со ссылками) |
| `course_id` | integer | ID курса из GET /api/courses |
| `support_type` | string | `"basic"` — 1 ссылка на TG; `"with_support"` — 2 ссылки на TG |

**Пример ответа:**
```json
{
  "detail": "Заявка принята. Письмо со ссылками отправлено на указанный email.",
  "id": 1
}
```

После регистрации на указанный email отправляется письмо:
- **basic**: 1 ссылка на Telegram-канал (`TG_LINK_BASIC`)
- **with_support**: 2 ссылки (`TG_LINK_SUPPORT_1`, `TG_LINK_SUPPORT_2`)

---

### 3. Курсы в админке (требуется авторизация)

**GET** `/api/admin/courses` — список курсов  
**POST** `/api/admin/courses` — создать курс (`Form: title`)  
**PUT** `/api/admin/courses/{course_id}` — обновить курс (`Form: title`)  
**DELETE** `/api/admin/courses/{course_id}` — удалить курс  

**GET** `/api/admin/course-registrations` — список всех заявок на курсы.

---

## Courses (Курсы)

### 1. Список курсов (публичный)

**GET** `/api/courses`

Возвращает все курсы для выбора в форме регистрации.

**Пример ответа:**
```json
[
  {"id": 1, "title": "Python для начинающих", "created_at": "2025-03-16T12:00:00"},
  {"id": 2, "title": "Веб-разработка", "created_at": "2025-03-16T12:00:00"}
]
```

---

### 2. Регистрация на курс

**POST** `/api/courses/register`

**Content-Type**: `application/json`

**Тело запроса:**
```json
{
  "full_name": "Иванов Иван Иванович",
  "phone": "+7 (999) 123-45-67",
  "email": "user@example.com",
  "course_id": 1,
  "support_type": "basic"
}
```

| Поле | Тип | Описание |
|------|-----|----------|
| `full_name` | string | ФИО |
| `phone` | string | Номер телефона |
| `email` | string | Email (на него придет письмо со ссылками) |
| `course_id` | integer | ID курса |
| `support_type` | string | `"basic"` — базовый (1 ссылка на TG) или `"with_support"` — с поддержкой (2 ссылки на TG) |

**Пример ответа:**
```json
{
  "detail": "Заявка принята. Письмо со ссылками отправлено на указанный email.",
  "id": 1
}
```

---

## Admin: Courses (требует авторизации admin)

**Заголовок:** `Authorization: Bearer <access_token>`

### GET `/api/admin/courses`
Список курсов.

### POST `/api/admin/courses`
**Content-Type**: `application/x-www-form-urlencoded`  
Параметр: `title` — название курса.

### PUT `/api/admin/courses/{course_id}`
Параметр: `title` — новое название.

### DELETE `/api/admin/courses/{course_id}`
Удаление курса.

### GET `/api/admin/course-registrations`
Список всех заявок на курсы.

---

## Courses (Курсы)

### 1. Получить список курсов (публичный)

**GET** `/api/courses`

Возвращает все курсы для выбора в форме регистрации.

**Пример ответа:**
```json
[
  {"id": 1, "title": "Python для начинающих", "created_at": "2025-03-16T12:00:00"},
  {"id": 2, "title": "Web-разработка", "created_at": "2025-03-16T12:00:00"}
]
```

---

### 2. Регистрация на курс

**POST** `/api/courses/register`

**Content-Type**: `application/json`

**Тело запроса:**
```json
{
  "full_name": "Иванов Иван Иванович",
  "phone": "+7 (999) 123-45-67",
  "email": "user@example.com",
  "course_id": 1,
  "support_type": "basic"
}
```

| Поле | Тип | Описание |
|------|-----|----------|
| `full_name` | string | ФИО |
| `phone` | string | Телефон |
| `email` | string | Email (на него приходит письмо со ссылками) |
| `course_id` | integer | ID курса |
| `support_type` | string | `basic` — 1 ссылка на TG; `with_support` — 2 ссылки на TG |

**Пример ответа:**
```json
{
  "detail": "Заявка принята. Письмо со ссылками отправлено на указанный email.",
  "id": 1
}
```

После регистрации на указанный email отправляется письмо со ссылками:
- **basic** — одна ссылка (TG_LINK_BASIC)
- **with_support** — две ссылки (TG_LINK_SUPPORT_1, TG_LINK_SUPPORT_2)

---

## Admin — Курсы (требуется авторизация)

**Authorization**: `Bearer <access_token>`

### GET `/api/admin/courses`

Список курсов (для админки).

### POST `/api/admin/courses`

**Content-Type**: `multipart/form-data`

| Параметр | Описание |
|----------|----------|
| `title` | Название курса |

Создание нового курса.

### PUT `/api/admin/courses/{course_id}`

**Content-Type**: `multipart/form-data`

| Параметр | Описание |
|----------|----------|
| `title` | Новое название курса |

Обновление курса.

### DELETE `/api/admin/courses/{course_id}`

Удаление курса.

### GET `/api/admin/course-registrations`

Список всех заявок на курсы (ФИО, телефон, email, курс, тип, дата).

---

## Курсы и регистрация

### 1. Список курсов (публичный)

**GET** `/api/courses`

Возвращает все курсы для выбора в форме.

**Пример ответа:**
```json
[
  {"id": 1, "title": "Курс Python", "created_at": "2025-03-16T12:00:00"},
  {"id": 2, "title": "Курс JavaScript", "created_at": "2025-03-16T12:00:00"}
]
```

---

### 2. Регистрация на курс

**POST** `/api/courses/register`

**Content-Type**: `application/json`

**Тело запроса:**
```json
{
  "full_name": "Иванов Иван Иванович",
  "phone": "+7 (999) 123-45-67",
  "email": "user@example.com",
  "course_id": 1,
  "support_type": "basic"
}
```

| Поле | Тип | Описание |
|------|-----|----------|
| `full_name` | string | ФИО |
| `phone` | string | Номер телефона |
| `email` | string | Email (на него придёт письмо со ссылками) |
| `course_id` | int | ID курса из GET /api/courses |
| `support_type` | string | `"basic"` — 1 ссылка на TG, `"with_support"` — 2 ссылки |

**Ответ при успехе:**
```json
{
  "detail": "Заявка принята. Письмо со ссылками отправлено на указанный email.",
  "id": 123
}
```

---

### 3. Админка: CRUD курсов

Все эндпоинты требуют заголовок `Authorization: Bearer <access_token>` (роль admin).

| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/api/admin/courses` | Список курсов |
| POST | `/api/admin/courses` | Создать курс (Form: `title`) |
| PUT | `/api/admin/courses/{id}` | Изменить курс (Form: `title`) |
| DELETE | `/api/admin/courses/{id}` | Удалить курс |

### 4. Админка: Заявки на курсы

**GET** `/api/admin/course-registrations`

Возвращает все заявки. Требует авторизации admin.

**Пример ответа:**
```json
[
  {
    "id": 1,
    "full_name": "Иванов Иван",
    "phone": "+79991234567",
    "email": "user@example.com",
    "course_id": 1,
    "course_title": "Курс Python",
    "support_type": "basic",
    "created_at": "2025-03-16T12:00:00"
  }
]
```

---

## Courses (Курсы)

### 1. Получить список курсов (публичный)

**GET** `/api/courses`

Возвращает список всех курсов. Без аутентификации.

**Пример ответа:**
```json
[
  {"id": 1, "title": "Курс 1", "created_at": "2025-03-16T12:00:00"},
  {"id": 2, "title": "Курс 2", "created_at": "2025-03-16T12:00:00"}
]
```

---

### 2. Регистрация на курс

**POST** `/api/courses/register`

Регистрация на курс. Сохраняет заявку в БД и отправляет на email пользователя письмо со ссылками на Telegram-каналы.

**Content-Type**: `application/json`

**Тело запроса:**
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
| `course_id` | integer | ✅ | ID курса |
| `support_type` | string | ✅ | `basic` — базовый (1 ссылка) или `with_support` — с поддержкой (2 ссылки) |

**Пример ответа:**
```json
{
  "detail": "Заявка принята. Письмо со ссылками отправлено на указанный email.",
  "id": 1
}
```

---

## Admin / Курсы (требуется Bearer токен админа)

### 3. Список курсов (админка)

**GET** `/api/admin/courses`

**Headers:** `Authorization: Bearer <access_token>`

---

### 4. Создать курс

**POST** `/api/admin/courses`

**Content-Type**: `multipart/form-data` или `application/x-www-form-urlencoded`

**Параметры:** `title` (string) — название курса

---

### 5. Обновить курс

**PUT** `/api/admin/courses/{course_id}`

**Параметры:** `title` (string) — новое название

---

### 6. Удалить курс

**DELETE** `/api/admin/courses/{course_id}`

---

### 7. Список заявок на курсы

**GET** `/api/admin/course-registrations`

Возвращает все заявки (ФИО, телефон, email, курс, тип поддержки, дата).

---

## Курсы и заявки

Префикс: `/api/courses` (публичные) и `/api/admin/courses` (требуют авторизации admin).

### 1. Получить список курсов (публично)

**GET** `/api/courses`

Возвращает все курсы для выбора в форме регистрации.

**Ответ:**
```json
[
  {"id": 1, "title": "Python для начинающих", "created_at": "2025-01-01T00:00:00"},
  {"id": 2, "title": "Веб-разработка", "created_at": "2025-01-02T00:00:00"}
]
```

---

### 2. Регистрация на курс (публично)

**POST** `/api/courses/register`

**Content-Type:** `application/json`

**Тело запроса:**
```json
{
  "full_name": "Иванов Иван Иванович",
  "phone": "+7 (999) 123-45-67",
  "email": "user@example.com",
  "course_id": 1,
  "support_type": "basic"
}
```

| Поле | Тип | Описание |
|------|-----|----------|
| `full_name` | string | ФИО |
| `phone` | string | Номер телефона |
| `email` | string | Email (на него придёт письмо со ссылками) |
| `course_id` | int | ID курса из списка |
| `support_type` | string | `"basic"` — базовый (1 ссылка на TG), `"with_support"` — с поддержкой (2 ссылки) |

**Ответ:**
```json
{
  "detail": "Заявка принята. Письмо со ссылками отправлено на указанный email.",
  "id": 42
}
```

После регистрации на указанный email отправляется письмо:
- **basic** — 1 ссылка на TG-канал (`TG_LINK_BASIC`)
- **with_support** — 2 ссылки (`TG_LINK_SUPPORT_1`, `TG_LINK_SUPPORT_2`)

---

### 3. Админ: список курсов

**GET** `/api/admin/courses` — требуется Bearer-токен admin.

---

### 4. Админ: создать курс

**POST** `/api/admin/courses`

**Content-Type:** `application/x-www-form-urlencoded` или `multipart/form-data`

**Параметры:** `title` — название курса.

---

### 5. Админ: обновить курс

**PUT** `/api/admin/courses/{course_id}`

**Параметры:** `title` — новое название.

---

### 6. Админ: удалить курс

**DELETE** `/api/admin/courses/{course_id}`

---

### 7. Админ: список заявок

**GET** `/api/admin/course-registrations`

Возвращает все заявки с полями: `id`, `full_name`, `phone`, `email`, `course_id`, `course_title`, `support_type`, `created_at`.

---

## Курсы

### 1. Список курсов (публичный)

**GET** `/api/courses`

Возвращает список всех курсов для выбора в форме регистрации.

**Пример ответа:**
```json
[
  {"id": 1, "title": "Python для начинающих", "created_at": "2025-01-01T00:00:00"},
  {"id": 2, "title": "Веб-разработка", "created_at": "2025-01-02T00:00:00"}
]
```

---

### 2. Регистрация на курс

**POST** `/api/courses/register`

**Content-Type**: `application/json`

| Параметр | Тип | Описание |
|----------|-----|----------|
| `full_name` | string | ФИО |
| `phone` | string | Телефон |
| `email` | string | Email (на него придёт письмо со ссылками) |
| `course_id` | integer | ID курса |
| `support_type` | string | `"basic"` — базовый (1 ссылка на TG) или `"with_support"` — с поддержкой (2 ссылки) |

**Пример запроса:**
```json
{
  "full_name": "Иванов Иван Иванович",
  "phone": "+7 (999) 123-45-67",
  "email": "user@example.com",
  "course_id": 1,
  "support_type": "basic"
}
```

**Пример ответа:**
```json
{
  "detail": "Заявка принята. Письмо со ссылками отправлено на указанный email.",
  "id": 1
}
```

После регистрации на указанный email отправляется письмо: при `basic` — 1 ссылка на TG-канал, при `with_support` — 2 ссылки. Ссылки задаются в `.env`: `TG_LINK_BASIC`, `TG_LINK_SUPPORT_1`, `TG_LINK_SUPPORT_2`.

---

## Админка: Курсы (требуется авторизация admin)

### GET /api/admin/courses
Список курсов.

### POST /api/admin/courses
**Form**: `title` — название курса.

### PUT /api/admin/courses/{course_id}
**Form**: `title` — новое название.

### DELETE /api/admin/courses/{course_id}
Удаление курса.

### GET /api/admin/course-registrations
Список заявок (ФИО, телефон, email, курс, тип, дата).

---

## Статические файлы

### Получить изображение

**GET** `/uploads/{filename}`

Возвращает загруженное изображение.

**Пример:**
```
GET /uploads/preview.png
```

---

## Коды ответов

| Код | Описание |
|-----|----------|
| `200` | Успешный запрос |
| `201` | Ресурс создан |
| `400` | Неверный запрос (валидация) |
| `404` | Ресурс не найден |
| `500` | Внутренняя ошибка сервера |

---

**Примеры ошибок:**

- `400 Bad Request`: Невалидный JSON в одном из полей
- `404 Not Found`: Проект с указанным ID не найден
- `500 Internal Server Error`: Внутренняя ошибка сервера

