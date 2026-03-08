const mongoose = require('mongoose');

const sosAlertSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }
  },
  address: String,
  voiceNoteUrl: String,
  mediaUrls: [String],
  description: String,
  status: {
    type: String,
    enum: ['ACTIVE', 'RESPONDED', 'RESOLVED', 'CANCELLED'],
    default: 'ACTIVE'
  },
  respondingNgoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ngo' },
  respondingVolunteerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notifiedNgos: [{
    ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ngo' },
    notifiedAt: { type: Date, default: Date.now },
    responded: { type: Boolean, default: false }
  }],
  notifiedAuthorities: [{
    authorityId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notifiedAt: { type: Date, default: Date.now }
  }],
  smsAlertsSent: [{
    phone: String,
    sentAt: { type: Date, default: Date.now }
  }],
  chatMessages: [{
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    senderName: String,
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],
  liveLocation: [{
    coordinates: [Number],
    recordedAt: { type: Date, default: Date.now }
  }],
  slaDeadline: Date,
  resolvedAt: Date
}, { timestamps: true });

sosAlertSchema.index({ location: '2dsphere' });
sosAlertSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('SosAlert', sosAlertSchema);
