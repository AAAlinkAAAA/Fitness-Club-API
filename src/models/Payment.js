// src/models/Payment.js
const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Payment = db.define('Payment', {
  payment_id: {
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
  subscription_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'subscriptions',
      key: 'subscription_id'
    }
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  payment_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  payment_method: {
    type: DataTypes.ENUM('card', 'paypal', 'mock'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('completed', 'failed', 'pending'),
    allowNull: false,
    defaultValue: 'pending'
  },
  transaction_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'payments',
  timestamps: true,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['subscription_id'] },
    { fields: ['payment_date'] },
    { fields: ['transaction_id'] }
  ]
});

module.exports = Payment;