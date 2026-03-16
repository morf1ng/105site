# API Курсов и заявок на курсы

## Публичные эндпоинты (без авторизации)

### GET /api/courses
Получить список всех курсов.

**Ответ:**
```json
[
  {"id": 1, "title": "Название курса", "created_at": "2025-03-16T12:00:00"},
  {"id": 2, "title": "Другой курс", "created_at": "2025-03-16T12:00:00"}
]
```

---

### POST /api/courses/register
Регистрация на курс. Сохраняет заявку в БД и отправляет email пользователю со ссылками на Telegram-каналы.

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
| full_name | string | ФИО |
| phone | string | Номер телефона |
| email | string | Email (на него придёт письмо со ссылками) |
| course_id | int | ID курса из GET /api/courses |
| support_type | string | `"basic"` — 1 ссылка на TG-канал, `"with_support"` — 2 ссылки |

**Ответ 200:**
```json
{
  "detail": "Заявка принята. Письмо со ссылками отправлено на указанный email.",
  "id": 1
}
```

**Ошибки:**
- `400` — support_type не `basic` или `with_support`
- `404` — курс не найден

---

## Админ-эндпоинты (требуют JWT admin)

### GET /api/admin/courses
Список курсов (то же, что публичный, но с проверкой прав).

### POST /api/admin/courses
Создать курс.

**Content-Type:** `application/x-www-form-urlencoded` или `multipart/form-data`

**Параметры:**
- `title` — название курса (обязательно)

### PUT /api/admin/courses/{course_id}
Обновить курс.
- `title` — новое название

### DELETE /api/admin/courses/{course_id}
Удалить курс.

### GET /api/admin/course-registrations
Список всех заявок на курсы.

**Ответ:**
```json
[
  {
    "id": 1,
    "full_name": "Иванов Иван",
    "phone": "+79991234567",
    "email": "user@example.com",
    "course_id": 1,
    "course_title": "Название курса",
    "support_type": "basic",
    "created_at": "2025-03-16T12:00:00"
  }
]
```

---

## Настройка email

В `.env` укажите:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=ваш-пароль-приложения
SMTP_FROM=your-email@gmail.com

TG_LINK_BASIC=https://t.me/ваш_базовый_канал
TG_LINK_SUPPORT_1=https://t.me/канал_поддержки_1
TG_LINK_SUPPORT_2=https://t.me/канал_поддержки_2
```

Если SMTP не настроен, заявки всё равно сохраняются в БД, но письма не отправляются.
