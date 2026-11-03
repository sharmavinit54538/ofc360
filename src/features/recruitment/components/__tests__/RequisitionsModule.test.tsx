/**
 * @file RequisitionsModule.test.tsx
 * @description Unit and integration tests for the Job Requisitions module.
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { jobRequisitionCreateSchema } from '../../schemas/requisition.schema';
import { CreateRequisitionModal } from '../CreateRequisitionModal';
import { RequisitionDetailsDrawer } from '../RequisitionDetailsDrawer';
import type { JobRequisitionItem } from '../../types/requisition.types';

// Mock dependencies
vi.mock('@/shared/ui/Toast', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
  }),
}));

vi.mock('@/features/auth/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'u1', fullName: 'HR Admin' },
    role: 'HR_ADMIN',
    activeRole: 'HR_ADMIN',
  }),
}));

vi.mock('@/features/workforce/api/workforceApi', () => ({
  useGetDepartmentsQuery: () => ({
    data: [
      { id: 'd1', name: 'Engineering' },
      { id: 'd2', name: 'Product' },
    ],
    isLoading: false,
  }),
}));

const mockMutateCreate = vi.fn().mockResolvedValue({ id: 'req-new', title: 'New Job' });
const mockMutateApprove = vi.fn().mockResolvedValue({ id: 'req-1', status: 'APPROVED' });

vi.mock('../../api/requisitionsApi', () => ({
  useCreateRequisition: () => ({
    mutateAsync: mockMutateCreate,
    isPending: false,
    error: null,
  }),
  useApproveRequisition: () => ({
    mutateAsync: mockMutateApprove,
    isPending: false,
    error: null,
  }),
  useRequisitions: () => ({
    data: {
      items: [
        {
          id: 'req-1',
          title: 'Senior Python Engineer',
          department: 'Engineering',
          vacancies: 2,
          min_experience: 3,
          max_experience: 6,
          min_salary: '1200000',
          max_salary: '1800000',
          description: 'Need strong FastAPI and PostgreSQL experience.',
          status: 'PENDING',
          requested_by: 'mgr-1',
          approved_by: null,
          created_at: '2026-11-01T10:00:00Z',
          updated_at: '2026-11-01T10:00:00Z',
        },
      ],
      total: 1,
      page: 1,
      limit: 15,
      pages: 1,
    },
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  }),
}));

describe('Job Requisitions Module', () => {
  describe('Zod Schema Validation', () => {
    it('validates a correct requisition payload', () => {
      const valid = {
        title: 'Backend Developer',
        department: 'Engineering',
        vacancies: 2,
        min_experience: 2,
        max_experience: 5,
        min_salary: '800000',
        max_salary: '1400000',
        description: 'Need backend engineer for cloud infrastructure expansion.',
      };

      const result = jobRequisitionCreateSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('rejects when max_experience is less than min_experience', () => {
      const invalid = {
        title: 'Backend Developer',
        department: 'Engineering',
        vacancies: 1,
        min_experience: 5,
        max_experience: 2,
        description: 'Test description',
      };

      const result = jobRequisitionCreateSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('greater than or equal to minimum experience');
      }
    });

    it('rejects when max_salary is less than min_salary', () => {
      const invalid = {
        title: 'Backend Developer',
        department: 'Engineering',
        vacancies: 1,
        min_experience: 0,
        min_salary: '1500000',
        max_salary: '1000000',
        description: 'Test description',
      };

      const result = jobRequisitionCreateSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('greater than or equal to minimum salary');
      }
    });

    it('requires title and description', () => {
      const invalid = {
        title: '',
        department: 'Engineering',
        description: '',
      };

      const result = jobRequisitionCreateSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('CreateRequisitionModal Component', () => {
    it('renders form inputs correctly when open', () => {
      render(
        <CreateRequisitionModal isOpen={true} onClose={vi.fn()} />
      );

      expect(screen.getByText('Raise Job Requisition')).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/e\.g\. Senior Backend Engineer/i)).toBeInTheDocument();
      expect(screen.getByText('Submit Requisition')).toBeInTheDocument();
    });

    it('does not render when closed', () => {
      const { container } = render(
        <CreateRequisitionModal isOpen={false} onClose={vi.fn()} />
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('RequisitionDetailsDrawer Component', () => {
    const mockItem: JobRequisitionItem = {
      id: 'req-test-123',
      title: 'DevOps Lead',
      department: 'Infrastructure',
      vacancies: 1,
      min_experience: 5,
      max_experience: 8,
      min_salary: '2000000',
      max_salary: '2500000',
      description: 'Manage AWS & Kubernetes cluster architecture.',
      status: 'PENDING',
      requested_by: 'mgr-infra',
      approved_by: null,
      created_at: '2026-11-01T12:00:00Z',
      updated_at: '2026-11-01T12:00:00Z',
    };

    it('renders requisition details and action buttons for authorized role', () => {
      render(
        <RequisitionDetailsDrawer
          requisition={mockItem}
          isOpen={true}
          onClose={vi.fn()}
        />
      );

      expect(screen.getByText('DevOps Lead')).toBeInTheDocument();
      expect(screen.getByText('Infrastructure')).toBeInTheDocument();
      expect(screen.getByText('Approve Requisition')).toBeInTheDocument();
      expect(screen.getByText('Reject Requisition')).toBeInTheDocument();
    });
  });
});
