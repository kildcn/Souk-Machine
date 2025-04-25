// app/javascript/react/contexts/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create theme context
const ThemeContext = createContext({
  theme: 'dark',
  toggleTheme: () => {}
});

// ThemeProvider component
export const ThemeProvider = function({ children }) {
  // Initialize theme based on user preference or default to dark
  const [theme, setTheme] = useState(function() {
    // Check if theme is stored in localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedTheme = localStorage.getItem('soukMachineTheme');
      if (savedTheme) {
        return savedTheme;
      }
    }

    // Check system preference
    if (typeof window !== 'undefined' && window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }

    // Default to dark theme (matches existing styles)
    return 'dark';
  });

  // Update document when theme changes
  useEffect(function() {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('soukMachineTheme', theme);
      }
    }
  }, [theme]);

  // Toggle theme function
  const toggleTheme = function() {
    setTheme(function(prevTheme) {
      return prevTheme === 'dark' ? 'light' : 'dark';
    });
  };

  return (
    <ThemeContext.Provider value={{ theme: theme, toggleTheme: toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = function() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
