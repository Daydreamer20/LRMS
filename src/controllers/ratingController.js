const { validationResult } = require('express-validator');
const Rating = require('../models/Rating');
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

// Create or update rating
exports.rateParticipant = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { eventId, participantId } = req.params;
    const { criteria, feedback } = req.body;

    // Verify event exists and is completed
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    if (event.status !== 'completed') {
      return res.status(400).json({ message: 'Can only rate participants after event completion' });
    }

    // Verify user is authorized to rate
    if (req.user.role !== 'admin' && event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to rate participants' });
    }

    // Verify participant was registered for the event
    const participant = event.participants.find(
      p => p.user.toString() === participantId && p.confirmationStatus === 'confirmed'
    );
    if (!participant) {
      return res.status(404).json({ message: 'Participant not found or did not confirm attendance' });
    }

    // Create or update rating
    let rating = await Rating.findOne({
      event: eventId,
      participant: participantId
    });

    if (rating) {
      // Update existing rating
      rating.criteria = criteria;
      rating.feedback = feedback;
      rating.updatedAt = Date.now();
    } else {
      // Create new rating
      rating = new Rating({
        event: eventId,
        participant: participantId,
        criteria,
        feedback,
        ratedBy: req.user.id
      });
    }

    await rating.save();

    // Send email notification to participant
    const user = await User.findById(participantId);
    await transporter.sendMail({
      to: user.depedEmail,
      subject: 'New Evaluation Rating',
      html: `
        <h2>Your Evaluation Rating for: ${event.title}</h2>
        <h3>Ratings:</h3>
        <ul>
          <li>Participation: ${criteria.participation}/5</li>
          <li>Contribution: ${criteria.contribution}/5</li>
          <li>Expertise: ${criteria.expertise}/5</li>
          <li>Collaboration: ${criteria.collaboration}/5</li>
        </ul>
        <h3>Overall Score: ${rating.overallScore}/5</h3>
        <h3>Feedback:</h3>
        <h4>Strengths:</h4>
        <ul>
          ${feedback.strengths.map(s => `<li>${s}</li>`).join('')}
        </ul>
        <h4>Areas for Improvement:</h4>
        <ul>
          ${feedback.areasForImprovement.map(a => `<li>${a}</li>`).join('')}
        </ul>
      `
    });

    res.json(rating);
  } catch (error) {
    console.error('Rating error:', error);
    res.status(500).json({ message: 'Server error during rating submission' });
  }
};

// Get ratings for an event
exports.getEventRatings = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Verify event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Verify user is authorized to view ratings
    if (req.user.role !== 'admin' && event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view ratings' });
    }

    const ratings = await Rating.find({ event: eventId })
      .populate('participant', 'fullName depedEmail')
      .populate('ratedBy', 'fullName');

    res.json(ratings);
  } catch (error) {
    console.error('Get ratings error:', error);
    res.status(500).json({ message: 'Server error while fetching ratings' });
  }
};

// Get ratings for a participant
exports.getParticipantRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ participant: req.user.id })
      .populate('event', 'title date')
      .populate('ratedBy', 'fullName')
      .sort({ createdAt: -1 });

    res.json(ratings);
  } catch (error) {
    console.error('Get participant ratings error:', error);
    res.status(500).json({ message: 'Server error while fetching ratings' });
  }
};

// Get rating statistics for a participant
exports.getParticipantStats = async (req, res) => {
  try {
    const ratings = await Rating.find({ participant: req.user.id });

    const stats = {
      totalEvents: ratings.length,
      averageScore: 0,
      criteriaAverages: {
        participation: 0,
        contribution: 0,
        expertise: 0,
        collaboration: 0
      }
    };

    if (ratings.length > 0) {
      // Calculate overall average
      stats.averageScore = ratings.reduce((sum, r) => sum + r.overallScore, 0) / ratings.length;

      // Calculate criteria averages
      Object.keys(stats.criteriaAverages).forEach(criterion => {
        stats.criteriaAverages[criterion] = ratings.reduce((sum, r) => sum + r.criteria[criterion], 0) / ratings.length;
      });
    }

    res.json(stats);
  } catch (error) {
    console.error('Get participant stats error:', error);
    res.status(500).json({ message: 'Server error while fetching statistics' });
  }
}; 