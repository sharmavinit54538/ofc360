import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { setupWorker } from 'msw/browser';
import { sidebarBadgesHandlers } from './mocks/sidebarBadges';

// Automatically cleanup DOM after each test run
afterEach(() => {
  cleanup();
});

// Fix jsdom vs undici Request / AbortSignal mismatch for RTK Query in Node 18+
if (typeof globalThis.Request !== 'undefined') {
  const OriginalRequest = globalThis.Request;
  // @ts-ignore
  globalThis.Request = class RequestShim extends OriginalRequest {
    constructor(input: any, init?: any) {
      if (init && 'signal' in init) {
        try {
          super(input, init);
        } catch {
          const { signal, ...rest } = init;
          super(input, rest);
        }
      } else {
        super(input, init);
      }
    }
  };
}

// MSW Worker setup for browser tests
let worker: ReturnType<typeof setupWorker> | null = null;

export const setupMSW = () => {
  if (!worker) {
    worker = setupWorker(...sidebarBadgesHandlers);
  }
  return worker.start({ onUnhandledRequest: 'bypass' });
};

export const resetMSW = () => {
  worker?.resetHandlers(...sidebarBadgesHandlers);
};

vi.mock('msw', async (importOriginal) => {
  const actual = await importOriginal<typeof import('msw')>();
  return {
    ...actual,
    setupWorker: vi.fn(() => ({
      start: vi.fn().mockResolvedValue(undefined),
      stop: vi.fn(),
      resetHandlers: vi.fn(),
      use: vi.fn(),
    })),
  };
});
