import type { ToastType } from '@/shared/ui/Toast';

export interface GlobalToastEvent {
  id: string;
  message: string;
  title?: string;
  type: ToastType;
  duration?: number;
}

type ToastListener = (event: GlobalToastEvent) => void;
type ToastOptions = { id?: string; title?: string; duration?: number };

const listeners = new Set<ToastListener>();
let sequence = 0;

function publish(type: ToastType, message: string, options: ToastOptions = {}): string {
  const id = options.id ?? `app-toast-${Date.now()}-${++sequence}`;
  const event: GlobalToastEvent = {
    id,
    type,
    message,
    ...(options.title ? { title: options.title } : {}),
    ...(options.duration === undefined && type === 'loading'
      ? { duration: 0 }
      : options.duration === undefined
        ? {}
        : { duration: options.duration }),
  };

  listeners.forEach((listener) => listener(event));
  return id;
}

export function subscribeToasts(listener: ToastListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const toast = {
  success: (message: string, options?: ToastOptions) => publish('success', message, options),
  error: (message: string, options?: ToastOptions) => publish('error', message, options),
  info: (message: string, options?: ToastOptions) => publish('info', message, options),
  warning: (message: string, options?: ToastOptions) => publish('warning', message, options),
  loading: (message: string, options?: ToastOptions) => publish('loading', message, options),
};

