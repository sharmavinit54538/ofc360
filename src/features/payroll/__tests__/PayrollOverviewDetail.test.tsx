import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PayrollOverviewDetail } from '../components/PayrollOverviewDetail';

// Mock child component that needs Toast & RTK Query context
vi.mock('../components/PayrollApprovalStepper', () => ({
  PayrollApprovalStepper: ({ run }: { run?: { month?: number; year?: number } }) => (
    <div data-testid="mock-stepper">
      Mock Stepper: Batch {run?.month}/{run?.year}
    </div>
  ),
}));

describe('PayrollOverviewDetail Component', () => {
  it('renders without crashing when stats and activeRun are undefined/null', () => {
    const { container } = render(
      <PayrollOverviewDetail
        stats={undefined}
        activeRun={null}
        onNavigate={vi.fn()}
        onInitiatePayroll={vi.fn()}
      />
    );

    expect(container).toBeDefined();
    // Default metrics should appear
    expect(screen.getByText('Gross Payroll Cost')).toBeDefined();
    expect(screen.getByText('Total Deductions')).toBeDefined();
    expect(screen.getByText('Net Payout Disbursed')).toBeDefined();
    expect(screen.getByText('No Active Payroll Batch')).toBeDefined();
  });

  it('renders custom stats when provided by API', () => {
    const mockStats = {
      totalGrossPay: 5000000,
      totalNetPay: 4400000,
      totalDeductions: 600000,
      totalEmployees: 150,
      totalPaidEmployees: 150,
      payrollPeriod: 'October 2026',
      totalTaxDeducted: 250000,
      complianceRate: 100,
      statusBreakdown: {
        draft: 0,
        pending: 0,
        approved: 0,
        paid: 150,
      },
    };

    render(
      <PayrollOverviewDetail
        stats={mockStats}
        activeRun={null}
        onNavigate={vi.fn()}
      />
    );

    // Total employees count should be present
    expect(screen.getByText('150')).toBeDefined();
    expect(screen.getByText('Department-wise Payroll Cost Breakdown')).toBeDefined();
  });

  it('renders active payroll run stepper when activeRun is provided', () => {
    const mockRun = {
      id: 'run-101',
      month: 10,
      year: 2026,
      status: 'APPROVED' as const,
      totalGrossPay: 4820000,
      totalNetPay: 4250000,
      totalDeductions: 570000,
      totalEmployees: 148,
      createdAt: '2026-10-01T00:00:00Z',
      updatedAt: '2026-10-25T00:00:00Z',
    };

    render(
      <PayrollOverviewDetail
        activeRun={mockRun}
        onNavigate={vi.fn()}
      />
    );

    expect(screen.getByText('Active Payroll Processing Lifecycle')).toBeDefined();
    expect(screen.getByText(/Current Batch: 10\/2026/i)).toBeDefined();
    expect(screen.getByTestId('mock-stepper')).toBeDefined();
  });

  it('navigates when module shortcut buttons are clicked', () => {
    const handleNavigate = vi.fn();

    render(
      <PayrollOverviewDetail
        onNavigate={handleNavigate}
      />
    );

    const payslipsBtn = screen.getByText(/Employee Payslips/i);
    fireEvent.click(payslipsBtn);

    expect(handleNavigate).toHaveBeenCalledWith('payslips');
  });
});

