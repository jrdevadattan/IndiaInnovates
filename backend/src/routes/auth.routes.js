const express = require('express');
const router = express.Router();
const passport = require('passport');
const { protect } = require('../middleware/auth.middleware');
const { authLimiter } = require('../middleware/rateLimit.middleware');
const ctrl = require('../controllers/auth.controller');

router.post('/register', authLimiter, ctrl.register);
router.post('/login', authLimiter, ctrl.login);
router.post('/logout', protect, ctrl.logout);
router.post('/refresh', authLimiter, ctrl.refreshToken);
router.post('/verify-email', protect, ctrl.verifyEmail);
router.post('/forgot-password', authLimiter, ctrl.forgotPassword);
router.post('/reset-password', ctrl.resetPassword);
router.get('/me', protect, ctrl.getMe);
router.patch('/fcm-token', protect, ctrl.updateFcmToken);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login?error=oauth' }),
  ctrl.googleCallback
);

module.exports = router;
