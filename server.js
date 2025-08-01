
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/payments/approve', (req, res) => {
  const { user_uid, amount } = req.body;
  if (amount === 0.1) {
    res.json({ status: 'approved' });
  } else {
    res.status(400).json({ error: 'Invalid amount' });
  }
});

app.post('/payments/complete', async (req, res) => {
  const { prompt } = req.body;
  // Mock AI response for now
  const aiResponse = "This is a prediction based on your question: " + prompt;
  res.json({ answer: aiResponse });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
