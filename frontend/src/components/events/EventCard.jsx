import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { CalendarIcon, MapPinIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const EventCard = ({ event }) => {
  const {
    _id,
    title,
    description,
    date,
    time,
    location,
    imageUrl,
    attendees,
    maxAttendees,
    category
  } = event;

  return (
    <Link to={`/events/${_id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-48">
          <img
            src={imageUrl || '/default-event.jpg'}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 bg-blue-500 text-white px-2 py-1 rounded-full text-sm">
            {category}
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
          
          <div className="space-y-2">
            <div className="flex items-center text-gray-500">
              <CalendarIcon className="h-5 w-5 mr-2" />
              <span className="text-sm">
                {format(new Date(date), 'MMM dd, yyyy')} at {time}
              </span>
            </div>
            
            <div className="flex items-center text-gray-500">
              <MapPinIcon className="h-5 w-5 mr-2" />
              <span className="text-sm">{location}</span>
            </div>
            
            <div className="flex items-center text-gray-500">
              <UserGroupIcon className="h-5 w-5 mr-2" />
              <span className="text-sm">
                {attendees.length} / {maxAttendees} attendees
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard; 