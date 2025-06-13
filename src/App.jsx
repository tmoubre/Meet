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

  // PWA install logic
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [installDismissed, setInstallDismissed] = useState(
    localStorage.getItem('installPromptDismissed') === 'true'
  );

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!installDismissed) {
        setShowInstallPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () =>
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, [installDismissed]);

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
        {infoAlert.length > 0 && <InfoAlert text={infoAlert} />}
        {errorAlert.length > 0 && <ErrorAlert text={errorAlert} />}
      </div>

      {/* Modal Install Prompt */}
      {showInstallPrompt && (
        <div className="install-modal">
          <div className="modal-content">
            <p>Install this app for a better experience.</p>
            <button
              onClick={async () => {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                  console.log('User accepted the install prompt');
                } else {
                  console.log('User dismissed the install prompt');
                }
                setShowInstallPrompt(false);
                localStorage.setItem('installPromptDismissed', 'true');
                setInstallDismissed(true);
              }}
            >
              Install App
            </button>
            <button
              onClick={() => {
                setShowInstallPrompt(false);
                localStorage.setItem('installPromptDismissed', 'true');
                setInstallDismissed(true);
              }}
            >
              Maybe later
            </button>
          </div>
        </div>
      )}

      {/* Reopen Modal Link */}
      {!showInstallPrompt && installDismissed && deferredPrompt && (
        <div style={{ textAlign: 'center', margin: '10px 0' }}>
          <button onClick={() => setShowInstallPrompt(true)}>
            Reopen Install Prompt
          </button>
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
