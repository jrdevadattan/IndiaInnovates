const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: [
      'SOS_NEARBY', 'REPORT_STATUS', 'SLA_BREACH', 'TASK_ASSIGNED',
      'POINTS_EARNED', 'BADGE_UNLOCKED', 'ORDER_UPDATE', 'ESCALATION',
      'WEEKLY_SUMMARY', 'GENERAL'
    ],
    required: true
  },
  title: { type: String, required: true },
  body: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed },
  isRead: { type: Boolean, default: false },
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'], default: 'MEDIUM' }
}, { timestamps: true });

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
