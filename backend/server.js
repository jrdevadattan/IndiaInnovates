require('dotenv').config();
const http = require('http');
const app = require('./app');
const { initSockets } = require('./src/sockets');
const { startSlaMonitor } = require('./src/jobs/slaMonitor.job');
const { startWeeklyDigest } = require('./src/jobs/weeklyDigest.job');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Initialize sockets
initSockets(server);

connectDB().then(() => {
  startSlaMonitor();
  startWeeklyDigest();
}).catch(err => {
  console.error('⚠️  MongoDB not connected:', err.message);
  console.error('   → Set MONGODB_URI in backend/.env to enable database features.');
});

// Start HTTP server regardless of DB state so health check is reachable
server.listen(PORT, () => {
  console.log(`🚀 LIFELINE server running on port ${PORT}`);
});
