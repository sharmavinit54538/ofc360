/**
 * @file AtsModule.test.tsx
 * @description Comprehensive unit tests for Application Tracking System (ATS) module.
 * Tests AtsKanbanBoard, MoveStageModal, and type contracts.
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AtsKanbanBoard } from '../AtsKanbanBoard';
import { MoveStageModal } from '../MoveStageModal';
import type { ApplicationItem } from '../../types/ats.types';

const mockApp: ApplicationItem = {
  id: 'app-999',
  job_id: 'job-111',
  first_name: 'Rahul',
  last_name: 'Verma',
  email: 'rahul.verma@example.com',
  phone: '+919876500000',
  current_company: 'Infosys Ltd',
  current_designation: 'Senior Developer',
  experience_years: 4.5,
  current_ctc: '1500000',
  expected_ctc: '2000000',
  notice_period: '30 days',
  status: 'APPLIED',
  created_at: '2026-11-03T12:00:00Z',
  updated_at: '2026-11-03T12:00:00Z',
  job: {
    id: 'job-111',
    title: 'Senior React Developer',
    department: 'Engineering',
    location: 'Bengaluru, India',
  },
};

describe('ATS Module Tests', () => {
  describe('AtsKanbanBoard Component', () => {
    it('renders all canonical ATS pipeline stage columns', () => {
      render(
        <AtsKanbanBoard
          applications={[mockApp]}
          isLoading={false}
          canManageStages={true}
          onOpenMoveModal={vi.fn()}
          onQuickShortlist={vi.fn()}
          onQuickReject={vi.fn()}
        />
      );

      expect(screen.getByText('Applied')).toBeInTheDocument();
      expect(screen.getByText('Screening (Under Review)')).toBeInTheDocument();
      expect(screen.getByText('Shortlisted')).toBeInTheDocument();
      expect(screen.getByText('Interview')).toBeInTheDocument();
      expect(screen.getByText('Selected')).toBeInTheDocument();
      expect(screen.getByText('Offer Released')).toBeInTheDocument();
      expect(screen.getByText('Offer Accepted')).toBeInTheDocument();
      expect(screen.getByText('Hired (Onboarded)')).toBeInTheDocument();
      expect(screen.getByText('Rejected')).toBeInTheDocument();
    });

    it('renders candidate card with full name, job chip, and experience', () => {
      render(
        <AtsKanbanBoard
          applications={[mockApp]}
          isLoading={false}
          canManageStages={true}
          onOpenMoveModal={vi.fn()}
          onQuickShortlist={vi.fn()}
          onQuickReject={vi.fn()}
        />
      );

      expect(screen.getByText('Rahul Verma')).toBeInTheDocument();
      expect(screen.getByText('Senior React Developer')).toBeInTheDocument();
      expect(screen.getByText('4.5y exp')).toBeInTheDocument();
    });

    it('triggers onOpenMoveModal when clicking the Move button', () => {
      const handleOpenMove = vi.fn();

      render(
        <AtsKanbanBoard
          applications={[mockApp]}
          isLoading={false}
          canManageStages={true}
          onOpenMoveModal={handleOpenMove}
          onQuickShortlist={vi.fn()}
          onQuickReject={vi.fn()}
        />
      );

      const moveBtn = screen.getByText('Move');
      fireEvent.click(moveBtn);
      expect(handleOpenMove).toHaveBeenCalledWith(mockApp);
    });

    it('displays empty state for stages without applications', () => {
      render(
        <AtsKanbanBoard
          applications={[]}
          isLoading={false}
          canManageStages={true}
          onOpenMoveModal={vi.fn()}
          onQuickShortlist={vi.fn()}
          onQuickReject={vi.fn()}
        />
      );

      const emptyNotes = screen.getAllByText('No candidates in this stage');
      expect(emptyNotes.length).toBeGreaterThan(0);
    });
  });

  describe('MoveStageModal Component', () => {
    it('renders candidate name and stage dropdown options', () => {
      const onClose = vi.fn();

      render(
        <MoveStageModal
          isOpen={true}
          onClose={onClose}
          application={mockApp}
        />
      );

      expect(screen.getByText('Move Candidate Stage')).toBeInTheDocument();
      expect(screen.getByText('Rahul Verma')).toBeInTheDocument();
      expect(screen.getByLabelText('Select Target Stage')).toBeInTheDocument();
    });
  });
});
