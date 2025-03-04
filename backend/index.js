const express = require('express');
const app = express();
const port = 3000;

// Middleware - parse JSON bodies (for POST, PUT, etc.)
app.use(express.json());

// Simple route
app.get('/', (req, res) => {
  res.send('Hello from the Smart Healthcare App!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
