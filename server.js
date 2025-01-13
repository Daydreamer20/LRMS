require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./src/config/db');
const cors = require('cors');

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

// API Routes first
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'), err => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).send('Error loading page');
    }
  });
});

const port = process.env.PORT || 10000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
  console.log('Static files being served from:', path.join(__dirname, 'build'));
  // Test if index.html exists
  const indexPath = path.join(__dirname, 'build', 'index.html');
  if (require('fs').existsSync(indexPath)) {
    console.log('index.html found at:', indexPath);
  } else {
    console.error('index.html not found at:', indexPath);
  }
}); 