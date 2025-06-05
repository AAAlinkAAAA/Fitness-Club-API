// src/models/Booking.js
const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Booking = db.define('Booking', {
  booking_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  schedule_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending'
  }
}, {
  tableName: 'bookings',
  timestamps: true
});

module.exports = Booking;