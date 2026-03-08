const Notification = require('../models/Notification');
const User = require('../models/User');

// Lazy-load firebase admin to avoid startup errors if not configured
const sendPushNotification = async (fcmToken, title, body, data = {}) => {
  if (!fcmToken || !process.env.FIREBASE_SERVICE_ACCOUNT_KEY) return;
  try {
    const { admin } = require('../config/firebase');
    await admin.messaging().send({
      token: fcmToken,
      notification: { title, body },
      data: Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)])),
      android: { priority: 'high' },
      apns: { payload: { aps: { sound: 'default' } } }
    });
  } catch (err) {
    console.error('FCM push error:', err.message);
  }
};

const sendSmsAlert = async (phone, message) => {
  if (!process.env.TWILIO_ACCOUNT_SID || !phone) return;
  try {
    const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    await twilio.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });
  } catch (err) {
    console.error('Twilio SMS error:', err.message);
  }
};

const sendNotificationToUser = async (userId, type, title, body, data = {}) => {
  try {
    await Notification.create({ userId, type, title, body, data });

    const user = await User.findById(userId).select('fcmToken notificationPreferences phone');
    if (!user) return;

    if (user.notificationPreferences?.push && user.fcmToken) {
      await sendPushNotification(user.fcmToken, title, body, data);
    }
  } catch (err) {
    console.error('Notification error:', err.message);
  }
};

const sendNgoNotification = async (ngoId, report) => {
  try {
    const Ngo = require('../models/Ngo');
    const ngo = await Ngo.findById(ngoId).populate('adminIds', 'fcmToken notificationPreferences');
    if (!ngo) return;

    for (const admin of ngo.adminIds) {
      await sendNotificationToUser(
        admin._id,
        'REPORT_STATUS',
        'New Case Assigned',
        `A ${report.aiAnalysis?.severity || 'MODERATE'} report has been assigned: "${report.title}"`,
        { reportId: report._id.toString(), severity: report.aiAnalysis?.severity }
      );
    }
  } catch (err) {
    console.error('NGO notification error:', err.message);
  }
};

const sendSosAlerts = async (sos, user, nearbyNgos) => {
  try {
    // Notify NGO admins
    for (const ngo of nearbyNgos) {
      await sendNgoNotification(ngo._id, {
        _id: sos._id,
        title: 'SOS Alert',
        aiAnalysis: { severity: 'CRITICAL' }
      });
    }

    // SMS to emergency contacts if configured
    if (process.env.TWILIO_ACCOUNT_SID && user.phone) {
      await sendSmsAlert(user.phone, `LIFELINE SOS ALERT: ${user.name} has triggered an emergency. Location shared. Please respond immediately.`);
    }
  } catch (err) {
    console.error('SOS alert sending error:', err.message);
  }
};

const getMyNotifications = async (userId, page = 1, limit = 20) => {
  const notifications = await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  const unreadCount = await Notification.countDocuments({ userId, isRead: false });
  return { notifications, unreadCount };
};

const markAllRead = async (userId) => {
  await Notification.updateMany({ userId, isRead: false }, { isRead: true });
};

module.exports = { sendNotificationToUser, sendNgoNotification, sendSosAlerts, getMyNotifications, markAllRead };
