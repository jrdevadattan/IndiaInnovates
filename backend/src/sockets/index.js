const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('./src/models/User');

let io;

const initSockets = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Auth middleware for sockets
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        const user = await User.findById(decoded.id).select('_id name role ngoId');
        if (user) socket.user = user;
      }
    } catch {
      // Allow unauthenticated connections for public feeds
    }
    next();
  });

  io.on('connection', (socket) => {
    const userId = socket.user?._id;

    // Auto-join personal room
    if (userId) {
      socket.join(`user_${userId}`);
    }

    // NGO admin joins their NGO room
    if (socket.user?.ngoId) {
      socket.join(`ngo_${socket.user.ngoId}`);
    }

    // SUPER_ADMIN joins admin room
    if (socket.user?.role === 'SUPER_ADMIN') {
      socket.join('admin_room');
    }

    // Join SOS tracking room
    socket.on('join_sos', (sosId) => {
      socket.join(`sos_${sosId}`);
    });

    socket.on('leave_sos', (sosId) => {
      socket.leave(`sos_${sosId}`);
    });

    // Join report room
    socket.on('join_report', (reportId) => {
      socket.join(`report_${reportId}`);
    });

    socket.on('disconnect', () => {});
  });

  console.log('✅ Socket.io initialized.');
  return io;
};

const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized.');
  return io;
};

module.exports = { initSockets, getIO };
