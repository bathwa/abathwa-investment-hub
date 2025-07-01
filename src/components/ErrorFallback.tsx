
import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Something went wrong
          </h1>
          <p className="text-muted-foreground">
            We're sorry, but something unexpected happened. Please try refreshing the page.
          </p>
        </div>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error.message || 'An unexpected error occurred'}
          </AlertDescription>
        </Alert>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={resetError} className="flex-1">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Button onClick={handleGoHome} variant="outline" className="flex-1">
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 p-4 bg-muted rounded-lg">
            <summary className="cursor-pointer text-sm font-medium">
              Error Details (Development)
            </summary>
            <pre className="mt-2 text-xs overflow-auto whitespace-pre-wrap">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};
