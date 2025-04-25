// app/javascript/react/utils/videoUtils.js

/**
 * Check if a video format is supported by the browser
 * @param {string} type - MIME type of the video
 * @returns {boolean} - Whether the format is supported
 */
export const isVideoFormatSupported = (type) => {
  const video = document.createElement('video');
  return video.canPlayType(type) !== '';
};

/**
 * Get the optimal video source URL based on available formats and browser support
 * @param {Object} sources - Object containing video sources for different formats
 * @returns {string} - The best video source URL for the current browser
 */
export const getOptimalVideoSource = (sources) => {
  // Define format priorities (from best to worst)
  const formatPriorities = [
    { type: 'video/mp4', codec: 'avc1.42E01E, mp4a.40.2' },
    { type: 'video/webm', codec: 'vp9, opus' },
    { type: 'video/webm', codec: 'vp8, vorbis' },
    { type: 'video/ogg', codec: 'theora, vorbis' }
  ];

  // Check for direct source
  if (typeof sources === 'string') {
    return sources;
  }

  // If sources is an array of URLs, return the first one
  if (Array.isArray(sources)) {
    return sources[0];
  }

  // If dealing with Cloudinary adaptive streaming
  if (sources.adaptive_streaming) {
    return sources.adaptive_streaming;
  }

  // Try formats based on priorities
  for (const format of formatPriorities) {
    const fullType = `${format.type}; codecs="${format.codec}"`;
    if (isVideoFormatSupported(fullType) && sources[format.type.split('/')[1]]) {
      return sources[format.type.split('/')[1]];
    }
  }

  // Fallback to any available format
  for (const key in sources) {
    if (sources[key]) {
      return sources[key];
    }
  }

  // Final fallback
  return sources.fallback || '';
};

/**
 * Handle Cloudinary video URLs to ensure compatibility
 * @param {string} url - The Cloudinary video URL
 * @returns {Object} - Object with optimized URLs for different formats
 */
export const handleCloudinaryVideo = (url) => {
  if (!url || !url.includes('cloudinary')) {
    return { original: url };
  }

  // For Cloudinary video URLs
  const base = url.split('/upload/')[0] + '/upload/';
  const identifier = url.split('/upload/')[1];

  // Generate different format URLs
  return {
    original: url,
    adaptive_streaming: base + 'sp_hd/fl_streaming/' + identifier.replace(/\.\w+$/, '.m3u8'),
    mp4: base + 'q_auto/f_mp4/' + identifier,
    webm: base + 'q_auto/f_webm/' + identifier.replace(/\.\w+$/, '.webm'),
    ogg: base + 'q_auto/f_ogv/' + identifier.replace(/\.\w+$/, '.ogv'),
    fallback: url
  };
};
