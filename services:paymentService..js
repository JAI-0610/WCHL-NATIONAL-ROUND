const Subscription = require('../models/Subscription');
const User = require('../models/User');
const logger = require('../utils/logger');

// Subscription plans
const PLANS = {
  basic: {
    price: 699,
    duration: 30, // days
    dappLimit: 1,
    features: ['realtime-monitoring', 'email-alerts', 'daily-reports']
  },
  professional: {
    price: 1999,
    duration: 90, // days
    dappLimit: 3,
    features: ['advanced-threat-detection', 'sms-alerts', 'weekly-audits', 'priority-support']
  },
  business: {
    price: 3899,
    duration: 180, // days
    dappLimit: 10,
    features: ['enterprise-threat-detection', 'auto-patching', '24-7-monitoring', 'daily-reports', 'dedicated-manager']
  },
  enterprise: {
    price: 7699,
    duration: 365, // days
    dappLimit: 999, // unlimited
    features: ['premium-threat-detection', 'custom-protocols', 'blockchain-forensics', '24-7-premium-support', 'compliance-reporting']
  }
};

// Create a new subscription
const createSubscription = async (userId, plan) => {
  try {
    // Check if plan is valid
    if (!PLANS[plan]) {
      throw new Error('Invalid subscription plan');
    }
    
    // Calculate end date
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + PLANS[plan].duration);
    
    // Create subscription
    const subscription = new Subscription({
      user: userId,
      plan,
      startDate,
      endDate,
      dappLimit: PLANS[plan].dappLimit,
      features: PLANS[plan].features,
    });
    
    await subscription.save();
    
    // Update user's subscription reference
    await User.findByIdAndUpdate(userId, { subscription: subscription._id });
    
    logger.info(`Subscription created for user ${userId}: ${plan} plan`);
    return subscription;
  } catch (error) {
    logger.error('Failed to create subscription:', error);
    throw error;
  }
};

// Get user's subscription
const getUserSubscription = async (userId) => {
  try {
    const subscription = await Subscription.findOne({ user: userId })
      .populate('user', 'name email');
    
    return subscription;
  } catch (error) {
    logger.error('Failed to get user subscription:', error);
    throw error;
  }
};

// Process payment (simulated)
const processPayment = async (userId, plan, paymentDetails) => {
  try {
    // In a real implementation, this would integrate with a payment gateway
    // For simulation, we'll just create the subscription
    
    // Validate payment details (simulated)
    if (!paymentDetails.cardNumber || !paymentDetails.expiry || !paymentDetails.cvv) {
      throw new Error('Invalid payment details');
    }
    
    // Create subscription
    const subscription = await createSubscription(userId, plan);
    
    logger.info(`Payment processed for user ${userId} for ${plan} plan`);
    return {
      success: true,
      message: 'Payment successful',
      subscription,
    };
  } catch (error) {
    logger.error('Payment processing failed:', error);
    throw error;
  }
};

module.exports = {
  createSubscription,
  getUserSubscription,
  processPayment,
};