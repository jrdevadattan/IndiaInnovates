const jwt = require('jsonwebtoken');

const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m'
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  });
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

const getSlaDeadline = (severity) => {
  const now = new Date();
  const minutes = {
    CRITICAL: parseInt(process.env.SLA_CRITICAL_MINUTES) || 10,
    SEVERE: parseInt(process.env.SLA_SEVERE_MINUTES) || 60,
    MODERATE: parseInt(process.env.SLA_MODERATE_MINUTES) || 360
  };
  return new Date(now.getTime() + (minutes[severity] || 360) * 60 * 1000);
};

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const getOtpExpiry = (minutes = 10) => {
  return new Date(Date.now() + minutes * 60 * 1000);
};

module.exports = { generateAccessToken, generateRefreshToken, verifyRefreshToken, getSlaDeadline, generateOtp, getOtpExpiry };
