require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { passport, initPassport } = require('./src/config/passport');
const { apiLimiter } = require('./src/middleware/rateLimit.middleware');

// Route imports
const authRoutes = require('./src/routes/auth.routes');
const reportRoutes = require('./src/routes/reports.routes');
const sosRoutes = require('./src/routes/sos.routes');
const ngoRoutes = require('./src/routes/ngo.routes');
const rewardRoutes = require('./src/routes/rewards.routes');
const marketplaceRoutes = require('./src/routes/marketplace.routes');
const adminRoutes = require('./src/routes/admin.routes');

// Initialize Passport strategy (after dotenv.config)
initPassport();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Rate limiting
app.use('/api', apiLimiter);

// Passport
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/sos', sosRoutes);
app.use('/api/ngos', ngoRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'LIFELINE API' }));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

module.exports = app;
