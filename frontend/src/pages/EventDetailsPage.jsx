import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EventDetails from '../components/events/EventDetails';
import Loading from '../components/common/Loading';
import api from '../services/api';
import socketService from '../services/socket';

const EventDetailsPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        setEvent(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch event');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();

    // Socket.io setup
    socketService.joinEvent(id);
    socketService.onAttendeeUpdate((data) => {
      if (data.eventId === id) {
        setEvent(prev => ({
          ...prev,
          attendees: data.attendees
        }));
      }
    });

    return () => {
      socketService.leaveEvent(id);
      socketService.removeEventListeners();
    };
  }, [id]);

  const handleAttend = async () => {
    try {
      const response = await api.post(`/events/${id}/attend`);
      setEvent(response.data);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to attend event');
    }
  };

  const handleLeave = async () => {
    try {
      const response = await api.delete(`/events/${id}/attend`);
      setEvent(response.data);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to leave event');
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!event) return <div>Event not found</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <EventDetails 
        event={event}
        onAttend={handleAttend}
        onLeave={handleLeave}
      />
    </div>
  );
};

export default EventDetailsPage; 