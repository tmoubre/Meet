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

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isiOS, setIsIOS] = useState(false);
  const [isInStandaloneMode, setIsInStandaloneMode] = useState(false);

  useEffect(() => {
    const iOS = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    const standalone = window.navigator.standalone === true;
    setIsIOS(iOS);
    setIsInStandaloneMode(standalone);
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', () => console.log('✅ App installed'));

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('📲 Install accepted');
      } else {
        console.log('❌ Install dismissed');
      }
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const allEvents = await getEvents();
      const filtered = currentCity === 'See all cities'
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

      {/* Modal */}
      {showInstallPrompt && (
        <div className="install-modal">
          <div className="modal-content">
            <p>Install this app for a better experience.</p>
            <button onClick={handleInstallClick}>Install App</button>
            <button onClick={() => setShowInstallPrompt(false)}>Maybe later</button>
          </div>
        </div>
      )}

      {/* iOS prompt */}
      {isiOS && !isInStandaloneMode && (
        <div className="ios-install-banner">
          <p>
            Tap <strong>Share</strong> then <strong>Add to Home Screen</strong> to install the app.
          </p>
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
