// src/data/db.js
const users = [
  {
    user_id: 'user_1',
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'trainer@fitnesscenter.com',
    password: '$2a$10$z7Qz3X9K6Y8L9P0M2N3O4P5Q6R7S8T9U0V1W2X3Y4Z5A6B7C8D9E0', // trainer123
    phone: '0987654321',
    role: 'trainer'
  }
];

const classes = [
  { class_id: 'class_1', name: 'Yoga Basics', description: 'Beginner yoga class', duration: 60, type: 'yoga' },
  { class_id: 'class_2', name: 'Cardio Blast', description: 'High-intensity cardio', duration: 45, type: 'cardio' },
  { class_id: 'class_3', name: 'Strength Training', description: 'Full-body strength', duration: 60, type: 'fitness' }
];

const schedules = [
  { schedule_id: 'schedule_1', date: new Date(Date.now() + 86400000).toISOString(), class_id: 'class_1', trainer_id: 'user_1' },
  { schedule_id: 'schedule_2', date: new Date(Date.now() + 2 * 86400000).toISOString(), class_id: 'class_2', trainer_id: 'user_1' },
  { schedule_id: 'schedule_3', date: new Date(Date.now() + 3 * 86400000).toISOString(), class_id: 'class_3', trainer_id: 'user_1' }
];

const bookings = [];
const subscriptions = [];

module.exports = { users, classes, schedules, bookings, subscriptions };