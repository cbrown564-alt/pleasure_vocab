// Error Boundary Provider
// Manages global error state and provides context for error display

import React, { createContext, useCallback, useContext, useState } from 'react';
import { FullScreenError } from './FullScreenError';
import { ToastContainer } from './ToastContainer';
import { ToastData, ToastType } from './Toast';

// ============ Types ============

interface SectionError {
  message: string;
  retryFn?: () => void;
}

interface ErrorContextValue {
  // Critical error (full-screen blocking)
  criticalError: Error | null;
  setCriticalError: (error: Error | null) => void;

  // Toast notifications
  showToast: (message: string, type?: ToastType, duration?: number) => void;

  // Section-level errors (inline banners)
  sectionErrors: Record<string, SectionError | null>;
  setSectionError: (section: string, error: SectionError | null) => void;
  clearSectionError: (section: string) => void;

  // Retry handler for critical errors
  onRetry?: () => void;
  setOnRetry: (fn: (() => void) | undefined) => void;
}

const ErrorContext = createContext<ErrorContextValue | null>(null);

// ============ Hook ============

export function useError(): ErrorContextValue {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorBoundaryProvider');
  }
  return context;
}

// ============ Provider ============

interface ErrorBoundaryProviderProps {
  children: React.ReactNode;
}

export function ErrorBoundaryProvider({ children }: ErrorBoundaryProviderProps) {
  const [criticalError, setCriticalError] = useState<Error | null>(null);
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [sectionErrors, setSectionErrors] = useState<Record<string, SectionError | null>>({});
  const [onRetry, setOnRetry] = useState<(() => void) | undefined>(undefined);

  // Toast management
  const showToast = useCallback((message: string, type: ToastType = 'error', duration?: number) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const toast: ToastData = { id, message, type, duration };

    setToasts((prev) => [...prev, toast]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Section error management
  const setSectionError = useCallback((section: string, error: SectionError | null) => {
    setSectionErrors((prev) => ({ ...prev, [section]: error }));
  }, []);

  const clearSectionError = useCallback((section: string) => {
    setSectionErrors((prev) => {
      const next = { ...prev };
      delete next[section];
      return next;
    });
  }, []);

  // Retry handler
  const handleRetry = useCallback(() => {
    if (onRetry) {
      setCriticalError(null);
      onRetry();
    }
  }, [onRetry]);

  const value: ErrorContextValue = {
    criticalError,
    setCriticalError,
    showToast,
    sectionErrors,
    setSectionError,
    clearSectionError,
    onRetry,
    setOnRetry,
  };

  // If there's a critical error, show full-screen error
  if (criticalError) {
    return (
      <ErrorContext.Provider value={value}>
        <FullScreenError
          title="Unable to Load"
          message={criticalError.message || 'An unexpected error occurred while loading the app.'}
          onRetry={onRetry ? handleRetry : undefined}
        />
      </ErrorContext.Provider>
    );
  }

  return (
    <ErrorContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ErrorContext.Provider>
  );
}
