# Learning Resource Management System (LRMS)

A web application for managing evaluation events, user participation, and resource assessment.

## Features

- User Registration with DepEd email validation
- Event listing and participation
- Dashboard for tracking upcoming and past events
- Participation rating system
- Admin features for event and user management

## Prerequisites

- Node.js (Portable version supported)
- MongoDB (Optional - can be configured to use MongoDB Atlas)

## Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd [repository-name]
```

2. Create a `.env` file in the root directory:
```bash
PORT=10000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=24h
```

3. Start the server:
```bash
node server.js
```

The server will start on http://localhost:10000

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /api/test` - API test endpoint
- More endpoints coming soon...

## Project Structure

```
├── src/
│   ├── components/     # React components
│   ├── assets/        # Static assets
│   ├── config/        # Configuration files
│   ├── models/        # Database models
│   └── routes/        # API routes
├── public/            # Public static files
└── server.js          # Server entry point
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.