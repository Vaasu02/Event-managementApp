import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    this.socket = io('http://localhost:5000');

    this.socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinEvent(eventId) {
    if (this.socket) {
      this.socket.emit('joinEvent', eventId);
    }
  }

  leaveEvent(eventId) {
    if (this.socket) {
      this.socket.emit('leaveEvent', eventId);
    }
  }

  onAttendeeUpdate(callback) {
    if (this.socket) {
      this.socket.on('attendeeUpdate', callback);
    }
  }

  onEventUpdate(callback) {
    if (this.socket) {
      this.socket.on('eventUpdated', callback);
    }
  }

  removeEventListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }
}

export default new SocketService(); 