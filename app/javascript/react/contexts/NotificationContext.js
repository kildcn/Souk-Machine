// app/javascript/react/contexts/NotificationContext.js
import React, { createContext, useContext, useReducer } from 'react';
import Notification from '../components/Notification';

// Create context
const NotificationContext = createContext();

// Notification reducer
const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return [...state, { id: Date.now(), ...action.payload }];
    case 'REMOVE_NOTIFICATION':
      return state.filter(notification => notification.id !== action.payload);
    default:
      return state;
  }
};

// NotificationProvider component
export const NotificationProvider = ({ children }) => {
  const [notifications, dispatch] = useReducer(notificationReducer, []);

  // Add a notification
  const addNotification = (notification) => {
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: notification
    });
  };

  // Remove a notification
  const removeNotification = (id) => {
    dispatch({
      type: 'REMOVE_NOTIFICATION',
      payload: id
    });
  };

  // Helper functions for common notification types
  const notify = {
    success: (message, options = {}) => {
      addNotification({ type: 'success', message, ...options });
    },
    error: (message, options = {}) => {
      addNotification({ type: 'error', message, ...options });
    },
    warning: (message, options = {}) => {
      addNotification({ type: 'warning', message, ...options });
    },
    info: (message, options = {}) => {
      addNotification({ type: 'info', message, ...options });
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification, notify }}>
      {children}
      <div className="notifications-container">
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            {...notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

// Custom hook to use the notification context
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
