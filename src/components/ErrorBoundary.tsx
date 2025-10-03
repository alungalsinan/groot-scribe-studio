import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('🚨 Error Boundary Caught Error:', error);
      console.error('📍 Error Info:', errorInfo);
    }

    // Log error to external service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to Sentry, LogRocket, etc.
      // logErrorToService(error, errorInfo);
    }

    this.setState({
      error,
      errorInfo,
      hasError: true,
    });

    // Show error toast
    toast({
      title: 'Application Error',
      description: 'Something went wrong. Our team has been notified.',
      variant: 'destructive',
    });
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    // Clear any cached data that might be causing issues
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
  };

  handleReload = (): void => {
    window.location.reload();
  };

  handleGoHome = (): void => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Oops! Something went wrong
              </CardTitle>
              <p className="text-gray-600 mt-2">
                We encountered an unexpected error. Don't worry, our team has been notified.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Error Details (Development Only) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Bug className="h-4 w-4" />
                    Error Details (Dev Mode)
                  </h4>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p><strong>Error:</strong> {this.state.error.message}</p>
                    <p><strong>Stack:</strong></p>
                    <pre className="bg-white p-2 rounded text-xs overflow-auto max-h-32">
                      {this.state.error.stack}
                    </pre>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={this.handleReset}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                <Button 
                  onClick={this.handleReload}
                  variant="outline"
                  className="flex-1"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reload Page
                </Button>
                <Button 
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="flex-1"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Button>
              </div>

              {/* Help Text */}
              <div className="text-center text-sm text-gray-500">
                <p>If the problem persists, please contact support.</p>
                <p className="mt-1">
                  Error ID: {Date.now().toString(36)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export const useErrorHandler = () => {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('🚨 Handled Error:', error);
    if (errorInfo) {
      console.error('📍 Error Info:', errorInfo);
    }
    
    toast({
      title: 'Something went wrong',
      description: error.message || 'An unexpected error occurred',
      variant: 'destructive',
    });
  };
};
