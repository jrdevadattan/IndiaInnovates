const User = require('../models/User');
const Reward = require('../models/Reward');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken, generateOtp, getOtpExpiry } = require('../utils/helpers');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
});

// Helper to send token pair
const sendTokens = (res, user, statusCode = 200) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  res.status(statusCode).json({
    success: true,
    accessToken,
    refreshToken,
    user: user.toSafeObject()
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role = 'CITIZEN', phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }

    const allowedRoles = ['CITIZEN', 'VOLUNTEER', 'NGO_ADMIN'];
    const assignedRole = allowedRoles.includes(role) ? role : 'CITIZEN';

    const otp = generateOtp();
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash: password,
      role: assignedRole,
      phone,
      emailVerificationOtp: otp,
      emailVerificationExpiry: getOtpExpiry(10)
    });

    // Initialize rewards record
    await Reward.create({ userId: user._id });

    // Send verification email (non-blocking)
    transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@lifeline.in',
      to: email,
      subject: 'Verify your LIFELINE account',
      html: `<h2>Welcome to LIFELINE!</h2><p>Your verification OTP is: <strong>${otp}</strong></p><p>Valid for 10 minutes.</p>`
    }).catch(err => console.error('Email send failed:', err.message));

    sendTokens(res, user, 201);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account suspended.' });
    }

    const refreshToken = generateRefreshToken(user._id);
    user.refreshTokens.push({ token: refreshToken });
    // Keep only 5 most recent refresh tokens
    if (user.refreshTokens.length > 5) {
      user.refreshTokens = user.refreshTokens.slice(-5);
    }
    await user.save();

    sendTokens(res, user);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken && req.user) {
      req.user.refreshTokens = req.user.refreshTokens.filter(t => t.token !== refreshToken);
      await req.user.save();
    }
    res.json({ success: true, message: 'Logged out.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token required.' });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found.' });
    }

    const tokenExists = user.refreshTokens.some(t => t.token === refreshToken);
    if (!tokenExists) {
      return res.status(401).json({ success: false, message: 'Refresh token revoked.' });
    }

    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    user.refreshTokens = user.refreshTokens.filter(t => t.token !== refreshToken);
    user.refreshTokens.push({ token: newRefreshToken });
    await user.save();

    res.json({ success: true, accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid refresh token.' });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { otp } = req.body;
    const user = req.user;

    const storedOtp = user.emailVerificationOtp || '';
    const providedOtp = (otp || '').toString();
    const otpMatch = storedOtp.length === providedOtp.length &&
      crypto.timingSafeEqual(Buffer.from(storedOtp), Buffer.from(providedOtp));

    if (!otpMatch) {
      return res.status(400).json({ success: false, message: 'Invalid OTP.' });
    }
    if (user.emailVerificationExpiry < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP expired.' });
    }

    user.isVerified = true;
    user.emailVerificationOtp = undefined;
    user.emailVerificationExpiry = undefined;
    await user.save();

    res.json({ success: true, message: 'Email verified.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });
    // Always return success to prevent user enumeration
    if (!user) {
      return res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
    user.passwordResetExpiry = getOtpExpiry(60);
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
    transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@lifeline.in',
      to: email,
      subject: 'Reset your LIFELINE password',
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. Link valid for 1 hour.</p>`
    }).catch(err => console.error('Email send failed:', err.message));

    res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpiry: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Token invalid or expired.' });
    }

    user.passwordHash = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpiry = undefined;
    user.refreshTokens = [];
    await user.save();

    res.json({ success: true, message: 'Password reset successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user.toSafeObject() });
};

exports.updateFcmToken = async (req, res) => {
  try {
    const { fcmToken } = req.body;
    req.user.fcmToken = fcmToken;
    await req.user.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.googleCallback = async (req, res) => {
  const user = req.user;
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshTokens.push({ token: refreshToken });
  await user.save();
  // Redirect to frontend with tokens
  res.redirect(`${process.env.CLIENT_URL}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`);
};
