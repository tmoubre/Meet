//Event.jsx

import React, { useState } from 'react';

const Event = ({ event }) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleToggle = () => {
    setShowDetails(prev => !prev);
  };

  return (
    <li className="event">
      <h2>{event.summary}</h2>
      <p>{event.location}</p>
      <p>{new Date(event.start.dateTime).toLocaleString()}</p>
      <button onClick={handleToggle}>
        {showDetails ? 'Hide Details' : 'Show Details'}
      </button>
      {showDetails && (
        <div className="details">
          <p>{event.description}</p>
        </div>
      )}
    </li>
  );
};

export default Event;


