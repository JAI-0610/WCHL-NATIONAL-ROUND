const { processPayment, getUserSubscription } = require('../services/paymentService');
const logger = require('../utils/logger');

// @desc    Create a subscription
// @route   POST /api/payment/subscribe
// @access  Private
exports.createSubscription = async (req, res) => {
  const { plan, paymentDetails } = req.body;
  const userId = req.user.id;
  
  try {
    const result = await processPayment(userId, plan, paymentDetails);
    res.json(result);
  } catch (error) {
    logger.error('Subscription creation failed:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user subscription
// @route   GET /api/payment/subscription
// @access  Private
exports.getSubscription = async (req, res) => {
  const userId = req.user.id;
  
  try {
    const subscription = await getUserSubscription(userId);
    if (!subscription) {
      return res.status(404).json({ message: 'No subscription found' });
    }
    
    res.json(subscription);
  } catch (error) {
    logger.error('Failed to get subscription:', error);
    res.status(500).json({ message: 'Server error' });
  }
};