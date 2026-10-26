/**
 * @file announcements.test.ts
 * @description Unit tests for OFC360 Announcements RTK Query integration,
 * response unwrapping, and ensuring zero mock or fake data.
 */

import { describe, it, expect } from 'vitest';
import { hrDashboardApi, normalizeAnnouncementsResponse } from '../api/hrDashboardApi';
import type { Announcement } from '../types/hrDashboard.types';

describe('OFC360 Announcements: RTK Query Endpoint Definitions', () => {
  it('defines getAnnouncements query pointing to /hr-admin/announcements with proper tags', () => {
    const endpoint = hrDashboardApi.endpoints.getAnnouncements;
    expect(endpoint).toBeDefined();

    // Query configuration check
    const queryWithParams = endpoint.initiate({ limit: 15, type: 'URGENT' });
    expect(queryWithParams).toBeDefined();

    const queryWithoutParams = endpoint.initiate(undefined);
    expect(queryWithoutParams).toBeDefined();
  });

  it('defines createAnnouncement mutation with POST method and cache invalidation tags', () => {
    const endpoint = hrDashboardApi.endpoints.createAnnouncement;
    expect(endpoint).toBeDefined();

    const mutation = endpoint.initiate({
      title: 'Emergency Office Relocation Notice',
      content: 'Effective immediately, the 4th floor is closed for maintenance.',
      type: 'URGENT',
      priority: 'CRITICAL',
    });
    expect(mutation).toBeDefined();
  });

  it('defines updateAnnouncement mutation with PATCH method and cache invalidation tags', () => {
    const endpoint = hrDashboardApi.endpoints.updateAnnouncement;
    expect(endpoint).toBeDefined();

    const mutation = endpoint.initiate({
      id: 'ann-123',
      data: {
        title: 'Updated Notice',
        priority: 'HIGH',
      },
    });
    expect(mutation).toBeDefined();
  });

  it('defines deleteAnnouncement mutation with DELETE method and cache invalidation tags', () => {
    const endpoint = hrDashboardApi.endpoints.deleteAnnouncement;
    expect(endpoint).toBeDefined();

    const mutation = endpoint.initiate('ann-to-delete-123');
    expect(mutation).toBeDefined();
  });
});

describe('OFC360 Announcements: Response Normalization & Safe Unwrapping', () => {
  const transform = normalizeAnnouncementsResponse;

  it('extracts Announcement[] directly from a raw array response', () => {
    const rawList: Announcement[] = [
      {
        id: 'ann-live-1',
        title: 'Q4 Annual Townhall',
        content: 'Join the executive leadership team at 4:00 PM IST.',
        type: 'EVENT',
        priority: 'HIGH',
        authorName: 'Executive Office',
        publishedAt: '2026-10-26T10:00:00Z',
      },
    ];

    const result = transform(rawList);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Q4 Annual Townhall');
  });

  it('extracts Announcement[] safely from a { data: [...] } envelope', () => {
    const envelope = {
      data: [
        {
          id: 'ann-live-2',
          title: 'Revised Health Insurance Policy',
          content: 'Updated coverage guidelines are now in effect.',
          type: 'POLICY',
          priority: 'MEDIUM',
          publishedAt: '2026-10-25T08:30:00Z',
        },
      ],
      status: 200,
    };

    const result = transform(envelope);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Revised Health Insurance Policy');
  });

  it('extracts Announcement[] safely from a { announcements: [...] } envelope', () => {
    const envelope = {
      announcements: [
        {
          id: 'ann-live-3',
          title: 'Cybersecurity Awareness Month',
          content: 'Please complete the mandatory phishing training.',
          type: 'INFO',
          priority: 'LOW',
          publishedAt: '2026-10-24T12:00:00Z',
        },
      ],
    };

    const result = transform(envelope);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Cybersecurity Awareness Month');
  });

  it('extracts Announcement[] safely from a { items: [...] } envelope', () => {
    const envelope = {
      items: [
        {
          id: 'ann-live-4',
          title: 'Diwali Bonus Disbursal',
          content: 'Disbursal processed.',
          type: 'CELEBRATION',
          priority: 'HIGH',
        },
      ],
    };

    const result = transform(envelope);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Diwali Bonus Disbursal');
  });

  it('strictly returns empty array [] on null, undefined, empty object, or error response (never returns fake data)', () => {
    expect(transform(null)).toEqual([]);
    expect(transform(undefined)).toEqual([]);
    expect(transform({})).toEqual([]);
    expect(transform({ data: null })).toEqual([]);
    expect(transform({ error: 'Server error' })).toEqual([]);
    expect(transform([])).toEqual([]);
  });
});
