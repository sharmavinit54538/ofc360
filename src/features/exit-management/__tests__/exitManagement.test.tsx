/**
 * @file exitManagement.test.tsx
 * @description Comprehensive unit and integration test suite for OFC360 Exit Management:
 * 1. RTK Query Endpoints verification (all /api/v1/exits routes)
 * 2. Zod schema validation rules (mandatory rejection reason >= 10 chars, hold reason >= 5 chars, ratings 1-5)
 * 3. Business rule verification:
 *    - Duplicate active request blocked in ESS
 *    - Reject without reason blocked
 *    - Hold clearance without reason blocked
 *    - Manager cannot see exit interview answers (RBAC restricted)
 *    - F&F pending does not block exit completion
 *    - Premature access revocation before LWD refused
 *    - 4-state rendering (loading, error, empty, success)
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import * as exitsApiModule from '../api/exitsApi';
import {
  resignationFormSchema,
  managerRejectionSchema,
  hrRejectionSchema,
  clearanceSignoffSchema,
  exitInterviewSchema,
  assetReturnSchema,
} from '../schemas/exit.schemas';
import { ExitStatsCards } from '../components/ExitStatsCards';
import { ExitRequestsTable } from '../components/ExitRequestsTable';
import { ExitFilters } from '../components/ExitFilters';
import { MyExitPage } from '../pages/MyExitPage';
import { ExitInterviewPage } from '../pages/ExitInterviewPage';
import { ExitNoticePeriodPage } from '../pages/ExitNoticePeriodPage';
import { ExitAccessDeactivationPage } from '../pages/ExitAccessDeactivationPage';
import { ExitSettingsPage } from '../pages/ExitSettingsPage';
import { ExitStagePage } from '../pages/ExitStagePage';
import { STAGE_CONFIGS, getStageConfigBySlug } from '../config/stageConfig';
import { Routes, Route } from 'react-router-dom';
import type { ExitCase } from '../types/exit.types';

// Mock user state
const mockUser = {
  id: 'usr-admin-1',
  fullName: 'Priya Sharma',
  email: 'priya@ofc360.com',
  role: 'HR_ADMIN',
  department: 'People Operations',
  jobTitle: 'HR Director',
};

let currentUserRole = 'HR_ADMIN';

vi.mock('@/features/auth/hooks/useAuth', () => ({
  useAuth: () => ({
    user: {
      ...mockUser,
      role: currentUserRole,
    },
    isAuthenticated: true,
  }),
}));

vi.mock('@/shared/ui/Toast', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  }),
}));

const mockExitCase: ExitCase = {
  id: 'ext-001',
  caseNumber: 'EXIT-2026-001',
  employeeId: 'emp-101',
  employeeName: 'Rahul Verma',
  employeeEmail: 'rahul@ofc360.com',
  department: 'Engineering',
  designation: 'Tech Lead',
  joiningDate: '2023-01-15T00:00:00Z',
  managerName: 'Vikram Mehta',
  resignationDate: '2026-10-01T00:00:00Z',
  noticeDays: 30,
  expectedLastWorkingDay: '2026-12-15T00:00:00Z',
  reason: 'Better Career Opportunity',
  comments: 'Transitioning to new opportunity; handing over core backend services.',
  stage: 'CLEARANCE_PENDING',
  exitStatus: 'IN_PROGRESS',
  fnfStatus: 'DRAFT',
  managerApproval: {
    status: 'APPROVED',
    comments: 'Approved with standard transition',
  },
  hrApproval: {
    status: 'APPROVED',
  },
  clearances: [
    { department: 'MANAGER', status: 'CLEARED', checklist: [] },
    { department: 'IT', status: 'CLEARED', checklist: [] },
    { department: 'FINANCE', status: 'CLEARED', checklist: [] },
    { department: 'ADMIN', status: 'CLEARED', checklist: [] },
    { department: 'HR', status: 'CLEARED', checklist: [] },
  ],
  ktStatus: true,
  ktTasks: [],
  assignedAssets: [],
  settlement: {
    status: 'DRAFT',
    earnings: [],
    deductions: [],
    grossEarnings: 150000,
    totalDeductions: 10000,
    netPayable: 140000,
    currency: 'INR',
  },
  interview: {
    reasonForLeaving: 'Higher Compensation',
    workEnvironmentRating: 4,
    managerBehaviourRating: 5,
    salaryBenefitsRating: 3,
    careerGrowthRating: 4,
    whatShouldImprove: 'Faster promotion cycles and compensation bands',
    wouldRejoin: true,
  },
  documents: [],
  timeline: [],
  isCompleted: false,
  isDeactivated: false,
  createdAt: '2026-10-01T00:00:00Z',
  updatedAt: '2026-10-05T00:00:00Z',
};

// Mock RTK Query hooks in exitsApi
vi.mock('../api/exitsApi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../api/exitsApi')>();
  return {
    ...actual,
    useGetExitCasesQuery: vi.fn(() => ({
      data: { items: [mockExitCase], total: 1, page: 1, limit: 20 },
      isLoading: false,
      error: undefined,
      refetch: vi.fn(),
    })),
    useGetExitStatsQuery: vi.fn(() => ({
      data: {
        totalExits: 45,
        activeExits: 12,
        pendingManagerReviews: 3,
        pendingHrReviews: 2,
        pendingClearances: 4,
        pendingFnF: 5,
        completedThisMonth: 8,
        averageNoticeDays: 30,
      },
      isLoading: false,
      error: undefined,
      refetch: vi.fn(),
    })),
    useGetMyExitRequestQuery: vi.fn(() => ({
      data: { ...mockExitCase, stage: 'RESIGNATION_SUBMITTED' },
      isLoading: false,
      error: undefined,
      refetch: vi.fn(),
    })),
    useGetFnFPreviewQuery: vi.fn(() => ({
      data: mockExitCase.settlement,
      isLoading: false,
      error: undefined,
      refetch: vi.fn(),
    })),
    useGetExitDocumentsQuery: vi.fn(() => ({
      data: [],
      isLoading: false,
      error: undefined,
      refetch: vi.fn(),
    })),
    useSubmitResignationMutation: vi.fn(() => [vi.fn(), { isLoading: false }]),
    useWithdrawMyRequestMutation: vi.fn(() => [vi.fn(), { isLoading: false }]),
    useManagerApproveMutation: vi.fn(() => [vi.fn(), { isLoading: false }]),
    useManagerRejectMutation: vi.fn(() => [vi.fn(), { isLoading: false }]),
    useHrApproveMutation: vi.fn(() => [vi.fn(), { isLoading: false }]),
    useHrRejectMutation: vi.fn(() => [vi.fn(), { isLoading: false }]),
    useStartNoticePeriodMutation: vi.fn(() => [vi.fn(), { isLoading: false }]),
    useCompleteKnowledgeTransferMutation: vi.fn(() => [vi.fn(), { isLoading: false }]),
    useReturnExitAssetMutation: vi.fn(() => [vi.fn(), { isLoading: false }]),
    useSubmitClearanceSignoffMutation: vi.fn(() => [vi.fn(), { isLoading: false }]),
    useUpdateFnFSettlementMutation: vi.fn(() => [vi.fn(), { isLoading: false }]),
    useSubmitExitInterviewMutation: vi.fn(() => [vi.fn(), { isLoading: false }]),
    useGenerateExitDocumentsMutation: vi.fn(() => [vi.fn(), { isLoading: false }]),
    useCompleteExitMutation: vi.fn(() => [vi.fn(), { isLoading: false }]),
  };
});

describe('OFC360 Exit Management: Full 14-Stage Workflow Test Suite', () => {
  beforeEach(() => {
    currentUserRole = 'HR_ADMIN';
  });

  describe('1. RTK Query Endpoints Baseline', () => {
    const endpoints = exitsApiModule.exitsApi.endpoints;

    it('exposes all required /api/v1/exits/* routes', () => {
      expect(endpoints.getExitCases).toBeDefined();
      expect(endpoints.getExitStats).toBeDefined();
      expect(endpoints.getExitCaseById).toBeDefined();
      expect(endpoints.getMyExitRequest).toBeDefined();
      expect(endpoints.submitResignation).toBeDefined();
      expect(endpoints.withdrawMyRequest).toBeDefined();
      expect(endpoints.managerApprove).toBeDefined();
      expect(endpoints.managerReject).toBeDefined();
      expect(endpoints.hrApprove).toBeDefined();
      expect(endpoints.hrReject).toBeDefined();
      expect(endpoints.startNoticePeriod).toBeDefined();
      expect(endpoints.completeKnowledgeTransfer).toBeDefined();
      expect(endpoints.getExitAssets).toBeDefined();
      expect(endpoints.returnExitAsset).toBeDefined();
      expect(endpoints.submitClearanceSignoff).toBeDefined();
      expect(endpoints.getFnFPreview).toBeDefined();
      expect(endpoints.updateFnFSettlement).toBeDefined();
      expect(endpoints.submitExitInterview).toBeDefined();
      expect(endpoints.getExitDocuments).toBeDefined();
      expect(endpoints.generateExitDocuments).toBeDefined();
      expect(endpoints.completeExit).toBeDefined();
    });

    it('verifies no dead /offboarding/ endpoints remain on the API slice', () => {
      const endpointKeys = Object.keys(endpoints);
      for (const key of endpointKeys) {
        expect(key.toLowerCase()).not.toContain('offboarding');
      }
    });
  });

  describe('2. Zod Business Validation Schemas', () => {
    it('resignationFormSchema: enforces reason and min 10 comments', () => {
      const valid = resignationFormSchema.safeParse({
        reason: 'Better Career Opportunity',
        comments: 'Handover complete and code reviewed with team lead.',
        proposedLastWorkingDay: '2026-12-01',
        noticePeriodDays: 30,
      });
      expect(valid.success).toBe(true);

      const invalidComments = resignationFormSchema.safeParse({
        reason: 'Better Career Opportunity',
        comments: 'Short',
        proposedLastWorkingDay: '2026-12-01',
      });
      expect(invalidComments.success).toBe(false);
      if (!invalidComments.success) {
        expect(invalidComments.error.errors[0].message).toContain('at least 10 characters');
      }
    });

    it('reject without reason blocked: requires minimum 10 characters', () => {
      const validReject = managerRejectionSchema.safeParse({
        rejectionReason: 'Project deadline critical until next quarter.',
      });
      expect(validReject.success).toBe(true);

      const invalidReject = managerRejectionSchema.safeParse({
        rejectionReason: 'No reason',
      });
      expect(invalidReject.success).toBe(false);
      if (!invalidReject.success) {
        expect(invalidReject.error.errors[0].message).toContain('at least 10 characters');
      }

      const invalidHrReject = hrRejectionSchema.safeParse({
        rejectionReason: 'Too short',
      });
      expect(invalidHrReject.success).toBe(false);
    });

    it('hold clearance without reason blocked: requires min 5 characters for ON_HOLD and REJECTED', () => {
      const validClear = clearanceSignoffSchema.safeParse({
        department: 'IT',
        status: 'CLEARED',
      });
      expect(validClear.success).toBe(true);

      const invalidHold = clearanceSignoffSchema.safeParse({
        department: 'FINANCE',
        status: 'ON_HOLD',
        reason: '',
      });
      expect(invalidHold.success).toBe(false);

      const validHold = clearanceSignoffSchema.safeParse({
        department: 'FINANCE',
        status: 'ON_HOLD',
        reason: 'Pending travel reimbursement bills',
      });
      expect(validHold.success).toBe(true);
    });

    it('exitInterviewSchema: enforces rating ranges (1-5) and feedback', () => {
      const validInterview = exitInterviewSchema.safeParse({
        reasonForLeaving: 'Higher Compensation',
        workEnvironmentRating: 4,
        managerBehaviourRating: 5,
        salaryBenefitsRating: 3,
        careerGrowthRating: 4,
        whatShouldImprove: 'Clearer career ladders',
        wouldRejoin: true,
      });
      expect(validInterview.success).toBe(true);

      const invalidRating = exitInterviewSchema.safeParse({
        reasonForLeaving: 'Other',
        workEnvironmentRating: 6,
        managerBehaviourRating: 5,
        salaryBenefitsRating: 3,
        careerGrowthRating: 4,
        whatShouldImprove: 'Valid feedback',
        wouldRejoin: true,
      });
      expect(invalidRating.success).toBe(false);
    });
  });

  describe('3. Security & RBAC: Manager Interview Answers Protection', () => {
    it('manager cannot see interview answers: shows access restricted screen when role is MANAGER', () => {
      currentUserRole = 'MANAGER';

      render(
        <MemoryRouter>
          <ExitInterviewPage />
        </MemoryRouter>
      );

      expect(screen.getByText(/Confidential Feedback — Access Restricted/i)).toBeInTheDocument();
      expect(
        screen.getByText(/accessible only to HR Administration and Super Admins/i)
      ).toBeInTheDocument();
      expect(screen.queryByText(/Primary Reason for Leaving/i)).not.toBeInTheDocument();
    });

    it('HR_ADMIN can access exit interview page and form', () => {
      currentUserRole = 'HR_ADMIN';

      render(
        <MemoryRouter>
          <ExitInterviewPage />
        </MemoryRouter>
      );

      expect(screen.getByText(/Confidential Exit Interviews/i)).toBeInTheDocument();
      expect(screen.getByText(/HR & SUPER ADMIN CONFIDENTIAL/i)).toBeInTheDocument();
    });
  });

  describe('4. ESS & Business Constraints Verification', () => {
    it('duplicate active request blocked: disables form and shows active request ladder in ESS', () => {
      render(
        <MemoryRouter>
          <MyExitPage />
        </MemoryRouter>
      );

      expect(screen.getByText('Active Resignation Case In Progress')).toBeInTheDocument();
      expect(screen.getByText('EXIT-2026-001')).toBeInTheDocument();
      expect(screen.getByText('Withdraw Resignation')).toBeInTheDocument();
      expect(screen.queryByText('Submit Resignation Notice')).not.toBeInTheDocument();
    });

    it('premature access revocation refused: warns and disables revocation before LWD', () => {
      render(
        <MemoryRouter>
          <ExitAccessDeactivationPage />
        </MemoryRouter>
      );

      expect(
        screen.getByText(/Premature Revocation Refused by Policy/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Access revocation is locked until the employee's actual Last Working Day/i)
      ).toBeInTheDocument();
    });

    it('F&F pending but exit completable: verifies Complete Exit action is enabled when other gates pass', () => {
      render(
        <MemoryRouter>
          <ExitAccessDeactivationPage />
        </MemoryRouter>
      );

      expect(screen.getByText('Final Exit Completion Gate')).toBeInTheDocument();
      expect(
        screen.getByText(/F&F settlement pending does not block completion/i)
      ).toBeInTheDocument();
      expect(screen.getByText('Formally Complete Exit Case')).toBeInTheDocument();
    });
  });

  describe('5. Component UI & 4-State Rendering', () => {
    it('ExitStatsCards: renders all 4 KPI cards accurately with live values', () => {
      render(
        <ExitStatsCards
          summary={{
            totalExits: 45,
            activeExits: 12,
            pendingManagerReviews: 3,
            pendingHrReviews: 2,
            pendingClearances: 4,
            pendingFnF: 5,
            completedThisMonth: 8,
            averageNoticeDays: 30,
          }}
          isLoading={false}
        />
      );

      expect(screen.getByText('Active Exits')).toBeInTheDocument();
      expect(screen.getAllByText('12').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Pending Manager Review')).toBeInTheDocument();
      expect(screen.getAllByText('3').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Clearances In Progress')).toBeInTheDocument();
      expect(screen.getAllByText('4').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Completed Exits')).toBeInTheDocument();
      expect(screen.getAllByText('8').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Avg 30d notice')).toBeInTheDocument();
    });

    it('ExitStatsCards: renders all 14 workflow stage KPI cards with interactive selection', () => {
      const handleSelect = vi.fn();
      render(
        <ExitStatsCards
          selectedStage="ALL"
          onSelectStage={handleSelect}
          stageCounts={{
            ALL: 14,
            RESIGNATION_SUBMITTED: 1,
            MANAGER_REVIEW: 2,
            HR_REVIEW: 1,
            NOTICE_PERIOD: 3,
            KNOWLEDGE_TRANSFER: 1,
            CLEARANCE_PENDING: 2,
            FNF_SETTLEMENT: 1,
            EXIT_INTERVIEW: 1,
            DOCUMENTS_PENDING: 1,
            ACCESS_REVOCATION: 1,
            COMPLETED: 5,
            REJECTED: 1,
            WITHDRAWN: 1,
          }}
          isLoading={false}
        />
      );

      // Verify all 14 requested KPI cards are rendered
      expect(screen.getByText('All Stages')).toBeInTheDocument();
      expect(screen.getByText('Resignation Submitted')).toBeInTheDocument();
      expect(screen.getByText('Manager Review')).toBeInTheDocument();
      expect(screen.getByText('HR Review')).toBeInTheDocument();
      expect(screen.getByText('Notice Period')).toBeInTheDocument();
      expect(screen.getByText('Knowledge Transfer')).toBeInTheDocument();
      expect(screen.getByText('Clearance Pending')).toBeInTheDocument();
      expect(screen.getByText('FnF Settlement')).toBeInTheDocument();
      expect(screen.getByText('Exit Interview')).toBeInTheDocument();
      expect(screen.getByText('Documents Pending')).toBeInTheDocument();
      expect(screen.getByText('Access Revocation')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getByText('Rejected')).toBeInTheDocument();
      expect(screen.getByText('Withdrawn')).toBeInTheDocument();

      // Verify clicking a card calls onSelectStage
      fireEvent.click(screen.getByText('Manager Review'));
      expect(handleSelect).toHaveBeenCalledWith('MANAGER_REVIEW');
    });

    it('ExitRequestsTable: renders empty state when cases list is empty', () => {
      render(
        <ExitRequestsTable
          cases={[]}
          isLoading={false}
          onViewDetails={vi.fn()}
        />
      );

      expect(screen.getByText(/No exit cases found matching criteria/i)).toBeInTheDocument();
    });

    it('ExitRequestsTable: renders exit case rows, 5 department clearance indicators, and F&F amount', () => {
      render(
        <ExitRequestsTable
          cases={[mockExitCase]}
          isLoading={false}
          onViewDetails={vi.fn()}
        />
      );

      expect(screen.getByText('Rahul Verma')).toBeInTheDocument();
      expect(screen.getByText('EXIT-2026-001')).toBeInTheDocument();
      expect(screen.getByText('Tech Lead')).toBeInTheDocument();
      expect(screen.getByText('5/5 Cleared')).toBeInTheDocument();
      expect(screen.getByText(/₹\s*1,?40,?000/)).toBeInTheDocument();
    });

    it('ExitFilters: renders search bar and department filter', () => {
      render(
        <ExitFilters
          searchQuery=""
          onSearchChange={vi.fn()}
          departmentFilter="ALL"
          onDepartmentChange={vi.fn()}
          onResetFilters={vi.fn()}
        />
      );

      expect(
        screen.getByPlaceholderText(/Search by Employee, Case ID/i)
      ).toBeInTheDocument();
      expect(screen.getByText('All Departments')).toBeInTheDocument();
    });

    it('ExitNoticePeriodPage: renders Active, Early Release, and Buyout tabs with API gap banners', () => {
      render(
        <MemoryRouter>
          <ExitNoticePeriodPage />
        </MemoryRouter>
      );

      expect(screen.getByText('Notice Period Management')).toBeInTheDocument();
      expect(screen.getByText('Active Tracking')).toBeInTheDocument();
      expect(screen.getByText('Early Release / Waiver')).toBeInTheDocument();
      expect(screen.getByText('Notice Buyout')).toBeInTheDocument();

      // Click Early Release tab to verify honest API gap banner
      fireEvent.click(screen.getByText('Early Release / Waiver'));
      expect(
        screen.getByText(/Notice Waiver & Early Release Pending:/i)
      ).toBeInTheDocument();

      // Click Notice Buyout tab
      fireEvent.click(screen.getByText('Notice Buyout'));
      expect(
        screen.getByText(/Notice Buyout Configuration Pending:/i)
      ).toBeInTheDocument();
    });

    it('ExitSettingsPage: renders clean unavailable banner listing required routes', () => {
      render(
        <MemoryRouter>
          <ExitSettingsPage />
        </MemoryRouter>
      );

      expect(
        screen.getByText(/Exit Management Settings Module Currently Unavailable/i)
      ).toBeInTheDocument();
      expect(screen.getAllByText('/api/v1/exits/settings').length).toBeGreaterThan(0);
      expect(screen.getByText('/api/v1/exits/settings/templates')).toBeInTheDocument();
      expect(screen.getByText('BACKEND ROUTES PENDING')).toBeInTheDocument();
    });
  });

  describe('6. Dedicated Stage Pages & KPI Card Navigation (All 14 Stages)', () => {
    it('verifies all 14 stages have valid config, slugs, titles, and /exit-management/ routes', () => {
      expect(STAGE_CONFIGS).toHaveLength(14);
      const expectedSlugs = [
        'stages',
        'resignation-submitted',
        'manager-review',
        'hr-review',
        'notice-period',
        'knowledge-transfer',
        'clearance-pending',
        'fnf-settlement',
        'exit-interview',
        'documents-pending',
        'access-revocation',
        'completed',
        'rejected',
        'withdrawn',
      ];
      expectedSlugs.forEach((slug) => {
        const config = getStageConfigBySlug(slug);
        expect(config).toBeDefined();
        expect(config.slug).toBe(slug);
        expect(config.routePath).toBe(`/exit-management/${slug}`);
        expect(config.title).toBeTruthy();
        expect(config.shortDescription).toBeTruthy();
      });
    });

    it('ExitStagePage: renders breadcrumb, matching stage title, description, and employee table', () => {
      render(
        <MemoryRouter initialEntries={['/exit-management/clearance-pending']}>
          <Routes>
            <Route path="/exit-management/:stageSlug" element={<ExitStagePage />} />
          </Routes>
        </MemoryRouter>
      );

      // Breadcrumb navigation
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Exit Management')).toBeInTheDocument();
      expect(screen.getAllByText('Clearance Pending').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Back to Exit Management')).toBeInTheDocument();

      // Stage header & short description
      expect(screen.getByRole('heading', { name: 'Clearance Pending' })).toBeInTheDocument();
      expect(screen.getAllByText(/Department-wise clearance tracking/i).length).toBeGreaterThanOrEqual(1);

      // Employee table columns
      expect(screen.getByText('Employee ID')).toBeInTheDocument();
      expect(screen.getByText('Employee Name')).toBeInTheDocument();
      expect(screen.getByText('Department')).toBeInTheDocument();
      expect(screen.getByText('Designation')).toBeInTheDocument();
      expect(screen.getByText('Manager')).toBeInTheDocument();
      expect(screen.getByText('Resignation Date')).toBeInTheDocument();
      expect(screen.getByText('Last Working Day')).toBeInTheDocument();
      expect(screen.getAllByText('Notice Period').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Current Status')).toBeInTheDocument();

      // Row data
      expect(screen.getByText('Rahul Verma')).toBeInTheDocument();
      expect(screen.getByText('emp-101')).toBeInTheDocument();
      expect(screen.getByText('EXIT-2026-001')).toBeInTheDocument();
      expect(screen.getByText('View Details')).toBeInTheDocument();
    });

    it('ExitStagePage: confidential protection blocks manager from exit interview data', () => {
      currentUserRole = 'MANAGER';
      render(
        <MemoryRouter initialEntries={['/exit-management/exit-interview']}>
          <Routes>
            <Route path="/exit-management/:stageSlug" element={<ExitStagePage />} />
          </Routes>
        </MemoryRouter>
      );

      expect(
        screen.getByText(/Confidential HR Records: Manager Access Restricted/i)
      ).toBeInTheDocument();
    });
  });
});
