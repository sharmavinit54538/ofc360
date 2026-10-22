import { describe, it, expect } from 'vitest';
import { getInitials } from './DashboardShell';

describe('getInitials', () => {
  it('generates initials for full names', () => {
    expect(getInitials('Shivam Kumar')).toBe('SK');
    expect(getInitials('Vinit Sharma')).toBe('VS');
    expect(getInitials('Shivam Sharma')).toBe('SS');
  });

  it('generates single letter initial for single-word names', () => {
    expect(getInitials('Rahul')).toBe('R');
    expect(getInitials('Shivam')).toBe('S');
  });

  it('handles multi-word names with more than two words', () => {
    expect(getInitials('John Michael Doe')).toBe('JD');
  });

  it('safely falls back to U for empty, missing, or whitespace-only names', () => {
    expect(getInitials(undefined)).toBe('U');
    expect(getInitials(null)).toBe('U');
    expect(getInitials('')).toBe('U');
    expect(getInitials('   ')).toBe('U');
  });

  it('trims extra whitespace around and between names', () => {
    expect(getInitials('  Vinit    Sharma  ')).toBe('VS');
  });
});
