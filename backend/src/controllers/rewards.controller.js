const Reward = require('../models/Reward');
const User = require('../models/User');
const { generateCertificatePdf } = require('../utils/certificateGenerator');

const LEVELS = [
  { name: 'NEWCOMER', minXp: 0 },
  { name: 'HELPER', minXp: 100 },
  { name: 'ACTIVIST', minXp: 500 },
  { name: 'CHAMPION', minXp: 1500 },
  { name: 'LEGEND', minXp: 5000 }
];

const REDEMPTION_CATALOG = [
  { id: 'cert_participation', name: 'Digital Certificate of Participation', points: 100, type: 'CERTIFICATE' },
  { id: 'letter_recommendation', name: 'NGO Letter of Recommendation', points: 500, type: 'LETTER' },
  { id: 'academic_credit', name: 'Academic Credit (partner universities)', points: 1000, type: 'ACADEMIC' },
  { id: 'internship', name: 'Internship with partner NGO', points: 2000, type: 'INTERNSHIP' },
  { id: 'marketplace_10', name: 'Marketplace 10% discount', points: 200, type: 'DISCOUNT' },
  { id: 'marketplace_25', name: 'Marketplace 25% discount', points: 500, type: 'DISCOUNT' }
];

exports.getMyRewards = async (req, res) => {
  try {
    let reward = await Reward.findOne({ userId: req.user._id });
    if (!reward) {
      reward = await Reward.create({ userId: req.user._id });
    }
    res.json({ success: true, reward });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const { scope = 'alltime', limit = 20 } = req.query;

    const rewards = await Reward.find()
      .sort({ balance: -1 })
      .limit(Number(limit))
      .populate('userId', 'name profilePicture role');

    const leaderboard = rewards.map((r, idx) => ({
      rank: idx + 1,
      user: r.userId,
      points: r.balance,
      level: r.level,
      xp: r.xp,
      badges: r.badges.length
    }));

    res.json({ success: true, leaderboard });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCatalog = async (req, res) => {
  res.json({ success: true, catalog: REDEMPTION_CATALOG });
};

exports.redeem = async (req, res) => {
  try {
    const { itemId } = req.body;
    const item = REDEMPTION_CATALOG.find(c => c.id === itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Catalog item not found.' });

    const reward = await Reward.findOne({ userId: req.user._id });
    if (!reward || reward.balance < item.points) {
      return res.status(400).json({ success: false, message: 'Insufficient points.' });
    }

    reward.balance -= item.points;
    reward.transactions.push({
      type: 'REDEEMED',
      points: item.points,
      reason: `Redeemed: ${item.name}`,
      referenceId: itemId
    });
    await reward.save();

    res.json({ success: true, message: `Successfully redeemed: ${item.name}`, remaining: reward.balance });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCertificates = async (req, res) => {
  try {
    const reward = await Reward.findOne({ userId: req.user._id });
    if (!reward) return res.json({ success: true, certificates: [] });

    const certs = reward.transactions.filter(t => t.type === 'REDEEMED' && t.referenceId === 'cert_participation');
    res.json({ success: true, certificates: certs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.generateCertificate = async (req, res) => {
  try {
    const pdfBuffer = await generateCertificatePdf(req.user);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="lifeline_certificate_${req.user._id}.pdf"`
    });
    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
