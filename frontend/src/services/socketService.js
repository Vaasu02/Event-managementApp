import io from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (!this.socket) {
      console.log('Attempting to connect to socket server at:', SOCKET_URL);
      this.socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        autoConnect: true,
        reconnection: true,
        path: '/socket.io'
      });
      
      this.socket.on('connect', () => {
        console.log('Socket connected successfully with ID:', this.socket.id);
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection failed:', error.message);
      });

      this.socket.on('error', (error) => {
        console.error('Socket error:', error);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Socket disconnected. Reason:', reason);
      });
    }
    return this.socket;
  }

  joinRoom(roomId) {
    if (this.socket) {
      console.log('Attempting to join room:', roomId);
      this.socket.emit('joinRoom', roomId);
    } else {
      console.warn('Cannot join room: socket not connected');
    }
  }

  leaveRoom(roomId) {
    if (this.socket) {
      console.log('Leaving room:', roomId);
      this.socket.emit('leaveRoom', roomId);
    }
  }

  disconnect() {
    if (this.socket) {
      console.log('Disconnecting socket');
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default new SocketService(); 