const db = require('../config/database');
const User = require('./User');
const Class = require('./Class');
const Schedule = require('./Schedule');
const Booking = require('./Booking');
const Subscription = require('./Subscription');
const Payment = require('./Payment');
const Notification = require('./Notification');

// Ассоциации для Schedule
Schedule.belongsTo(Class, { foreignKey: 'class_id', as: 'class' });
Schedule.belongsTo(User, { foreignKey: 'trainer_id', as: 'trainer' });
User.hasMany(Schedule, { foreignKey: 'trainer_id', as: 'trainerSchedules' });
Class.hasMany(Schedule, { foreignKey: 'class_id', as: 'schedules' });

// Ассоциации для Booking
Booking.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Booking.belongsTo(Schedule, { foreignKey: 'schedule_id', as: 'schedule' });
User.hasMany(Booking, { foreignKey: 'user_id', as: 'bookings' });
Schedule.hasMany(Booking, { foreignKey: 'schedule_id', as: 'bookings' });

// Ассоциации для Subscription
Subscription.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Subscription, { foreignKey: 'user_id', as: 'subscriptions' });

// Ассоциации для Payment
Payment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Payment.belongsTo(Subscription, { foreignKey: 'subscription_id', as: 'subscription' });
User.hasMany(Payment, { foreignKey: 'user_id', as: 'payments' });
Subscription.hasMany(Payment, { foreignKey: 'subscription_id', as: 'payments' });

// Ассоциации для Notification
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });

if (process.env.NODE_ENV !== 'production') {
  console.log('Models loaded:', {
    User: !!User,
    Class: !!Class,
    Schedule: !!Schedule,
    Booking: !!Booking,
    Subscription: !!Subscription,
    Payment: !!Payment,
    Notification: !!Notification
  });
}

module.exports = {
  db,
  User,
  Class,
  Schedule,
  Booking,
  Subscription,
  Payment,
  Notification
};