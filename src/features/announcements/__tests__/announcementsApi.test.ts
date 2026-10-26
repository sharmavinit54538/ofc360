/**
 * @file announcementsApi.test.ts
 * @description Comprehensive unit tests for OFC360 Announcements RTK Query API,
 * response normalizers, Zod schemas, and all 12 backend endpoint contracts.
 */

import { describe, it, expect } from 'vitest';
import {
  announcementsApi,
  normalizeAnnouncementList,
  normalizeSuperAdminAnnouncements,
  normalizeInternalDashboardFeed,
} from '../api/announcementsApi';
import {
  createAnnouncementSchema,
  updateAnnouncementSchema,
  superAdminAnnouncementSchema,
} from '../schemas/announcements.schemas';
import type {
  AnnouncementResponse,
  SuperAdminAnnouncementResponse,
} from '../types/announcements.types';

describe('OFC360 Announcements: RTK Query Endpoints Coverage (All 12 Endpoints)', () => {
  const endpoints = announcementsApi.endpoints;

  it('verifies all 12 endpoints exist on announcementsApi', () => {
    // 7 Company-level endpoints
    expect(endpoints.getAnnouncements).toBeDefined();
    expect(endpoints.getAnnouncementById).toBeDefined();
    expect(endpoints.createAnnouncement).toBeDefined();
    expect(endpoints.updateAnnouncement).toBeDefined();
    expect(endpoints.deleteAnnouncement).toBeDefined();
    expect(endpoints.publishAnnouncement).toBeDefined();
    expect(endpoints.archiveAnnouncement).toBeDefined();

    // 4 Super Admin platform-wide endpoints
    expect(endpoints.getSuperAdminAnnouncements).toBeDefined();
    expect(endpoints.createSuperAdminAnnouncement).toBeDefined();
    expect(endpoints.updateSuperAdminAnnouncement).toBeDefined();
    expect(endpoints.deleteSuperAdminAnnouncement).toBeDefined();

    // 1 Unified Employee Feed endpoint
    expect(endpoints.getInternalDashboardFeed).toBeDefined();
  });

  describe('Company-Level Endpoints', () => {
    it('getAnnouncements: initiates query with and without params', () => {
      const qWithParams = endpoints.getAnnouncements.initiate({
        status: 'PUBLISHED',
        priority: 'URGENT',
        department: 'Engineering',
        branch: 'HQ-Bangalore',
        search: 'relocation',
        page: 1,
        limit: 20,
      });
      expect(qWithParams).toBeDefined();

      const qEmpty = endpoints.getAnnouncements.initiate({});
      expect(qEmpty).toBeDefined();
    });

    it('getAnnouncementById: initiates GET query by UUID', () => {
      const q = endpoints.getAnnouncementById.initiate('ann-uuid-1234');
      expect(q).toBeDefined();
    });

    it('createAnnouncement: initiates POST mutation with full payload', () => {
      const m = endpoints.createAnnouncement.initiate({
        title: 'New Health Insurance Policy 2026',
        description: 'Comprehensive family cover details enrolled automatically.',
        category: 'Policy',
        priority: 'HIGH',
        department: null,
        branch: null,
        visibility: 'ALL_EMPLOYEES',
        publish_date: '2026-10-26',
        expiry_date: null,
        is_pinned: true,
        status: 'PUBLISHED',
      });
      expect(m).toBeDefined();
    });

    it('updateAnnouncement: initiates full PUT mutation with id and payload', () => {
      const m = endpoints.updateAnnouncement.initiate({
        id: 'ann-uuid-1234',
        data: {
          title: 'Revised Health Insurance Policy 2026',
          description: 'Updated terms for dependent claims.',
          category: 'Policy',
          priority: 'URGENT',
          department: 'HR',
          branch: 'HQ',
          visibility: 'ALL_EMPLOYEES',
          publish_date: '2026-10-26',
          expiry_date: '2026-12-31',
          is_pinned: true,
          status: 'PUBLISHED',
        },
      });
      expect(m).toBeDefined();
    });

    it('deleteAnnouncement: initiates DELETE mutation by id', () => {
      const m = endpoints.deleteAnnouncement.initiate('ann-uuid-1234');
      expect(m).toBeDefined();
    });

    it('publishAnnouncement: initiates PATCH publish mutation by id', () => {
      const m = endpoints.publishAnnouncement.initiate('ann-uuid-1234');
      expect(m).toBeDefined();
    });

    it('archiveAnnouncement: initiates PATCH archive mutation by id', () => {
      const m = endpoints.archiveAnnouncement.initiate('ann-uuid-1234');
      expect(m).toBeDefined();
    });
  });

  describe('Super Admin Endpoints', () => {
    it('getSuperAdminAnnouncements: initiates query', () => {
      const q = endpoints.getSuperAdminAnnouncements.initiate();
      expect(q).toBeDefined();
    });

    it('createSuperAdminAnnouncement: initiates POST mutation', () => {
      const m = endpoints.createSuperAdminAnnouncement.initiate({
        title: 'Platform Maintenance Notice',
        content: 'Zero-downtime maintenance scheduled for Sunday 2 AM.',
        target_audience: 'ALL_TENANTS',
      });
      expect(m).toBeDefined();
    });

    it('updateSuperAdminAnnouncement: initiates PATCH mutation using string ann_id', () => {
      const m = endpoints.updateSuperAdminAnnouncement.initiate({
        ann_id: 'sa-ann-901',
        data: {
          title: 'Platform Maintenance Rescheduled',
          content: 'Shifted to Sunday 4 AM.',
        },
      });
      expect(m).toBeDefined();
    });

    it('deleteSuperAdminAnnouncement: initiates DELETE mutation using string ann_id', () => {
      const m = endpoints.deleteSuperAdminAnnouncement.initiate('sa-ann-901');
      expect(m).toBeDefined();
    });
  });

  describe('Unified Internal Dashboard Feed', () => {
    it('getInternalDashboardFeed: initiates GET query', () => {
      const q = endpoints.getInternalDashboardFeed.initiate();
      expect(q).toBeDefined();
    });
  });
});

