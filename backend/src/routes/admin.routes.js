const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');
const User = require('../models/User');
const Ngo = require('../models/Ngo');
const Report = require('../models/Report');
const SosAlert = require('../models/SosAlert');
const Order = require('../models/Order');

const adminOnly = [protect, requireRole('SUPER_ADMIN')];

// Platform stats
router.get('/stats', adminOnly, async (req, res) => {
  try {
    const [totalUsers, totalReports, resolvedReports, activeNgos, activeSos, totalOrders] = await Promise.all([
      User.countDocuments(),
      Report.countDocuments(),
      Report.countDocuments({ status: 'RESOLVED' }),
      Ngo.countDocuments({ isVerified: true, isActive: true }),
      SosAlert.countDocuments({ status: 'ACTIVE' }),
      Order.countDocuments({ 'payment.status': 'PAID' })
    ]);

    res.json({ success: true, stats: { totalUsers, totalReports, resolvedReports, activeNgos, activeSos, totalOrders, resolutionRate: totalReports > 0 ? Math.round((resolvedReports / totalReports) * 100) : 0 } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// User management
router.get('/users', adminOnly, async (req, res) => {
  try {
    const { role, page = 1, limit = 50 } = req.query;
    const query = role ? { role } : {};
    const users = await User.find(query).select('-passwordHash -refreshTokens').skip((page - 1) * limit).limit(Number(limit)).sort({ createdAt: -1 });
    const total = await User.countDocuments(query);
    res.json({ success: true, users, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.patch('/users/:id', adminOnly, async (req, res) => {
  try {
    const { isActive, role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { isActive, role }, { new: true }).select('-passwordHash -refreshTokens');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// NGO approvals
router.get('/ngos/pending', adminOnly, async (req, res) => {
  try {
    const ngos = await Ngo.find({ isVerified: false }).populate('adminIds', 'name email');
    res.json({ success: true, ngos });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.patch('/ngos/:id/approve', adminOnly, async (req, res) => {
  try {
    const { approved } = req.body;
    const ngo = await Ngo.findByIdAndUpdate(req.params.id, {
      isVerified: approved,
      isActive: approved,
      approvedBy: req.user._id,
      approvedAt: new Date()
    }, { new: true });
    if (!ngo) return res.status(404).json({ success: false, message: 'NGO not found.' });
    res.json({ success: true, ngo });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Report moderation
router.patch('/reports/:id', adminOnly, async (req, res) => {
  try {
    const updates = {};
    if (req.body.status) updates.status = req.body.status;
    if (req.body.severity) updates['aiAnalysis.severity'] = req.body.severity;

    const report = await Report.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!report) return res.status(404).json({ success: false, message: 'Report not found.' });
    res.json({ success: true, report });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Analytics
router.get('/analytics', adminOnly, async (req, res) => {
  try {
    const [byCategory, byStatus, recentReports] = await Promise.all([
      Report.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
      Report.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Report.find().sort({ createdAt: -1 }).limit(10).populate('reporterId', 'name').lean()
    ]);

    res.json({ success: true, analytics: { byCategory, byStatus, recentReports } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
