const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/subscribe', protect, paymentController.createSubscription);
router.get('/subscription', protect, paymentController.getSubscription);

module.exports = router;