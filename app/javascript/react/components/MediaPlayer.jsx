import React, { useState, useEffect, useRef } from 'react';
import { getOptimalVideoSource, handleCloudinaryVideo } from '../utils/videoUtils';

const MediaPlayer = ({ src, type = 'auto', title, details, language }) => {
  const [mediaType, setMediaType] = useState(type);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sources, setSources] = useState(null);
  const mediaRef = useRef(null);

  useEffect(() => {
    if (!src) {
      setError('No media source provided');
      setIsLoading(false);
      return;
    }

    // Reset states on source change
    setIsLoading(true);
    setError(null);

    // Determine media type automatically if set to 'auto'
    if (type === 'auto') {
      const extension = src.split('.').pop().toLowerCase();

      if (['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'].includes(extension)) {
        setMediaType('video');
        // Handle video sources
        setSources(handleCloudinaryVideo(src));
      } else if (['mp3', 'wav', 'ogg', 'aac', 'm4a'].includes(extension)) {
        setMediaType('audio');
        setSources({ original: src });
      } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
        setMediaType('image');
        setSources({ original: src });
      } else {
        // Try to detect Cloudinary streaming URLs
        if (src.includes('cloudinary')) {
          if (src.includes('.m3u8')) {
            setMediaType('video');
            setSources({ adaptive_streaming: src });
          } else {
            setMediaType('video');
            setSources(handleCloudinaryVideo(src));
          }
        } else {
          setMediaType('unknown');
          setSources({ original: src });
        }
      }
    } else {
      setMediaType(type);
      if (type === 'video') {
        setSources(handleCloudinaryVideo(src));
      } else {
        setSources({ original: src });
      }
    }
  }, [src, type]);

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  const handleLoadedData = () => {
    setIsLoading(false);
  };

  const handleError = (e) => {
    console.error('Media error:', e);
    setError('Failed to load media');
    setIsLoading(false);
  };

  // Function to render video element with appropriate sources
  const renderVideo = () => {
    if (!sources) return null;

    // Get optimal video source based on browser support
    const optimalSource = getOptimalVideoSource(sources);

    // Check if it's a HLS (m3u8) stream
    const isHLS = optimalSource.includes('.m3u8');

    // If HLS and HLS.js is available, use it for better compatibility
    if (isHLS && window.Hls && window.Hls.isSupported()) {
      // This requires HLS.js to be loaded
      // You would need to add HLS.js to your dependencies and include it in your application
      return (
        <div className="hls-video-container">
          <video
            ref={mediaRef}
            className="media-player-video"
            controls
            controlsList="nodownload"
            onLoadStart={handleLoadStart}
            onLoadedData={handleLoadedData}
            onError={handleError}
            playsInline
          />
        </div>
      );
    }

    // Regular video element with multiple sources for compatibility
    return (
      <video
        ref={mediaRef}
        className="media-player-video"
        controls
        controlsList="nodownload"
        preload="metadata"
        onLoadStart={handleLoadStart}
        onLoadedData={handleLoadedData}
        onError={handleError}
        playsInline
      >
        {sources.mp4 && <source src={sources.mp4} type="video/mp4" />}
        {sources.webm && <source src={sources.webm} type="video/webm" />}
        {sources.ogg && <source src={sources.ogg} type="video/ogg" />}
        {sources.adaptive_streaming && <source src={sources.adaptive_streaming} type="application/x-mpegURL" />}
        {sources.original && <source src={sources.original} />}
        Your browser does not support the video tag.
      </video>
    );
  };

  // Function to render the appropriate media element based on type
  const renderMedia = () => {
    if (error) {
      return (
        <div className="media-error">
          <p>{error}</p>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="media-loading">
          <div className="spinner"></div>
          <p>Loading media...</p>
        </div>
      );
    }

    if (!sources) {
      return (
        <div className="media-loading">
          <p>Preparing media...</p>
        </div>
      );
    }

    switch (mediaType) {
      case 'video':
        return renderVideo();

      case 'audio':
        return (
          <audio
            ref={mediaRef}
            className="media-player-audio"
            controls
            controlsList="nodownload"
            preload="metadata"
            onLoadStart={handleLoadStart}
            onLoadedData={handleLoadedData}
            onError={handleError}
          >
            <source src={sources.original} />
            Your browser does not support the audio tag.
          </audio>
        );

      case 'image':
        return (
          <img
            ref={mediaRef}
            className="media-player-image"
            src={sources.original}
            alt={title || 'Media content'}
            onLoad={handleLoadedData}
            onError={handleError}
          />
        );

      default:
        return (
          <div className="media-unknown">
            <p>Unsupported media format</p>
            <a href={sources.original} target="_blank" rel="noopener noreferrer" className="media-download-link">
              Open media in new tab
            </a>
          </div>
        );
    }
  };

  // Use HLS.js for HLS streams if available
  useEffect(() => {
    if (mediaType === 'video' && mediaRef.current && sources?.adaptive_streaming) {
      const isHLS = sources.adaptive_streaming.includes('.m3u8');

      if (isHLS && window.Hls && window.Hls.isSupported()) {
        const hls = new window.Hls();
        hls.loadSource(sources.adaptive_streaming);
        hls.attachMedia(mediaRef.current);
        hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
          mediaRef.current.play().catch(e => console.log('Auto-play prevented:', e));
        });

        // Clean up
        return () => {
          if (hls) {
            hls.destroy();
          }
        };
      }
    }
  }, [mediaType, sources]);

  return (
    <div className="media-player-container">
      <div className="media-content">
        {renderMedia()}
      </div>
      {title && <h3 className="media-title">{title}</h3>}
      <div className="media-info">
        {language && <p className="media-language"><strong>Language:</strong> {language}</p>}
        {details && <p className="media-details">{details}</p>}
      </div>
    </div>
  );
};

export default MediaPlayer;
