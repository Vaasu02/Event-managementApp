import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import EventList from '../components/events/EventList';
import api from '../services/api';
import Loading from '../components/common/Loading';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const [createdEvents, setCreatedEvents] = useState([]);
  const [attendingEvents, setAttendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchUserEvents = async () => {
      if (!user?._id) return;
      
      try {
        setLoading(true);
        const [createdRes, attendingRes] = await Promise.all([
          api.get(`/users/${user._id}/events`),
          api.get(`/users/${user._id}/attending`)
        ]);
        
        setCreatedEvents(createdRes.data);
        setAttendingEvents(attendingRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch user events');
      } finally {
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, [user?._id, isAuthenticated, navigate]);

  if (!isAuthenticated) return null;
  if (loading) return <Loading />;
  if (!user) return <div className="text-center py-8">Please log in to view your profile</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <div className="mt-4 bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
              {user.username ? user.username[0].toUpperCase() : '?'}
            </div>
            <div className="ml-6">
              <h2 className="text-xl font-semibold">{user.username}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      {error ? (
        <div className="text-red-600 text-center py-4">{error}</div>
      ) : (
        <>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Events</h2>
            <EventList 
              events={createdEvents} 
              loading={loading} 
              error={error}
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Events You're Attending</h2>
            <EventList 
              events={attendingEvents} 
              loading={loading} 
              error={error}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage; 