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

// Define build path
const buildPath = path.join(__dirname, 'build');

// Verify build directory exists
if (!require('fs').existsSync(buildPath)) {
  console.error('Build directory does not exist:', buildPath);
  process.exit(1);
}

// Serve static files from the React app
app.use(express.static(buildPath));

// API Routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  const indexPath = path.join(buildPath, 'index.html');
  console.log('Serving index.html for path:', req.path);
  console.log('Full path:', indexPath);
  
  if (!require('fs').existsSync(indexPath)) {
    console.error('index.html does not exist at:', indexPath);
    return res.status(500).send('index.html not found');
  }
  
  res.sendFile(indexPath, err => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).send('Error loading page');
    }
  });
});

const port = process.env.PORT || 10000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
  console.log('Static files being served from:', buildPath);
  console.log('Current directory:', __dirname);
  console.log('Directory contents:', require('fs').readdirSync(__dirname));
}); 