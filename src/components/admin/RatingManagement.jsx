import React, { useState } from 'react';

function RatingManagement() {
  const [selectedEvent, setSelectedEvent] = useState('');
  const [participants, setParticipants] = useState([]);

  const mockEvents = [
    { id: 1, title: 'Event 1' },
    { id: 2, title: 'Event 2' },
  ];

  const handleRatingChange = (participantId, rating) => {
    setParticipants(
      participants.map((p) =>
        p.id === participantId ? { ...p, rating } : p
      )
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Participant Ratings</h2>
        <div className="max-w-xs">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Event
          </label>
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select an event...</option>
            {mockEvents.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedEvent && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {participants.map((participant) => (
                <tr key={participant.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {participant.name}
                    </div>
                    <div className="text-sm text-gray-500">{participant.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={participant.rating || ''}
                      onChange={(e) =>
                        handleRatingChange(participant.id, e.target.value)
                      }
                      className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select rating...</option>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <option key={rating} value={rating}>
                          {rating} Stars
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <textarea
                      value={participant.notes || ''}
                      onChange={(e) =>
                        setParticipants(
                          participants.map((p) =>
                            p.id === participant.id
                              ? { ...p, notes: e.target.value }
                              : p
                          )
                        )
                      }
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      rows="2"
                      placeholder="Add notes..."
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RatingManagement; 