// app/javascript/react/components/ErrorBoundary.jsx
import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return React.createElement('div', { className: "error-boundary" },
        React.createElement('h2', null, "Something went wrong"),
        React.createElement('p', null, "We're sorry, but there was an error loading this component."),
        this.props.showDetails &&
          React.createElement('details', { style: { whiteSpace: 'pre-wrap' } },
            React.createElement('summary', null, "Error Details"),
            React.createElement('p', null, this.state.error && this.state.error.toString()),
            React.createElement('p', null,
              "Component Stack: ",
              this.state.errorInfo && this.state.errorInfo.componentStack
            )
          ),
        this.props.resetButton &&
          React.createElement('button', {
            className: "reset-button",
            onClick: () => {
              this.setState({ hasError: false, error: null, errorInfo: null });
              if (this.props.onReset) {
                this.props.onReset();
              }
            }
          }, "Try Again")
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
