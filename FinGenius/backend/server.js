const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Root route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Example route: /invoices
app.get('/invoices', (req, res) => {
  res.json([
    { id: 1, description: 'Invoice 1', amount: 100 },
    { id: 2, description: 'Invoice 2', amount: 200 },
  ]);
});

// Example route: /partners
app.get('/partners', (req, res) => {
  res.json([
    { id: 1, name: 'Partner A' },
    { id: 2, name: 'Partner B' },
  ]);
});

// Catch-all route for 404 errors
app.use((req, res) => {
  res.status(404).send('Route not found');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
