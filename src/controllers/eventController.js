const { validationResult } = require('express-validator');
const Event = require('../models/Event');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Email configuration
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Create new event
exports.createEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      description,
      date,
      time,
      areaOfEvaluation,
      gradeLevel,
      location,
      maxParticipants
    } = req.body;

    const event = new Event({
      title,
      description,
      date,
      time,
      areaOfEvaluation,
      gradeLevel,
      location,
      maxParticipants,
      createdBy: req.user.id
    });

    await event.save();

    // Find users who match the event criteria
    const matchingUsers = await User.find({
      preferredArea: areaOfEvaluation,
      preferredGradeLevel: gradeLevel,
      isEmailVerified: true
    });

    // Send notification emails to matching users
    for (const user of matchingUsers) {
      await transporter.sendMail({
        to: user.depedEmail,
        subject: 'New Evaluation Event Available',
        html: `
          <h2>New Evaluation Event: ${title}</h2>
          <p>Date: ${date}</p>
          <p>Time: ${time}</p>
          <p>Location: ${location}</p>
          <p>Area of Evaluation: ${areaOfEvaluation}</p>
          <p>Grade Level: ${gradeLevel}</p>
          <p>Click here to view details and register: ${process.env.FRONTEND_URL}/events/${event._id}</p>
        `
      });
    }

    res.status(201).json(event);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error during event creation' });
  }
};

// Get all events
exports.getEvents = async (req, res) => {
  try {
    const { status, areaOfEvaluation, gradeLevel } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (areaOfEvaluation) filter.areaOfEvaluation = areaOfEvaluation;
    if (gradeLevel) filter.gradeLevel = gradeLevel;

    const events = await Event.find(filter)
      .populate('createdBy', 'fullName')
      .sort({ date: 1 });

    res.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error while fetching events' });
  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'fullName')
      .populate('participants.user', 'fullName depedEmail');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: 'Server error while fetching event' });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Only admin or event creator can update
    if (req.user.role !== 'admin' && event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(updatedEvent);
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Server error while updating event' });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Only admin or event creator can delete
    if (req.user.role !== 'admin' && event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await event.remove();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Server error while deleting event' });
  }
};

// Register for event
exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if event is full
    if (event.participants.length >= event.maxParticipants) {
      return res.status(400).json({ message: 'Event is already full' });
    }

    // Check if user is already registered
    const isRegistered = event.participants.some(
      p => p.user.toString() === req.user.id
    );
    if (isRegistered) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    // Add user to participants
    event.participants.push({
      user: req.user.id,
      note: req.body.note
    });

    await event.save();

    // Send confirmation email
    const user = await User.findById(req.user.id);
    await transporter.sendMail({
      to: user.depedEmail,
      subject: 'Event Registration Confirmation',
      html: `
        <h2>Registration Confirmed: ${event.title}</h2>
        <p>Date: ${event.date}</p>
        <p>Time: ${event.time}</p>
        <p>Location: ${event.location}</p>
        <p>Please confirm your attendance before the event.</p>
      `
    });

    res.json(event);
  } catch (error) {
    console.error('Event registration error:', error);
    res.status(500).json({ message: 'Server error during event registration' });
  }
};

// Confirm attendance
exports.confirmAttendance = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const participant = event.participants.find(
      p => p.user.toString() === req.user.id
    );
    if (!participant) {
      return res.status(404).json({ message: 'Not registered for this event' });
    }

    participant.confirmationStatus = 'confirmed';
    participant.confirmedAt = Date.now();

    await event.save();
    res.json(event);
  } catch (error) {
    console.error('Attendance confirmation error:', error);
    res.status(500).json({ message: 'Server error during attendance confirmation' });
  }
}; 