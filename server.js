require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');
const threatDetectionService = require('./services/threatDetectionService');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/scans', require('./routes/scanRoutes'));
app.use('/api/threats', require('./routes/threatRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));

// Start threat detection service
threatDetectionService.start();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});