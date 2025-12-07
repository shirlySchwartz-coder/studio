import React from 'react';
class ErrorBoundary extends React.Component<
  { fallback?: React.ReactNode; children?: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || <h1>משהו השתבש... נסה לרענן את הדף</h1>;
    }
    return this.props.children;
  }
}
export default ErrorBoundary;
