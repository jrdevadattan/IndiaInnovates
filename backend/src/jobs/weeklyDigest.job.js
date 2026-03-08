const cron = require('node-cron');
const User = require('../models/User');
const Report = require('../models/Report');
const Reward = require('../models/Reward');
const { sendNotificationToUser } = require('../services/notification.service');

const sendWeeklyDigest = async () => {
  try {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const volunteers = await User.find({ role: { $in: ['VOLUNTEER', 'CITIZEN'] }, isActive: true }).select('_id name email');

    for (const user of volunteers) {
      const reward = await Reward.findOne({ userId: user._id });
      if (!reward) continue;

      const weeklyEarned = reward.transactions
        .filter(t => t.type === 'EARNED' && t.createdAt >= oneWeekAgo)
        .reduce((sum, t) => sum + t.points, 0);

      if (weeklyEarned > 0) {
        await sendNotificationToUser(
          user._id,
          'WEEKLY_SUMMARY',
          'Your Weekly Impact Summary',
          `You earned ${weeklyEarned} points this week! Total balance: ${reward.balance} pts. Level: ${reward.level}.`,
          { weeklyPoints: weeklyEarned, totalBalance: reward.balance }
        );
      }
    }

    console.log('Weekly digest sent.');
  } catch (err) {
    console.error('Weekly digest error:', err.message);
  }
};

const startWeeklyDigest = () => {
  // Every Monday at 9am
  cron.schedule('0 9 * * 1', sendWeeklyDigest);
  console.log('✅ Weekly digest scheduler started.');
};

module.exports = { startWeeklyDigest };
