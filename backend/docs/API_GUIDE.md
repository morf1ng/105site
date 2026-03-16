# REST API Документация

## Базовый URL

```
http://localhost:8000
```

## Интерактивная документация

Scalar API Reference доступен по адресу: `http://localhost:8000/docs`

## Аутентификация

Для большинства эндпоинтов аутентификация не требуется. Эндпоинты админки требуют заголовок `Authorization: Bearer <access_token>` и роль `admin`.

---

## Эндпоинты

### Projects

#### 1. Создать проект

**POST** `/api/projects`

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
| `stage_imgs` | file[] | ❌ | Изображения этапов |
| `result_imgs` | file[] | ❌ | Изображения результатов |

---

#### 2. Получить список проектов

**GET** `/api/projects`

Возвращает краткую информацию о всех проектах.

---

#### 3. Получить проект по ID

**GET** `/api/projects/{project_id}`

Возвращает полную информацию о проекте.

---

#### 4. Обновить проект

**PUT** `/api/projects/{project_id}`

Полное обновление проекта. **Content-Type**: `multipart/form-data`

---

#### 5. Удалить проект

**DELETE** `/api/projects/{project_id}`

Удаляет проект и все связанные данные.

---

## Courses (Курсы)

### 1. Список курсов (публичный)

**GET** `/api/courses`

Возвращает список всех курсов для выбора в форме регистрации. Аутентификация не требуется.

**Пример ответа:**
```json
[
  {"id": 1, "title": "Python для начинающих", "created_at": "2025-03-16T12:00:00"},
  {"id": 2, "title": "Веб-разработка", "created_at": "2025-03-16T12:00:00"}
]
```

---

### 2. Регистрация на курс (публичный)

**POST** `/api/courses/register`

**Content-Type**: `application/json`

Сохраняет заявку в БД и отправляет на email пользователя письмо со ссылками на Telegram-каналы.

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
| `course_id` | integer | ID курса из GET /api/courses |
| `support_type` | string | `"basic"` — 1 ссылка на TG; `"with_support"` — 2 ссылки на TG |

**Ответ:**
```json
{
  "detail": "Заявка принята. Письмо со ссылками отправлено на указанный email.",
  "id": 1
}
```

---

## Admin — Курсы (требуется Bearer токен admin)

**Заголовок:** `Authorization: Bearer <access_token>`

| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/api/admin/courses` | Список курсов |
| POST | `/api/admin/courses` | Создать курс (Form: `title`) |
| PUT | `/api/admin/courses/{course_id}` | Обновить курс (Form: `title`) |
| DELETE | `/api/admin/courses/{course_id}` | Удалить курс |
| GET | `/api/admin/course-registrations` | Список всех заявок на курсы |

**POST/PUT:** Content-Type `application/x-www-form-urlencoded`, параметр `title` — название курса.

---

## Admin — Экспорт в Excel

### Скачать таблицу заявок на курсы

**GET** `/api/admin/export/course-registrations`

Экспортирует все заявки на курсы в файл Excel (.xlsx).

**Требуется:** заголовок `Authorization: Bearer <access_token>` (роль admin).

**Ответ:**
- Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Заголовок `Content-Disposition: attachment; filename=course_registrations.xlsx`
- Файл содержит колонки: ID, ФИО, Телефон, Email, Курс, Тип (Базовый/С поддержкой), Дата регистрации

**Пример использования:**
```
GET /api/admin/export/course-registrations
Authorization: Bearer <ваш_access_token>
```
Браузер или клиент автоматически скачает файл `course_registrations.xlsx`.

---

## Статические файлы

**GET** `/uploads/{filename}`

Возвращает загруженное изображение.

---

## Коды ответов

| Код | Описание |
|-----|----------|
| `200` | Успешный запрос |
| `201` | Ресурс создан |
| `400` | Неверный запрос (валидация) |
| `401` | Не авторизован |
| `403` | Доступ запрещён |
| `404` | Ресурс не найден |
| `500` | Внутренняя ошибка сервера |
