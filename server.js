// server.js
const express = require('express');
const path = require('path');
const cors = require('cors'); // Добавлен CORS
const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:8080' })); // Разрешить запросы с PWA
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src', 'public')));

// Logging middleware для отладки
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} Body:`, req.body);
  next();
});

// In-memory static data
const data = {
  users: [
    { id: 'user1', name: 'Jane Smith', email: 'trainer@1.com', password: '123', role: 'trainer' }
  ],
  classes: [
    { id: 'class1', name: 'Yoga Basics', description: 'Beginner yoga', duration: 60, type: 'yoga' },
    { id: 'class2', name: 'Cardio Blast', description: 'High-intensity cardio', duration: 45, type: 'cardio' },
    { id: 'class3', name: 'Strength Training', description: 'Full-body strength', duration: 60, type: 'fitness' }
  ],
  schedules: [
    { id: 's1', date: new Date('2025-06-06T10:00:00Z').toISOString(), classId: 'class1', trainerId: 'user1' },
    { id: 's2', date: new Date('2025-06-07T12:00:00Z').toISOString(), classId: 'class2', trainerId: 'user1' },
    { id: 's3', date: new Date('2025-06-08T10:00:00Z').toISOString(), classId: 'class1', trainerId: 'user1' },
    { id: 's4', date: new Date('2025-06-10T14:00:00Z').toISOString(), classId: 'class3', trainerId: 'user1' },
    { id: 's5', date: new Date('2025-06-12T09:00:00Z').toISOString(), classId: 'class2', trainerId: 'user1' }
  ],
  bookings: [],
  subscriptions: []
};

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'public', 'index.html'));
});

// Serve static HTML files
app.get('/*.html', (req, res) => {
  const filePath = path.join(__dirname, 'src', 'public', req.path);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(`Ошибка при загрузке ${req.path}:`, err);
      res.status(404).send('Страница не найдена');
    }
  });
});

// Register user
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  console.log('Попытка регистрации:', { name, email, password }); // Отладка
  if (!name || !email || !password) {
    console.log('Ошибка: отсутствуют обязательные поля');
    return res.status(400).json({ message: 'Имя, email и пароль обязательны' });
  }
  if (data.users.find(u => u.email === email)) {
    console.log('Ошибка: пользователь уже существует');
    return res.status(400).json({ message: 'Пользователь уже существует' });
  }
  const user = { id: `user${data.users.length + 1}`, name, email, password, role: 'client' };
  data.users.push(user);
  console.log('Пользователь зарегистрирован:', user);
  res.json({ user: { id: user.id, name, email, role: user.role } });
});

// Login user
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Попытка входа:', { email, password }); // Отладка
  if (!email || !password) {
    console.log('Ошибка: отсутствуют email или пароль');
    return res.status(400).json({ message: 'Email и пароль обязательны' });
  }
  const user = data.users.find(u => u.email === email && u.password === password);
  if (!user) {
    console.log('Ошибка: неверные данные');
    return res.status(401).json({ message: 'Неверные данные' });
  }
  console.log('Вход успешен:', user);
  res.json({ user: { id: user.id, name: user.name, email, role: user.role } });
});

// Get schedules
app.get('/api/schedules', (req, res) => {
  console.log('Запрос расписания');
  res.json(data.schedules.map(s => ({
    ...s,
    class: data.classes.find(c => c.id === s.classId),
    trainer: data.users.find(u => u.id === s.trainerId)
  })));
});

// Create booking
app.post('/api/bookings', (req, res) => {
  const { userId, scheduleId } = req.body;
  console.log('Попытка бронирования:', { userId, scheduleId }); // Отладка
  if (!userId || !scheduleId) {
    console.log('Ошибка: отсутствуют userId или scheduleId');
    return res.status(400).json({ message: 'userId и scheduleId обязательны' });
  }
  const schedule = data.schedules.find(s => s.id === scheduleId);
  if (!schedule) {
    console.log('Ошибка: расписание не найдено');
    return res.status(404).json({ message: 'Расписание не найдено' });
  }
  const existingBooking = data.bookings.find(b => 
    b.userId === userId && 
    data.schedules.find(s => s.id === b.scheduleId).classId === schedule.classId &&
    new Date(data.schedules.find(s => s.id === b.scheduleId).date).toDateString() === new Date(schedule.date).toDateString()
  );
  if (existingBooking) {
    console.log('Ошибка: повторное бронирование');
    return res.status(400).json({ message: 'Вы уже забронировали это занятие на эту дату' });
  }
  const booking = { id: `b${data.bookings.length + 1}`, userId, scheduleId, status: 'pending' };
  data.bookings.push(booking);
  console.log('Бронирование создано:', booking);
  res.status(201).json(booking);
});

// Get user bookings
app.get('/api/bookings', (req, res) => {
  const userId = req.query.userId;
  console.log('Запрос бронирований:', { userId }); // Отладка
  if (!userId) {
    console.log('Ошибка: отсутствует userId');
    return res.status(400).json({ message: 'userId обязателен' });
  }
  res.json(data.bookings
    .filter(b => b.userId === userId)
    .map(b => ({
      ...b,
      schedule: data.schedules.find(s => s.id === b.scheduleId),
      class: data.classes.find(c => c.id === data.schedules.find(s => s.id === b.scheduleId)?.classId)
    })));
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

// Handle EADDRINUSE error gracefully
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Порт ${PORT} занят. Пробуем порт ${PORT + 1}...`);
    app.listen(PORT + 1, () => {
      console.log(`Сервер запущен на порту ${PORT + 1}`);
    });
  } else {
    console.error('Ошибка сервера:', error);
  }
});