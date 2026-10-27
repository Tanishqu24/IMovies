const http = require('http');
const dotenv = require('dotenv');
const { Server } = require('socket.io');

// Load environment variables
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');
const seatLockService = require('./services/seatLockService');

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Provide io instance to express app
app.set('io', io);

// Socket.IO real-time event handling
io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);

  // User joins a specific show room
  socket.on('joinShow', ({ showId }) => {
    if (!showId) return;
    const roomName = `show_${showId}`;
    socket.join(roomName);
    console.log(`[Socket.IO] Socket ${socket.id} joined ${roomName}`);

    // Send currently locked seats to this user
    socket.emit('seatStatusChanged', {
      showId,
      lockedSeats: seatLockService.getLockedSeats(showId)
    });
  });

  // User leaves show room
  socket.on('leaveShow', ({ showId }) => {
    if (!showId) return;
    socket.leave(`show_${showId}`);
    console.log(`[Socket.IO] Socket ${socket.id} left show_${showId}`);
  });

  // User selecting/deselecting a seat (ephemeral broadcast)
  socket.on('seatSelected', ({ showId, seatId, isSelected, userId }) => {
    socket.to(`show_${showId}`).emit('remoteSeatSelected', {
      seatId,
      isSelected,
      userId
    });
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

// Connect DB and listen
const startServer = async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🎬 IMovies Backend running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`🔗 API URL: http://localhost:${PORT}/api`);
    console.log(`====================================================`);
  });
};

startServer();

