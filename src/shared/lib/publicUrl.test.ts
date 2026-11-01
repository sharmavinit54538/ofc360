import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  getCareerSiteUrl,
  getJobApplicationUrl,
  getPublicAppUrl,
  getPublicJobUrl,
  getReferralUrl,
  sanitizePublicUrl,
} from './publicUrl';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('public URL helpers', () => {
  it('uses the configured public origin and removes trailing slashes', () => {
    vi.stubEnv('VITE_PUBLIC_APP_URL', 'https://careers.example.test///');
    expect(getPublicAppUrl()).toBe('https://careers.example.test');
  });

  it('uses the public application path and safely encodes IDs', () => {
    vi.stubEnv('VITE_PUBLIC_APP_URL', 'https://careers.example.test');
    expect(getJobApplicationUrl('job/with space')).toBe('https://careers.example.test/jobs/apply/job%2Fwith%20space');
    expect(getPublicJobUrl('job-123')).toBe('https://careers.example.test/jobs/apply/job-123');
    expect(getReferralUrl('job-123')).toBe('https://careers.example.test/jobs/apply/job-123');
  });

  it('returns a local career-site route', () => {
    expect(getCareerSiteUrl('product roles')).toBe('/careers/product%20roles');
  });

  it('replaces development origins while preserving path, query, and fragment', () => {
    vi.stubEnv('VITE_PUBLIC_APP_URL', 'https://careers.example.test/');
    expect(sanitizePublicUrl('http://localhost:8080/careers/aurix?team=hr#jobs'))
      .toBe('https://careers.example.test/careers/aurix?team=hr#jobs');
  });

  it('keeps a non-local backend URL unchanged', () => {
    expect(sanitizePublicUrl('https://jobs.example.test/opening/123')).toBe('https://jobs.example.test/opening/123');
  });
});

