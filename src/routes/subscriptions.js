// src/routes/subscriptions.js
const express = require('express');
const router = express.Router();
const { Subscription, User } = require('../models');

// Create a new subscription
router.post('/', async (req, res) => {
  try {
    const { user_id, type, start_date, end_date, price, status = 'active', features } = req.body;

    if (!user_id || !type || !start_date || !end_date || !price || !features) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!['basic', 'premium', 'unlimited'].includes(type)) {
      return res.status(400).json({ message: 'Invalid subscription type' });
    }

    if (!['active', 'expired', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const parsedStartDate = new Date(start_date);
    const parsedEndDate = new Date(end_date);
    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    const userExists = await User.findByPk(user_id);
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const subscription = await Subscription.create({
      user_id,
      type,
      start_date: parsedStartDate,
      end_date: parsedEndDate,
      price: Number(price),
      status,
      features
    });

    res.status(201).json(subscription);
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ message: 'Error creating subscription', error: error.message });
  }
});

// Get all subscriptions for a user
router.get('/', async (req, res) => {
  try {
    const userId = req.query.user_id;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const subscriptions = await Subscription.findAll({
      where: { user_id: userId }
    });

    res.json(subscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ message: 'Error fetching subscriptions', error: error.message });
  }
});

module.exports = router;