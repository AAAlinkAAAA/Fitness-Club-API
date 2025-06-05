// src/models/Schedule.js
const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Schedule = db.define('Schedule', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  class_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  trainer_id: {
    type: DataTypes.UUID,
    allowNull: false
  }
}, {
  tableName: 'schedules',
  timestamps: true
});

module.exports = Schedule;