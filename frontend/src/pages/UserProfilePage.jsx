import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import EventList from '../components/events/EventList';
import Loading from '../components/common/Loading';
import api from '../services/api';

const UserProfilePage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [createdEvents, setCreatedEvents] = useState([]);
  const [attendingEvents, setAttendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const [userRes, createdRes, attendingRes] = await Promise.all([
          api.get(`/users/${userId}`),
          api.get(`/users/${userId}/events`),
          api.get(`/users/${userId}/attending`)
        ]);
        
        setUser(userRes.data);
        setCreatedEvents(createdRes.data);
        setAttendingEvents(attendingRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) return <Loading />;
  if (error) return <div className="text-red-600 text-center py-8">{error}</div>;
  if (!user) return <div className="text-center py-8">User not found</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <div className="mt-4 bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
              {user.username[0].toUpperCase()}
            </div>
            <div className="ml-6">
              <h2 className="text-xl font-semibold">{user.username}</h2>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Events Created by {user.username}</h2>
        <EventList events={createdEvents} loading={loading} error={error} />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Events {user.username} is Attending</h2>
        <EventList events={attendingEvents} loading={loading} error={error} />
      </div>
    </div>
  );
};

export default UserProfilePage; 