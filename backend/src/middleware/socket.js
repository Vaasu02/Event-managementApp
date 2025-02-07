module.exports = (io) => {
  // Log when the Socket.IO server starts
  console.log('Socket.IO server initialized');

  io.on('connection', (socket) => {
    console.log('New client connected. Socket ID:', socket.id);
    console.log('Total connected clients:', io.engine.clientsCount);

    // Handle room joining
    socket.on('joinRoom', (roomId) => {
      try {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined room:`, roomId);
        console.log('Rooms for this socket:', Array.from(socket.rooms));
        
        const room = io.sockets.adapter.rooms.get(roomId);
        console.log(`Clients in room ${roomId}:`, room ? room.size : 0);
      } catch (error) {
        console.error('Error joining room:', error);
      }
    });

    // Handle room leaving
    socket.on('leaveRoom', (roomId) => {
      try {
        socket.leave(roomId);
        console.log(`Socket ${socket.id} left room:`, roomId);
        
        const room = io.sockets.adapter.rooms.get(roomId);
        console.log(`Remaining clients in room ${roomId}:`, room ? room.size : 0);
      } catch (error) {
        console.error('Error leaving room:', error);
      }
    });

    socket.on('disconnect', (reason) => {
      console.log('Client disconnected. Socket ID:', socket.id);
      console.log('Disconnect reason:', reason);
      console.log('Remaining connected clients:', io.engine.clientsCount);
    });
  });
}; 