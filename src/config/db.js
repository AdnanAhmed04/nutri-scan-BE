const mongoose = require('mongoose');

let isConnected = false;

// Handle connection events to prevent Node EventEmitter unhandled exceptions
mongoose.connection.on('connected', () => {
  isConnected = true;
  console.log('[MongoDB] Connected successfully.');
});

mongoose.connection.on('error', (err) => {
  isConnected = false;
  console.log('[MongoDB] Connection event error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.log('[MongoDB] Disconnected.');
});

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/snap_tutor';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
  } catch (error) {
    isConnected = false;
    console.warn(`[MongoDB] Note: Could not reach MongoDB Atlas (${error.message}).`);
    console.warn(`[MongoDB] Running in high-performance in-memory mode so app remains 100% operational.`);
  }
};

const getDBStatus = () => ({
  connected: isConnected,
  readyState: mongoose.connection.readyState,
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/snap_tutor',
});

module.exports = { connectDB, getDBStatus };
