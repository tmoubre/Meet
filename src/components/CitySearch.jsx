//city-search.jsx

import React, { useState, useEffect } from 'react';

const CitySearch = ({
  allLocations = [],
  setCurrentCity = () => {}
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setSuggestions(allLocations);
  }, [allLocations]);

  const handleInputChanged = (e) => {
    const val = e.target.value;
    setQuery(val);
    const filtered = allLocations.filter((loc) =>
      loc.toUpperCase().includes(val.toUpperCase())
    );
    setSuggestions(filtered);
  };

  const handleItemClicked = (loc) => {
    setQuery(loc);
    setShowSuggestions(false);
    setCurrentCity(loc);
  };

  return (
    <div id="city-search">
      <input
        role="textbox"
        className="city"
        placeholder="Search for a city"
        value={query}
        onFocus={() => setShowSuggestions(true)}
        onChange={handleInputChanged}
      />
      {showSuggestions && (
        <ul className="suggestions" role="list">
          {suggestions.map((loc) => (
            <li key={loc} onClick={() => handleItemClicked(loc)}>
              {loc}
            </li>
          ))}
          <li
            key="see-all"
            onClick={() => handleItemClicked('See all cities')}
          >
            <b>See all cities</b>
          </li>
        </ul>
      )}
    </div>
  );
};

export default CitySearch;








