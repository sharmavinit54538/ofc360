/**
 * @file ErrorDisplay.tsx
 * @description Reusable error display component with retry functionality.
 */

import React from 'react';
import { AlertTriangle, RefreshCw, AlertCircle, ShieldAlert } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';

type RTKError = FetchBaseQueryError | SerializedError | null | undefined;

type ErrorStatus = number | 'FETCH_ERROR' | 'CONNECTION_ERROR' | 'PARSING_ERROR' | 'TIMEOUT_ERROR' | 'CUSTOM_ERROR' | undefined;

export interface ErrorDisplayProps {
  error: RTKError;
  onRetry?: () => void;
  title?: string;
  compact?: boolean;
  className?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  title,
  compact = false,
  className = '',
}) => {
  if (!error) return null;

  const status = 'status' in error ? error.status : undefined;
  const message = 'message' in error ? error.message : undefined;
  const data = 'data' in error ? error.data : undefined;

  const isAuthError = status === 401 || status === 403;
  const isServerError = status === 500 || status === 502 || status === 503 || status === 504;
  const isNotFound = status === 404;
  const isNetworkError = (status as ErrorStatus) === 'FETCH_ERROR' || (status as ErrorStatus) === 'CONNECTION_ERROR' || (status as ErrorStatus) === 'PARSING_ERROR';

  const getErrorConfig = () => {
    if (isAuthError) {
      return {
        icon: ShieldAlert,
        iconColor: 'text-rose-600 dark:text-rose-400',
        bgColor: 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/30',
        textColor: 'text-rose-700 dark:text-rose-300',
        defaultTitle: 'Access Denied',
        defaultMessage: 'You do not have permission to view this data. Please contact your administrator.',
      };
    }
    if (isServerError) {
      return {
        icon: AlertTriangle,
        iconColor: 'text-amber-600 dark:text-amber-400',
        bgColor: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/30',
        textColor: 'text-amber-700 dark:text-amber-300',
        defaultTitle: 'Server Error',
        defaultMessage: 'The server encountered an error. Please try again in a moment.',
      };
    }
    if (isNotFound) {
      return {
        icon: AlertCircle,
        iconColor: 'text-gray-600 dark:text-zinc-400',
        bgColor: 'bg-gray-50 dark:bg-zinc-900/30 border-gray-200 dark:border-zinc-800',
        textColor: 'text-gray-700 dark:text-zinc-300',
        defaultTitle: 'Not Found',
        defaultMessage: 'The requested resource was not found.',
      };
    }
    if (isNetworkError) {
      return {
        icon: AlertTriangle,
        iconColor: 'text-rose-600 dark:text-rose-400',
        bgColor: 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/30',
        textColor: 'text-rose-700 dark:text-rose-300',
        defaultTitle: 'Connection Error',
        defaultMessage: 'Unable to connect to the server. Please check your network and try again.',
      };
    }
    return {
      icon: AlertCircle,
      iconColor: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/30',
      textColor: 'text-rose-700 dark:text-rose-300',
      defaultTitle: 'Error',
      defaultMessage: message || 'An unexpected error occurred.',
    };
  };

  const config = getErrorConfig();
  const Icon = config.icon;

  const errorDetails = data && typeof data === 'object' && data !== null && 'details' in data
    ? JSON.stringify((data as Record<string, unknown>).details, null, 2)
    : null;

  if (compact) {
    return (
      <div className={`flex items-center gap-2 p-3 rounded-xl border ${config.bgColor} ${className}`}>
        <Icon className={`w-4 h-4 ${config.iconColor} shrink-0`} />
        <span className={`text-xs ${config.textColor}`}>
          {message || config.defaultMessage}
        </span>
        {onRetry && (
          <Button variant="ghost" size="sm" onClick={onRetry} className="ml-auto">
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Retry</span>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-2xl border ${config.bgColor} ${className}`}>
      <div className="flex items-start gap-4">
        <div className={`p-2 rounded-lg ${config.iconColor}/20 shrink-0`}>
          <Icon className={`w-6 h-6 ${config.iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold ${config.textColor}`}>{title || config.defaultTitle}</h3>
          <p className={`text-sm mt-1 ${config.textColor}/90`}>
            {message || config.defaultMessage}
          </p>
          {errorDetails && (
            <details className="mt-3 text-xs">
              <summary className={`cursor-pointer ${config.textColor}/70`}>Error Details</summary>
              <pre className="mt-2 p-3 bg-gray-100 dark:bg-zinc-800 rounded-lg overflow-auto text-[10px] text-gray-600 dark:text-zinc-400">
                {errorDetails}
              </pre>
            </details>
          )}
          {onRetry && (
            <div className="mt-4">
              <Button
                variant={isAuthError ? 'danger' : 'primary'}
                size="sm"
                onClick={onRetry}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                {isAuthError ? 'Go to Login' : 'Retry Request'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const InlineError: React.FC<{ message: string; onDismiss?: () => void }> = ({ message, onDismiss }) => (
  <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/30 text-rose-700 dark:text-rose-300">
    <AlertCircle className="w-4 h-4 shrink-0" />
    <span className="text-sm flex-1">{message}</span>
    {onDismiss && (
      <button
        type="button"
        onClick={onDismiss}
        className="text-rose-400 hover:text-rose-300 p-1 rounded-lg hover:bg-rose-500/10 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    )}
  </div>
);