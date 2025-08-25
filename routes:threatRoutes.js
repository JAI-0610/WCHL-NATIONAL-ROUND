const express = require('express');
const router = express.Router();
const threatController = require('../controllers/threatController');
const { protect } = require('../middleware/auth');

router.get('/', threatController.getThreats);
router.get('/notifications', protect, threatController.getNotifications);
router.put('/notifications/:id', protect, threatController.markNotificationAsRead);

module.exports = router;