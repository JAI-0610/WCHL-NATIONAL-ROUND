const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  plan: {
    type: String,
    enum: ['basic', 'professional', 'business', 'enterprise'],
    required: true,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: Date,
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active',
  },
  dappLimit: {
    type: Number,
    required: true,
  },
  features: [String],
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);