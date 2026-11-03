/**
 * @file InterviewScheduler.test.tsx
 * @description Unit tests for Interview Scheduler & Evaluation module components.
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ScheduleInterviewSlotModal } from '../ScheduleInterviewSlotModal';
import { RoundEvaluationModal } from '../RoundEvaluationModal';
import { InitiateInterviewModal } from '../InitiateInterviewModal';
import { InterviewProgressStepper } from '../InterviewProgressStepper';
import {
  interviewSchedulerClient,
  InterviewApiError,
} from '../../api/interviewSchedulerApi';
import type { InterviewDetail } from '../../types/interviewScheduler.types';

const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();
const mockToastInfo = vi.fn();

vi.mock('@/shared/ui/Toast', () => ({
  useToast: () => ({
    success: mockToastSuccess,
    error: mockToastError,
    info: mockToastInfo,
  }),
}));

vi.mock('@/features/auth/hooks/useAuth', () => ({
  useAuth: () => ({
    user: {
      name: 'Siddharth Verma',
      email: 'siddharth@example.com',
      role: 'HR_ADMIN',
    },
  }),
}));

const mockInterview: InterviewDetail = {
  id: 'interview-123',
  application_id: 'app-456',
  status: 'SCHEDULED',
  current_round_index: 0,
  interview_date: '2026-11-05',
  interview_time: '14:30:00',
  mode: 'ONLINE',
  meeting_url: 'https://meet.google.com/abc-defg-hij',
  office_address: null,
  candidate_name: 'Aarav Patel',
  job_title: 'Senior Python Engineer',
  rounds: [
    {
      id: 'round-1',
      round_name: 'Technical Round 1',
      round_order: 0,
      status: 'PENDING',
      score: null,
      feedback: null,
      interviewer_name: null,
      conducted_at: null,
    },
    {
      id: 'round-2',
      round_name: 'HR Round',
      round_order: 1,
      status: 'PENDING',
      score: null,
      feedback: null,
      interviewer_name: null,
      conducted_at: null,
    },
  ],
};

describe('Interview Scheduler & Evaluation Module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ScheduleInterviewSlotModal', () => {
    it('renders modal header, round indicator, and booking actions', () => {
      render(
        <ScheduleInterviewSlotModal
          isOpen={true}
          onClose={vi.fn()}
          interviewId="interview-123"
          roundName="Technical Round 1"
          candidateName="Aarav Patel"
          jobTitle="Senior Python Engineer"
        />
      );

      expect(screen.getByRole('heading', { name: /Schedule Interview Slot/i })).toBeInTheDocument();
      expect(screen.getByText(/Target Round:/i)).toBeInTheDocument();
      expect(screen.getByText(/Online \(Video\)/i)).toBeInTheDocument();
      expect(screen.getByText(/In-person \(Offline\)/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Confirm & Send Calendar Invite/i })
      ).toBeInTheDocument();
    });

    it('submits slot booking with valid online meeting url', async () => {
      const bookSpy = vi
        .spyOn(interviewSchedulerClient, 'bookInterviewSlot')
        .mockResolvedValueOnce({
          success: true,
          message: 'Slot scheduled',
          data: mockInterview,
          errors: null,
        });

      const handleClose = vi.fn();
      const handleSuccess = vi.fn();

      render(
        <ScheduleInterviewSlotModal
          isOpen={true}
          onClose={handleClose}
          interviewId="interview-123"
          roundName="Technical Round 1"
          candidateName="Aarav Patel"
          onSuccess={handleSuccess}
        />
      );

      const submitBtn = screen.getByRole('button', {
        name: /Confirm & Send Calendar Invite/i,
      });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(bookSpy).toHaveBeenCalledTimes(1);
        expect(mockToastSuccess).toHaveBeenCalled();
        expect(handleClose).toHaveBeenCalled();
        expect(handleSuccess).toHaveBeenCalled();
      });
    });

    it('displays error notice on 409 slot conflict', async () => {
      vi.spyOn(interviewSchedulerClient, 'bookInterviewSlot').mockRejectedValueOnce(
        new InterviewApiError(
          'This time slot is already booked. Please choose another slot.',
          409
        )
      );

      render(
        <ScheduleInterviewSlotModal
          isOpen={true}
          onClose={vi.fn()}
          interviewId="interview-123"
          roundName="Technical Round 1"
        />
      );

      const submitBtn = screen.getByRole('button', {
        name: /Confirm & Send Calendar Invite/i,
      });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(
          screen.getByText(/This time slot is already booked\. Please choose another slot\./i)
        ).toBeInTheDocument();
      });
    });
  });

  describe('RoundEvaluationModal', () => {
    it('renders scorecard inputs and outcome decision buttons', () => {
      render(
        <RoundEvaluationModal
          isOpen={true}
          onClose={vi.fn()}
          roundId="round-1"
          roundName="Technical Round 1"
          candidateName="Aarav Patel"
        />
      );

      expect(
        screen.getByRole('heading', { name: /Round Evaluation & Scorecard/i })
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/e\.g\. Siddharth Verma/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Pass Round/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Put on Hold/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Reject/i })).toBeInTheDocument();
    });

    it('submits pass round evaluation', async () => {
      const decisionSpy = vi
        .spyOn(interviewSchedulerClient, 'submitRoundDecision')
        .mockResolvedValueOnce({
          success: true,
          message: 'Decision recorded',
          data: null,
          errors: null,
        });

      const handleSuccess = vi.fn();

      render(
        <RoundEvaluationModal
          isOpen={true}
          onClose={vi.fn()}
          roundId="round-1"
          roundName="Technical Round 1"
          candidateName="Aarav Patel"
          onSuccess={handleSuccess}
        />
      );

      const feedbackInput = screen.getByPlaceholderText(/Detailed candidate evaluation/i);
      fireEvent.change(feedbackInput, {
        target: {
          value: 'Outstanding architecture and problem-solving skills shown in FastAPI tasks.',
        },
      });

      const passBtn = screen.getByRole('button', { name: /Pass Round/i });
      fireEvent.click(passBtn);

      await waitFor(() => {
        expect(decisionSpy).toHaveBeenCalledWith(
          'round-1',
          'pass',
          expect.objectContaining({
            interviewer_name: 'Siddharth Verma',
            feedback: 'Outstanding architecture and problem-solving skills shown in FastAPI tasks.',
          })
        );
        expect(handleSuccess).toHaveBeenCalledWith('pass');
      });
    });
  });

  describe('InitiateInterviewModal', () => {
    it('allows configuring and adding custom rounds', async () => {
      const initiateSpy = vi
        .spyOn(interviewSchedulerClient, 'initiateInterview')
        .mockResolvedValueOnce({
          success: true,
          message: 'Interview invitation sent',
          data: mockInterview,
          errors: null,
        });

      render(
        <InitiateInterviewModal
          isOpen={true}
          onClose={vi.fn()}
          applicationId="app-456"
          candidateName="Aarav Patel"
        />
      );

      expect(screen.getByText(/Configure Interview Rounds/i)).toBeInTheDocument();

      // Add a quick preset
      const systemDesignBtn = screen.getByRole('button', { name: /System Design/i });
      fireEvent.click(systemDesignBtn);

      const submitBtn = screen.getByRole('button', { name: /Save & Send Invite/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(initiateSpy).toHaveBeenCalledWith(
          'app-456',
          expect.arrayContaining(['Technical Round 1', 'HR Round', 'System Design'])
        );
      });
    });
  });

  describe('InterviewProgressStepper', () => {
    it('renders round steps, meeting link, and join call action', () => {
      render(<InterviewProgressStepper interview={mockInterview} />);

      expect(screen.getByText(/Interview Evaluation Pipeline/i)).toBeInTheDocument();
      expect(screen.getByText(/Technical Round 1/i)).toBeInTheDocument();
      expect(screen.getByText(/HR Round/i)).toBeInTheDocument();
      expect(screen.getByText(/Join Call/i)).toBeInTheDocument();
      expect(screen.getByText(/Copy Link/i)).toBeInTheDocument();
    });
  });
});

