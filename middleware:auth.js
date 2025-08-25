const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;
  
  // Check for token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  // Make sure token exists
  if (!token) {
    return res.status(401).json({ message: 'Not authorized to access this route' });
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from token
    req.user = await User.findById(decoded.userId).select('-password');
    
    if (!req.user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    next();
  } catch (error) {
    logger.error('Authentication failed:', error);
    res.status(401).json({ message: 'Not authorized to access this route' });
  }
};