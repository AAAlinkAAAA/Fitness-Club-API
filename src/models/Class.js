// src/models/Class.js
const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Class = db.define('Class', {
  class_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('yoga', 'fitness', 'cardio'),
    allowNull: false
  }
}, {
  tableName: 'classes',
  timestamps: true
});

module.exports = Class;