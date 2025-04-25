// app/javascript/react/index.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import SoukMachineApp from './components/SoukMachineApp';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('react-app');

  if (container) {
    const root = createRoot(container);
    root.render(<SoukMachineApp />);
    console.log('React app initialized successfully');
  } else {
    console.error('Could not find #react-app container element');
  }
});
