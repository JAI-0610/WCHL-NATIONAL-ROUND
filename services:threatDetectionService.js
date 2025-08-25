const Scan = require('../models/Scan');
const User = require('../models/User');
const { createNotification } = require('./notificationService');
const logger = require('../utils/logger');

// Start continuous threat detection
const start = () => {
  setInterval(async () => {
    try {
      // Get all active users
      const users = await User.find().populate('subscription');
      
      // For each user, simulate threat detection
      for (const user of users) {
        // Skip users without active subscription
        if (!user.subscription || user.subscription.status !== 'active') {
          continue;
        }
        
        // Simulate threat detection (10% chance per user)
        if (Math.random() < 0.1) {
          const threatTypes = ['Reentrancy', 'Access Control', 'Front-Running', 'Arithmetic Overflow'];
          const randomThreat = threatTypes[Math.floor(Math.random() * threatTypes.length)];
          const dappNames = ['ICPSwap', 'OpenChat', 'Distrikt', 'DSCVR'];
          const randomDapp = dappNames[Math.floor(Math.random() * dappNames.length)];
          
          // Create notification
          await createNotification(
            user._id,
            `Threat Detected in ${randomDapp}`,
            `A ${randomThreat} vulnerability was detected in the ${randomDapp} application.`
          );
          
          logger.info(`Threat detected for user ${user.email}: ${randomThreat} in ${randomDapp}`);
        }
      }
    } catch (error) {
      logger.error('Threat detection service error:', error);
    }
  }, 30000); // Run every 30 seconds
};

module.exports = {
  start,
};