// App.jsx

import React, { useState, useEffect } from 'react';
import CitySearch from './components/CitySearch';
import NumberOfEvents from './components/NumberOfEvents';
import EventList from './components/EventList';
import { extractLocations, getEvents } from './api';
import mockData from './mock-data';
import './App.css';
import { InfoAlert, ErrorAlert, WarningAlert } from './components/Alert';

const App = () => {
  const [events, setEvents] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [currentCity, setCurrentCity] = useState('See all cities');
  const [currentNOE, setCurrentNOE] = useState(mockData.length);
  const [infoAlert, setInfoAlert] = useState('');
  const [errorAlert, setErrorAlert] = useState('');
  const [warningAlert, setWarningAlert] = useState('');
  const [showIosInstallBanner, setShowIosInstallBanner] = useState(false);

  // iOS detection
  const isIos = () => {
    return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
  };

  const isInStandaloneMode = () =>
    'standalone' in window.navigator && window.navigator.standalone;

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
      <div className="alerts-container">
        {infoAlert && <InfoAlert text={infoAlert} />}
        {errorAlert && <ErrorAlert text={errorAlert} />}
        {warningAlert && <WarningAlert text={warningAlert} />}
      </div>

      {/* iOS Install Instructions */}
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
      <EventList events={events} />
    </div>
  );
};

export default App;

