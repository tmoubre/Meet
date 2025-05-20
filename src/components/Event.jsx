// src/components/Event.jsx
import React, { useState } from 'react';

const Event = ({ event }) => {
  const [showDetails, setShowDetails] = useState(false);

  const dateTime = event?.created
  ? new Date(event.created).toLocaleString()
  : 'No date available';
  
  return (
    <li className="event">
      <h2>{event.summary}</h2>
      <p>{event.location}</p>
      <p>{dateTime}</p>

      <button onClick={() => setShowDetails(!showDetails)}>
        {showDetails ? 'Hide Details' : 'Show Details'}
      </button>

      {showDetails && (
        <div className="event-details">
          <p>{event.description}</p>
        </div>
      )}
    </li>
  );
};

export default Event;