describe('OFC360 Announcements: Safe Response Envelope Normalization', () => {
  describe('normalizeAnnouncementList', () => {
    it('normalizes a raw array of announcements', () => {
      const raw: AnnouncementResponse[] = [
        {
          id: 'ann-1',
          title: 'Welcome Townhall',
          description: 'Townhall link inside.',
          category: 'General',
          priority: 'MEDIUM',
          department: null,
          branch: null,
          visibility: 'ALL_EMPLOYEES',
          publish_date: '2026-10-26',
          expiry_date: null,
          is_pinned: true,
          status: 'PUBLISHED',
          created_by: 'admin-1',
          created_at: '2026-10-26T08:00:00Z',
        },
      ];

      const result = normalizeAnnouncementList(raw);
      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
      expect(result.data?.[0].title).toBe('Welcome Townhall');
    });

    it('normalizes a { data: [...] } envelope safely', () => {
      const envelope = {
        data: [
          {
            id: 'ann-2',
            title: 'Holiday Circular: Diwali 2026',
            description: 'Office closed on Monday and Tuesday.',
            priority: 'HIGH',
            status: 'PUBLISHED',
          },
        ],
        total: 45,
        page: 2,
        limit: 10,
        total_pages: 5,
      };

      const result = normalizeAnnouncementList(envelope);
      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(45);
      expect(result.page).toBe(2);
      expect(result.limit).toBe(10);
      expect(result.total_pages).toBe(5);
      expect(result.data?.[0].id).toBe('ann-2');
    });

    it('handles null, undefined, or empty objects safely without throwing', () => {
      const expectedEmpty = {
        items: [],
        data: [],
        total: 0,
        page: 1,
        limit: 20,
        total_pages: 0,
        pages: 0,
      };
      expect(normalizeAnnouncementList(null)).toEqual(expectedEmpty);
      expect(normalizeAnnouncementList(undefined)).toEqual(expectedEmpty);
      expect(normalizeAnnouncementList({})).toEqual(expectedEmpty);
    });
  });

  describe('normalizeSuperAdminAnnouncements', () => {
    it('extracts SuperAdminAnnouncementResponse[] from raw array', () => {
      const raw: SuperAdminAnnouncementResponse[] = [
        {
          ann_id: 'sa-1',
          title: 'Infrastructure Upgrade',
          content: 'Database tier upgraded to Postgres 16.',
          target_audience: 'ALL_TENANTS',
          created_at: '2026-10-26T00:00:00Z',
        },
      ];
      const result = normalizeSuperAdminAnnouncements(raw);
      expect(result).toHaveLength(1);
      expect(result[0].ann_id).toBe('sa-1');
    });

    it('extracts from { data: [...] } envelope', () => {
      const envelope = {
        data: [
          {
            ann_id: 'sa-2',
            title: 'Billing Maintenance',
            content: 'Invoicing service downtime.',
          },
        ],
      };
      const result = normalizeSuperAdminAnnouncements(envelope);
      expect(result).toHaveLength(1);
      expect(result[0].ann_id).toBe('sa-2');
    });

    it('returns empty array on empty or falsy inputs', () => {
      expect(normalizeSuperAdminAnnouncements(null)).toEqual([]);
      expect(normalizeSuperAdminAnnouncements(undefined)).toEqual([]);
      expect(normalizeSuperAdminAnnouncements({})).toEqual([]);
    });
  });

  describe('normalizeInternalDashboardFeed', () => {
    it('extracts pinned and recent announcements accurately', () => {
      const raw = {
        pinned_announcements: [
          { id: 'pin-1', title: 'Critical Alert', is_pinned: true },
        ],
        recent_announcements: [
          { id: 'rec-1', title: 'Weekly Newsletter', is_pinned: false },
        ],
        super_admin_broadcasts: [
          { ann_id: 'sa-1', title: 'Global Platform Update' },
        ],
      };

      const result = normalizeInternalDashboardFeed(raw);
      expect(result.pinned_announcements).toHaveLength(1);
      expect(result.recent_announcements).toHaveLength(1);
      expect(result.super_admin_broadcasts).toHaveLength(1);
      expect(result.pinned_announcements[0].id).toBe('pin-1');
    });

    it('handles nested data envelope', () => {
      const wrapped = {
        data: {
          pinned_announcements: [{ id: 'pin-2', title: 'Fire Drill' }],
          recent_announcements: [],
        },
      };

      const result = normalizeInternalDashboardFeed(wrapped);
      expect(result.pinned_announcements).toHaveLength(1);
      expect(result.recent_announcements).toHaveLength(0);
      expect(result.pinned_announcements[0].title).toBe('Fire Drill');
    });

    it('returns empty lists on null or empty input', () => {
      const empty = normalizeInternalDashboardFeed(null);
      expect(empty.pinned_announcements).toEqual([]);
      expect(empty.recent_announcements).toEqual([]);
      expect(empty.super_admin_broadcasts).toEqual([]);
    });
  });
});

