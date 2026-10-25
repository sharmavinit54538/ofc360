import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PayrollAnalyticsCharts } from '../components/PayrollAnalyticsCharts';

describe('PayrollAnalyticsCharts Component', () => {
  it('renders all 4 analytics charts with headers and legends', () => {
    render(<PayrollAnalyticsCharts />);

    // Chart 1: Monthly Trends
    expect(screen.getByText('Monthly Payroll Payout Trend')).toBeDefined();
    expect(screen.getByText('Net Salary Disbursed')).toBeDefined();

    // Chart 2: Department-wise Cost
    expect(screen.getByText('Department-Wise Cost Distribution')).toBeDefined();
    expect(screen.getByText('Engineering & Tech')).toBeDefined();
    expect(screen.getByText('Sales & Marketing')).toBeDefined();

    // Chart 3: Salary Components & Statutory Breakup
    expect(screen.getByText('Salary Components & Statutory Breakup')).toBeDefined();
    expect(screen.getByText('Basic Salary')).toBeDefined();
    expect(screen.getByText('House Rent Allowance (HRA)')).toBeDefined();

    // Chart 4: Compliance Gauges
    expect(screen.getByText('Compliance & Execution Gauges')).toBeDefined();
    expect(screen.getByText('Payslips Disbursed')).toBeDefined();
    expect(screen.getByText('Tax Proofs Verified')).toBeDefined();
    expect(screen.getByText('EPFO ECR & TRRN')).toBeDefined();
  });

  it('switches between Earnings and Deductions views in component breakup chart', () => {
    render(<PayrollAnalyticsCharts />);

    // Initially shows earnings
    expect(screen.getByText('Basic Salary')).toBeDefined();

    // Click Deductions toggle
    const deductionsBtn = screen.getByRole('button', { name: /Deductions/i });
    fireEvent.click(deductionsBtn);

    // Now shows statutory deductions
    expect(screen.getByText('Employee Provident Fund (EPF)')).toBeDefined();
    expect(screen.getByText('Tax Deducted at Source (TDS)')).toBeDefined();
  });

  it('handles empty or loading state without crashing', () => {
    const { container: loadingContainer } = render(<PayrollAnalyticsCharts isLoading={true} />);
    expect(loadingContainer.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);

    const { container: emptyContainer } = render(<PayrollAnalyticsCharts stats={undefined} runs={[]} />);
    expect(emptyContainer).toBeDefined();
  });
});

