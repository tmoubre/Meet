// App.jsx

import React, { useState, useEffect } from 'react';
import CitySearch from './components/CitySearch';
import NumberOfEvents from './components/NumberOfEvents';
import CityEventsChart from './components/CityEventsChart.jsx';
import EventList from './components/EventList';
import { extractLocations, getEvents } from './api';
import mockData from './mock-data';
import './App.css';
import { InfoAlert, ErrorAlert, WarningAlert } from './components/Alert';

const App = () => {
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]); // <-- Store full event list
  const [allLocations, setAllLocations] = useState([]);
  const [currentCity, setCurrentCity] = useState('See all cities');
  const [currentNOE, setCurrentNOE] = useState(mockData.length);
  const [infoAlert, setInfoAlert] = useState('');
  const [errorAlert, setErrorAlert] = useState('');
  const [warningAlert, setWarningAlert] = useState('');
  const [showIosInstallBanner, setShowIosInstallBanner] = useState(false);

  // iOS detection
  const isIos = () => /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
  const isInStandaloneMode = () => 'standalone' in window.navigator && window.navigator.standalone;

  useEffect(() => {
    if (isIos() && !isInStandaloneMode()) {
      setShowIosInstallBanner(true);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (navigator.onLine) {
        setWarningAlert('');
      } else {
        setWarningAlert('You are offline. Displayed events may not be up to date.');
      }

      const eventsFromApi = await getEvents();
      setAllEvents(eventsFromApi); // <-- Save full event list

      const filtered =
        currentCity === 'See all cities'
          ? eventsFromApi
          : eventsFromApi.filter((e) => e.location === currentCity);
      setEvents(filtered.slice(0, currentNOE));
      setAllLocations(extractLocations(eventsFromApi));
    };

    fetchData();
  }, [currentCity, currentNOE]);

  return (
    <div className="App">
      <h1>Meet App</h1>

      <div className="alerts-container">
        {infoAlert && <InfoAlert text={infoAlert} />}
        {warningAlert && <WarningAlert text={warningAlert} />}
        {errorAlert && <ErrorAlert text={errorAlert} />}
      </div>

      {showIosInstallBanner && (
        <div className="ios-install-banner">
          <p>
            To install this app, tap <strong>Share</strong> then <strong>Add to Home Screen</strong>.
          </p>
          <button onClick={() => setShowIosInstallBanner(false)}>Dismiss</button>
        </div>
      )}

      <CitySearch
        allLocations={allLocations}
        setCurrentCity={setCurrentCity}
        setInfoAlert={setInfoAlert}
      />
      <NumberOfEvents
        currentNOE={currentNOE}
        setCurrentNOE={setCurrentNOE}
        setErrorAlert={setErrorAlert}
      />
      <CityEventsChart allLocations={allLocations} events={allEvents} />
      <EventList events={events} />
    </div>
  );
};

export default App;

