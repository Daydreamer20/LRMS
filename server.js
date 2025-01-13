require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./src/config/db');
const cors = require('cors');
const fs = require('fs');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// Verify build directory exists
const buildPath = path.join(__dirname, 'build');
if (!fs.existsSync(buildPath)) {
  console.error('Build directory is missing:', buildPath);
  console.log('Current directory contents:', fs.readdirSync(__dirname));
} else {
  console.log('Build directory found at:', buildPath);
  console.log('Build directory contents:', fs.readdirSync(buildPath));
}

// Serve static files from the React app
app.use(express.static(buildPath));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    message: 'Something broke!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res, next) => {
  const indexPath = path.join(buildPath, 'index.html');
  
  if (!fs.existsSync(indexPath)) {
    console.error('index.html not found at:', indexPath);
    return res.status(500).send('Application files not found');
  }

  res.sendFile(indexPath, err => {
    if (err) {
      console.error('Error sending index.html:', err);
      next(err);
    }
  });
});

const port = process.env.PORT || 10000;
app.listen(port, '0.0.0.0', () => {
  console.log('----------------------------------------');
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('Directory structure:');
  console.log('- Current directory:', __dirname);
  console.log('- Build path:', buildPath);
  console.log('----------------------------------------');
}); 