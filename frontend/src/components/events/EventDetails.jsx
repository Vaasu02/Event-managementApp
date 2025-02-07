import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { CalendarIcon, MapPinIcon, UserGroupIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import Button from '../common/Button';
import AttendeesList from './AttendeesList';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { updateEvent } from '../../features/events/eventSlice';
import socketService from '../../services/socketService';

const EventDetails = ({ event }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    _id,
    title,
    description,
    date,
    time,
    location,
    imageUrl,
    attendees = [],
    maxAttendees,
    category,
    creator,
    isPrivate
  } = event;

  const isCreator = user?._id && (creator._id === user._id || creator === user._id);
  const isAttending = attendees.some(attendee => 
    (attendee._id === user?._id) || (attendee === user?._id)
  );
  const isFull = attendees.length >= maxAttendees;

  const handleEventUpdate = useCallback((data) => {
    console.log('Received event update:', data);
    if (data.event._id === event._id) {
      console.log('Updating event in store:', data.event);
      dispatch(updateEvent(data.event));
      
      // Show toast notification
      if (data.type === 'ATTENDEE_JOINED') {
        console.log('New attendee joined:', data.event.attendees);
        toast.success('New attendee joined the event!');
      } else if (data.type === 'ATTENDEE_LEFT') {
        console.log('Attendee left:', data.event.attendees);
        toast.info('An attendee left the event');
      }
    }
  }, [event._id, dispatch]);

  useEffect(() => {
    console.log('Setting up socket connection for event:', event._id);
    const socket = socketService.connect();
    
    // Join the event-specific room
    const roomId = `event_${event._id}`;
    console.log('Joining room:', roomId);
    socket.emit('joinRoom', roomId);

    // Listen for event updates
    socket.on('eventUpdated', (data) => {
      console.log('Received eventUpdated:', data);
      handleEventUpdate(data);
    });

    // Cleanup on component unmount
    return () => {
      console.log('Cleaning up socket listeners');
      socket.emit('leaveRoom', roomId);
      socket.off('eventUpdated');
    };
  }, [event._id, handleEventUpdate]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      try {
        setIsLoading(true);
        await api.delete(`/events/${_id}`);
        toast.success('Event deleted successfully');
        navigate('/');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete event');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAttendClick = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setIsLoading(true);
      if (isAttending) {
        await api.delete(`/events/${_id}/attend`);
        toast.success('Successfully left the event');
      } else {
        await api.post(`/events/${_id}/attend`);
        toast.success('Successfully joined the event');
      }
      
      // Fetch updated event data
      const response = await api.get(`/events/${_id}`);
      dispatch(updateEvent(response.data));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update attendance');
    } finally {
      setIsLoading(false);
    }
  };

  const renderAttendButton = () => {
    if (!isAuthenticated) {
      return (
        <Button
          onClick={() => navigate('/login')}
          variant="primary"
          className="w-full"
        >
          Login to Attend
        </Button>
      );
    }

    if (isCreator) {
      return null; // Don't show any attend/leave button for the creator
    }

    if (isAttending) {
      return (
        <Button
          onClick={handleAttendClick}
          isLoading={isLoading}
          variant="danger"
          className="w-full"
        >
          Leave Event
        </Button>
      );
    }

    return (
      <Button
        onClick={handleAttendClick}
        isLoading={isLoading}
        disabled={isFull}
        variant="primary"
        className="w-full"
      >
        {isFull ? 'Event Full' : 'Attend Event'}
      </Button>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative h-64 sm:h-96">
        <img
          src={imageUrl || '/default-event.jpg'}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 flex space-x-2">
          <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
            {category}
          </div>
          {isPrivate && (
            <div className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm flex items-center">
              <LockClosedIcon className="h-4 w-4 mr-1" />
              Private
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {isCreator && (
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate(`/events/${_id}/edit`)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDelete}
                isLoading={isLoading}
              >
                Delete
              </Button>
            </div>
          )}
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center text-gray-600">
            <CalendarIcon className="h-6 w-6 mr-2" />
            <span>{format(new Date(date), 'MMMM dd, yyyy')} at {time}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <MapPinIcon className="h-6 w-6 mr-2" />
            <span>{location}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <UserGroupIcon className="h-6 w-6 mr-2" />
            <span>{attendees.length} / {maxAttendees} attendees</span>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-600 whitespace-pre-line">{description}</p>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Attendees</h2>
            <AttendeesList attendees={attendees} />
          </div>

          {!isCreator && (
            <div className="mt-6">
              {renderAttendButton()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails; 