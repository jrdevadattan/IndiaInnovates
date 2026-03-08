const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const ctrl = require('../controllers/rewards.controller');

router.get('/me', protect, ctrl.getMyRewards);
router.get('/leaderboard', ctrl.getLeaderboard);
router.get('/catalog', ctrl.getCatalog);
router.post('/redeem', protect, ctrl.redeem);
router.get('/certificates', protect, ctrl.getCertificates);
router.get('/certificates/download', protect, ctrl.generateCertificate);

module.exports = router;
