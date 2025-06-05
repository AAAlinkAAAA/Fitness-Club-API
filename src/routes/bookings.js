// src/routes/bookings.js
const express = require('express');
const router = express.Router();
const { Booking, Schedule, User, Class } = require('../models');

// Create a new booking
router.post('/', async (req, res) => {
  try {
    const { user_id, schedule_id, status = 'pending' } = req.body;

    if (!user_id || !schedule_id) {
      return res.status(400).json({ message: 'Missing required fields: user_id, schedule_id are required' });
    }

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const userExists = await User.findByPk(user_id);
    const scheduleExists = await Schedule.findByPk(schedule_id);

    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!scheduleExists) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    const existingBooking = await Booking.findOne({
      where: { user_id, schedule_id }
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'User already booked this schedule' });
    }

    const booking = await Booking.create({
      user_id,
      schedule_id,
      status
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
});

// Get all bookings for a user
router.get('/', async (req, res) => {
  try {
    const userId = req.query.user_id;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const bookings = await Booking.findAll({
      where: { user_id: userId },
      include: [
        { 
          model: Schedule, 
          as: 'schedule', 
          include: [
            { model: Class, as: 'class', attributes: ['class_id', 'name', 'type'] },
            { model: User, as: 'trainer', attributes: ['user_id', 'first_name', 'last_name'] }
          ]
        }
      ]
    });

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
});

module.exports = router;