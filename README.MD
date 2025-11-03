
# Full Stack Интернет-магазин электроники
Проект разработан в качестве дипломной работы и продолжает активно улучшаться.  
Приложение представляет собой полноценный интернет-магазин с клиентской и серверной частями.

## Запуск проекта

### 1. Клонирование репозитория
```bash
git clone https://github.com/LoliDuckk/online-store.git
cd online-store
```

### 2. Установка зависимостей
Установите зависимости как для клиента, так и для сервера:
```bash
cd client
npm install

cd ../server
npm install
```

### 3. Настройка окружения (.env)
Необходимо создать по одному `.env` файлу в директориях `client` и `server`.

#### Пример `.env` для **server**:
```env
PORT = 5000

DB_NAME = online_store
DB_USER = postgres
DB_PASSWORD = 123
DB_HOST = localhost
DB_PORT = 5432

JWT_SECRET_KEY=any_random_secret_jwt_key
```

#### Пример `.env` для **client**:
```env
VITE_API_URL='http://localhost:5000/'
```


### 4. Подготовка базы данных
Перед запуском сервера необходимо создать базу данных PostgreSQL.

1. Запустите PostgreSQL.  
2. Подключитесь к консоли psql (или используйте GUI вроде pgAdmin).  
3. Выполните команду для создания базы данных:
   ```sql
   CREATE DATABASE online_store;
   ```
4. Убедитесь, что имя, пользователь и пароль совпадают с данными из `.env` файла.  
5. После первого запуска сервер автоматически создаст нужные таблицы.

### 5. Запуск проекта
В одном терминале:
```bash
cd server
npm run dev
```

В другом:
```bash
cd client
npm run dev
```

## Технологии
**Frontend:** React, MobX  
**Backend:** Node.js, Express  
**Database:** PostgreSQL  
