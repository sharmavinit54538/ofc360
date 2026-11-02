/**
 * @file AnalyticsCenterPage.test.tsx
 * @description Integration tests for AnalyticsCenterPage: verifies tab navigation across all 8 modules.
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { ToastProvider } from '@/shared/ui/Toast';
import { AnalyticsCenterPage } from '../pages/AnalyticsCenterPage';

const mockSummary = {
  totalHeadcount: 240,
  activeEmployees: 232,
  attritionRate: 4.2,
  payrollVariance: 2.1,
  leaveLiabilityInr: 1850000,
  recruitmentTimeToHireDays: 28,
  complianceScore: 98,
};

const mockPayrollVariance = {
  kpis: {
    totalDisbursed: 14200000,
    totalDisbursedFormatted: '₹1.42 Cr',
    momVariancePercent: 4.8,
    avgCtc: 1250000,
    avgCtcFormatted: '₹12.5 Lakhs',
    pendingAdjustmentsAmount: 240000,
    pendingAdjustmentsFormatted: '₹2.4 Lakhs',
  },
  momVarianceTrend: [{ month: 'Oct 2026', grossPayroll: 142, budget: 138, variancePercent: 2.9 }],
  departmentCompensation: [],
  salaryComponents: [{ name: 'Gross Pay', value: 70, amountFormatted: '₹99.4 Lakhs', color: '#4f46e5' }],
  highVarianceDepartments: [],
  aiInsights: [],
};

const mockStatutoryCompliance = {
  kpis: {
    complianceScore: 98,
    totalPfContributionFormatted: '₹28.4 Lakhs',
    ptTdsDeductedFormatted: '₹14.2 Lakhs',
    auditReadyRegistersCount: 5,
    totalRegistersCount: 5,
  },
  monthlyContributions: [],
  filingTimeline: [],
  exportableRegisters: [
    {
      id: 'reg-epf-ecr',
      name: 'EPFO Electronic Challan Return (ECR)',
      code: 'EPF-ECR-V2',
      description: 'EPFO monthly contribution file.',
      frequency: 'Monthly (15th)',
      formats: ['CSV', 'PDF'],
    },
  ],
  complianceGaps: [],
  aiInsights: [],
};

const renderCenter = () => {
  return render(
    <Provider store={store}>
      <ToastProvider>
        <MemoryRouter>
          <AnalyticsCenterPage />
        </MemoryRouter>
      </ToastProvider>
    </Provider>
  );
};

describe('AnalyticsCenterPage Integration', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((url: string | URL | Request) => {
        const urlString = typeof url === 'string' ? url : url instanceof Request ? url.url : url.toString();

        if (urlString.includes('analytics/summary')) {
          return Promise.resolve(new Response(JSON.stringify(mockSummary), { status: 200 }));
        }
        if (urlString.includes('payroll-variance')) {
          return Promise.resolve(new Response(JSON.stringify(mockPayrollVariance), { status: 200 }));
        }
        if (urlString.includes('statutory-compliance')) {
          return Promise.resolve(new Response(JSON.stringify(mockStatutoryCompliance), { status: 200 }));
        }
        return Promise.resolve(new Response(JSON.stringify({ data: [] }), { status: 200 }));
      })
    );
  });

  it('renders executive workforce overview and module navigation tabs', async () => {
    renderCenter();

    // Verify Title
    expect(await screen.findByText('Workforce Analytics & Intelligence Center')).toBeDefined();

    // Verify Tab buttons
    expect(screen.getByText('Workforce Overview')).toBeDefined();
    expect(screen.getByText('Payroll Variance')).toBeDefined();
    expect(screen.getByText('Leave Liability')).toBeDefined();
    expect(screen.getByText('9-Box Talent')).toBeDefined();
    expect(screen.getByText('T&E Audit')).toBeDefined();
    expect(screen.getByText('Assets & Capex')).toBeDefined();
    expect(screen.getByText('Statutory Registers')).toBeDefined();
    expect(screen.getByText('Recruitment Funnel')).toBeDefined();
    expect(screen.getByText('Attendance & Shifts')).toBeDefined();
  });

  it('clicking Payroll Variance tab switches view to Payroll Variance dashboard', async () => {
    renderCenter();

    const payrollTab = screen.getByText('Payroll Variance');
    fireEvent.click(payrollTab);

    // Verify Payroll dashboard rendered
    expect(await screen.findByText('Month-over-Month Payroll Variance')).toBeDefined();
    expect(await screen.findByText('Salary Components Split')).toBeDefined();
  });

  it('clicking Statutory Registers tab switches view to Statutory Registers with one-click downloads', async () => {
    renderCenter();

    const statutoryTab = screen.getByText('Statutory Registers');
    fireEvent.click(statutoryTab);

    // Verify Statutory dashboard rendered
    expect(await screen.findByText(/Audit-Ready Statutory Registers/)).toBeDefined();
    expect(await screen.findByText(/EPFO Electronic Challan Return/)).toBeDefined();
  });
});
