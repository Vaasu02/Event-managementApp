import React from 'react';
import EventCard from './EventCard';
import Loading from '../common/Loading';
import { ErrorBoundary } from 'react-error-boundary';

const EventList = ({ events, loading, error }) => {
  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-8">
        Error: {error}
      </div>
    );
  }

  if (!events?.length) {
    return (
      <div className="text-center text-gray-500 py-8">
        No events found.
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    </ErrorBoundary>
  );
};

export default EventList; 