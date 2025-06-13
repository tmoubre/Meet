// App.jsx

import React, { useState, useEffect } from 'react';
import CitySearch from './components/CitySearch';
import NumberOfEvents from './components/NumberOfEvents';
import EventList from './components/EventList';
import { extractLocations, getEvents } from './api';
import mockData from './mock-data';
import './App.css';
import { InfoAlert, ErrorAlert } from './components/Alert';

const App = () => {
  const [events, setEvents] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [currentCity, setCurrentCity] = useState('See all cities');
  const [currentNOE, setCurrentNOE] = useState(mockData.length);
  const [infoAlert, setInfoAlert] = useState('');
  const [errorAlert, setErrorAlert] = useState('');

  // PWA install modal state
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallModal, setShowInstallModal] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); // Prevent automatic prompt
      setDeferredPrompt(e);
      setShowInstallModal(true); // Automatically show modal
    };

    const handleAppInstalled = () => {
      console.log('✅ App was installed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallNow = async () => {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      console.log('User choice:', result.outcome);
      setShowInstallModal(false);
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Install prompt failed:', error);
    }
  };

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
      <div className="alerts-container">
        {infoAlert && <InfoAlert text={infoAlert} />}
        {errorAlert && <ErrorAlert text={errorAlert} />}
      </div>

      {/* Install Modal - shown automatically if supported */}
      {showInstallModal && (
        <div className="install-modal">
          <div className="modal-content">
            <p>Install the Meet App for a better experience.</p>
            <button onClick={handleInstallNow}>Install App</button>
            <button onClick={() => setShowInstallModal(false)}>Maybe later</button>
          </div>
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

