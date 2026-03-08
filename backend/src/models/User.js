const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  passwordHash: { type: String },
  role: {
    type: String,
    enum: ['CITIZEN', 'VOLUNTEER', 'NGO_ADMIN', 'AUTHORITY', 'SUPER_ADMIN'],
    default: 'CITIZEN'
  },
  isVerified: { type: Boolean, default: false },
  profilePicture: { type: String },
  ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ngo' },
  rewardPoints: { type: Number, default: 0 },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  notificationPreferences: {
    push: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    email: { type: Boolean, default: true }
  },
  fcmToken: { type: String },
  emailVerificationOtp: { type: String },
  emailVerificationExpiry: { type: Date },
  phoneVerificationOtp: { type: String },
  phoneVerificationExpiry: { type: Date },
  passwordResetToken: { type: String },
  passwordResetExpiry: { type: Date },
  refreshTokens: [{ token: String, createdAt: { type: Date, default: Date.now } }],
  oauth: {
    googleId: { type: String }
  },
  skills: [String],
  bio: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

userSchema.index({ location: '2dsphere' });

userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash') || !this.passwordHash) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.refreshTokens;
  delete obj.emailVerificationOtp;
  delete obj.phoneVerificationOtp;
  delete obj.passwordResetToken;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
