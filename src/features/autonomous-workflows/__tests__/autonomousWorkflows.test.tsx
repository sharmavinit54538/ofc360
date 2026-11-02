import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToastProvider } from '@/shared/ui/Toast';
import { AutonomousWorkflowsPage } from '../pages/AutonomousWorkflowsPage';
import { WorkflowKpiCards } from '../components/WorkflowKpiCards';
import { INITIAL_KPIS } from '../data/initialWorkflows';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<ToastProvider>{ui}</ToastProvider>);
};

describe('Autonomous Workflows Feature', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the KPI cards with correct metric values', () => {
    renderWithProviders(<WorkflowKpiCards kpis={INITIAL_KPIS} />);

    expect(screen.getByText('Total Workflows')).toBeDefined();
    expect(screen.getByText(String(INITIAL_KPIS.totalWorkflows))).toBeDefined();
    expect(screen.getByText('Active Pipelines')).toBeDefined();
    expect(screen.getByText(String(INITIAL_KPIS.activeAutomations))).toBeDefined();
    expect(screen.getByText('Success Rate')).toBeDefined();
    expect(screen.getByText(`${INITIAL_KPIS.successRate}%`)).toBeDefined();
  });

  it('renders the Autonomous Workflows page with header and default workflows', () => {
    renderWithProviders(<AutonomousWorkflowsPage />);

    expect(screen.getByRole('heading', { name: /Autonomous Workflows/i })).toBeDefined();
    expect(screen.getByText('Auto-Offboarding & System Revocation')).toBeDefined();
    expect(screen.getByText('Biometric Missing Punch Regularizer')).toBeDefined();
    expect(screen.getByText('Smart Expense Fraud & Anomaly Audit')).toBeDefined();
  });

  it('filters workflows by search keyword', () => {
    renderWithProviders(<AutonomousWorkflowsPage />);

    const searchInput = screen.getByPlaceholderText(/Search workflows by trigger, title, or action/i);
    fireEvent.change(searchInput, { target: { value: 'Offboarding' } });

    expect(screen.getByText('Auto-Offboarding & System Revocation')).toBeDefined();
    expect(screen.queryByText('Smart Expense Fraud & Anomaly Audit')).toBeNull();
  });

  it('filters workflows by category pill', () => {
    renderWithProviders(<AutonomousWorkflowsPage />);

    // Click on Attendance & Shifts category pill
    const attendancePill = screen.getByRole('button', { name: 'Attendance & Shifts' });
    fireEvent.click(attendancePill);

    expect(screen.getByText('Biometric Missing Punch Regularizer')).toBeDefined();
    expect(screen.queryByText('Auto-Offboarding & System Revocation')).toBeNull();
  });

  it('toggles a workflow from active to paused', () => {
    renderWithProviders(<AutonomousWorkflowsPage />);

    const activeToggles = screen.getAllByTitle('Click to pause automation');
    expect(activeToggles.length).toBeGreaterThan(0);

    // Toggle first active workflow
    fireEvent.click(activeToggles[0]);

    // Should now find a toggle with 'Click to activate automation'
    expect(screen.getAllByTitle('Click to activate automation').length).toBeGreaterThan(0);
  });

  it('opens and closes execution logs modal', () => {
    renderWithProviders(<AutonomousWorkflowsPage />);

    const logsBtn = screen.getByRole('button', { name: /Execution Logs/i });
    fireEvent.click(logsBtn);

    expect(screen.getByText(/All Autonomous Execution Logs/i)).toBeDefined();

    const closeBtn = screen.getByRole('button', { name: 'Close' });
    fireEvent.click(closeBtn);

    expect(screen.queryByText(/All Autonomous Execution Logs/i)).toBeNull();
  });

  it('opens the new workflow creator modal and allows adding a step', () => {
    renderWithProviders(<AutonomousWorkflowsPage />);

    const newBtn = screen.getByRole('button', { name: /New Workflow/i });
    fireEvent.click(newBtn);

    expect(screen.getByText(/Build New Autonomous Workflow/i)).toBeDefined();

    const stepInput = screen.getByPlaceholderText(/Add next pipeline step/i);
    fireEvent.change(stepInput, { target: { value: 'Send Teams Alert' } });

    const addStepBtn = screen.getByRole('button', { name: /Add Step/i });
    fireEvent.click(addStepBtn);

    expect(screen.getByText('Send Teams Alert')).toBeDefined();
  });
});

