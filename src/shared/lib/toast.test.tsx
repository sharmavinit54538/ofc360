import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { subscribeToasts, toast } from './toast';
import { ToastProvider } from '@/shared/ui/Toast';

afterEach(() => {
  cleanup();
});

describe('imperative toast bridge', () => {
  it('publishes typed events and unsubscribes listeners', () => {
    const listener = vi.fn();
    const unsubscribe = subscribeToasts(listener);

    const id = toast.warning('Check the application', { title: 'Notice', duration: 0 });

    expect(listener).toHaveBeenCalledWith({
      id,
      type: 'warning',
      message: 'Check the application',
      title: 'Notice',
      duration: 0,
    });
    unsubscribe();
    toast.info('Later message');
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('updates a loading toast in place when the same id is reused', () => {
    render(<ToastProvider><div>Dashboard</div></ToastProvider>);

    act(() => {
      toast.loading('Parsing resume', { id: 'resume-upload', duration: 0 });
    });
    expect(screen.getByText('Parsing resume')).toBeInTheDocument();

    act(() => {
      toast.success('Resume parsed', { id: 'resume-upload', duration: 0 });
    });

    expect(screen.queryByText('Parsing resume')).not.toBeInTheDocument();
    expect(screen.getByText('Resume parsed')).toBeInTheDocument();
    expect(screen.getAllByRole('status')).toHaveLength(1);
  });
});



