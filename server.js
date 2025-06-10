const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('public'));

// Health check endpoint for Kubernetes
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API endpoint for high scores (in-memory storage for simplicity)
let highScores = [];

app.use(express.json());

app.get('/api/scores', (req, res) => {
  res.json(highScores.slice(0, 10)); // Top 10 scores
});

app.post('/api/scores', (req, res) => {
  const { name, score, time } = req.body;
  if (name && score !== undefined && time !== undefined) {
    highScores.push({ name, score, time, date: new Date().toISOString() });
    highScores.sort((a, b) => b.score - a.score);
    highScores = highScores.slice(0, 50); // Keep top 50
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'Invalid score data' });
  }
});

// Serve the main game
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Car Racing Game server running on port ${PORT}`);
});