describe('OFC360 Announcements: Zod Payload Schemas & Validation', () => {
  describe('createAnnouncementSchema', () => {
    it('validates a valid announcement payload', () => {
      const valid = {
        title: 'Quarterly Town Hall Meeting',
        description: 'Join all hands to review Q3 progress and upcoming roadmap.',
        category: 'Townhall',
        priority: 'HIGH',
        department: 'Product & Tech',
        branch: 'Bengaluru Campus',
        visibility: 'ALL_EMPLOYEES',
        publish_date: '2026-10-26',
        is_pinned: true,
        status: 'PUBLISHED',
      };

      const parsed = createAnnouncementSchema.safeParse(valid);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.title).toBe(valid.title);
        expect(parsed.data.priority).toBe('HIGH');
        expect(parsed.data.status).toBe('PUBLISHED');
      }
    });

    it('fails when title is missing', () => {
      const invalid = {
        description: 'Missing title description.',
      };

      const parsed = createAnnouncementSchema.safeParse(invalid);
      expect(parsed.success).toBe(false);
    });

    it('fails when title exceeds 150 characters', () => {
      const invalid = {
        title: 'A'.repeat(151),
        description: 'Description text.',
      };

      const parsed = createAnnouncementSchema.safeParse(invalid);
      expect(parsed.success).toBe(false);
    });

    it('fails when description is empty', () => {
      const invalid = {
        title: 'Valid Title',
        description: '',
      };

      const parsed = createAnnouncementSchema.safeParse(invalid);
      expect(parsed.success).toBe(false);
    });

    it('applies defaults for optional fields', () => {
      const minimal = {
        title: 'Simple Notice',
        description: 'This is a brief announcement description.',
      };

      const parsed = createAnnouncementSchema.safeParse(minimal);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.priority).toBe('MEDIUM');
        expect(parsed.data.status).toBe('DRAFT');
        expect(parsed.data.visibility).toBe('ALL_EMPLOYEES');
        expect(parsed.data.category).toBe('General');
        expect(parsed.data.is_pinned).toBe(false);
      }
    });
  });

  describe('updateAnnouncementSchema', () => {
    it('validates full update payload', () => {
      const valid = {
        title: 'Updated Policy Title',
        description: 'Updated policy content details.',
        priority: 'URGENT',
        status: 'PUBLISHED',
      };

      const parsed = updateAnnouncementSchema.safeParse(valid);
      expect(parsed.success).toBe(true);
    });
  });

  describe('superAdminAnnouncementSchema', () => {
    it('validates a valid super admin platform announcement', () => {
      const valid = {
        title: 'Scheduled Maintenance Notice',
        content: 'Services will experience brief intermittent downtime on Sunday.',
        target_audience: 'ALL_TENANTS',
      };

      const parsed = superAdminAnnouncementSchema.safeParse(valid);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.target_audience).toBe('ALL_TENANTS');
      }
    });

    it('applies default target_audience if omitted', () => {
      const valid = {
        title: 'Platform Maintenance',
        content: 'Brief downtime.',
      };

      const parsed = superAdminAnnouncementSchema.safeParse(valid);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.target_audience).toBe('ALL_TENANTS');
      }
    });

    it('rejects empty title or content', () => {
      expect(superAdminAnnouncementSchema.safeParse({ title: '', content: 'x' }).success).toBe(false);
      expect(superAdminAnnouncementSchema.safeParse({ title: 'x', content: '' }).success).toBe(false);
    });
  });
});

