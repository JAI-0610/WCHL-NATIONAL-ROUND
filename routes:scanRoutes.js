const express = require('express');
const router = express.Router();
const scanController = require('../controllers/scanController');
const { protect } = require('../middleware/auth');

router.post('/', protect, scanController.scanDApp);
router.get('/', protect, scanController.getScanHistory);
router.get('/:id', protect, scanController.getScanResults);

module.exports = router;