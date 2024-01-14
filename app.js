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
  const { name } = req.query;

  if (name) {
    // If the name parameter is provided, return details for the specific organization
    const orgDetails = organizationsData.find(org => org.name === name);
    if (orgDetails) {
      res.json(orgDetails);
    } else {
      res.status(404).json({ error: 'Organization not found' });
    }
  } else {
    // If no name parameter is provided, return the full list of organizations
    res.json(organizationsData);
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
