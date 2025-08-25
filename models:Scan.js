const mongoose = require('mongoose');

const ThreatSchema = new mongoose.Schema({
  title: String,
  severity: {
    type: String,
    enum: ['critical', 'high', 'medium', 'low'],
  },
  description: String,
  fix: String,
});

const ScanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  dappName: {
    type: String,
    required: true,
  },
  canisterId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending',
  },
  threats: [ThreatSchema],
  startedAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: Date,
});

module.exports = mongoose.model('Scan', ScanSchema);