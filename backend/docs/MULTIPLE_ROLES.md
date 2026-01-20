# Множественные роли пользователей

## Обзор

Система теперь поддерживает назначение нескольких ролей одному пользователю. Роли хранятся в виде строки с ID через запятую в поле `role_ids`.

## Изменения в структуре базы данных

### Изменения в таблице users
- Колонка `role_id` (INTEGER) заменена на `role_ids` (VARCHAR)
- В `role_ids` хранятся ID ролей через запятую, например: "1,2,3"

### Пример структуры
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    email VARCHAR NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    fullname VARCHAR,
    role_ids VARCHAR NOT NULL,  -- "1,2,3"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

## Миграция существующих данных

Для миграции существующей базы данных выполните:

```bash
python -m app.migrate_role_ids
```

Этот скрипт:
1. Преобразует колонку `role_id` в `role_ids`
2. Конвертирует существующие значения в строковый формат

## API изменения

### Создание пользователя

**Endpoint:** `POST /admin/users`

**Параметры:**
- `email` (string, обязательно)
- `password` (string, обязательно)
- `fullname` (string, опционально)
- `role_ids` (string, обязательно) - ID ролей через запятую, например: "1,2,3"

**Пример запроса:**
```bash
curl -X POST "http://localhost:8000/admin/users" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "email=user@example.com" \
  -F "password=securepass123" \
  -F "fullname=John Doe" \
  -F "role_ids=1,2"
```

### Обновление пользователя

**Endpoint:** `PUT /admin/users/{user_id}`

**Параметры:**
- `email` (string, опционально)
- `password` (string, опционально)
- `fullname` (string, опционально)
- `role_ids` (string, опционально) - ID ролей через запятую

**Пример запроса:**
```bash
curl -X PUT "http://localhost:8000/admin/users/1" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "role_ids=1,3"
```

## Изменения в аутентификации

### Токены
Токены теперь содержат массив ролей вместо одной роли:

```json
{
  "user_id": 1,
  "roles": ["admin", "editor"]
}
```

### Проверка прав доступа

Функция `role_required()` теперь проверяет наличие требуемой роли в массиве ролей пользователя:

```python
@router.get("/protected")
def protected_route(user=Depends(role_required("admin"))):
    # Доступ разрешен, если у пользователя есть роль "admin"
    return {"message": "Access granted"}
```

## Защита последнего администратора

Система защищает от случайного удаления или изменения последнего администратора:

1. **Нельзя удалить последнего админа**
2. **Нельзя убрать роль admin у последнего админа**

## Примеры использования

### Python клиент

```python
import requests

# Создание пользователя с несколькими ролями
response = requests.post(
    "http://localhost:8000/admin/users",
    headers={"Authorization": f"Bearer {token}"},
    data={
        "email": "user@example.com",
        "password": "password123",
        "fullname": "John Doe",
        "role_ids": "1,2,3"  # Роли: admin, editor, viewer
    }
)

# Обновление ролей пользователя
response = requests.put(
    "http://localhost:8000/admin/users/1",
    headers={"Authorization": f"Bearer {token}"},
    data={
        "role_ids": "1,2"  # Оставляем только admin и editor
    }
)
```

### JavaScript клиент

```javascript
// Создание пользователя с несколькими ролями
const formData = new FormData();
formData.append('email', 'user@example.com');
formData.append('password', 'password123');
formData.append('fullname', 'John Doe');
formData.append('role_ids', '1,2,3');

const response = await fetch('http://localhost:8000/admin/users', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

## Модели данных

### User модель
```python
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(Text, nullable=False)
    fullname = Column(String)
    role_ids = Column(String, nullable=False)  # "1,2,3"
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())
    
    def get_role_ids_list(self):
        """Возвращает список ID ролей как integers"""
        if not self.role_ids:
            return []
        return [int(rid.strip()) for rid in self.role_ids.split(",") if rid.strip()]
    
    def set_role_ids_list(self, role_id_list):
        """Устанавливает роли из списка integers"""
        self.role_ids = ",".join(str(rid) for rid in role_id_list)
    
    def get_roles(self, session):
        """Получает объекты Role для данного пользователя"""
        role_id_list = self.get_role_ids_list()
        if not role_id_list:
            return []
        return session.query(Role).filter(Role.id.in_(role_id_list)).all()
```

### Role модель
```python
class Role(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)
```

## Работа с ролями в коде

### Получение ролей пользователя
```python
# Получить список ID ролей
role_ids = user.get_role_ids_list()  # [1, 2, 3]

# Получить объекты Role
roles = user.get_roles(session)  # [Role(id=1, name="admin"), ...]

# Проверить наличие конкретной роли
has_admin = any(role.name == "admin" for role in user.get_roles(session))
```

### Установка ролей
```python
# Установить роли из списка
user.set_role_ids_list([1, 2, 3])

# Или напрямую через строку
user.role_ids = "1,2,3"
```
