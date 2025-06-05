// src/routes/notifications.js
const express = require('express');
const router = express.Router();
const { Notification, User } = require('../models');

// Create a new notification
router.post('/', async (req, res) => {
  try {
    const { user_id, message } = req.body;

    if (!user_id || !message) {
      return res.status(400).json({ message: 'Missing required fields: user_id, message are required' });
    }

    const userExists = await User.findByPk(user_id);
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const notification = await Notification.create({
      user_id,
      message,
      is_read: false
    });

    res.status(201).json(notification);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ message: 'Error creating notification', error: error.message });
  }
});

// Get all notifications for a user
router.get('/', async (req, res) => {
  try {
    const userId = req.query.user_id;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const notifications = await Notification.findAll({
      where: { user_id: userId }
    });

    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
});

module.exports = router;