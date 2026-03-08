const mongoose = require('mongoose');

const ngoSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  registrationNumber: { type: String, unique: true, sparse: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String },
  website: { type: String },
  description: { type: String },
  adminIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  categories: [{
    type: String,
    enum: ['SANITATION', 'INFRASTRUCTURE', 'HEALTH', 'ENVIRONMENT', 'SAFETY', 'DISASTER', 'OTHER']
  }],
  serviceArea: {
    type: { type: String, enum: ['Polygon'], default: 'Polygon' },
    coordinates: { type: [[[Number]]], default: undefined }
  },
  headquarters: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },
    address: String,
    city: String,
    state: String
  },
  documents: [{
    type: { type: String, enum: ['REGISTRATION', 'TAX_EXEMPTION', 'OTHER'] },
    url: String,
    verified: { type: Boolean, default: false }
  }],
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: Date,
  stats: {
    totalCasesHandled: { type: Number, default: 0 },
    resolvedCount: { type: Number, default: 0 },
    avgResponseTimeMinutes: { type: Number, default: 0 },
    slaBreachCount: { type: Number, default: 0 },
    volunteerCount: { type: Number, default: 0 },
    marketplaceRevenue: { type: Number, default: 0 }
  },
  bankDetails: {
    accountNumber: String,
    ifsc: String,
    upiId: String
  },
  logo: String,
  coverImage: String
}, { timestamps: true });

ngoSchema.index({ 'headquarters': '2dsphere' });
ngoSchema.index({ categories: 1, isVerified: 1 });

module.exports = mongoose.model('Ngo', ngoSchema);
