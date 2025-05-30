import React, { useState, useEffect } from 'react';
import CitySearch from './components/CitySearch';
import EventList from './components/EventList';
import NumberOfEvents from './components/NumberofEvents';
import { extractLocations, getEvents } from './api';
import './App.css';

const App = () => {
  const [events, setEvents] = useState([]);
  const [currentCity, setCurrentCity] = useState('See all cities');
  const [allLocations, setAllLocations] = useState([]);
  const [currentNOE, setCurrentNOE] = useState(32);

  useEffect(() => {
    const fetchData = async () => {
      const allEvents = await getEvents();
      const filtered =
        currentCity === 'See all cities'
          ? allEvents
          : allEvents.filter((e) => e.location === currentCity);
      setEvents(filtered.slice(0, currentNOE));
      setAllLocations(extractLocations(allEvents));
    };
    fetchData();
  }, [currentCity, currentNOE]);

  return (
    <div className="App">
      <CitySearch
        allLocations={allLocations}
        setCurrentCity={setCurrentCity}
      />
      <NumberOfEvents
        currentNOE={currentNOE}
        setCurrentNOE={setCurrentNOE}
      />
      <EventList events={events} />
    </div>
  );
};

export default App;



