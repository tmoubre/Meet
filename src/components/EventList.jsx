// src/components/EventList.js
import React from 'react';
import Event from './Event';

const EventList = ({ events = [] }) => {
  return (
    <ul id="event-list">
      {events.map(evt => (
        <Event key={evt.id} event={evt} />
      ))}
    </ul>
  );
};

export default EventList;
