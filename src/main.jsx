// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import * as atatus from 'atatus-spa';
import { registerSW } from 'virtual:pwa-register';

// Atatus monitoring
atatus.config('55d794d255324fc79c3f5150ec0a2ce0').install();

// Register service worker (Vite PWA plugin)
registerSW({
  onNeedRefresh() {
    console.log('🌀 A new version is available. Refresh to update.');
  },
  onOfflineReady() {
    console.log('📡 App is ready to work offline.');
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
