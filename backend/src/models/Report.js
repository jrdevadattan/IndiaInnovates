const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isAnonymous: { type: Boolean, default: false },
  category: {
    type: String,
    enum: ['SANITATION', 'INFRASTRUCTURE', 'HEALTH', 'ENVIRONMENT', 'SAFETY', 'DISASTER', 'OTHER'],
    required: true
  },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  media: [{
    url: String,
    type: { type: String, enum: ['IMAGE', 'VIDEO'] },
    cloudinaryId: String
  }],
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true },
    address: String,
    city: String,
    state: String
  },
  aiAnalysis: {
    severity: { type: String, enum: ['CRITICAL', 'SEVERE', 'MODERATE'], default: 'MODERATE' },
    keywords: [String],
    confidenceScore: Number,
    isVerified: { type: Boolean, default: false },
    isLegitimate: { type: Boolean, default: true },
    estimatedAffected: String,
    analyzedAt: Date
  },
  status: {
    type: String,
    enum: ['SUBMITTED', 'AI_VERIFIED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'],
    default: 'SUBMITTED'
  },
  assignedNgoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ngo' },
  assignedVolunteerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  slaDeadline: Date,
  slaBreached: { type: Boolean, default: false },
  escalationLevel: { type: Number, default: 0 },
  escalationHistory: [{
    ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ngo' },
    escalatedAt: { type: Date, default: Date.now },
    reason: String
  }],
  upvotes: { type: Number, default: 0 },
  upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],
  resolvedAt: Date,
  resolutionNotes: String,
  resolutionProof: [{ url: String, type: String }],
  priorityScore: { type: Number, default: 0 }
}, { timestamps: true });

reportSchema.index({ location: '2dsphere' });
reportSchema.index({ status: 1, slaDeadline: 1 });
reportSchema.index({ createdAt: -1 });
reportSchema.index({ category: 1, status: 1 });

module.exports = mongoose.model('Report', reportSchema);
