const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Get all events
router.get('/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Join an event
router.post('/events/:id/join', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    // TODO: Add user to event participants
    res.json({ message: 'Successfully joined event' });
  } catch (error) {
    console.error('Error joining event:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 