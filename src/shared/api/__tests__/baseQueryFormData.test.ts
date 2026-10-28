import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { rawBaseQuery } from '../baseQuery';

describe('baseQuery FormData header handling', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('sets Content-Type: application/json for standard JSON requests', async () => {
    let capturedHeaders: Headers | undefined;
    globalThis.fetch = vi.fn().mockImplementation((input: RequestInfo | URL, init?: RequestInit) => {
      if (input instanceof Request) {
        capturedHeaders = input.headers;
      } else {
        capturedHeaders = new Headers(init?.headers);
      }
      return Promise.resolve(new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }));
    });

    const fakeApi: any = {
      getState: () => ({ auth: { accessToken: 'test-token' } }),
      dispatch: vi.fn(),
    };

    await rawBaseQuery(
      {
        url: '/test-json',
        method: 'POST',
        body: { key: 'value' },
      },
      fakeApi,
      {}
    );

    expect(capturedHeaders).toBeDefined();
    expect(capturedHeaders?.get('Content-Type')).toBe('application/json');
    expect(capturedHeaders?.get('Authorization')).toBe('Bearer test-token');
  });

  it('preserves multipart boundary and omits Content-Type: application/json for FormData requests', async () => {
    let capturedHeaders: Headers | undefined;
    globalThis.fetch = vi.fn().mockImplementation((input: RequestInfo | URL, init?: RequestInit) => {
      if (input instanceof Request) {
        capturedHeaders = input.headers;
      } else {
        capturedHeaders = new Headers(init?.headers);
      }
      return Promise.resolve(new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }));
    });

    const fakeApi: any = {
      getState: () => ({ auth: { accessToken: 'test-token' } }),
      dispatch: vi.fn(),
    };

    const formData = new FormData();
    formData.append('file', new Blob(['test content'], { type: 'application/pdf' }), 'test.pdf');
    formData.append('title', 'Test PDF Document');

    await rawBaseQuery(
      {
        url: '/test-upload',
        method: 'POST',
        body: formData,
      },
      fakeApi,
      {}
    );

    expect(capturedHeaders).toBeDefined();
    // Content-Type must NOT be forced to application/json so the browser/fetch runtime can set multipart/form-data with boundary
    expect(capturedHeaders?.get('Content-Type')).not.toBe('application/json');
    expect(capturedHeaders?.get('Authorization')).toBe('Bearer test-token');
    expect(capturedHeaders?.get('X-Client-Platform')).toBe('OFC360-Enterprise-Web');
  });
});
