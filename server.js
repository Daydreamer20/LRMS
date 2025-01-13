const express = require('express');
const path = require('path');

const app = express();

// Railway sets PORT environment variable automatically
// We'll use their PORT value if available
const port = process.env.PORT || 10000;
console.log('Environment PORT:', process.env.PORT);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
  console.log('All environment variables:', process.env);
}); 