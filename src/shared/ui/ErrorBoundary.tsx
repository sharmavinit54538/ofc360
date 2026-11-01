/**
 * @file ErrorBoundary.tsx
 * @description Enterprise React Error Boundary catching synchronous render and Suspense errors.
 * Provides user-friendly recovery options, technical diagnostic logging, and safe fallback rendering.
 */

import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from 'lucide-react';
import { Button } from './Button';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
  title?: string;
  message?: string;
  showHomeButton?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    // Safe diagnostic logging without exposing sensitive tokens
    console.error('[ErrorBoundary caught error]:', {
      name: error.name,
      message: error.message,
      componentStack: errorInfo.componentStack?.slice(0, 500),
    });
  }

  public handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    this.props.onReset?.();
  };

  public handleGoHome = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard';
    }
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isDev = process.env.NODE_ENV !== 'production';
      const errorMessage = this.state.error?.message || this.props.message || 'An unexpected runtime error occurred.';
      const isSuspenseError = errorMessage.includes('suspended') || errorMessage.includes('Suspense');

      return (
        <div className="min-h-[320px] flex items-center justify-center p-6 bg-slate-50/60 dark:bg-zinc-950/40 rounded-2xl border border-slate-200/80 dark:border-zinc-800 my-4">
          <div className="max-w-md w-full text-center space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40">
              {isSuspenseError ? (
                <ShieldAlert className="w-6 h-6" />
              ) : (
                <AlertTriangle className="w-6 h-6" />
              )}
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {this.props.title || (isSuspenseError ? 'Navigation Synchronization Error' : 'Unable to load view')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                {isSuspenseError
                  ? 'A background component transition was interrupted. Please retry loading this section.'
                  : errorMessage}
              </p>
            </div>

            {isDev && this.state.error && (
              <details className="text-left text-[11px] bg-slate-100 dark:bg-zinc-900 p-3 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 font-mono overflow-auto max-h-40">
                <summary className="cursor-pointer font-bold text-slate-600 dark:text-zinc-400 mb-1">
                  Technical Details (Development Only)
                </summary>
                <div>{this.state.error.toString()}</div>
                {this.state.errorInfo?.componentStack && (
                  <pre className="mt-2 text-[10px] text-slate-500 whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </details>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={this.handleReset}
                className="gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </Button>

              {this.props.showHomeButton !== false && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={this.handleGoHome}
                  className="gap-1.5"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Go to Dashboard</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
