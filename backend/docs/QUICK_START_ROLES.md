# Быстрый старт: Множественные роли

## Как это работает

Роли пользователя хранятся в поле `role_ids` как строка с ID через запятую.

**Пример:** `"1,2,3"` означает, что у пользователя есть роли с ID 1, 2 и 3.

## Примеры использования API

### 1. Создание пользователя с одной ролью

```bash
curl -X POST "http://localhost:8000/admin/users" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "email=user@example.com" \
  -F "password=securepass123" \
  -F "fullname=Иван Иванов" \
  -F "role_ids=1"
```

### 2. Создание пользователя с несколькими ролями

```bash
curl -X POST "http://localhost:8000/admin/users" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "email=admin@example.com" \
  -F "password=securepass123" \
  -F "fullname=Админ Админов" \
  -F "role_ids=1,2,3"
```

### 3. Обновление ролей пользователя

```bash
curl -X PUT "http://localhost:8000/admin/users/1" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "role_ids=2,3"
```

### 4. Добавление роли к существующим

Сначала получите текущие роли:
```bash
curl -X GET "http://localhost:8000/admin/users/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Затем обновите, добавив новую роль:
```bash
# Если было "1,2", станет "1,2,3"
curl -X PUT "http://localhost:8000/admin/users/1" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "role_ids=1,2,3"
```

## Примеры в Python

### Создание пользователя

```python
import requests

token = "YOUR_ACCESS_TOKEN"
url = "http://localhost:8000/admin/users"

data = {
    "email": "user@example.com",
    "password": "securepass123",
    "fullname": "Иван Иванов",
    "role_ids": "1,2,3"  # Несколько ролей
}

response = requests.post(
    url,
    headers={"Authorization": f"Bearer {token}"},
    data=data
)

print(response.json())
```

### Обновление ролей

```python
import requests

token = "YOUR_ACCESS_TOKEN"
user_id = 1
url = f"http://localhost:8000/admin/users/{user_id}"

data = {
    "role_ids": "1,3"  # Оставляем только роли 1 и 3
}

response = requests.put(
    url,
    headers={"Authorization": f"Bearer {token}"},
    data=data
)

print(response.json())
```

## Примеры в JavaScript

### Создание пользователя

```javascript
const token = "YOUR_ACCESS_TOKEN";
const url = "http://localhost:8000/admin/users";

const formData = new FormData();
formData.append("email", "user@example.com");
formData.append("password", "securepass123");
formData.append("fullname", "Иван Иванов");
formData.append("role_ids", "1,2,3");

const response = await fetch(url, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${token}`
  },
  body: formData
});

const data = await response.json();
console.log(data);
```

### Обновление ролей

```javascript
const token = "YOUR_ACCESS_TOKEN";
const userId = 1;
const url = `http://localhost:8000/admin/users/${userId}`;

const formData = new FormData();
formData.append("role_ids", "1,3");

const response = await fetch(url, {
  method: "PUT",
  headers: {
    "Authorization": `Bearer ${token}`
  },
  body: formData
});

const data = await response.json();
console.log(data);
```

## Работа с ролями в коде приложения

### Получение ролей пользователя

```python
from app.models import User
from app.database import get_session

# Получить пользователя
user = session.query(User).filter(User.id == 1).first()

# Получить список ID ролей
role_ids = user.get_role_ids_list()  # [1, 2, 3]

# Получить объекты Role
roles = user.get_roles(session)
for role in roles:
    print(f"Role: {role.name}")

# Проверить наличие конкретной роли
has_admin = any(role.name == "admin" for role in roles)
```

### Установка ролей

```python
# Способ 1: Через метод
user.set_role_ids_list([1, 2, 3])

# Способ 2: Напрямую
user.role_ids = "1,2,3"

session.commit()
```

## Важные замечания

1. **Формат:** ID ролей должны быть разделены запятыми без пробелов или с пробелами (они будут удалены)
   - ✅ Правильно: `"1,2,3"` или `"1, 2, 3"`
   - ❌ Неправильно: `"1 2 3"` или `"1;2;3"`

2. **Минимум одна роль:** Каждый пользователь должен иметь хотя бы одну роль

3. **Защита админа:** Нельзя удалить или убрать роль admin у последнего администратора

4. **Проверка существования:** Все указанные ID ролей должны существовать в таблице `roles`

## Типичные ошибки

### Ошибка: "Invalid role_ids format"
```bash
# Неправильно
role_ids=abc

# Правильно
role_ids=1,2,3
```

### Ошибка: "At least one role is required"
```bash
# Неправильно
role_ids=

# Правильно
role_ids=1
```

### Ошибка: "One or more roles do not exist"
```bash
# Неправильно (роли с ID 999 не существует)
role_ids=1,999

# Правильно (все роли существуют)
role_ids=1,2,3
```
