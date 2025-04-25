import React, { useState, useRef } from 'react';
import { MapPin } from 'lucide-react';

const MediaSubmissionForm = ({ onSubmit, onCancel }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [language, setLanguage] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    // Create a preview if it's an image or video
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(selectedFile);
    } else if (selectedFile.type.startsWith('video/')) {
      const videoURL = URL.createObjectURL(selectedFile);
      setPreview(videoURL);
    } else if (selectedFile.type.startsWith('audio/')) {
      setPreview('audio');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    if (!latitude || !longitude) {
      setError('Please select a location on the map');
      return;
    }

    if (!language) {
      setError('Please specify the language');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Create form data for submission
      const formData = new FormData();
      formData.append('submission[file]', file);
      formData.append('submission[address]', address);
      formData.append('submission[latitude]', latitude);
      formData.append('submission[longitude]', longitude);
      formData.append('submission[language]', language);
      formData.append('submission[details]', details);

      // Call the onSubmit callback with the form data
      await onSubmit(formData);

      // Reset form after successful submission
      resetForm();
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message || 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset the form
  const resetForm = () => {
    setFile(null);
    setPreview(null);
    setAddress('');
    setLatitude('');
    setLongitude('');
    setLanguage('');
    setDetails('');
    setError(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Use current location
  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);

          // Try to get the address using reverse geocoding
          fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${position.coords.longitude},${position.coords.latitude}.json?access_token=${process.env.MAPBOX_API_KEY}`)
            .then(res => res.json())
            .then(data => {
              if (data.features && data.features.length > 0) {
                setAddress(data.features[0].place_name);
              }
            })
            .catch(err => console.error('Error getting address:', err));
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Could not get your current location. Please enter manually.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
    }
  };

  // Render the preview based on file type
  const renderPreview = () => {
    if (!preview) return null;

    if (preview === 'audio') {
      return (
        <div className="audio-preview">
          <div className="audio-icon">
            <span>Audio File</span>
          </div>
          <p>{file.name}</p>
        </div>
      );
    }

    if (file.type.startsWith('video/')) {
      return (
        <div className="video-preview">
          <video controls width="100%" height="auto">
            <source src={preview} type={file.type} />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    return (
      <div className="image-preview">
        <img src={preview} alt="Preview" width="100%" height="auto" />
      </div>
    );
  };

  return (
    <div className="submission-form-container">
      <h2 className="form-title">Share Your Market Experience</h2>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label htmlFor="file">Upload Video or Audio</label>
          <input
            type="file"
            id="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="video/*,audio/*,image/*"
            required
          />
          <small>Supported formats: MP4, MOV, AVI, MP3, WAV, JPEG, PNG</small>
        </div>

        {preview && (
          <div className="preview-container">
            {renderPreview()}
          </div>
        )}

        <div className="form-group location-group">
          <label htmlFor="address">Location</label>
          <div className="location-input-group">
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Market location"
              readOnly
              required
            />
            <button
              type="button"
              className="location-button"
              onClick={useCurrentLocation}
            >
              <MapPin size={16} />
              Use My Location
            </button>
          </div>

          <div className="coordinates">
            <input
              type="hidden"
              id="latitude"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              required
            />
            <input
              type="hidden"
              id="longitude"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              required
            />
            {latitude && longitude && (
              <small>
                Selected coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </small>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="language">Language</label>
          <input
            type="text"
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            placeholder="Language in the recording"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="details">Details (Optional)</label>
          <textarea
            id="details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Tell us about this market experience"
            rows={4}
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MediaSubmissionForm;
