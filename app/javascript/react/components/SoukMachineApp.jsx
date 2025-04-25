import React, { useState, useEffect } from 'react';
import InteractiveMap from './InteractiveMap';
import MediaSubmissionForm from './MediaSubmissionForm';
import ThemeToggle from './ThemeToggle';
import ErrorBoundary from './ErrorBoundary';
import LoadingAnimation from './LoadingAnimation';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { NotificationProvider, useNotification } from '../contexts/NotificationContext';

// Main App component wrapped with providers
const SoukMachineApp = () => {
  return (
    <ErrorBoundary showDetails={false} resetButton={true}>
      <ThemeProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

// Actual app content using the context hooks
const AppContent = () => {
  const { theme } = useTheme();
  const { notify } = useNotification();

  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [artists, setArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');

  // Get CSRF token on mount
  useEffect(() => {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    if (metaTag) {
      setCsrfToken(metaTag.getAttribute('content'));
    }
  }, []);

  // Fetch artists for about page
  useEffect(() => {
    if (currentPage === 'about') {
      fetchArtists();
    }
  }, [currentPage]);

  const fetchArtists = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/artists');
      if (!response.ok) {
        throw new Error('Failed to fetch artists');
      }
      const data = await response.json();
      setArtists(data);
    } catch (error) {
      console.error('Error fetching artists:', error);
      notify.error('Failed to load artists. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSubmissionForm = () => {
    setShowSubmissionForm(!showSubmissionForm);
  };

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/submit', {
        method: 'POST',
        headers: {
          'X-CSRF-Token': csrfToken
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Submission failed');
      }

      notify.success('Your submission has been uploaded successfully!');
      setShowSubmissionForm(false);

      // Refresh the map data after successful submission
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Submission error:', error);
      notify.error(error.message || 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
    setShowSubmissionForm(false);
  };

  // Render About Us page
  const renderAboutUs = () => (
    <div className="about-us-container">
      <h1>About Us</h1>

      {isLoading ? (
        <div className="loading-container">
          <LoadingAnimation type="pulse" size="large" text="Loading artists information..." />
        </div>
      ) : (
        <>
          <section className="project-description">
            <h2>What is Souk Machine?</h2>
            <p>
              Souk Machine is an online directory where people capture the visual and auditive experience
              of going to a market, from anywhere in the world, all gathered in one place. It is a digital
              mosaic that celebrates the vibrant, chaotic, and sensory-rich environments of markets globally.
              Through video and audio recordings, users can share their unique perspectives and experiences,
              creating a dynamic and interactive cultural archive.
            </p>
          </section>

          <section className="artists-involved">
            <h2>Artists Involved</h2>
            <div className="artist-cards">
              {artists.length > 0 ? (
                artists.map((artist, index) => (
                  <div className="artist-card" key={index}>
                    <h3>{artist.name}</h3>
                    <p>{artist.bio}</p>
                    {artist.website && (
                      <p>
                        <a href={artist.website} target="_blank" rel="noopener noreferrer">
                          Visit Website
                        </a>
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p>No artists information available at the moment.</p>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );

  return (
    <div className="souk-machine-app" data-theme={theme}>
      <h1 className="souk title">SOUK MACHINE</h1>

      {/* Theme toggle button */}
      <ThemeToggle />

      {/* Main content based on current page */}
      <main className="main-content">
        {currentPage === 'home' && (
          <ErrorBoundary
            showDetails={false}
            resetButton={true}
            onReset={() => window.location.reload()}
          >
            <InteractiveMap />
          </ErrorBoundary>
        )}

        {currentPage === 'about' && renderAboutUs()}
      </main>

      {/* Submission form overlay */}
      {showSubmissionForm && (
        <div className="form-popup-overlay">
          <div className={`toggle-form ${showSubmissionForm ? 'show' : 'hidden'}`}>
            <ErrorBoundary
              showDetails={false}
              resetButton={true}
              onReset={() => setShowSubmissionForm(false)}
            >
              <MediaSubmissionForm
                onSubmit={handleSubmit}
                onCancel={toggleSubmissionForm}
                isSubmitting={isSubmitting}
              />
            </ErrorBoundary>
          </div>
        </div>
      )}

      {/* Bottom navigation */}
      <nav className="bottom-navbar">
        <a
          href="#"
          className="nav-link"
          onClick={(e) => { e.preventDefault(); navigateTo('about'); }}
        >
          About Us
        </a>

        {currentPage === 'about' ? (
          <a
            href="#"
            className="nav-link"
            onClick={(e) => { e.preventDefault(); navigateTo('home'); }}
          >
            Home
          </a>
        ) : (
          <button
            id="contribute-button"
            className="contribute-button"
            onClick={toggleSubmissionForm}
          >
            <span>Contribute</span>
          </button>
        )}

        <a href="mailto:leila.boutaam@gmail.com" className="nav-link">
          Contact
        </a>
      </nav>
    </div>
  );
};

export default SoukMachineApp;
