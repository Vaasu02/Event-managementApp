import React from 'react';
import { useNavigate } from 'react-router-dom';
import EventForm from '../components/events/EventForm';
import api from '../services/api';

const CreateEventPage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      const response = await api.post('/events', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate(`/events/${response.data._id}`);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create event');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Event</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <EventForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default CreateEventPage; 