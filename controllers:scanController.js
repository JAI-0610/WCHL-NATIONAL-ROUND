const Scan = require('../models/Scan');
const { getDappMetadata } = require('../services/icpService');
const { detectThreats } = require('../services/aiService');
const { createNotification } = require('../services/notificationService');
const logger = require('../utils/logger');

// @desc    Scan a dApp
// @route   POST /api/scans
// @access  Private
exports.scanDApp = async (req, res) => {
  const { canisterId } = req.body;
  const userId = req.user.id;
  
  try {
    // Get dApp metadata
    const dappMetadata = await getDappMetadata(canisterId);
    
    // Create scan record
    const scan = new Scan({
      user: userId,
      dappName: dappMetadata.name,
      canisterId,
      status: 'processing',
    });
    
    await scan.save();
    
    // Simulate scan processing
    setTimeout(async () => {
      try {
        // Detect threats using AI
        const threats = await detectThreats(canisterId, dappMetadata.name);
        
        // Update scan with results
        scan.status = 'completed';
        scan.threats = threats;
        scan.completedAt = new Date();
        await scan.save();
        
        // Create notification if threats found
        if (threats.length > 0) {
          await createNotification(
            userId,
            `Scan Completed: ${dappMetadata.name}`,
            `Found ${threats.length} vulnerabilities in ${dappMetadata.name}`
          );
        }
        
        logger.info(`Scan completed for ${dappMetadata.name} (${canisterId})`);
      } catch (error) {
        logger.error('Scan processing failed:', error);
        scan.status = 'failed';
        await scan.save();
      }
    }, 5000); // Simulate 5 second scan
    
    res.status(202).json({
      message: 'Scan started',
      scanId: scan._id,
      dappName: dappMetadata.name,
    });
  } catch (error) {
    logger.error('Scan initiation failed:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get scan results
// @route   GET /api/scans/:id
// @access  Private
exports.getScanResults = async (req, res) => {
  try {
    const scan = await Scan.findById(req.params.id);
    
    if (!scan) {
      return res.status(404).json({ message: 'Scan not found' });
    }
    
    // Check if user owns the scan
    if (scan.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    res.json(scan);
  } catch (error) {
    logger.error('Failed to get scan results:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's scan history
// @route   GET /api/scans
// @access  Private
exports.getScanHistory = async (req, res) => {
  try {
    const scans = await Scan.find({ user: req.user.id })
      .sort({ startedAt: -1 })
      .limit(20);
    
    res.json(scans);
  } catch (error) {
    logger.error('Failed to get scan history:', error);
    res.status(500).json({ message: 'Server error' });
  }
};