// src/routes/schedules.js
const express = require('express');
const router = express.Router();
const { Schedule, Class, User } = require('../models');

// Get all schedules
router.get('/', async (req, res) => {
  try {
    const schedules = await Schedule.findAll({
      include: [
        { 
          model: Class, 
          as: 'class', 
          attributes: ['class_id', 'name', 'description', 'type'],
          required: false
        },
        { 
          model: User, 
          as: 'trainer', 
          attributes: ['user_id', 'first_name', 'last_name'],
          required: false
        }
      ]
    });
    res.json(schedules);
  } catch (error) {
    console.error('Error fetching schedules:', {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ message: 'Error fetching schedules', error: error.message });
  }
});

// Create a new schedule
router.post('/', async (req, res) => {
  try {
    const { date, class_id, trainer_id } = req.body;

    if (!date || !class_id || !trainer_id) {
      return res.status(400).json({ message: 'Missing required fields: date, class_id, trainer_id are required' });
    }

    // Validate date
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    // Verify class and trainer exist
    const classExists = await Class.findByPk(class_id);
    const trainerExists = await User.findByPk(trainer_id);
    if (!classExists) {
      return res.status(404).json({ message: 'Class not found' });
    }
    if (!trainerExists) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    const schedule = await Schedule.create({
      date: parsedDate,
      class_id,
      trainer_id
    });

    res.status(201).json(schedule);
  } catch (error) {
    console.error('Error creating schedule:', {
      message: error.message,
      stack: error.stack,
      data: req.body
    });
    res.status(500).json({ message: 'Error creating schedule', error: error.message });
  }
});

module.exports = router;