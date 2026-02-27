const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// Connect  to MongoDB
// Notice: 'mongo' is the service name from docker-compose.yml
mongoose.connect('mongodb://mongo:27017/myapp')
  .then(() => console.log('✅ Connected to MongoDB!'))
  .catch((err) => console.log('❌ MongoDB Error:', err));

// Simple route
app.get('/', (req, res) => {
  res.send(`
    <h1>🐳 Docker Compose is Working!</h1>
    <p>Node.js app is running and connected to MongoDB</p>
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 App running on http://localhost:${PORT}`);
});
