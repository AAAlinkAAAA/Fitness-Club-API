// src/models/Notification.js
const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Notification = db.define('Notification', {
  notification_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'notifications',
  timestamps: true,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['createdAt'] }
  ]
});

module.exports = Notification;