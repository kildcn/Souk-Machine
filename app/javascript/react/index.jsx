// app/javascript/react/index.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import SoukMachineApp from './components/SoukMachineApp';

// Wait for DOM to load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initReact);
} else {
  initReact();
}

function initReact() {
  const container = document.getElementById('react-app');
  if (container) {
    try {
      const root = createRoot(container);
      root.render(<SoukMachineApp />);
      console.log('React app mounted successfully');
    } catch (error) {
      console.error('Failed to mount React app:', error);
      // Show user-friendly error
      container.innerHTML = `
        <div style="text-align: center; padding: 20px; color: white;">
          <h2 style="color: #d91fe5;">React Loading Error</h2>
          <p>There was a problem loading the application. Technical details:</p>
          <pre style="background: rgba(0,0,0,0.2); padding: 10px; text-align: left; overflow: auto;">${error.message}</pre>
        </div>
      `;
    }
  } else {
    console.error('Could not find #react-app element');
  }
}
