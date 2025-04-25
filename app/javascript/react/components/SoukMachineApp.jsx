// app/javascript/react/components/SoukMachineApp.jsx
import React, { useState, useEffect } from 'react';
import InteractiveMap from './InteractiveMap';
import MediaSubmissionForm from './MediaSubmissionForm';
import ThemeToggle from './ThemeToggle';
import ErrorBoundary from './ErrorBoundary';
import LoadingAnimation from './LoadingAnimation';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { NotificationProvider, useNotification } from '../contexts/NotificationContext';

// Main App component wrapped with providers
const SoukMachineApp = function() {
  return (
    React.createElement(ErrorBoundary, {showDetails: false, resetButton: true},
      React.createElement(ThemeProvider, null,
        React.createElement(NotificationProvider, null,
          React.createElement(AppContent, null)
        )
      )
    )
  );
};

// Actual app content using the context hooks
const AppContent = function() {
  const { theme } = useTheme();
  const { notify } = useNotification();

  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [artists, setArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');

  // Get CSRF token on mount
  useEffect(function() {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    if (metaTag) {
      setCsrfToken(metaTag.getAttribute('content'));
    }
  }, []);

  // Fetch artists for about page
  useEffect(function() {
    if (currentPage === 'about') {
      fetchArtists();
    }
  }, [currentPage]);

  const fetchArtists = function() {
    setIsLoading(true);
    fetch('/api/artists')
      .then(function(response) {
        if (!response.ok) {
          throw new Error('Failed to fetch artists');
        }
        return response.json();
      })
      .then(function(data) {
        setArtists(data);
        setIsLoading(false);
      })
      .catch(function(error) {
        console.error('Error fetching artists:', error);
        notify.error('Failed to load artists. Please try again later.');
        setIsLoading(false);
      });
  };

  const toggleSubmissionForm = function() {
    setShowSubmissionForm(!showSubmissionForm);
  };

  const handleSubmit = function(formData) {
    setIsSubmitting(true);

    fetch('/submit', {
      method: 'POST',
      headers: {
        'X-CSRF-Token': csrfToken
      },
      body: formData
    })
      .then(function(response) {
        if (!response.ok) {
          return response.json().then(function(errorData) {
            throw new Error(errorData.message || 'Submission failed');
          });
        }
        notify.success('Your submission has been uploaded successfully!');
        setShowSubmissionForm(false);

        // Refresh the map data after successful submission
        setTimeout(function() {
          window.location.reload();
        }, 2000);
      })
      .catch(function(error) {
        console.error('Submission error:', error);
        notify.error(error.message || 'Failed to submit. Please try again.');
      })
      .finally(function() {
        setIsSubmitting(false);
      });
  };

  const navigateTo = function(page) {
    setCurrentPage(page);
    setShowSubmissionForm(false);
  };

  // Render About Us page
  const renderAboutUs = function() {
    return (
      React.createElement('div', { className: "about-us-container" },
        React.createElement('h1', null, "About Us"),

        isLoading ?
          React.createElement('div', { className: "loading-container" },
            React.createElement(LoadingAnimation, {
              type: "pulse",
              size: "large",
              text: "Loading artists information..."
            })
          ) :
          React.createElement(React.Fragment, null,
            React.createElement('section', { className: "project-description" },
              React.createElement('h2', null, "What is Souk Machine?"),
              React.createElement('p', null,
                "Souk Machine is an online directory where people capture the visual and auditive experience " +
                "of going to a market, from anywhere in the world, all gathered in one place. It is a digital " +
                "mosaic that celebrates the vibrant, chaotic, and sensory-rich environments of markets globally. " +
                "Through video and audio recordings, users can share their unique perspectives and experiences, " +
                "creating a dynamic and interactive cultural archive."
              )
            ),

            React.createElement('section', { className: "artists-involved" },
              React.createElement('h2', null, "Artists Involved"),
              React.createElement('div', { className: "artist-cards" },
                artists.length > 0 ?
                  artists.map(function(artist, index) {
                    return React.createElement('div', { className: "artist-card", key: index },
                      React.createElement('h3', null, artist.name),
                      React.createElement('p', null, artist.bio),
                      artist.website && React.createElement('p', null,
                        React.createElement('a', {
                          href: artist.website,
                          target: "_blank",
                          rel: "noopener noreferrer"
                        }, "Visit Website")
                      )
                    );
                  }) :
                  React.createElement('p', null, "No artists information available at the moment.")
              )
            )
          )
      )
    );
  };

  return (
    React.createElement('div', { className: "souk-machine-app", "data-theme": theme },
      React.createElement('h1', { className: "souk title" }, "SOUK MACHINE"),

      /* Theme toggle button */
      React.createElement(ThemeToggle, null),

      /* Main content based on current page */
      React.createElement('main', { className: "main-content" },
        currentPage === 'home' &&
          React.createElement(ErrorBoundary, {
            showDetails: false,
            resetButton: true,
            onReset: function() { window.location.reload(); }
          },
            React.createElement(InteractiveMap, null)
          ),

        currentPage === 'about' && renderAboutUs()
      ),

      /* Submission form overlay */
      showSubmissionForm &&
        React.createElement('div', { className: "form-popup-overlay" },
          React.createElement('div', { className: "toggle-form " + (showSubmissionForm ? 'show' : 'hidden') },
            React.createElement(ErrorBoundary, {
              showDetails: false,
              resetButton: true,
              onReset: function() { setShowSubmissionForm(false); }
            },
              React.createElement(MediaSubmissionForm, {
                onSubmit: handleSubmit,
                onCancel: toggleSubmissionForm,
                isSubmitting: isSubmitting
              })
            )
          )
        ),

      /* Bottom navigation */
      React.createElement('nav', { className: "bottom-navbar" },
        React.createElement('a', {
          href: "#",
          className: "nav-link",
          onClick: function(e) {
            e.preventDefault();
            navigateTo('about');
          }
        }, "About Us"),

        currentPage === 'about' ?
          React.createElement('a', {
            href: "#",
            className: "nav-link",
            onClick: function(e) {
              e.preventDefault();
              navigateTo('home');
            }
          }, "Home") :
          React.createElement('button', {
            id: "contribute-button",
            className: "contribute-button",
            onClick: toggleSubmissionForm
          }, React.createElement('span', null, "Contribute")),

        React.createElement('a', {
          href: "mailto:leila.boutaam@gmail.com",
          className: "nav-link"
        }, "Contact")
      )
    )
  );
};

export default SoukMachineApp;
