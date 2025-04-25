import React, { useState, useEffect, useRef } from 'react';
import MediaPlayer from './MediaPlayer';

const InteractiveMap = () => {
  // State to store map instance
  const [map, setMap] = useState(null);
  // State to store markers
  const [markers, setMarkers] = useState([]);
  // State to store submissions data
  const [submissions, setSubmissions] = useState([]);
  // State to track selected submission for display
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  // State to control popup visibility
  const [showPopup, setShowPopup] = useState(false);
  // Ref for map container
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (!window.mapboxgl) {
      console.error('Mapbox GL JS is not loaded');
      return;
    }

    // Set Mapbox access token - UPDATE THIS LINE
    window.mapboxgl.accessToken = window.MAPBOX_API_KEY || '';
    console.log('Using Mapbox API key:', window.MAPBOX_API_KEY ? 'Key is present' : 'Key is missing');

    // Initialize the map
    const mapInstance = new window.mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/liankee/clwrx5r3s00lf01po7lke6w7z',
      center: [0, 20], // Default center (Africa/Europe)
      zoom: 2,
    });

    // Add navigation controls
    mapInstance.addControl(new window.mapboxgl.NavigationControl(), 'top-right');

    // Save the map instance to state
    setMap(mapInstance);

    // Clean up on unmount
    return () => mapInstance.remove();
  }, []);

  // Fetch submissions data
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch('/api/submissions');
        const data = await response.json();
        setSubmissions(data);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      }
    };

    fetchSubmissions();
  }, []);

  // Add markers to the map when submissions data changes
  useEffect(() => {
    if (!map || submissions.length === 0) return;

    // Remove existing markers
    markers.forEach(marker => marker.remove());

    // Create bounds object to fit all markers
    const bounds = new window.mapboxgl.LngLatBounds();

    // Create new markers
    const newMarkers = submissions.map(submission => {
      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'custom-marker';

      // Create marker instance
      const marker = new window.mapboxgl.Marker(el)
        .setLngLat([submission.longitude, submission.latitude])
        .addTo(map);

      // Add click event to marker
      el.addEventListener('click', () => {
        setSelectedSubmission(submission);
        setShowPopup(true);
      });

      // Extend bounds with this marker
      bounds.extend([submission.longitude, submission.latitude]);

      return marker;
    });

    // Save markers to state
    setMarkers(newMarkers);

    // Fit map to bounds with padding
    if (newMarkers.length > 0) {
      map.fitBounds(bounds, {
        padding: 70,
        maxZoom: 15,
        duration: 1000
      });
    }
  }, [map, submissions]);

  // Handle popup close
  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedSubmission(null);
  };

  // Handle click outside popup to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showPopup && !event.target.closest('.info-window-popup')) {
        handleClosePopup();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPopup]);

  // Find user's location and add marker
  const addUserLocation = () => {
    if (!map) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;

          // Create user location marker
          const el = document.createElement('div');
          el.className = 'user-location-marker';

          new window.mapboxgl.Marker({ color: '#d91fe5' })
            .setLngLat([longitude, latitude])
            .addTo(map);

          // Fly to user location
          map.flyTo({
            center: [longitude, latitude],
            zoom: 14,
            speed: 1.5
          });
        },
        (error) => {
          console.error('Error getting geolocation:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser');
    }
  };

  return (
    <div className="map-container">
      <div
        ref={mapContainerRef}
        className="map"
        style={{ width: '100%', height: 'calc(100vh - 8vh)' }}
      />

      {/* User location button */}
      <button
        className="location-button"
        onClick={addUserLocation}
        title="Find my location"
      >
        <span>📍</span>
      </button>

      {/* Media popup */}
      {showPopup && selectedSubmission && (
        <div className="info-window-popup-overlay">
          <div className="info-window-popup show">
            <MediaPlayer
              src={selectedSubmission.file}
              type="auto"
              title={selectedSubmission.address}
              details={selectedSubmission.details}
              language={selectedSubmission.language}
            />
            <button
              className="close-button"
              onClick={handleClosePopup}
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;
