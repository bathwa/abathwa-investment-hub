
import React from 'react';
import { LoadingSpinner } from '@/components/LoadingStates';
import { cn } from '@/lib/utils';

interface LoadingWrapperProps {
  loading: boolean;
  children: React.ReactNode;
  className?: string;
  fallback?: React.ReactNode;
  error?: Error | null;
  onRetry?: () => void;
}

export const LoadingWrapper: React.FC<LoadingWrapperProps> = ({
  loading,
  children,
  className,
  fallback,
  error,
  onRetry,
}) => {
  if (error) {
    return (
      <div className={cn('flex flex-col items-center justify-center p-8 space-y-4', className)}>
        <div className="text-center">
          <p className="text-destructive font-medium">Something went wrong</p>
          <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-sm text-primary hover:underline"
          >
            Try again
          </button>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className={cn('flex items-center justify-center p-8', className)}>
        {fallback || <LoadingSpinner size="lg" />}
      </div>
    );
  }

  return <>{children}</>;
};
