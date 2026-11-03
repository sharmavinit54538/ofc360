/**
 * @file CandidatesModule.test.tsx
 * @description Unit tests for Candidate & Applicant Management Module (RMS/ATS).
 * Validates Zod contract schemas, Kanban pipeline board, Table view, Details drawer, and Modals.
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { candidateCreateSchema, bulkMoveSchema } from '../../schemas/candidate.schema';
import { CandidateKanbanBoard } from '../CandidateKanbanBoard';
import { CandidatesTableView } from '../CandidatesTableView';
import { CandidateDetailsDrawer } from '../CandidateDetailsDrawer';
import type { ApplicationItem } from '../../types/candidate.types';

const mockApplication: ApplicationItem = {
  id: 'app-101',
  job_id: 'job-202',
  candidate_id: 'cand-303',
  first_name: 'Aman',
  last_name: 'Sharma',
  email: 'aman.sharma@example.com',
  phone: '+919876543210',
  country: 'India',
  state: 'Rajasthan',
  city: 'Jaipur',
  current_company: 'Acme Tech Solutions',
  current_designation: 'Senior Software Engineer',
  current_ctc: 2000000,
  expected_ctc: 2500000,
  notice_period: '15 days',
  highest_qualification: 'B.Tech CSE',
  experience_years: 5.5,
  status: 'APPLIED',
  job: {
    id: 'job-202',
    title: 'Lead Python Architect',
    department: 'Engineering',
    location: 'Jaipur, India',
  },
  created_at: '2026-11-03T10:00:00Z',
  updated_at: '2026-11-03T10:00:00Z',
};

describe('Candidate & Applicant Management Module Tests', () => {
  describe('Zod Contract Schemas', () => {
    it('validates a compliant CandidateCreate payload', () => {
      const validPayload = {
        first_name: 'Aman',
        last_name: 'Sharma',
        email: 'aman.sharma@example.com',
        phone: '+919876543210',
        location: 'Jaipur, India',
        summary: 'Experienced backend architect',
        skills: 'Python, FastAPI, PostgreSQL',
        years_experience: 5.5,
        current_company: 'Acme Tech Solutions',
        current_role: 'Senior Software Engineer',
        expected_salary: 2400000,
        notice_days: 15,
        source: 'DIRECT',
        is_talent_pool: true,
      };

      const parsed = candidateCreateSchema.safeParse(validPayload);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.skills).toEqual(['Python', 'FastAPI', 'PostgreSQL']);
        expect(parsed.data.email).toBe('aman.sharma@example.com');
      }
    });

    it('rejects candidate payloads with short phone numbers or invalid emails', () => {
      const invalidPayload = {
        first_name: 'Aman',
        last_name: 'Sharma',
        email: 'invalid-email',
        phone: '12345', // < 10 chars
        location: 'Jaipur',
      };

      const parsed = candidateCreateSchema.safeParse(invalidPayload);
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        const errors = parsed.error.format();
        expect(errors.email).toBeDefined();
        expect(errors.phone).toBeDefined();
      }
    });

    it('validates bulk move schema with allowed workflow stages', () => {
      const validBulk = {
        application_ids: ['a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d'],
        status: 'SHORTLISTED',
      };
      const parsed = bulkMoveSchema.safeParse(validBulk);
      expect(parsed.success).toBe(true);
    });
  });

  describe('CandidateKanbanBoard Component', () => {
    it('renders workflow columns and candidate cards', () => {
      const onSelect = vi.fn();
      const onAdvance = vi.fn();
      const onReject = vi.fn();

      render(
        <CandidateKanbanBoard
          applications={[mockApplication]}
          isLoading={false}
          onSelectApplication={onSelect}
          onAdvanceStage={onAdvance}
          onRejectApplication={onReject}
        />
      );

      expect(screen.getByText('Aman Sharma')).toBeInTheDocument();
      expect(screen.getByText('Lead Python Architect')).toBeInTheDocument();
      expect(screen.getByText('Applied')).toBeInTheDocument();
      expect(screen.getByText('Shortlisted')).toBeInTheDocument();
    });

    it('fires onAdvanceStage when clicking Next button', () => {
      const onSelect = vi.fn();
      const onAdvance = vi.fn();
      const onReject = vi.fn();

      render(
        <CandidateKanbanBoard
          applications={[mockApplication]}
          isLoading={false}
          onSelectApplication={onSelect}
          onAdvanceStage={onAdvance}
          onRejectApplication={onReject}
        />
      );

      const nextBtn = screen.getByText('Next');
      fireEvent.click(nextBtn);
      expect(onAdvance).toHaveBeenCalledWith(mockApplication, 'UNDER_REVIEW');
    });
  });

  describe('CandidatesTableView Component', () => {
    it('renders candidate row with contact details, role, and actions', () => {
      const onView = vi.fn();
      const onShortlist = vi.fn();
      const onReject = vi.fn();
      const onAdvance = vi.fn();

      render(
        <CandidatesTableView
          applications={[mockApplication]}
          isLoading={false}
          onViewDetails={onView}
          onShortlist={onShortlist}
          onReject={onReject}
          onAdvanceStage={onAdvance}
        />
      );

      expect(screen.getByText('Aman Sharma')).toBeInTheDocument();
      expect(screen.getByText('aman.sharma@example.com')).toBeInTheDocument();
      expect(screen.getByText('Shortlist')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Shortlist'));
      expect(onShortlist).toHaveBeenCalledWith(mockApplication);
    });
  });

  describe('CandidateDetailsDrawer Component', () => {
    it('renders drawer with tabs and applicant data', () => {
      const onClose = vi.fn();
      const onAdvance = vi.fn();
      const onShortlist = vi.fn();
      const onReject = vi.fn();
      const onHold = vi.fn();

      render(
        <CandidateDetailsDrawer
          isOpen={true}
          onClose={onClose}
          application={mockApplication}
          onAdvanceStage={onAdvance}
          onShortlist={onShortlist}
          onReject={onReject}
          onHold={onHold}
        />
      );

      expect(screen.getByText('Aman Sharma')).toBeInTheDocument();
      expect(screen.getByText('Current Employer')).toBeInTheDocument();
      expect(screen.getByText('Acme Tech Solutions')).toBeInTheDocument();

      // Switch to ATS Scorecard Tab
      const atsTab = screen.getByText('AI ATS Scorecard');
      fireEvent.click(atsTab);
      expect(screen.getByText('88.5%')).toBeInTheDocument();
      expect(screen.getByText('Skill Match Breakdown')).toBeInTheDocument();
    });
  });
});

