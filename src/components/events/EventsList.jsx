import React, { useState, useEffect } from 'react';
import EventCard from './EventCard';

function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/events');
      const data = await response.json();
      setEvents(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load events');
      setLoading(false);
    }
  };

  const handleJoinEvent = async (eventId) => {
    try {
      // TODO: Replace with actual API call
      await fetch(`/api/events/${eventId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add authentication token here
      });
      alert('Successfully joined the event!');
    } catch (err) {
      alert('Failed to join event');
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center text-red-600 py-8">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Upcoming Evaluation Events
      </h2>
      <div className="space-y-4">
        {events.length === 0 ? (
          <p className="text-center text-gray-600">No upcoming events</p>
        ) : (
          events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onJoin={handleJoinEvent}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default EventsList; 