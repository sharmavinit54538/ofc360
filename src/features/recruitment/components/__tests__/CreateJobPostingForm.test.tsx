/**
 * @file CreateJobPostingForm.test.tsx
 * @description Unit tests for CreateJobPostingForm with One-Click AI Auto-fill.
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CreateJobPostingForm } from '../CreateJobPostingForm';
import { jobCreationClient } from '../../api/jobCreationApi';

const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();

vi.mock('@/shared/ui/Toast', () => ({
  useToast: () => ({
    success: mockToastSuccess,
    error: mockToastError,
  }),
}));

describe('CreateJobPostingForm with One-Click AI Auto-fill', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Job Title input and "Generate with AI" button', () => {
    render(<CreateJobPostingForm />);

    expect(screen.getByLabelText(/Job Title & AI Auto-Fill/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Generate with AI/i })).toBeInTheDocument();
    expect(screen.getByText(/Save as Draft/i)).toBeInTheDocument();
    expect(screen.getByText(/Publish Job/i)).toBeInTheDocument();
  });

  it('shows error toast when clicking "Generate with AI" with empty title', async () => {
    render(<CreateJobPostingForm />);

    const aiBtn = screen.getByRole('button', { name: /Generate with AI/i });
    fireEvent.click(aiBtn);

    expect(mockToastError).toHaveBeenCalledWith(
      'Please enter a Job Title before generating with AI.',
      'Job Title Required'
    );
  });

  it('populates fields upon successful AI auto-fill generation', async () => {
    const mockAiResponse = {
      department: 'Engineering',
      employment_type: 'FULL_TIME',
      location: 'Jaipur, India',
      vacancies: 2,
      skills: ['Python', 'FastAPI', 'Docker'],
      description: 'AI Generated Senior Backend JD description.',
      responsibilities: ['Build robust microservices', 'Scale PostgreSQL cluster'],
      requirements: ['4+ years Python backend', 'Docker deployment'],
      benefits: ['Medical insurance', 'Remote work'],
    };

    vi.spyOn(jobCreationClient, 'generateAiAutofill').mockResolvedValue(mockAiResponse);

    render(<CreateJobPostingForm />);

    // Type job title
    const titleInput = screen.getByPlaceholderText(/e\.g\. Senior Backend Engineer/i);
    fireEvent.change(titleInput, { target: { value: 'Senior Backend Engineer' } });

    // Click AI trigger
    const aiBtn = screen.getByRole('button', { name: /Generate with AI/i });
    fireEvent.click(aiBtn);

    await waitFor(() => {
      expect(jobCreationClient.generateAiAutofill).toHaveBeenCalledWith(
        'Senior Backend Engineer',
        '3-5 years'
      );
      expect(mockToastSuccess).toHaveBeenCalledWith(
        'AI successfully generated the job description, skills, and requirements!',
        'AI Auto-Fill Completed'
      );
    });

    // Verify auto-filled fields
    expect(screen.getByDisplayValue('AI Generated Senior Backend JD description.')).toBeInTheDocument();
    expect(screen.getByText('Docker')).toBeInTheDocument();
    expect(screen.getByText(/• Build robust microservices/i)).toBeInTheDocument();
  });

  it('submits job posting as DRAFT when clicking "Save as Draft"', async () => {
    const mockCreateJob = vi.spyOn(jobCreationClient, 'createJob').mockResolvedValue({ id: 'job-123' });
    const mockSuccess = vi.fn();

    render(<CreateJobPostingForm onSuccess={mockSuccess} />);

    const titleInput = screen.getByPlaceholderText(/e\.g\. Senior Backend Engineer/i);
    fireEvent.change(titleInput, { target: { value: 'Staff Platform Engineer' } });

    const deptInput = screen.getByPlaceholderText(/e\.g\. Engineering/i);
    fireEvent.change(deptInput, { target: { value: 'Core Infrastructure' } });

    const draftBtn = screen.getByText(/Save as Draft/i);
    fireEvent.click(draftBtn);

    await waitFor(() => {
      expect(mockCreateJob).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Staff Platform Engineer',
          department: 'Core Infrastructure',
          status: 'DRAFT',
        })
      );
      expect(mockSuccess).toHaveBeenCalled();
    });
  });

  it('submits job posting as PUBLISHED when clicking "Publish Job"', async () => {
    const mockCreateJob = vi.spyOn(jobCreationClient, 'createJob').mockResolvedValue({ id: 'job-456' });
    const mockSuccess = vi.fn();

    render(<CreateJobPostingForm onSuccess={mockSuccess} />);

    const titleInput = screen.getByPlaceholderText(/e\.g\. Senior Backend Engineer/i);
    fireEvent.change(titleInput, { target: { value: 'Principal Architect' } });

    const deptInput = screen.getByPlaceholderText(/e\.g\. Engineering/i);
    fireEvent.change(deptInput, { target: { value: 'Architecture' } });

    const publishBtn = screen.getByText(/Publish Job/i);
    fireEvent.click(publishBtn);

    await waitFor(() => {
      expect(mockCreateJob).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Principal Architect',
          department: 'Architecture',
          status: 'PUBLISHED',
        })
      );
      expect(mockSuccess).toHaveBeenCalled();
    });
  });
});

