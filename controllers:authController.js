const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { createNotification } = require('../services/notificationService');
const logger = require('../utils/logger');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  const { name, email, password, company } = req.body;
  
  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create user
    user = new User({
      name,
      email,
      password,
      company,
    });
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    await user.save();
    
    // Create welcome notification
    await createNotification(
      user._id,
      'Welcome to ChainGuard Sentinel',
      'Thank you for registering with ChainGuard Sentinel. Start by scanning your first dApp!'
    );
    
    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      company: user.company,
      token,
    });
  } catch (error) {
    logger.error('Registration failed:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Authenticate user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      company: user.company,
      token,
    });
  } catch (error) {
    logger.error('Login failed:', error);
    res.status(500).json({ message: 'Server error' });
  }
};