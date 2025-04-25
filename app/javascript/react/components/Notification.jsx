// app/javascript/react/components/Notification.jsx
import React, { useEffect, useState } from 'react';

// Notification component using React.createElement instead of JSX
const Notification = function(props) {
  const type = props.type || 'info';
  const message = props.message;
  const title = props.title;
  const duration = props.duration || 5000;
  const position = props.position || 'top-right';
  const onClose = props.onClose;
  const autoClose = props.autoClose !== undefined ? props.autoClose : true;
  const showIcon = props.showIcon !== undefined ? props.showIcon : true;
  const showCloseButton = props.showCloseButton !== undefined ? props.showCloseButton : true;

  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  // Notification types and their associated properties
  const notificationTypes = {
    success: {
      bgColor: 'bg-success',
      color: 'text-white',
      icon: function() {
        return React.createElement('svg', {
          xmlns: 'http://www.w3.org/2000/svg',
          width: '20',
          height: '20',
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: '2',
          strokeLinecap: 'round',
          strokeLinejoin: 'round'
        },
        React.createElement('path', { d: 'M22 11.08V12a10 10 0 1 1-5.93-9.14' }),
        React.createElement('polyline', { points: '22 4 12 14.01 9 11.01' })
        );
      }
    },
    error: {
      bgColor: 'bg-error',
      color: 'text-white',
      icon: function() {
        return React.createElement('svg', {
          xmlns: 'http://www.w3.org/2000/svg',
          width: '20',
          height: '20',
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: '2',
          strokeLinecap: 'round',
          strokeLinejoin: 'round'
        },
        React.createElement('circle', { cx: '12', cy: '12', r: '10' }),
        React.createElement('line', { x1: '12', y1: '8', x2: '12', y2: '12' }),
        React.createElement('line', { x1: '12', y1: '16', x2: '12.01', y2: '16' })
        );
      }
    },
    warning: {
      bgColor: 'bg-warning',
      color: 'text-black',
      icon: function() {
        return React.createElement('svg', {
          xmlns: 'http://www.w3.org/2000/svg',
          width: '20',
          height: '20',
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: '2',
          strokeLinecap: 'round',
          strokeLinejoin: 'round'
        },
        React.createElement('path', { d: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z' }),
        React.createElement('line', { x1: '12', y1: '9', x2: '12', y2: '13' }),
        React.createElement('line', { x1: '12', y1: '17', x2: '12.01', y2: '17' })
        );
      }
    },
    info: {
      bgColor: 'bg-info',
      color: 'text-white',
      icon: function() {
        return React.createElement('svg', {
          xmlns: 'http://www.w3.org/2000/svg',
          width: '20',
          height: '20',
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: '2',
          strokeLinecap: 'round',
          strokeLinejoin: 'round'
        },
        React.createElement('circle', { cx: '12', cy: '12', r: '10' }),
        React.createElement('line', { x1: '12', y1: '16', x2: '12', y2: '12' }),
        React.createElement('line', { x1: '12', y1: '8', x2: '12.01', y2: '8' })
        );
      }
    }
  };

  // Get the notification config based on type
  const notificationConfig = notificationTypes[type] || notificationTypes.info;

  // Handle auto-close
  useEffect(function() {
    var timer;

    if (autoClose && duration > 0) {
      timer = setTimeout(function() {
        setIsClosing(true);

        // Wait for closing animation
        setTimeout(function() {
          setIsVisible(false);
          if (onClose) onClose();
        }, 300);
      }, duration);
    }

    return function() {
      if (timer) clearTimeout(timer);
    };
  }, [autoClose, duration, onClose]);

  // Handle manual close
  const handleClose = function() {
    setIsClosing(true);

    // Wait for closing animation
    setTimeout(function() {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  // Position classes
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  };

  if (!isVisible) {
    return null;
  }

  // Close button icon
  const closeIcon = function() {
    return React.createElement('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      width: '16',
      height: '16',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round'
    },
    React.createElement('line', { x1: '18', y1: '6', x2: '6', y2: '18' }),
    React.createElement('line', { x1: '6', y1: '6', x2: '18', y2: '18' })
    );
  };

  // Create the notification element
  return React.createElement('div', {
    className: 'notification ' + (positionClasses[position] || 'top-right') + ' ' +
              (isClosing ? 'notification-closing' : 'notification-opening')
  },
    React.createElement('div', {
      className: 'notification-content ' + notificationConfig.bgColor
    },
      showIcon && React.createElement('div', {
        className: 'notification-icon'
      }, notificationConfig.icon()),

      React.createElement('div', {
        className: 'notification-text'
      },
        title && React.createElement('div', {
          className: 'notification-title'
        }, title),
        React.createElement('div', {
          className: 'notification-message'
        }, message)
      ),

      showCloseButton && React.createElement('button', {
        className: 'notification-close',
        onClick: handleClose
      }, closeIcon())
    )
  );
};

export default Notification;
