import React from 'react';

const LoadingAnimation = ({ text = 'Loading...', type = 'spinner', size = 'medium' }) => {
  // Define size classes
  const sizeClasses = {
    small: {
      container: 'loading-container-sm',
      spinner: 'spinner-sm',
      pulse: 'pulse-sm',
      dots: 'dots-sm',
      text: 'text-sm'
    },
    medium: {
      container: 'loading-container-md',
      spinner: 'spinner-md',
      pulse: 'pulse-md',
      dots: 'dots-md',
      text: 'text-md'
    },
    large: {
      container: 'loading-container-lg',
      spinner: 'spinner-lg',
      pulse: 'pulse-lg',
      dots: 'dots-lg',
      text: 'text-lg'
    }
  };

  // Get size class or default to medium
  const sizeClass = sizeClasses[size] || sizeClasses.medium;

  // Render different loading animations based on type
  const renderLoadingAnimation = () => {
    switch (type) {
      case 'spinner':
        return <div className={`spinner ${sizeClass.spinner}`}></div>;

      case 'pulse':
        return (
          <div className={`pulse-container ${sizeClass.pulse}`}>
            <div className="pulse-dot"></div>
            <div className="pulse-dot"></div>
            <div className="pulse-dot"></div>
          </div>
        );

      case 'dots':
        return (
          <div className={`dots-container ${sizeClass.dots}`}>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        );

      default:
        return <div className={`spinner ${sizeClass.spinner}`}></div>;
    }
  };

  return (
    <div className={`loading-container ${sizeClass.container}`}>
      {renderLoadingAnimation()}
      {text && <p className={`loading-text ${sizeClass.text}`}>{text}</p>}
    </div>
  );
};

export default LoadingAnimation;
