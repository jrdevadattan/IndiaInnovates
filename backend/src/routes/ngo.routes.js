const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const { upload } = require('../middleware/upload.middleware');
const ctrl = require('../controllers/ngo.controller');

router.get('/nearby', ctrl.getNearbyNgos);
router.get('/', ctrl.getNgos);
router.get('/:id', ctrl.getNgo);
router.get('/:id/dashboard', protect, ctrl.getNgoDashboard);
router.post('/register', protect, upload.array('documents', 5), ctrl.registerNgo);
router.patch('/:id/cases/:caseId', protect, ctrl.updateCaseStatus);
router.post('/:id/volunteers', protect, ctrl.assignVolunteer);

module.exports = router;
