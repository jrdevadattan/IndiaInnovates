const Reward = require('../models/Reward');

const LEVEL_THRESHOLDS = [
  { name: 'NEWCOMER', minXp: 0 },
  { name: 'HELPER', minXp: 100 },
  { name: 'ACTIVIST', minXp: 500 },
  { name: 'CHAMPION', minXp: 1500 },
  { name: 'LEGEND', minXp: 5000 }
];

const getLevel = (xp) => {
  let level = 'NEWCOMER';
  for (const tier of LEVEL_THRESHOLDS) {
    if (xp >= tier.minXp) level = tier.name;
  }
  return level;
};

const BADGES = {
  FIRST_REPORT: { id: 'first_report', name: 'First Report', description: 'Submitted your first report', icon: '📋' },
  HERO: { id: 'hero', name: 'SOS Hero', description: 'Triggered first SOS', icon: '🆘' },
  UPVOTE_STAR: { id: 'upvote_star', name: 'Community Star', description: 'Received 10 upvotes on a report', icon: '⭐' },
  VOLUNTEER_10: { id: 'volunteer_10', name: 'Active Volunteer', description: 'Completed 10 volunteer tasks', icon: '🤝' },
  LEGEND_BADGE: { id: 'legend_badge', name: 'Legend', description: 'Reached Legend level', icon: '🏆' }
};

const addPoints = async (userId, points, reason, referenceId = '') => {
  try {
    let reward = await Reward.findOne({ userId });
    if (!reward) {
      reward = await Reward.create({ userId });
    }

    reward.balance += points;
    reward.totalEarned += points;
    reward.xp += points;
    reward.level = getLevel(reward.xp);

    reward.transactions.push({
      type: 'EARNED',
      points,
      reason,
      referenceId,
      createdAt: new Date()
    });

    // Check badges
    const earnedBadgeIds = reward.badges.map(b => b.id);
    if (reason.includes('Report submitted') && !earnedBadgeIds.includes('first_report')) {
      reward.badges.push({ ...BADGES.FIRST_REPORT, earnedAt: new Date() });
    }
    if (reason.includes('SOS') && !earnedBadgeIds.includes('hero')) {
      reward.badges.push({ ...BADGES.HERO, earnedAt: new Date() });
    }
    if (reward.level === 'LEGEND' && !earnedBadgeIds.includes('legend_badge')) {
      reward.badges.push({ ...BADGES.LEGEND_BADGE, earnedAt: new Date() });
    }

    // Update streak
    const today = new Date().toDateString();
    const lastActive = reward.streak.lastActiveDate?.toDateString();
    if (lastActive !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (lastActive === yesterday) {
        reward.streak.current += 1;
      } else {
        reward.streak.current = 1;
      }
      reward.streak.longest = Math.max(reward.streak.current, reward.streak.longest);
      reward.streak.lastActiveDate = new Date();
    }

    await reward.save();
    return reward;
  } catch (err) {
    console.error('Reward points error:', err.message);
  }
};

module.exports = { addPoints, getLevel };
