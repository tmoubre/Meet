import React, { useState } from 'react';

const NumberOfEvents = () => {
  const [number, setNumber] = useState(32);

  const handleInputChanged = (e) => {
    const value = e.target.value;
    const parsedValue = parseInt(value, 10);
    setNumber(isNaN(parsedValue) ? '' : parsedValue);
  };

  return (
    <div className="number-of-events">
      <input
        id="number-of-events"
        type="number"
        role="textbox"
        value={number}
        onChange={handleInputChanged}
      />
    </div>
  );
};

export default NumberOfEvents;


