const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
// mongodb-memory-server is used as a development fallback when no MongoDB is available
let MongoMemoryServer;
const path = require('path');
require('dotenv').config(); 
console.log('DEBUG - MONGO_URI:', process.env.MONGO_URI);
console.log('DEBUG -PORT:', process.env.PORT);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure CORS origins. Prefer explicit env var CORS_ORIGINS (comma-separated). Otherwise use sensible dev defaults.
const defaultOrigins = [
  'http://localhost:3000',
  'http://192.168.1.100:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://localhost:5174'
];
const corsOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',').map(s => s.trim()) : defaultOrigins;
app.use(cors({ origin: corsOrigins, credentials: true }));

// Connect to MongoDB with a development fallback to an in-memory server
async function connectDatabase() {
  const uri = process.env.MONGO_URI;
  try {
    if (uri) {
      await mongoose.connect(uri);
      console.log('MongoDB Connected Successfully!');
      return;
    }
    throw new Error('No MONGO_URI provided');
  } catch (err) {
    console.error('MongoDB Connection Error:', err && err.message ? err.message : err);
    // In development, start an in-memory MongoDB so frontend/backends can run without local MongoDB
    if ((process.env.NODE_ENV || 'development') === 'development') {
      try {
        MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
        const mongod = await MongoMemoryServer.create();
        const memUri = mongod.getUri();
        await mongoose.connect(memUri);
        console.log('Connected to in-memory MongoDB for development');
        // ensure clean shutdown
        const cleanup = async () => {
          try { await mongoose.disconnect(); } catch (e) {}
          try { await mongod.stop(); } catch (e) {}
          process.exit(0);
        };
        process.on('SIGINT', cleanup);
        process.on('SIGTERM', cleanup);
        return;
      } catch (memErr) {
        console.error('Failed to start in-memory MongoDB:', memErr);
      }
    }
    process.exit(1);
  }
}

connectDatabase();

app.use('/api/auth', require('./auth/routes'));
app.use('/api/resources', require('./resources/routes'));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Messages (chat/post) routes
app.use('/api/messages', require('./messages/routes'));


app.get('/health', (req, res) => {
  res.json({
    status: 'Backend is running! ',
    timestamp: new Date(),
    environment: process.env.NODE_ENV
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message,
    status: err.status || 500
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
