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

