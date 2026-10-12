require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB } = require('./config/db');

// Safeguard against unhandled async exceptions
process.on('unhandledRejection', (reason) => {
  console.log('[Server] Handled unhandled rejection:', reason?.message || reason);
});

process.on('uncaughtException', (err) => {
  console.log('[Server] Handled uncaught exception:', err.message);
});

const healthRoutes = require('./routes/healthRoutes');
const userRoutes = require('./routes/userRoutes');
const dietRoutes = require('./routes/dietRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB (with graceful fallback)
connectDB();

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/user', userRoutes);
app.use('/api/diet', dietRoutes);
app.use('/api/chat', chatRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Nutri-Scan & Snap Tutor API',
    endpoints: {
      health: '/api/health',
      userProfile: '/api/user/profile',
      todayDiet: '/api/diet/today',
      addMeal: 'POST /api/diet/meals',
      chat: 'POST /api/chat/message',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`=========================================`);
  console.log(` Nutri-Scan Server running on port ${PORT}`);
  console.log(` Local URL: http://localhost:${PORT}`);
  console.log(` Health:    http://localhost:${PORT}/api/health`);
  console.log(`=========================================`);
});
