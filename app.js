// server.js
const express = require('express');
const path = require('path');
const organizationsData = require('./orgs');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/organizations', (req, res) => {
  res.json(organizationsData);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
