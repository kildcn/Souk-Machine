// app/javascript/packs/souk_machine_react.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import SoukMachineApp from '../react/components/SoukMachineApp';

// Initialize HLS.js if needed for video streaming
const initializeHLS = async () => {
  if (window.Hls) {
    console.log('HLS.js already loaded');
    return window.Hls;
  }

  try {
    // Load HLS.js dynamically
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
    script.async = true;

    return new Promise((resolve) => {
      script.onload = () => {
        if (window.Hls && window.Hls.isSupported()) {
          console.log('HLS.js loaded successfully');
        } else {
          console.warn('HLS.js loaded but not supported in this browser');
        }
        resolve(window.Hls);
      };

      script.onerror = () => {
        console.error('Failed to load HLS.js');
        resolve(null);
      };

      document.head.appendChild(script);
    });
  } catch (error) {
    console.error('Error initializing HLS.js:', error);
    return null;
  }
};

// Application initialization
document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM loaded, initializing Souk Machine app');

  // Set Mapbox API key from Rails
  if (window.MAPBOX_API_KEY) {
    console.log('MAPBOX_API_KEY is available');
  }

  // Attempt to load HLS.js for better video compatibility
  try {
    await initializeHLS();
    console.log('HLS.js initialized for better video streaming');
  } catch (error) {
    console.warn('Could not initialize HLS.js, will fall back to native video capabilities');
  }

  // Render the React app
  const container = document.getElementById('react-app');
  if (container) {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <SoukMachineApp />
      </React.StrictMode>
    );
    console.log('React app mounted successfully');
  } else {
    console.error('Could not find #react-app container element');
  }
});
