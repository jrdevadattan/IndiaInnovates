const express = require('express');
const router = express.Router();
const { protect, optionalAuth } = require('../middleware/auth.middleware');
const { upload } = require('../middleware/upload.middleware');
const ctrl = require('../controllers/reports.controller');

router.get('/nearby', ctrl.getNearbyReports);
router.get('/mine', protect, ctrl.getMyReports);
router.get('/', ctrl.getReports);
router.get('/:id', ctrl.getReport);
router.post('/', optionalAuth, upload.array('media', 7), ctrl.createReport);
router.patch('/:id/status', protect, ctrl.updateStatus);
router.post('/:id/upvote', protect, ctrl.upvote);
router.post('/:id/comments', protect, ctrl.addComment);
router.post('/:id/resolve', protect, upload.array('proof', 5), ctrl.resolveReport);

module.exports = router;
