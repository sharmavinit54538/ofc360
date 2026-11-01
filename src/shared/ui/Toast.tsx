import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, LoaderCircle, X } from 'lucide-react';
import { subscribeToasts } from '@/shared/lib/toast';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface ToastItem {
  id: string;
  title?: string;
  message?: string;
  description?: string;
  type?: ToastType;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  duration?: number;
}

interface ToastContextType {
  toast: (item: Omit<ToastItem, 'id'>) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<(ToastItem & { message: string; type: ToastType })[]>([]);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const fallbackId = useRef(0);

  const dismiss = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer) clearTimeout(timer);
    timers.current.delete(id);
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ id: requestedId, title, message, description, type, variant, duration = 4000 }: Omit<ToastItem, 'id'> & { id?: string }) => {
      const id = requestedId ?? `toast-${Date.now()}-${++fallbackId.current}`;
      const resolvedMessage = message || description || '';
      let resolvedType: ToastType = type || 'info';
      if (!type) {
        if (variant === 'destructive') resolvedType = 'error';
        else if (variant === 'default' || variant === 'success') resolvedType = 'success';
        else if (variant === 'warning') resolvedType = 'warning';
      }
      const item = { id, title, message: resolvedMessage, type: resolvedType, duration };
      setToasts((prev) => prev.some((existing) => existing.id === id)
        ? prev.map((existing) => existing.id === id ? item : existing)
        : [...prev, item]);

      const previousTimer = timers.current.get(id);
      if (previousTimer) clearTimeout(previousTimer);
      timers.current.delete(id);
      if (duration > 0) timers.current.set(id, setTimeout(() => dismiss(id), duration));
      return id;
    },
    [dismiss]
  );

  useEffect(() => subscribeToasts((event) => { addToast(event); }), [addToast]);
  useEffect(() => () => { timers.current.forEach((timer) => clearTimeout(timer)); }, []);

  const success = useCallback((message: string, title?: string) => addToast({ type: 'success', message, title }), [addToast]);
  const error = useCallback((message: string, title?: string) => addToast({ type: 'error', message, title }), [addToast]);
  const warning = useCallback((message: string, title?: string) => addToast({ type: 'warning', message, title }), [addToast]);
  const info = useCallback((message: string, title?: string) => addToast({ type: 'info', message, title }), [addToast]);

  return (
    <ToastContext.Provider value={{ toast: addToast, success, error, warning, info, dismiss }}>
      {children}

      {/* Top Right Floating Flash Message Container */}
      <div role="status" aria-live="polite" className="fixed top-5 right-5 z-50 flex flex-col items-end gap-2.5 max-w-sm sm:max-w-md w-full pointer-events-none px-4">
        {toasts.map((t) => {
          const icons = {
            success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
            error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />,
            warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />,
            info: <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />,
            loading: <LoaderCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5 animate-spin" />,
          };

          const cardStyles = {
            success: 'border-emerald-200 dark:border-emerald-900/30 bg-white dark:bg-[#171717] shadow-xl shadow-emerald-950/5 dark:shadow-emerald-900/10',
            error: 'border-rose-200 dark:border-rose-900/30 bg-white dark:bg-[#171717] shadow-xl shadow-rose-950/5 dark:shadow-rose-900/10',
            warning: 'border-amber-200 dark:border-amber-900/30 bg-white dark:bg-[#171717] shadow-xl shadow-amber-950/5 dark:shadow-amber-900/10',
            info: 'border-indigo-200 dark:border-indigo-900/30 bg-white dark:bg-[#171717] shadow-xl shadow-indigo-950/5 dark:shadow-indigo-900/10',
            loading: 'border-indigo-200 dark:border-indigo-900/30 bg-white dark:bg-[#171717] shadow-xl shadow-indigo-950/5 dark:shadow-indigo-900/10',
          };

          const titleColor = 'text-gray-900 dark:text-[#ececec]';
          const messageColor = 'text-gray-600 dark:text-zinc-400';

          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border transition-all duration-300 animate-in slide-in-from-top-2 slide-in-from-right-4 fade-in w-full ${cardStyles[t.type]}`}
            >
              {icons[t.type]}
              <div className="flex-1 min-w-0">
                {t.title && (
                  <h4 className={`text-sm font-bold ${titleColor} mb-0.5`}>{t.title}</h4>
                )}
                <p className={`text-xs ${messageColor} leading-relaxed break-words font-medium`}>
                  {t.message}
                </p>
              </div>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="text-gray-400 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-200 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2f2f2f] shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};


