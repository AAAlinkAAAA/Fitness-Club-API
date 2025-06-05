// src/models/Subscription.js
const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Subscription = db.define('Subscription', {
  subscription_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('basic', 'premium', 'unlimited'),
    allowNull: false
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'expired', 'cancelled'),
    allowNull: false,
    defaultValue: 'active'
  },
  features: {
    type: DataTypes.JSON,
    allowNull: false
  }
}, {
  tableName: 'subscriptions',
  timestamps: true
});

module.exports = Subscription;