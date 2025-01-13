import React from 'react';
import PropTypes from 'prop-types';

function EventCard({ event, onJoin }) {
  const { title, date, time, area, gradeLevel, location } = event;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <div className="space-y-2 text-gray-600">
        <p>
          <span className="font-medium">Date & Time:</span>{' '}
          {date} at {time}
        </p>
        <p>
          <span className="font-medium">Area of Evaluation:</span>{' '}
          Area {area}
        </p>
        <p>
          <span className="font-medium">Grade Level:</span>{' '}
          Grade {gradeLevel}
        </p>
        {location && (
          <p>
            <span className="font-medium">Location:</span> {location}
          </p>
        )}
      </div>
      <button
        onClick={() => onJoin(event.id)}
        className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
      >
        Join Event
      </button>
    </div>
  );
}

EventCard.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    area: PropTypes.oneOf(['1', '3']).isRequired,
    gradeLevel: PropTypes.oneOf(['5', '8']).isRequired,
    location: PropTypes.string
  }).isRequired,
  onJoin: PropTypes.func.isRequired
};

export default EventCard; 