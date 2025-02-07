import React from 'react';
import { Link } from 'react-router-dom';

const AttendeesList = ({ attendees }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {attendees.map((attendee) => (
        <Link
          key={attendee._id}
          to={`/users/${attendee._id}`}
          className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
        >
          <span className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm mr-2">
            {attendee.username[0].toUpperCase()}
          </span>
          {attendee.username}
        </Link>
      ))}
    </div>
  );
};

export default AttendeesList; 