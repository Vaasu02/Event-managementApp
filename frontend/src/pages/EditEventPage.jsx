import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EventForm from '../components/events/EventForm';
import Loading from '../components/common/Loading';
import api from '../services/api';

const EditEventPage = () => {
  const navigate = useNavigate();
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
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      const response = await api.put(`/events/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate(`/events/${response.data._id}`);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update event');
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!event) return <div>Event not found</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Event</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <EventForm 
          initialValues={{
            title: event.title,
            description: event.description,
            category: event.category,
            date: event.date.split('T')[0],
            time: event.time,
            location: event.location,
            maxAttendees: event.maxAttendees,
            isPrivate: event.isPrivate
          }}
          onSubmit={handleSubmit}
          buttonText="Update Event"
        />
      </div>
    </div>
  );
};

export default EditEventPage; 