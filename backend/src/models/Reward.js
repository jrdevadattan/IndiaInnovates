const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  balance: { type: Number, default: 0 },
  totalEarned: { type: Number, default: 0 },
  level: {
    type: String,
    enum: ['NEWCOMER', 'HELPER', 'ACTIVIST', 'CHAMPION', 'LEGEND'],
    default: 'NEWCOMER'
  },
  xp: { type: Number, default: 0 },
  streak: {
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
    lastActiveDate: Date
  },
  badges: [{
    id: String,
    name: String,
    description: String,
    icon: String,
    earnedAt: { type: Date, default: Date.now }
  }],
  transactions: [{
    type: { type: String, enum: ['EARNED', 'REDEEMED'] },
    points: Number,
    reason: String,
    referenceId: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// userId already indexed via unique:true on the field — only add balance index
rewardSchema.index({ balance: -1 });

module.exports = mongoose.model('Reward', rewardSchema);
