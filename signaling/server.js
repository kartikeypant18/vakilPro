// Load environment variables from project root .env so the signaling server
// can share the same JWT secret as the main Next app when run locally.
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET not found in environment. Using fallback.');
}
const PORT = process.env.PORT || 4000;

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: true,
    methods: ['GET', 'POST'],
  },
});

io.use((socket, next) => {
  const token = socket.handshake.auth?.token || socket.handshake.query?.token;
  console.log('Handshake auth:', socket.handshake.auth, 'query:', socket.handshake.query);
  if (!token) return next(new Error('Auth token required'));
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // Attach payload to socket for later checks
    socket.user = payload;
    return next();
  } catch (err) {
    console.error('JWT verify failed:', err && err.message ? err.message : err);
    return next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  const { bookingId } = socket.handshake.query;
  if (!bookingId) {
    socket.disconnect(true);
    return;
  }

  const room = `booking:${bookingId}`;
  socket.join(room);
  
  // Get user ID based on role
  const userId = socket.user.role === 'lawyer' ? socket.user.lawyerId : socket.user.clientId;
  const userName = socket.user.name || socket.user.role;
  
  console.log(`User ${userName} (${userId}) joined room: ${room}`);
  socket.to(room).emit('user:joined', { userId, role: socket.user.role, name: userName });

  socket.on('call:offer', (payload) => {
    socket.to(room).emit('call:offer', payload);
  });

  socket.on('call:answer', (payload) => {
    socket.to(room).emit('call:answer', payload);
  });

  socket.on('call:ice', (payload) => {
    socket.to(room).emit('call:ice', payload);
  });

  socket.on('call:hangup', (payload) => {
    socket.to(room).emit('call:hangup', payload);
  });

  // Chat message forwarding
  socket.on('chat:message', (payload) => {
    socket.to(room).emit('chat:message', payload);
  });

  socket.on('disconnect', () => {
    socket.leave(room);
  });
});

server.listen(PORT, () => {
  console.log(`Signaling server listening on ${PORT}`);
});