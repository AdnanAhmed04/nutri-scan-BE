const express = require('express');
const router = express.Router();
const { getDBStatus } = require('../config/db');

router.get('/', (req, res) => {
  const dbStatus = getDBStatus();
  res.json({
    status: 'online',
    app: 'Snap Tutor Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus.connected ? 'connected' : 'disconnected (using in-memory fallback)',
      readyState: dbStatus.readyState,
    },
    features: {
      dietTracking: 'active',
      userProfile: 'active',
      auth: 'ready for JWT',
      chatbot: 'ready for LLM provider',
    },
  });
});

module.exports = router;
