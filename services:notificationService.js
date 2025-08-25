const Notification = require('../models/Notification');
const User = require('../models/User');
const logger = require('../utils/logger');

// Create a new notification
const createNotification = async (userId, title, message) => {
  try {
    const notification = new Notification({
      user: userId,
      title,
      message,
    });
    
    await notification.save();
    
    logger.info(`Notification created for user ${userId}: ${title}`);
    return notification;
  } catch (error) {
    logger.error('Failed to create notification:', error);
    throw error;
  }
};

// Get all notifications for a user
const getUserNotifications = async (userId) => {
  try {
    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(20);
    
    return notifications;
  } catch (error) {
    logger.error('Failed to get user notifications:', error);
    throw error;
  }
};

// Mark notification as read
const markAsRead = async (notificationId, userId) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { read: true },
      { new: true }
    );
    
    if (!notification) {
      throw new Error('Notification not found');
    }
    
    return notification;
  } catch (error) {
    logger.error('Failed to mark notification as read:', error);
    throw error;
  }
};

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
};