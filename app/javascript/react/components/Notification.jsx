import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';

// Notification types and their associated icons and colors
const notificationTypes = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-success',
    color: 'text-white'
  },
  error: {
    icon: AlertCircle,
    bgColor: 'bg-error',
    color: 'text-white'
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-warning',
    color: 'text-black'
  },
  info: {
    icon: Info,
    bgColor: 'bg-info',
    color: 'text-white'
  }
};

const Notification = ({
  type = 'info',
  message,
  title,
  duration = 5000,
  position = 'top-right',
  onClose,
  autoClose = true,
  showIcon = true,
  showCloseButton = true
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  // Get the notification config based on type
  const notificationConfig = notificationTypes[type] || notificationTypes.info;
  const Icon = notificationConfig.icon;

  // Handle auto-close
  useEffect(() => {
    let timer;

    if (autoClose && duration > 0) {
      timer = setTimeout(() => {
        setIsClosing(true);

        // Wait for closing animation
        setTimeout(() => {
          setIsVisible(false);
          if (onClose) onClose();
        }, 300);
      }, duration);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [autoClose, duration, onClose]);

  // Handle manual close
  const handleClose = () => {
    setIsClosing(true);

    // Wait for closing animation
    setTimeout(() => {
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

  return (
    <div
      className={`notification ${positionClasses[position] || 'top-right'} ${isClosing ? 'notification-closing' : 'notification-opening'}`}
    >
      <div className={`notification-content ${notificationConfig.bgColor}`}>
        {showIcon && (
          <div className="notification-icon">
            <Icon size={20} />
          </div>
        )}

        <div className="notification-text">
          {title && <div className="notification-title">{title}</div>}
          <div className="notification-message">{message}</div>
        </div>

        {showCloseButton && (
          <button className="notification-close" onClick={handleClose}>
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Notification;
