import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EventList from '../components/events/EventList';
import { setEvents, setLoading, setError } from '../features/events/eventSlice';
import api from '../services/api';
import SearchAndFilter from '../components/events/SearchAndFilter';
import { format } from 'date-fns';

const HomePage = () => {
  const dispatch = useDispatch();
  const { items: events, loading, error } = useSelector(state => state.events);

  // Add filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const fetchEvents = async () => {
    dispatch(setLoading(true));
    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory && selectedCategory !== 'All Categories') {
        params.append('category', selectedCategory);
      }
      if (selectedDate) params.append('date', selectedDate);
      if (selectedStatus && selectedStatus !== 'All Status') {
        params.append('status', selectedStatus);
      }

      const response = await api.get(`/events?${params.toString()}`);
      dispatch(setEvents(response.data));
    } catch (err) {
      dispatch(setError(err.response?.data?.message || 'Failed to fetch events'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Fetch events when filters change
  useEffect(() => {
    fetchEvents();
  }, [searchTerm, selectedCategory, selectedDate, selectedStatus]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search events..."
          className="flex-1 p-2 border rounded"
          value={searchTerm}
          onChange={handleSearch}
        />
        
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="p-2 border rounded"
        >
          <option value="">All Categories</option>
          <option value="Sports">Sports</option>
          <option value="Music">Music</option>
          <option value="Technology">Technology</option>
          <option value="Art">Art</option>
          <option value="Food">Food</option>
          <option value="Business">Business</option>
          <option value="Education">Education</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Health">Health</option>
          <option value="Social">Social</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="p-2 border rounded"
        />

        <select
          value={selectedStatus}
          onChange={handleStatusChange}
          className="p-2 border rounded"
        >
          <option value="">All Status</option>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="past">Past</option>
        </select>
      </div>

      <EventList events={events} loading={loading} error={error} />
    </div>
  );
};

export default HomePage; 