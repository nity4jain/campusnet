const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); 
console.log('DEBUG - MONGO_URI:', process.env.MONGO_URI);
console.log('DEBUG -PORT:', process.env.PORT);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: ['http://localhost:3000', 'http://192.168.1.100:3000'],
  credentials: true
}));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected Successfully!');
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1); 
  });

app.use('/api/auth', require('./auth/routes'));

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
