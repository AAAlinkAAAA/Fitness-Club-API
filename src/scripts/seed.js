const bcrypt = require('bcryptjs');
const { User, Class, Schedule, Subscription, Payment, Booking } = require('../models');
const sequelize = require('../config/database');

async function seed() {
  try {
    // Sync database
    await sequelize.sync({ force: true });
    console.log('Database synced');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      email: 'admin@fitnesscenter.com',
      password_hash: adminPassword,
      first_name: 'Admin',
      last_name: 'User',
      role: 'admin'
    });
    console.log('Admin user created');

    // Create trainer
    const trainerPassword = await bcrypt.hash('trainer123', 10);
    const trainer = await User.create({
      email: 'trainer@fitnesscenter.com',
      password_hash: trainerPassword,
      first_name: 'John',
      last_name: 'Doe',
      role: 'trainer'
    });
    console.log('Trainer created');

    // Create client
    const clientPassword = await bcrypt.hash('client123', 10);
    const client = await User.create({
      email: 'client@fitnesscenter.com',
      password_hash: clientPassword,
      first_name: 'Jane',
      last_name: 'Smith',
      role: 'client'
    });
    console.log('Client created');

    // Create classes
    const classes = await Class.bulkCreate([
      {
        name: 'Йога',
        description: 'Расслабляющий класс йоги для всех уровней подготовки',
        duration: 60,
        type: 'yoga'
      },
      {
        name: 'HIIT',
        description: 'Высокоинтенсивная интервальная тренировка',
        duration: 45,
        type: 'fitness'
      },
      {
        name: 'Кардио',
        description: 'Интенсивная кардио тренировка',
        duration: 50,
        type: 'cardio'
      },
      {
        name: 'Кроссфит',
        description: 'Функциональная тренировка высокой интенсивности',
        duration: 60
      },
      {
        name: 'Стретчинг',
        description: 'Растяжка и улучшение гибкости',
        duration: 45
      },
      {
        name: 'Танцевальная аэробика',
        description: 'Кардио тренировка в танцевальном стиле',
        duration: 55
      }
    ]);
    console.log('Classes created');

    // Create schedules
    const now = new Date();
    const schedules = await Schedule.bulkCreate([
      {
        class_id: classes[0].class_id,
        trainer_id: trainer.user_id,
        start_time: new Date(now.getTime() + 24 * 60 * 60 * 1000), // завтра
        end_time: new Date(now.getTime() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
        room: 'Зал 1',
        max_capacity: 15
      },
      {
        class_id: classes[1].class_id,
        trainer_id: trainer.user_id,
        start_time: new Date(now.getTime() + 48 * 60 * 60 * 1000), // послезавтра
        end_time: new Date(now.getTime() + 48 * 60 * 60 * 1000 + 45 * 60 * 1000),
        room: 'Зал 2',
        max_capacity: 20
      },
      {
        class_id: classes[2].class_id,
        trainer_id: trainer.user_id,
        start_time: new Date(now.getTime() + 72 * 60 * 60 * 1000), // через 3 дня
        end_time: new Date(now.getTime() + 72 * 60 * 60 * 1000 + 50 * 60 * 1000),
        room: 'Зал 1',
        max_capacity: 12
      },
      {
        class_id: classes[3].class_id,
        trainer_id: trainer.user_id,
        start_time: new Date(now.getTime() + 96 * 60 * 60 * 1000), // через 4 дня
        end_time: new Date(now.getTime() + 96 * 60 * 60 * 1000 + 60 * 60 * 1000),
        room: 'Зал 3',
        max_capacity: 15
      },
      {
        class_id: classes[4].class_id,
        trainer_id: trainer.user_id,
        start_time: new Date(now.getTime() + 120 * 60 * 60 * 1000), // через 5 дней
        end_time: new Date(now.getTime() + 120 * 60 * 60 * 1000 + 45 * 60 * 1000),
        room: 'Зал 2',
        max_capacity: 15
      },
      {
        class_id: classes[5].class_id,
        trainer_id: trainer.user_id,
        start_time: new Date(now.getTime() + 144 * 60 * 60 * 1000), // через 6 дней
        end_time: new Date(now.getTime() + 144 * 60 * 60 * 1000 + 55 * 60 * 1000),
        room: 'Зал 1',
        max_capacity: 20
      }
    ]);
    console.log('Schedules created');

    // Create subscription for client
    const subscription = await Subscription.create({
      user_id: client.user_id,
      type: 'premium',
      start_date: new Date(),
      end_date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      price: 99.99,
      status: 'active'
    });
    console.log('Subscription created');

    // Create payment for subscription
    const payment = await Payment.create({
      user_id: client.user_id,
      subscription_id: subscription.subscription_id,
      amount: 99.99,
      payment_date: new Date(),
      payment_method: 'card',
      status: 'completed',
      transaction_id: 'sample_transaction_123'
    });
    console.log('Payment created');

    // Create bookings
    const bookings = await Booking.bulkCreate([
      {
        user_id: client.user_id,
        schedule_id: schedules[0].schedule_id,
        status: 'confirmed'
      },
      {
        user_id: client.user_id,
        schedule_id: schedules[1].schedule_id,
        status: 'confirmed'
      },
      {
        user_id: client.user_id,
        schedule_id: schedules[2].schedule_id,
        status: 'confirmed'
      },
      {
        user_id: client.user_id,
        schedule_id: schedules[3].schedule_id,
        status: 'confirmed'
      },
      {
        user_id: client.user_id,
        schedule_id: schedules[4].schedule_id,
        status: 'confirmed'
      },
      {
        user_id: client.user_id,
        schedule_id: schedules[5].schedule_id,
        status: 'confirmed'
      }
    ]);
    console.log('Bookings created');

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed(); 