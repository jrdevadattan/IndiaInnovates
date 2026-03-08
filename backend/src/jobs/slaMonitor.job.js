const cron = require('node-cron');
const Report = require('../models/Report');
const Ngo = require('../models/Ngo');
const { sendNotificationToUser, sendNgoNotification } = require('../services/notification.service');
const { assignNgo } = require('../services/geo.service');

const SLA_TIERS = {
  CRITICAL: 3 * 60,   // 3h resolution
  SEVERE: 12 * 60,    // 12h resolution
  MODERATE: 48 * 60   // 48h resolution
};

const escalateReport = async (report) => {
  try {
    report.escalationLevel = (report.escalationLevel || 0) + 1;

    const escalationLog = { escalatedAt: new Date() };

    if (report.escalationLevel <= 2) {
      // Find next closest NGO
      const nextNgo = await assignNgo({ ...report.toObject(), location: report.location });
      if (nextNgo && nextNgo._id.toString() !== report.assignedNgoId?.toString()) {
        escalationLog.ngoId = nextNgo._id;
        escalationLog.reason = `Level ${report.escalationLevel} escalation - previous NGO SLA breach`;
        report.escalationHistory.push(escalationLog);
        report.assignedNgoId = nextNgo._id;
        await sendNgoNotification(nextNgo._id, report);
      }
    } else if (report.escalationLevel === 3) {
      // Notify all NGOs in city with matching category
      const allNgos = await Ngo.find({
        categories: report.category,
        'headquarters.city': report.location?.city,
        isVerified: true,
        isActive: true
      });
      for (const ngo of allNgos) {
        await sendNgoNotification(ngo._id, report);
      }
      escalationLog.reason = 'Level 3 escalation - city-wide NGO notification';
      report.escalationHistory.push(escalationLog);
    } else {
      // Notify authorities
      const User = require('../models/User');
      const authorities = await User.find({ role: 'AUTHORITY' }).select('_id');
      for (const auth of authorities) {
        await sendNotificationToUser(auth._id, 'ESCALATION', 'Critical Escalation',
          `Report "${report.title}" has reached Level ${report.escalationLevel} escalation.`,
          { reportId: report._id.toString() });
      }
      escalationLog.reason = `Level ${report.escalationLevel} escalation - authorities notified`;
      report.escalationHistory.push(escalationLog);
    }

    await report.save();
  } catch (err) {
    console.error('Escalation error:', err.message);
  }
};

const startSlaMonitor = () => {
  // Run every minute
  cron.schedule('* * * * *', async () => {
    try {
      const breachedCases = await Report.find({
        status: { $in: ['ASSIGNED', 'IN_PROGRESS'] },
        slaDeadline: { $lte: new Date() },
        slaBreached: false
      });

      for (const report of breachedCases) {
        report.slaBreached = true;
        await report.save();

        // Notify NGO admin about breach
        if (report.assignedNgoId) {
          await sendNgoNotification(report.assignedNgoId, report);
        }

        // Escalate
        await escalateReport(report);
      }

      if (breachedCases.length > 0) {
        console.log(`SLA monitor: processed ${breachedCases.length} breached cases.`);
      }
    } catch (err) {
      console.error('SLA monitor error:', err.message);
    }
  });

  console.log('✅ SLA monitor started.');
};

module.exports = { startSlaMonitor, escalateReport };
