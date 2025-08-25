const mongoose = require('mongoose');

const ThreatSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  severity: {
    type: String,
    enum: ['critical', 'high', 'medium', 'low'],
    required: true,
  },
  fix: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['reentrancy', 'access-control', 'arithmetic', 'front-running', 'others'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Threat', ThreatSchema);