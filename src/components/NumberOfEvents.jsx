// NumberOfEvents.jsx  

import React, { useState, useEffect } from 'react';

const NumberOfEvents = ({
  currentNOE,
  setCurrentNOE,
  setErrorAlert = () => {} // ✅ default fallback for tests or missing props
}) => {
  // keep an internal state so the input display updates immediately
  const [number, setNumber] = useState(currentNOE);

  // if the parent ever changes the prop, sync it
  useEffect(() => {
    setNumber(currentNOE);
  }, [currentNOE]);

  const handleInputChanged = (e) => {
    const val = e.target.value;
    const parsed = parseInt(val, 10);
    const final = isNaN(parsed) ? 0 : parsed;

    setNumber(final); // update local display

    if (isNaN(parsed) || parsed <= 0) {
      setErrorAlert('Please enter a valid number greater than zero.');
    } else {
      setErrorAlert('');
      setCurrentNOE(final); // notify parent
    }
  };

  return (
    <div className="number-of-events">
      <label htmlFor="number-of-events">Number of Events:</label>
      <input
        id="number-of-events"
        type="number"
        role="spinbutton"
        aria-label="Number of Events:"
        value={number}
        onChange={handleInputChanged}
      />
    </div>
  );
};

export default NumberOfEvents;
