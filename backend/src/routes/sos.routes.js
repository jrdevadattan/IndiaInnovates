const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { upload } = require('../middleware/upload.middleware');
const { sosLimiter } = require('../middleware/rateLimit.middleware');
const ctrl = require('../controllers/sos.controller');

router.get('/mine', protect, ctrl.getMySosAlerts);
router.post('/', protect, sosLimiter, upload.array('media', 3), ctrl.createSos);
router.patch('/:id/respond', protect, ctrl.respondToSos);
router.patch('/:id/resolve', protect, ctrl.resolveSos);
router.patch('/:id/cancel', protect, ctrl.cancelSos);
router.post('/:id/location', protect, ctrl.updateLiveLocation);
router.get('/:id/chat', protect, ctrl.getSosChat);
router.post('/:id/chat', protect, ctrl.sendSosChat);

module.exports = router;
