const socketIO = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected');

    // Join event room
    socket.on('joinEvent', (eventId) => {
      socket.join(`event_${eventId}`);
      console.log(`Client joined event: ${eventId}`);
    });

    // Leave event room
    socket.on('leaveEvent', (eventId) => {
      socket.leave(`event_${eventId}`);
      console.log(`Client left event: ${eventId}`);
    });

    // Handle real-time event updates
    socket.on('eventUpdate', (data) => {
      socket.to(`event_${data.eventId}`).emit('eventUpdated', data);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  // Store io instance on app for use in routes
  return io;
};

module.exports = socketIO; 