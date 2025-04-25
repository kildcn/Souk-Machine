// app/javascript/react/contexts/NotificationContext.js
import React, { createContext, useContext, useReducer } from 'react';
import Notification from '../components/Notification';

// Create context
const NotificationContext = createContext({
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {},
  notify: {
    success: () => {},
    error: () => {},
    warning: () => {},
    info: () => {}
  }
});

// Notification reducer
const notificationReducer = function(state, action) {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return [].concat(state, [Object.assign({ id: Date.now() }, action.payload)]);
    case 'REMOVE_NOTIFICATION':
      return state.filter(function(notification) {
        return notification.id !== action.payload;
      });
    default:
      return state;
  }
};

// NotificationProvider component
export const NotificationProvider = function({ children }) {
  const [notifications, dispatch] = useReducer(notificationReducer, []);

  // Add a notification
  const addNotification = function(notification) {
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: notification
    });
  };

  // Remove a notification
  const removeNotification = function(id) {
    dispatch({
      type: 'REMOVE_NOTIFICATION',
      payload: id
    });
  };

  // Helper functions for common notification types
  const notify = {
    success: function(message, options) {
      if (!options) options = {};
      addNotification(Object.assign({ type: 'success', message: message }, options));
    },
    error: function(message, options) {
      if (!options) options = {};
      addNotification(Object.assign({ type: 'error', message: message }, options));
    },
    warning: function(message, options) {
      if (!options) options = {};
      addNotification(Object.assign({ type: 'warning', message: message }, options));
    },
    info: function(message, options) {
      if (!options) options = {};
      addNotification(Object.assign({ type: 'info', message: message }, options));
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications: notifications,
      addNotification: addNotification,
      removeNotification: removeNotification,
      notify: notify
    }}>
      {children}
      <div className="notifications-container">
        {notifications.map(function(notification) {
          return (
            <Notification
              key={notification.id}
              type={notification.type}
              message={notification.message}
              title={notification.title}
              duration={notification.duration}
              position={notification.position}
              onClose={function() { removeNotification(notification.id); }}
              autoClose={notification.autoClose !== undefined ? notification.autoClose : true}
              showIcon={notification.showIcon !== undefined ? notification.showIcon : true}
              showCloseButton={notification.showCloseButton !== undefined ? notification.showCloseButton : true}
            />
          );
        })}
      </div>
    </NotificationContext.Provider>
  );
};

// Custom hook to use the notification context
export const useNotification = function() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
