const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Future Chatbot integration endpoint
router.post('/message', authMiddleware, async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, message: 'Message content required' });
  }

  // Pre-configured intelligent nutritionist response stub
  return res.json({
    success: true,
    reply: `Hello! I'm your Snap Tutor AI Nutritionist & Study Coach. You asked: "${message}". Soon I'll be fully connected to your LLM API of choice!`,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
