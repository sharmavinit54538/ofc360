/**
 * @file signaturesApi.test.ts
 * @description Comprehensive unit tests for OFC360 Digital Signatures RTK Query API,
 * response normalizers (snake_case and camelCase), envelope unwrapping, and mock fixtures.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  signaturesApi,
  normalizeSigner,
  normalizeSignatureRequest,
  normalizeSignatureStats,
  normalizeSignatureAuditEvent,
  unwrapEnvelope,
  extractApiErrorMessage,
} from '../api/signaturesApi';
import * as mockDb from '../api/signaturesMock';

describe('OFC360 Digital Signatures: RTK Query Endpoints & Normalizers', () => {
  beforeEach(() => {
    mockDb.resetMockDatabase();
  });

  describe('RTK Query Endpoints Verification', () => {
    const endpoints = signaturesApi.endpoints;

    it('exposes all required signature lifecycle endpoints', () => {
      expect(endpoints.getSignatureStats).toBeDefined();
      expect(endpoints.getSignatureRequests).toBeDefined();
      expect(endpoints.getSignatureRequest).toBeDefined();
      expect(endpoints.getSignatureAudit).toBeDefined();
      expect(endpoints.createSignatureRequest).toBeDefined();
      expect(endpoints.remindSigners).toBeDefined();
      expect(endpoints.resendRequest).toBeDefined();
      expect(endpoints.cancelSignatureRequest).toBeDefined();
      expect(endpoints.signDocument).toBeDefined();
      expect(endpoints.declineSignature).toBeDefined();
      expect(endpoints.downloadSignatureFile).toBeDefined();
      expect(endpoints.getPublicSignatureRequest).toBeDefined();
      expect(endpoints.sendPublicOtp).toBeDefined();
      expect(endpoints.signPublicDocument).toBeDefined();
      expect(endpoints.declinePublicSignature).toBeDefined();
    });
  });

  describe('Tolerant Normalizers (snake_case vs camelCase)', () => {
    it('normalizeSigner: handles snake_case backend payloads', () => {
      const raw = {
        signer_id: 'sgn-99',
        signer_name: 'Anita Roy',
        signer_email: 'anita@example.com',
        employee_id: 'EMP-777',
        role: 'approver',
        signing_order: 2,
        status: 'viewed',
        viewed_at: '2026-10-20T10:00:00Z',
        last_reminder_at: '2026-10-21T09:00:00Z',
      };

      const signer = normalizeSigner(raw);
      expect(signer.id).toBe('sgn-99');
      expect(signer.name).toBe('Anita Roy');
      expect(signer.email).toBe('anita@example.com');
      expect(signer.employeeId).toBe('EMP-777');
      expect(signer.role).toBe('APPROVER');
      expect(signer.order).toBe(2);
      expect(signer.status).toBe('VIEWED');
      expect(signer.viewedAt).toBe('2026-10-20T10:00:00Z');
      expect(signer.lastReminderAt).toBe('2026-10-21T09:00:00Z');
    });

    it('normalizeSigner: handles camelCase payloads and null safety', () => {
      const raw = {
        id: 'sgn-88',
        name: 'Carlos Ruiz',
        email: 'carlos@example.com',
        role: 'SIGNER',
        order: 1,
        status: 'PENDING',
      };

      const signer = normalizeSigner(raw);
      expect(signer.id).toBe('sgn-88');
      expect(signer.name).toBe('Carlos Ruiz');
      expect(signer.kind).toBe('EXTERNAL');
      expect(signer.viewedAt).toBeNull();
      expect(signer.signedAt).toBeNull();
    });

    it('normalizeSignatureRequest: handles snake_case with nested creator', () => {
      const raw = {
        request_id: 'req-501',
        reference_no: 'SIG-2026-0501',
        document_title: 'Service Agreement',
        document_type: 'contract',
        source: 'uploaded',
        file_name: 'contract.pdf',
        file_size: 512000,
        sha256: 'deadbeef123',
        signing_order: 'sequential',
        status: 'in_progress',
        created_by: {
          id: 'u-1',
          name: 'Chief Legal Officer',
          email: 'clo@ofc360.com',
        },
        created_at: '2026-10-15T10:00:00Z',
        expires_at: '2026-11-15T23:59:59Z',
        reminder_days: [5, 10],
        signers: [
          { id: 's1', name: 'Signer 1', email: 's1@test.com', status: 'signed' },
          { id: 's2', name: 'Signer 2', email: 's2@test.com', status: 'pending' },
        ],
      };

      const req = normalizeSignatureRequest(raw);
      expect(req.id).toBe('req-501');
      expect(req.referenceNo).toBe('SIG-2026-0501');
      expect(req.title).toBe('Service Agreement');
      expect(req.documentType).toBe('CONTRACT');
      expect(req.signingOrder).toBe('SEQUENTIAL');
      expect(req.status).toBe('IN_PROGRESS');
      expect(req.createdBy.name).toBe('Chief Legal Officer');
      expect(req.signers).toHaveLength(2);
      expect(req.progress).toEqual({ signed: 1, total: 2 });
    });

    it('normalizeSignatureStats: correctly handles snake_case and missing fields', () => {
      const raw = {
        awaiting_my_signature: 3,
        waiting_on_others: 7,
        completed_last_30_days: 19,
        expiring_soon: 2,
        declined: 1,
        expired: 0,
        avg_turnaround_hours: 14.5,
      };

      const stats = normalizeSignatureStats(raw);
      expect(stats.awaitingMySignature).toBe(3);
      expect(stats.waitingOnOthers).toBe(7);
      expect(stats.completedLast30Days).toBe(19);
      expect(stats.expiringSoon).toBe(2);
      expect(stats.avgTurnaroundHours).toBe(14.5);
    });

    it('normalizeSignatureAuditEvent: normalizes event fields safely', () => {
      const raw = {
        id: 'ev-1',
        request_id: 'req-1',
        event_type: 'signed',
        actor_name: 'Priya',
        actor_email: 'priya@example.com',
        ip_address: '1.2.3.4',
        created_at: '2026-10-25T11:00:00Z',
      };

      const ev = normalizeSignatureAuditEvent(raw);
      expect(ev.type).toBe('SIGNED');
      expect(ev.actorName).toBe('Priya');
      expect(ev.ipAddress).toBe('1.2.3.4');
    });
  });

  describe('Envelope Unwrapping & Error Message Extraction', () => {
    it('unwraps standard API envelope { success: true, data: T }', () => {
      const payload = { success: true, data: { foo: 'bar' } };
      expect(unwrapEnvelope(payload)).toEqual({ foo: 'bar' });
    });

    it('returns raw payload if not in an envelope', () => {
      const raw = [{ id: '1' }, { id: '2' }];
      expect(unwrapEnvelope(raw)).toEqual(raw);
    });

    it('extractApiErrorMessage parses various error shapes', () => {
      expect(extractApiErrorMessage({ data: { message: 'Signer cannot be empty' } })).toBe('Signer cannot be empty');
      expect(extractApiErrorMessage({ data: { detail: 'FastAPI validation error' } })).toBe('FastAPI validation error');
      expect(
        extractApiErrorMessage({
          data: { errors: [{ message: 'Field A required' }, { message: 'Field B invalid' }] },
        })
      ).toBe('Field A required; Field B invalid');
      expect(extractApiErrorMessage(null, 'Custom fallback')).toBe('Custom fallback');
    });
  });

  describe('Mock Database Seed Fixtures & Mutations', () => {
    it('seeds 12 realistic mock requests covering all 7 statuses', () => {
      const requests = mockDb.INITIAL_MOCK_REQUESTS;
      expect(requests.length).toBeGreaterThanOrEqual(12);

      const statuses = new Set(requests.map((r) => r.status));
      expect(statuses.has('DRAFT')).toBe(true);
      expect(statuses.has('PENDING')).toBe(true);
      expect(statuses.has('IN_PROGRESS')).toBe(true);
      expect(statuses.has('COMPLETED')).toBe(true);
      expect(statuses.has('DECLINED')).toBe(true);
      expect(statuses.has('EXPIRED')).toBe(true);
      expect(statuses.has('CANCELLED')).toBe(true);
    });

    it('supports mock signing and advances audit trail', () => {
      const res = mockDb.signMockDocument('sig-req-001', {
        signerId: 'sgn-101',
        method: 'DRAW',
        signatureImage: 'data:image/png;base64,sample',
        consent: true,
      });

      expect(res).toBeDefined();
      expect(res?.status).toBe('COMPLETED');
      expect(res?.progress).toEqual({ signed: 1, total: 1 });

      const audit = mockDb.getMockAudit('sig-req-001');
      expect(audit.some((a) => a.type === 'SIGNED')).toBe(true);
      expect(audit.some((a) => a.type === 'COMPLETED')).toBe(true);
    });

    it('supports mock decline and marks request DECLINED', () => {
      const res = mockDb.declineMockDocument('sig-req-001', {
        signerId: 'sgn-101',
        reason: 'Salary expectation was not met in clause 4',
      });

      expect(res?.status).toBe('DECLINED');
      const signer = res?.signers.find((s) => s.id === 'sgn-101');
      expect(signer?.status).toBe('DECLINED');
      expect(signer?.declineReason).toBe('Salary expectation was not met in clause 4');
    });

    it('supports mock cancellation with reason', () => {
      const success = mockDb.cancelMockRequest('sig-req-002', 'Vendor renegotiated contract terms');
      expect(success).toBe(true);

      const updated = mockDb.getMockRequestById('sig-req-002');
      expect(updated?.status).toBe('CANCELLED');

      const audit = mockDb.getMockAudit('sig-req-002');
      expect(audit[audit.length - 1].type).toBe('CANCELLED');
    });

    it('filters requests by scope, status, and search query', () => {
      const result = mockDb.getMockRequests({ search: 'CyberTech' });
      expect(result.items.length).toBeGreaterThan(0);
      expect(result.items[0].title).toContain('CyberTech');

      const statusFilter = mockDb.getMockRequests({ status: 'COMPLETED' });
      expect(statusFilter.items.every((i) => i.status === 'COMPLETED')).toBe(true);
    });
  });
});
