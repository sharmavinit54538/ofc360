import { describe, it, expect } from 'vitest';
import {
  unwrapApiResponse,
  calculateNoticeDays,
  mapDepartmentClearances,
  mapExitAssets,
  mapFnFSettlement,
  mapExitInterview,
  mapExitDocuments,
  mapTimelineEvents,
  mapExitCase,
  mapExitCaseListResponse,
  mapExitAnalyticsMetrics,
  DEFAULT_CLEARANCE_DEPARTMENTS,
} from '../exitMappers';

describe('exitMappers unit tests', () => {
  describe('unwrapApiResponse', () => {
    it('unwraps data envelope when present', () => {
      const payload = { data: { id: 'test-123' } };
      expect(unwrapApiResponse(payload)).toEqual({ id: 'test-123' });
    });

    it('returns raw payload when data envelope is absent', () => {
      const payload = { id: 'test-456' };
      expect(unwrapApiResponse(payload)).toEqual({ id: 'test-456' });
    });
  });

  describe('calculateNoticeDays', () => {
    it('calculates served days and remaining days correctly', () => {
      const today = new Date();
      const resDate = new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString();
      const lwd = new Date(today.getTime() + 20 * 24 * 60 * 60 * 1000).toISOString();

      const { servedDays, remainingDays } = calculateNoticeDays(resDate, lwd, 30);
      expect(servedDays).toBeGreaterThanOrEqual(9);
      expect(servedDays).toBeLessThanOrEqual(11);
      expect(remainingDays).toBeGreaterThanOrEqual(19);
      expect(remainingDays).toBeLessThanOrEqual(21);
    });

    it('handles undefined dates gracefully', () => {
      const result = calculateNoticeDays(undefined, undefined, 45);
      expect(result.servedDays).toBe(0);
      expect(result.remainingDays).toBe(45);
    });
  });

  describe('mapDepartmentClearances', () => {
    it('synthesizes default 5 departments when raw is empty', () => {
      const clearances = mapDepartmentClearances([]);
      expect(clearances).toHaveLength(5);
      expect(clearances.map((c) => c.department)).toEqual(DEFAULT_CLEARANCE_DEPARTMENTS);
      expect(clearances[0].status).toBe('PENDING');
      expect(clearances[0].checklist.length).toBeGreaterThan(0);
    });

    it('maps snake_case and camelCase clearance payloads with status and reasons', () => {
      const raw = [
        {
          department: 'IT',
          status: 'cleared',
          signed_by: 'usr-1',
          signed_by_name: 'IT Admin Alex',
          remarks: 'All equipment collected',
        },
        {
          department: 'FINANCE',
          status: 'ON_HOLD',
          reason: 'Pending travel reimbursement bills',
        },
        {
          department: 'ADMIN',
          status: 'REJECTED',
          reason: 'Locker key missing',
        },
      ];

      const clearances = mapDepartmentClearances(raw);
      expect(clearances).toHaveLength(5);

      const itDept = clearances.find((c) => c.department === 'IT');
      expect(itDept?.status).toBe('CLEARED');
      expect(itDept?.signedByName).toBe('IT Admin Alex');

      const finDept = clearances.find((c) => c.department === 'FINANCE');
      expect(finDept?.status).toBe('ON_HOLD');
      expect(finDept?.reason).toBe('Pending travel reimbursement bills');

      const adminDept = clearances.find((c) => c.department === 'ADMIN');
      expect(adminDept?.status).toBe('REJECTED');
      expect(adminDept?.reason).toBe('Locker key missing');
    });
  });

  describe('mapExitAssets', () => {
    it('maps asset list correctly with condition and recovery', () => {
      const raw = [
        {
          id: 'ea-1',
          asset_id: 'AST-101',
          name: 'MacBook Pro 16',
          condition: 'good',
          status: 'returned',
          recovery_amount: 0,
        },
        {
          id: 'ea-2',
          asset_id: 'AST-102',
          name: 'Dell 27-inch Monitor',
          condition: 'damaged',
          status: 'assigned',
          recovery_amount: 5000,
          remarks: 'Cracked screen bezel',
        },
      ];

      const assets = mapExitAssets(raw);
      expect(assets).toHaveLength(2);
      expect(assets[0].name).toBe('MacBook Pro 16');
      expect(assets[0].status).toBe('RETURNED');
      expect(assets[1].condition).toBe('DAMAGED');
      expect(assets[1].recoveryAmount).toBe(5000);
    });
  });

  describe('mapFnFSettlement', () => {
    it('maps earnings, deductions, and calculates totals accurately without simulation', () => {
      const raw = {
        status: 'UNDER_REVIEW',
        currency: 'INR',
        basic_pay_dues: 50000,
        leave_encashment: 15000,
        bonus_gratuity: 25000,
        deductions: 10000,
        net_payable: 80000,
      };

      const settlement = mapFnFSettlement(raw);
      expect(settlement.status).toBe('UNDER_REVIEW');
      expect(settlement.grossEarnings).toBe(90000);
      expect(settlement.totalDeductions).toBe(10000);
      expect(settlement.netPayable).toBe(80000);
      expect(settlement.currency).toBe('INR');
    });
  });

  describe('mapExitInterview', () => {
    it('maps interview responses and ratings', () => {
      const raw = {
        reason_for_leaving: 'Higher Studies abroad',
        work_environment_rating: 5,
        manager_behaviour_rating: 4,
        salary_benefits_rating: 3,
        career_growth_rating: 4,
        what_should_improve: 'More regular compensation reviews',
        would_rejoin: true,
      };

      const interview = mapExitInterview(raw);
      expect(interview).toBeDefined();
      expect(interview?.reasonForLeaving).toBe('Higher Studies abroad');
      expect(interview?.workEnvironmentRating).toBe(5);
      expect(interview?.wouldRejoin).toBe(true);
    });

    it('returns undefined if interview object is empty', () => {
      expect(mapExitInterview(null)).toBeUndefined();
      expect(mapExitInterview({})).toBeUndefined();
    });
  });

  describe('mapExitDocuments', () => {
    it('maps exit documents with normalized document types', () => {
      const raw = [
        {
          id: 'doc-1',
          type: 'relieving_letter',
          document_number: 'REL-2026-001',
          status: 'issued',
        },
        {
          id: 'doc-2',
          type: 'no_dues_certificate',
          document_number: 'ND-2026-001',
          status: 'generated',
        },
      ];

      const docs = mapExitDocuments(raw);
      expect(docs).toHaveLength(2);
      expect(docs[0].type).toBe('RELIEVING_LETTER');
      expect(docs[1].type).toBe('NO_DUES_CERTIFICATE');
    });
  });

  describe('mapExitCase', () => {
    it('maps full backend exit case with snake_case and separated Exit & FnF statuses', () => {
      const raw = {
        id: 'exit-101',
        case_number: 'EXIT-2026-042',
        employee_id: 'emp-500',
        employee_name: 'Priya Sharma',
        employee_email: 'priya.sharma@ofc360.com',
        designation: 'Senior Backend Engineer',
        department: 'Engineering',
        manager_name: 'Rahul Verma',
        resigned_at: '2026-10-01T10:00:00Z',
        notice_days: 60,
        last_working_day: '2026-11-30T18:00:00Z',
        reason: 'Better Career Opportunity',
        stage: 'CLEARANCE_PENDING',
        status: 'IN_PROGRESS',
        manager_approval_status: 'APPROVED',
        hr_approval_status: 'APPROVED',
        settlement: {
          status: 'DRAFT',
          net_payable: 120000,
        },
      };

      const exitCase = mapExitCase(raw);
      expect(exitCase.id).toBe('exit-101');
      expect(exitCase.caseNumber).toBe('EXIT-2026-042');
      expect(exitCase.employeeName).toBe('Priya Sharma');
      expect(exitCase.stage).toBe('CLEARANCE_PENDING');
      expect(exitCase.exitStatus).toBe('IN_PROGRESS');
      expect(exitCase.fnfStatus).toBe('DRAFT');
      expect(exitCase.managerApproval.status).toBe('APPROVED');
      expect(exitCase.hrApproval.status).toBe('APPROVED');
      expect(exitCase.clearances).toHaveLength(5);
    });
  });

  describe('mapExitAnalyticsMetrics', () => {
    it('maps metrics summary correctly', () => {
      const raw = {
        total_exits: 45,
        active_exits: 12,
        pending_manager_reviews: 3,
        pending_hr_reviews: 2,
        pending_clearances: 4,
        pending_fnf: 5,
        completed_this_month: 8,
        average_notice_days: 30,
      };

      const metrics = mapExitAnalyticsMetrics(raw);
      expect(metrics.totalExits).toBe(45);
      expect(metrics.activeExits).toBe(12);
      expect(metrics.pendingClearances).toBe(4);
    });
  });
});
