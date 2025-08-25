const Threat = require('../models/Threat');
const { createNotification } = require('../services/notificationService');
const logger = require('../utils/logger');

// @desc    Get all known threats
// @route   GET /api/threats
// @access  Public
exports.getThreats = async (req, res) => {
  try {
    const threats = await Threat.find();
    res.json(threats);
  } catch (error) {
    logger.error('Failed to get threats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user notifications
// @route   GET /api/threats/notifications
// @access  Private
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);
    
    res.json(notifications);
  } catch (error) {
    logger.error('Failed to get notifications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/threats/notifications/:id
// @access  Private
exports.markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    // Check if user owns the notification
    if (notification.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    notification.read = true;
    await notification.save();
    
    res.json(notification);
  } catch (error) {
    logger.error('Failed to mark notification as read:', error);
    res.status(500).json({ message: 'Server error' });
  }
};