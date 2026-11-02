import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

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
