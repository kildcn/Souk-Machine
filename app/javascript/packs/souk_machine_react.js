// app/javascript/packs/souk_machine_react.js
import { initializeHLS } from '../react/utils/hlsSetup';

// Initialize HLS.js if needed for video streaming
document.addEventListener('DOMContentLoaded', async () => {
  // Attempt to load HLS.js for better video compatibility
  try {
    await initializeHLS();
    console.log('HLS.js initialized for better video streaming');
  } catch (error) {
    console.warn('Could not initialize HLS.js, will fall back to native video capabilities');
  }

  // Import the React app (using dynamic import for better performance)
  import('../react')
    .then(() => {
      console.log('React app loaded successfully');
    })
    .catch(error => {
      console.error('Failed to load React app:', error);
    });
});
