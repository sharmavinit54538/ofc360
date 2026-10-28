/**
 * @file signatureUtils.test.ts
 * @description Comprehensive unit tests for Digital Signatures business logic rules.
 */

import { describe, it, expect } from 'vitest';
import {
  isSequentialOrder,
  isRequestExpired,
  resolveEffectiveStatus,
  isExpiringSoon,
  formatExpiryCountdown,
  getActiveSequentialSigner,
  isSignerTurn,
  canUserSign,
  findSignerForUser,
  canRemindSigner,
  computeStateAfterSign,
  computeStateAfterDecline,
  calculateAvgTurnaroundHours,
  formatDocumentTypeLabel,
  getStatusBadgeConfig,
} from '../utils/signatureUtils';
import type { SignatureRequest, Signer } from '../types/signatures.types';

const createMockSigner = (overrides: Partial<Signer> = {}): Signer => ({
  id: 'sig-1',
  name: 'Jane Doe',
  email: 'jane@example.com',
  kind: 'EMPLOYEE',
  role: 'SIGNER',
  order: 1,
  status: 'PENDING',
  ...overrides,
});

const createMockRequest = (overrides: Partial<SignatureRequest> = {}): SignatureRequest => ({
  id: 'req-1',
  referenceNo: 'SIG-2026-0001',
  title: 'NDA Agreement',
  documentType: 'NDA',
  source: 'GENERATED',
  fileName: 'nda.pdf',
  sha256: 'abc123hash',
  signingOrder: 'SEQUENTIAL',
  status: 'PENDING',
  createdBy: { id: 'u1', name: 'HR Admin', email: 'hr@example.com' },
  createdAt: '2026-10-01T10:00:00Z',
  sentAt: '2026-10-01T10:05:00Z',
  expiresAt: '2026-11-01T10:00:00Z',
  reminderDays: [3, 7],
  signers: [
    createMockSigner({ id: 's1', email: 'jane@example.com', order: 1, status: 'PENDING' }),
    createMockSigner({ id: 's2', email: 'john@example.com', order: 2, status: 'WAITING' }),
  ],
  progress: { signed: 0, total: 2 },
  ...overrides,
});

