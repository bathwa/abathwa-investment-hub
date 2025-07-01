
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface ErrorState {
  error: Error | null;
  isError: boolean;
}

export const useErrorHandler = () => {
  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    isError: false,
  });

  const handleError = useCallback((error: Error | string, showToast = true) => {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    
    console.error('App Error:', errorObj);
    
    setErrorState({
      error: errorObj,
      isError: true,
    });

    if (showToast) {
      toast.error(errorObj.message || 'An unexpected error occurred');
    }
  }, []);

  const clearError = useCallback(() => {
    setErrorState({
      error: null,
      isError: false,
    });
  }, []);

  const handleApiError = useCallback((error: any) => {
    let message = 'An unexpected error occurred';
    
    if (error?.message) {
      message = error.message;
    } else if (error?.error?.message) {
      message = error.error.message;
    } else if (typeof error === 'string') {
      message = error;
    }

    handleError(new Error(message));
  }, [handleError]);

  return {
    error: errorState.error,
    isError: errorState.isError,
    handleError,
    clearError,
    handleApiError,
  };
};
