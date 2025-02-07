import { useEffect, useCallback } from 'react';
import socketService from '../services/socket';

export const useSocket = (eventId) => {
  useEffect(() => {
    socketService.connect();

    return () => {
      socketService.disconnect();
    };
  }, []);

  const joinEvent = useCallback((id) => {
    socketService.joinEvent(id || eventId);
  }, [eventId]);

  const leaveEvent = useCallback((id) => {
    socketService.leaveEvent(id || eventId);
  }, [eventId]);

  const onAttendeeUpdate = useCallback((callback) => {
    socketService.onAttendeeUpdate(callback);
  }, []);

  const onEventUpdate = useCallback((callback) => {
    socketService.onEventUpdate(callback);
  }, []);

  return {
    joinEvent,
    leaveEvent,
    onAttendeeUpdate,
    onEventUpdate
  };
}; 