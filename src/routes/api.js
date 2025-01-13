const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const eventController = require('../controllers/eventController');
const ratingController = require('../controllers/ratingController');
const { auth, admin, eventAccess } = require('../middleware/auth');
const {
  registerValidation,
  loginValidation,
  eventValidation,
  ratingValidation
} = require('../middleware/validation');

// Auth routes
router.post('/auth/register', registerValidation, authController.register);
router.post('/auth/login', loginValidation, authController.login);
router.get('/auth/verify-email/:token', authController.verifyEmail);
router.get('/auth/me', auth, authController.getCurrentUser);

// Event routes
router.post('/events', [auth, admin, eventValidation], eventController.createEvent);
router.get('/events', auth, eventController.getEvents);
router.get('/events/:id', auth, eventController.getEventById);
router.put('/events/:id', [auth, eventAccess, eventValidation], eventController.updateEvent);
router.delete('/events/:id', [auth, eventAccess], eventController.deleteEvent);
router.post('/events/:id/register', auth, eventController.registerForEvent);
router.post('/events/:id/confirm', auth, eventController.confirmAttendance);

// Rating routes
router.post(
  '/events/:eventId/participants/:participantId/rate',
  [auth, eventAccess, ratingValidation],
  ratingController.rateParticipant
);
router.get('/events/:eventId/ratings', [auth, eventAccess], ratingController.getEventRatings);
router.get('/ratings/me', auth, ratingController.getParticipantRatings);
router.get('/ratings/me/stats', auth, ratingController.getParticipantStats);

module.exports = router; 