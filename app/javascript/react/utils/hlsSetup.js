// app/javascript/react/utils/hlsSetup.js

/**
 * Initialize HLS.js library by loading it dynamically if needed
 * @returns {Promise} - Resolves when HLS.js is ready
 */
export const initializeHLS = () => {
  return new Promise((resolve) => {
    // Check if HLS.js is already loaded
    if (window.Hls) {
      resolve(window.Hls);
      return;
    }

    // Load HLS.js dynamically
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
    script.async = true;

    script.onload = () => {
      // HLS.js is now loaded
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
};

/**
 * Set up HLS.js on a video element with the provided source
 * @param {HTMLVideoElement} videoElement - The video element to attach HLS.js to
 * @param {string} source - The HLS source URL
 * @returns {Object|null} - The HLS instance or null if not supported
 */
export const setupHLSPlayer = (videoElement, source) => {
  if (!videoElement || !source) {
    return null;
  }

  // If HLS.js is not available, try to play natively
  if (!window.Hls) {
    videoElement.src = source;
    return null;
  }

  // Check if HLS.js is supported
  if (window.Hls.isSupported()) {
    const hls = new window.Hls({
      maxBufferLength: 30,
      maxMaxBufferLength: 600,
      enableWorker: true,
      lowLatencyMode: false,
      startLevel: -1, // Auto level selection
    });

    hls.loadSource(source);
    hls.attachMedia(videoElement);

    hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
      // Try to play automatically (may be blocked by browser autoplay policies)
      videoElement.play().catch((e) => {
        console.log('Auto-play prevented:', e);
      });
    });

    // Error handling
    hls.on(window.Hls.Events.ERROR, (event, data) => {
      if (data.fatal) {
        switch (data.type) {
          case window.Hls.ErrorTypes.NETWORK_ERROR:
            console.error('HLS network error:', data);
            hls.startLoad(); // Try to recover
            break;
          case window.Hls.ErrorTypes.MEDIA_ERROR:
            console.error('HLS media error:', data);
            hls.recoverMediaError(); // Try to recover
            break;
          default:
            // Cannot recover
            console.error('HLS fatal error:', data);
            hls.destroy();
            break;
        }
      }
    });

    return hls;
  } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
    // HLS is supported natively (Safari, iOS)
    videoElement.src = source;
    return null;
  }

  return null;
};
