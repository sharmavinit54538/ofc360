/**
 * @file ReportsAnalyticsHubPage.test.tsx
 * @description Integration tests for all 8 Reports & Analytics Hub modules:
 * verifies card rendering, switching into detailed views, AI insights, 9-Box grid, and filters.
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { ToastProvider } from '@/shared/ui/Toast';
import { ReportsAnalyticsHubPage } from '../pages/ReportsAnalyticsHubPage';

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
  highVarianceDepartments: [
    {
      department: 'Engineering',
      headcount: 48,
      previousSpend: '₹42 Lakhs',
      currentSpend: '₹48 Lakhs',
      variancePercent: 14.2,
      varianceType: 'INCREASE',
      primaryReason: 'New Senior AI Hires',
      status: 'Flagged',
    },
  ],
  aiInsights: [
    {
      id: 'ai-1',
      type: 'ANOMALY',
      title: 'AI Compensation & Variance Audit',
      description: 'Payroll variance detected.',
      confidenceScore: 92,
      impact: 'HIGH',
    },
  ],
};

const mockPerformanceTalent = {
  kpis: {
    appraisalCompletionRate: 94,
    highPerformersCount: 38,
    flightRiskTalentCount: 7,
    avgGoalProgressPercent: 88,
  },
  nineBoxGrid: [
    {
      boxKey: 'star',
      title: 'Star / Future Leader',
      description: 'High Performance / High Potential',
      performanceLevel: 'HIGH',
      potentialLevel: 'HIGH',
      color: '#10b981',
      count: 14,
      employees: [
        {
          id: 'emp-1',
          name: 'Ananya Roy',
          role: 'Staff Engineer',
          department: 'Engineering',
          rating: 4.8,
          flightRisk: 'LOW',
        },
      ],
    },
    {
      boxKey: 'rising-star',
      title: 'Rising Star / High Potential',
      description: 'Moderate Performance / High Potential',
      performanceLevel: 'MEDIUM',
      potentialLevel: 'HIGH',
      color: '#6366f1',
      count: 18,
      employees: [
        {
          id: 'emp-2',
          name: 'Devansh Verma',
          role: 'Product Designer',
          department: 'Product',
          rating: 4.4,
          flightRisk: 'LOW',
        },
      ],
    },
  ],
  bellCurveRatingDistribution: [],
  departmentGoalProgress: [],
  successionPlanHighlights: [
    {
      keyRole: 'VP Engineering',
      incumbent: 'Vikram Joshi',
      readinessStatus: 'Ready in 1-2 Yrs',
      designatedSuccessor: 'Ananya Roy',
      department: 'Engineering',
    },
  ],
  aiInsights: [
    {
      id: 'ai-perf-1',
      type: 'OPPORTUNITY',
      title: 'Talent Density & Succession Matrix',
      description: 'Identified strong internal succession pipeline.',
      confidenceScore: 95,
      impact: 'HIGH',
    },
  ],
};

const renderHub = (initialEntries = ['/dashboard/reports']) => {
  return render(
    <Provider store={store}>
      <ToastProvider>
        <MemoryRouter initialEntries={initialEntries}>
          <ReportsAnalyticsHubPage />
        </MemoryRouter>
      </ToastProvider>
    </Provider>
  );
};

describe('ReportsAnalyticsHubPage Integration', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((url: string | URL | Request) => {
        const urlString = typeof url === 'string' ? url : url instanceof Request ? url.url : url.toString();

        if (urlString.includes('payroll-variance')) {
          return Promise.resolve(new Response(JSON.stringify(mockPayrollVariance), { status: 200 }));
        }
        if (urlString.includes('performance-talent')) {
          return Promise.resolve(new Response(JSON.stringify(mockPerformanceTalent), { status: 200 }));
        }
        return Promise.resolve(new Response(JSON.stringify({ data: [] }), { status: 200 }));
      })
    );
  });

  it('renders all 8 reporting modules on the hub page', async () => {
    renderHub();

    expect(await screen.findByText('Payroll Variance & Compensation')).toBeDefined();
    expect(await screen.findByText('Leave Balances & Absence Liability')).toBeDefined();
    expect(await screen.findByText('Performance & 9-Box Talent Grid')).toBeDefined();
    expect(await screen.findByText('Travel & Expense Spending Audit')).toBeDefined();
    expect(await screen.findByText('Asset Inventory & Depreciation')).toBeDefined();
    expect(await screen.findByText('Statutory Registers & Audit Exports')).toBeDefined();
    expect(await screen.findByText('Recruitment Funnel & Sourcing')).toBeDefined();
    expect(await screen.findByText('Attendance & Shift Utilization')).toBeDefined();
  });

  it('clicking Payroll Variance opens dedicated detailed view with AI Insights and KPIs', async () => {
    renderHub();

    const payrollCard = await screen.findByText('Payroll Variance & Compensation');
    fireEvent.click(payrollCard.closest('[role="button"]') || payrollCard);

    expect(await screen.findByText('Back to All Reports Hub')).toBeDefined();
    expect(await screen.findByText('AI Compensation & Variance Audit')).toBeDefined();
    expect(await screen.findByText('Total Payroll Cost')).toBeDefined();
    expect(await screen.findByText('Average CTC')).toBeDefined();
    expect(await screen.findByText('Pending Adjustments')).toBeDefined();
    expect(await screen.findByText(/High Variance Departments/)).toBeDefined();

    const backBtn = screen.getByText('Back to All Reports Hub');
    fireEvent.click(backBtn);

    expect(await screen.findByText('Reports & Analytics Hub')).toBeDefined();
  });

  it('clicking Performance opens 9-Box Talent Grid with interactive quadrant selection', async () => {
    renderHub();

    const perfCard = await screen.findByText('Performance & 9-Box Talent Grid');
    fireEvent.click(perfCard.closest('[role="button"]') || perfCard);

    expect(await screen.findByText(/Interactive 9-Box Talent Matrix/)).toBeDefined();
    expect(await screen.findByText('Star / Future Leader')).toBeDefined();
    expect(await screen.findByText('Rising Star / High Potential')).toBeDefined();

    const risingStar = screen.getByText('Rising Star / High Potential');
    fireEvent.click(risingStar.closest('button') || risingStar);

    expect(await screen.findByText(/Succession Planning Recommendations/)).toBeDefined();
  });

  it('search filter bar filters report cards properly', async () => {
    renderHub();

    const searchInput = screen.getByPlaceholderText('Search reports or metrics...');
    fireEvent.change(searchInput, { target: { value: 'epfo' } });

    expect(await screen.findByText('Statutory Registers & Audit Exports')).toBeDefined();
    expect(screen.queryByText('Performance & 9-Box Talent Grid')).toBeNull();
  });
});