describe('Digital Signatures Business Rules (signatureUtils)', () => {
  describe('Signing Order & Turn Determination', () => {
    it('correctly identifies sequential ordering', () => {
      expect(isSequentialOrder('SEQUENTIAL')).toBe(true);
      expect(isSequentialOrder('sequential')).toBe(true);
      expect(isSequentialOrder('PARALLEL')).toBe(false);
    });

    it('in sequential flow: finds the lowest-order unsigned signer', () => {
      const signers: Signer[] = [
        createMockSigner({ id: 's2', order: 2, status: 'WAITING' }),
        createMockSigner({ id: 's1', order: 1, status: 'SIGNED' }),
        createMockSigner({ id: 's3', order: 3, status: 'WAITING' }),
      ];
      const active = getActiveSequentialSigner(signers);
      expect(active?.id).toBe('s2');
    });

    it('in sequential flow: only the lowest-order unsigned signer has turn', () => {
      const req = createMockRequest({
        signingOrder: 'SEQUENTIAL',
        signers: [
          createMockSigner({ id: 's1', order: 1, status: 'PENDING' }),
          createMockSigner({ id: 's2', order: 2, status: 'WAITING' }),
        ],
      });

      expect(isSignerTurn(req, 's1')).toBe(true);
      expect(isSignerTurn(req, 's2')).toBe(false);
    });

    it('in parallel flow: all non-signed signers have their turn simultaneously', () => {
      const req = createMockRequest({
        signingOrder: 'PARALLEL',
        signers: [
          createMockSigner({ id: 's1', order: 1, status: 'PENDING' }),
          createMockSigner({ id: 's2', order: 2, status: 'PENDING' }),
        ],
      });

      expect(isSignerTurn(req, 's1')).toBe(true);
      expect(isSignerTurn(req, 's2')).toBe(true);
    });
  });

  describe('User Signability Permissions (canUserSign)', () => {
    it('allows signing when it is user turn and email matches', () => {
      const req = createMockRequest();
      const signer = req.signers[0];
      const user = { email: 'jane@example.com' };

      expect(canUserSign(req, signer, user)).toBe(true);
    });

    it('allows signing when employeeId matches', () => {
      const req = createMockRequest({
        signers: [createMockSigner({ id: 's1', employeeId: 'EMP-99', status: 'PENDING' })],
      });
      const user = { employeeId: 'EMP-99' };

      expect(canUserSign(req, req.signers[0], user)).toBe(true);
    });

    it('rejects signing when user email/id does not match signer slot', () => {
      const req = createMockRequest();
      const signer = req.signers[0];
      const user = { email: 'unrelated@example.com' };

      expect(canUserSign(req, signer, user)).toBe(false);
    });

    it('rejects signing when it is not their turn in sequential flow', () => {
      const req = createMockRequest();
      const signer2 = req.signers[1]; // status WAITING, order 2
      const user2 = { email: 'john@example.com' };

      expect(canUserSign(req, signer2, user2)).toBe(false);
    });

    it('rejects signing when request is completed or cancelled', () => {
      const req = createMockRequest({ status: 'COMPLETED' });
      const signer = req.signers[0];
      const user = { email: 'jane@example.com' };

      expect(canUserSign(req, signer, user)).toBe(false);
    });

    it('findSignerForUser retrieves matching signer object', () => {
      const req = createMockRequest();
      const found = findSignerForUser(req, { email: 'JOHN@example.com' });
      expect(found?.id).toBe('s2');
    });
  });

  describe('Decline Cascades (computeStateAfterDecline)', () => {
    it('transitions entire request to DECLINED upon any decline', () => {
      const req = createMockRequest({
        signers: [
          createMockSigner({ id: 's1', status: 'PENDING' }),
          createMockSigner({ id: 's2', status: 'WAITING' }),
        ],
      });

      const { requestStatus, updatedSigners } = computeStateAfterDecline(req, 's1', 'Terms are unacceptable');

      expect(requestStatus).toBe('DECLINED');
      const declinedSigner = updatedSigners.find((s) => s.id === 's1');
      expect(declinedSigner?.status).toBe('DECLINED');
      expect(declinedSigner?.declineReason).toBe('Terms are unacceptable');
    });
  });

  describe('Completion Rules (computeStateAfterSign)', () => {
    it('when requireAllSignatures is true: stays IN_PROGRESS and advances next signer in sequential mode', () => {
      const req = createMockRequest({
        signingOrder: 'SEQUENTIAL',
        signers: [
          createMockSigner({ id: 's1', order: 1, status: 'PENDING', role: 'SIGNER' }),
          createMockSigner({ id: 's2', order: 2, status: 'WAITING', role: 'SIGNER' }),
        ],
      });

      const result = computeStateAfterSign(req, 's1', true);

      expect(result.requestStatus).toBe('IN_PROGRESS');
      expect(result.progress).toEqual({ signed: 1, total: 2 });
      const s1 = result.updatedSigners.find((s) => s.id === 's1');
      const s2 = result.updatedSigners.find((s) => s.id === 's2');
      expect(s1?.status).toBe('SIGNED');
      expect(s2?.status).toBe('PENDING'); // Advanced!
    });

    it('when requireAllSignatures is true: marks COMPLETED when all SIGNERs have signed', () => {
      const req = createMockRequest({
        signers: [
          createMockSigner({ id: 's1', status: 'SIGNED', role: 'SIGNER' }),
          createMockSigner({ id: 's2', status: 'PENDING', role: 'SIGNER' }),
        ],
      });

      const result = computeStateAfterSign(req, 's2', true);

      expect(result.requestStatus).toBe('COMPLETED');
      expect(result.progress).toEqual({ signed: 2, total: 2 });
    });

    it('when requireAllSignatures is false: completes upon the very first signature', () => {
      const req = createMockRequest({
        signers: [
          createMockSigner({ id: 's1', status: 'PENDING', role: 'SIGNER' }),
          createMockSigner({ id: 's2', status: 'WAITING', role: 'SIGNER' }),
        ],
      });

      const result = computeStateAfterSign(req, 's1', false);

      expect(result.requestStatus).toBe('COMPLETED');
    });
  });

  describe('Expiration & Countdown', () => {
    const fixedNow = new Date('2026-10-15T12:00:00Z');

    it('identifies expired requests', () => {
      const pastReq = { expiresAt: '2026-10-14T00:00:00Z', status: 'PENDING' as const };
      expect(isRequestExpired(pastReq, fixedNow)).toBe(true);
      expect(resolveEffectiveStatus(pastReq, fixedNow)).toBe('EXPIRED');
    });

    it('completed requests do not expire even if past expiry', () => {
      const pastReq = { expiresAt: '2026-10-14T00:00:00Z', status: 'COMPLETED' as const };
      expect(isRequestExpired(pastReq, fixedNow)).toBe(false);
      expect(resolveEffectiveStatus(pastReq, fixedNow)).toBe('COMPLETED');
    });

    it('detects expiring soon (within 3 days)', () => {
      const expiringIn2Days = '2026-10-17T12:00:00Z';
      const expiringIn5Days = '2026-10-20T12:00:00Z';

      expect(isExpiringSoon(expiringIn2Days, fixedNow)).toBe(true);
      expect(isExpiringSoon(expiringIn5Days, fixedNow)).toBe(false);
    });

    it('formats countdown string correctly', () => {
      expect(formatExpiryCountdown('2026-10-17T18:00:00Z', fixedNow)).toBe('2d 6h left');
      expect(formatExpiryCountdown('2026-10-15T16:00:00Z', fixedNow)).toBe('4h left');
      expect(formatExpiryCountdown('2026-10-14T12:00:00Z', fixedNow)).toBe('Expired 1d ago');
    });
  });

  describe('Manual Reminder Throttling (24h rule)', () => {
    const fixedNow = new Date('2026-10-15T12:00:00Z');

    it('allows reminder if no reminder was previously sent', () => {
      const signer = createMockSigner({ lastReminderAt: null });
      expect(canRemindSigner(signer, fixedNow).canRemind).toBe(true);
    });

    it('blocks reminder if sent within the last 24 hours', () => {
      // Sent 4 hours ago
      const signer = createMockSigner({ lastReminderAt: '2026-10-15T08:00:00Z' });
      const check = canRemindSigner(signer, fixedNow);

      expect(check.canRemind).toBe(false);
      expect(check.remainingHours).toBe(20);
      expect(check.reason).toContain('Please wait 20h');
    });

    it('allows reminder once 24 hours have elapsed', () => {
      // Sent 25 hours ago
      const signer = createMockSigner({ lastReminderAt: '2026-10-14T11:00:00Z' });
      expect(canRemindSigner(signer, fixedNow).canRemind).toBe(true);
    });

    it('blocks reminder if signer has already signed or is waiting in sequence', () => {
      const signedSigner = createMockSigner({ status: 'SIGNED' });
      expect(canRemindSigner(signedSigner, fixedNow).canRemind).toBe(false);

      const waitingSigner = createMockSigner({ status: 'WAITING' });
      expect(canRemindSigner(waitingSigner, fixedNow).canRemind).toBe(false);
    });
  });

  describe('Turnaround Time & Formatting', () => {
    it('calculates average turnaround hours for completed requests', () => {
      const requests = [
        createMockRequest({
          status: 'COMPLETED',
          sentAt: '2026-10-01T10:00:00Z',
          completedAt: '2026-10-01T20:00:00Z', // 10 hours
        }),
        createMockRequest({
          status: 'COMPLETED',
          sentAt: '2026-10-02T10:00:00Z',
          completedAt: '2026-10-03T10:00:00Z', // 24 hours
        }),
        createMockRequest({ status: 'PENDING' }), // ignored
      ];

      expect(calculateAvgTurnaroundHours(requests)).toBe(17);
    });

    it('formats document types and status badges', () => {
      expect(formatDocumentTypeLabel('OFFER_LETTER')).toBe('Offer Letter');
      expect(formatDocumentTypeLabel('NDA')).toBe('Non-Disclosure Agreement (NDA)');
      expect(getStatusBadgeConfig('COMPLETED').variant).toBe('success');
      expect(getStatusBadgeConfig('EXPIRED').variant).toBe('slate');
    });
  });
});

