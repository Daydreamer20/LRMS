require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./src/config/db');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint (before MongoDB connection)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// MongoDB Connection with error handling
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start server only after successful DB connection
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    // Don't exit the process, let the health check respond
    console.error('Server will continue running without MongoDB connection');
  }
};

// Start the server
startServer(); 