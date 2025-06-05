# Fitness Club API

Backend API для фитнес-клуба.

## Технологии

- Node.js
- Express
- Sequelize
- PostgreSQL
- JWT Authentication

## Установка и запуск

1. Установите зависимости:
```bash
npm install
```

2. Настройте базу данных:
- Создайте файл `.env` на основе `db.env`
- Настройте подключение к PostgreSQL

3. Запустите миграции:
```bash
npx sequelize-cli db:migrate
```

4. Запустите сервер:
```bash
npm run dev
```

## API Endpoints

- `POST /api/register` - Регистрация
- `POST /api/login` - Авторизация
- `GET /api/schedules` - Получение расписания
- `POST /api/bookings` - Создание бронирования
- `GET /api/bookings` - Получение списка бронирований

## Структура проекта

```
fitness-club-api/
├── src/
│   ├── models/
│   ├── routes/
│   └── public/
├── migrations/
├── seeders/
├── config/
├── server.js
└── package.json
```

## Лицензия

MIT 