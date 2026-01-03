import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

// Capacitor initialisieren
if (Capacitor.isNativePlatform()) {
  // Status Bar für iOS/Android konfigurieren
  StatusBar.setStyle({ style: Style.Light });
  StatusBar.setBackgroundColor({ color: '#f8fafc' });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);