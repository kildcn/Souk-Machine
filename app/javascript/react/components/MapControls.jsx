import React from 'react';
import { MapPin, ZoomIn, ZoomOut, Globe, Compass, RotateCcw } from 'lucide-react';

const MapControls = ({
  onZoomIn,
  onZoomOut,
  onReset,
  onLocate,
  onRotate,
  className = ''
}) => {
  return (
    <div className={`map-controls ${className}`}>
      <button
        className="map-control-button"
        onClick={onZoomIn}
        title="Zoom In"
      >
        <ZoomIn size={20} />
      </button>

      <button
        className="map-control-button"
        onClick={onZoomOut}
        title="Zoom Out"
      >
        <ZoomOut size={20} />
      </button>

      <button
        className="map-control-button"
        onClick={onReset}
        title="Reset View"
      >
        <Globe size={20} />
      </button>

      <button
        className="map-control-button"
        onClick={onLocate}
        title="My Location"
      >
        <MapPin size={20} />
      </button>

      <button
        className="map-control-button"
        onClick={onRotate}
        title="Reset Rotation"
      >
        <Compass size={20} />
      </button>
    </div>
  );
};

export default MapControls;
