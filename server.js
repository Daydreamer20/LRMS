// Load environment variables if dotenv is available
try {
  require('dotenv').config();
} catch (error) {
  console.warn('dotenv module not found, using default environment variables');
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const https = require('https');
const connectDB = require('./src/config/db');
const apiRoutes = require('./src/routes/api');

const app = express();
const PORT = process.env.PORT || 8080;
const isProduction = process.env.NODE_ENV === 'production';

// Security middleware
app.use(helmet({
  contentSecurityPolicy: isProduction ? undefined : false,
  crossOriginEmbedderPolicy: isProduction ? undefined : false
}));

// CORS configuration
const corsOptions = {
  origin: isProduction
    ? process.env.CORS_ALLOWED_ORIGINS?.split(',') || []
    : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// General middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());

// Logging configuration
if (isProduction) {
  // Production logging
  app.use(morgan('combined'));
} else {
  // Development logging
  app.use(morgan('dev'));
}

// Health check endpoint (before MongoDB connection)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api', apiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  // Log error details
  console.error('Error:', {
    timestamp: new Date().toISOString(),
    error: err.message,
    stack: isProduction ? undefined : err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip
  });

  res.status(500).json({ 
    message: 'Something went wrong!',
    error: isProduction ? undefined : err.message
  });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// MongoDB Connection with error handling
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start HTTP server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`HTTP Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('MongoDB connected successfully');
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    // Don't exit the process, let the health check respond
    console.error('Server will continue running without MongoDB connection');
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', {
    timestamp: new Date().toISOString(),
    error: err.message,
    stack: err.stack
  });
  // Gracefully shutdown
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', {
    timestamp: new Date().toISOString(),
    error: err.message,
    stack: err.stack
  });
  // Gracefully shutdown
  process.exit(1);
});

// Start the server
startServer(); 