const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.get('/invoices', (req, res) => {
  res.json([
    { id: 1, amount: 100 },
    { id: 2, amount: 200 },
    { id: 3, amount: 300 }
  ]);
});

app.get('/partners', (req, res) => {
  res.json([
    { id: 1, name: 'Partner A' },
    { id: 2, name: 'Partner B' },
    { id: 3, name: 'Partner C' }
  ]);
});

app.use((req, res) => {
  res.status(404).send('Not Found');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
