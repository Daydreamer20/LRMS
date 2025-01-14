# Evaluation Event Management System

A web application for managing evaluation events, participant registration, and ratings.

## Features

### User Features
- User Registration with DepEd email validation
- Event browsing and registration
- Attendance confirmation
- View personal participation history and ratings
- Dashboard with upcoming events and past participation

### Admin Features
- Event creation and management
- Participant management
- Rating system for evaluating participants
- Event statistics and reports

## Technology Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Express Validator
- Node mailer for email notifications

### Security Features
- Helmet for security headers
- Rate limiting
- CORS protection
- Password hashing
- JWT token authentication
- Input validation and sanitization

## Prerequisites

- Node.js (v18 or higher)
- MongoDB
- NPM or Yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd evaluation-event-system
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
- Set MongoDB connection URI
- Configure JWT secret
- Set up email service credentials
- Update other environment-specific variables

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## API Documentation

### Authentication Endpoints
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login
- GET `/api/auth/verify-email/:token` - Verify email
- GET `/api/auth/me` - Get current user

### Event Endpoints
- POST `/api/events` - Create new event (Admin only)
- GET `/api/events` - Get all events
- GET `/api/events/:id` - Get event details
- PUT `/api/events/:id` - Update event (Admin only)
- DELETE `/api/events/:id` - Delete event (Admin only)
- POST `/api/events/:id/register` - Register for event
- POST `/api/events/:id/confirm` - Confirm attendance

### Rating Endpoints
- POST `/api/events/:eventId/participants/:participantId/rate` - Rate participant
- GET `/api/events/:eventId/ratings` - Get event ratings
- GET `/api/ratings/me` - Get personal ratings
- GET `/api/ratings/me/stats` - Get personal rating statistics

## Environment Variables

```env
NODE_ENV=development
PORT=8080
MONGODB_URI=mongodb://localhost:27017/evaluation-events
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=24h
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@deped.gov.ph
EMAIL_PASSWORD=your-email-app-password
FRONTEND_URL=http://localhost:3000
```

## Security Considerations

1. Email Verification
   - Users must verify their DepEd email address
   - Verification tokens expire after 24 hours

2. Password Requirements
   - Minimum 8 characters
   - Must contain uppercase and lowercase letters
   - Must contain numbers and special characters

3. API Security
   - Rate limiting to prevent abuse
   - JWT token authentication
   - Input validation and sanitization
   - Secure headers with Helmet
   - CORS protection

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.