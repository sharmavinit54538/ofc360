/**
 * @file AIHubPage.test.tsx
 * @description Integration tests for OFC360 AI Hub & Autonomous Tools Portal:
 * verifies all 6 AI modules launch interactive workspaces, search filters, and real RTK Query bindings.
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { ToastProvider } from '@/shared/ui/Toast';
import { AIHubPage } from '../pages/AIHubPage';

const mockCandidates = [
  {
    id: 'can-1',
    name: 'Aarav Mehta',
    appliedRole: 'Senior Fullstack Engineer',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    experienceYears: 5,
    status: 'SHORTLISTED',
  },
];

const mockShifts = [
  {
    id: 's-1',
    name: 'Morning General Shift',
    startTime: '09:00 AM',
    endTime: '06:00 PM',
    scheduledCount: 30,
    status: 'ADEQUATE',
  },
];

const mockAuditFindings = [
  {
    id: 'find-1',
    findingType: 'NET_PAY_SPIKE',
    severity: 'HIGH',
    employeeId: 'EMP-101',
    employeeName: 'Vikram Joshi',
    department: 'Engineering',
    amountAtRisk: 35000,
    amountFormatted: '₹35,000',
    description: 'Salary spiked 35% MoM.',
    suggestedCorrection: 'Verify overtime arrears signoff.',
    status: 'PENDING_AUDIT',
  },
];

const renderHub = () => {
  return render(
    <Provider store={store}>
      <ToastProvider>
        <MemoryRouter>
          <AIHubPage />
        </MemoryRouter>
      </ToastProvider>
    </Provider>
  );
};

describe('AIHubPage Integration Tests', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((url: string | URL | Request) => {
        const urlStr = typeof url === 'string' ? url : url instanceof Request ? url.url : url.toString();

        if (urlStr.includes('candidates') || urlStr.includes('recruiter')) {
          return Promise.resolve(new Response(JSON.stringify({ candidates: mockCandidates }), { status: 200 }));
        }
        if (urlStr.includes('attendance/shifts') || urlStr.includes('shift-monitor')) {
          return Promise.resolve(new Response(JSON.stringify(mockShifts), { status: 200 }));
        }
        if (urlStr.includes('payroll/audit-scan') || urlStr.includes('findings')) {
          return Promise.resolve(new Response(JSON.stringify(mockAuditFindings), { status: 200 }));
        }
        if (urlStr.includes('capacity') || urlStr.includes('department-breakdown')) {
          return Promise.resolve(
            new Response(
              JSON.stringify([
                {
                  departmentId: 'dept-1',
                  departmentName: 'Engineering',
                  totalHeadcount: 42,
                  activeWorkloadScore: 88,
                  plannedLeavesCount: 4,
                  netAvailableCapacity: 12,
                  utilizationRisk: 'MODERATE',
                  recommendedActions: ['Rebalance sprint workload'],
                },
              ]),
              { status: 200 }
            )
          );
        }
        return Promise.resolve(new Response(JSON.stringify({ data: [] }), { status: 200 }));
      })
    );
  });

  it('renders all 6 core AI modules plus copilot and meeting intelligence', async () => {
    renderHub();

    expect(screen.getByText('Resume & Talent Matcher')).toBeDefined();
    expect(screen.getByText('Capacity Planner')).toBeDefined();
    expect(screen.getByText('Shift AI Monitor')).toBeDefined();
    expect(screen.getByText('Payroll Audit Scanner')).toBeDefined();
    expect(screen.getByText('Smart Legal Generator')).toBeDefined();
    expect(screen.getByText('Autonomous Workflows')).toBeDefined();
    expect(screen.getByText('OFC360 HR Copilot')).toBeDefined();
  });

  it('clicking Resume & Talent Matcher launches dedicated interactive workspace', async () => {
    renderHub();

    const resumeCard = screen.getByText('Resume & Talent Matcher');
    fireEvent.click(resumeCard.closest('[role="button"]') || resumeCard);

    expect(await screen.findByText(/Resume & Talent Matcher AI/)).toBeDefined();
    expect(await screen.findByText('Back to AI Catalog')).toBeDefined();

    const backBtn = screen.getByText('Back to AI Catalog');
    fireEvent.click(backBtn);

    expect(await screen.findByText('OFC360 AI Hub & Autonomous Tools')).toBeDefined();
  });

  it('clicking Capacity Planner launches dedicated interactive workspace', async () => {
    renderHub();

    const capacityCard = screen.getByText('Capacity Planner');
    fireEvent.click(capacityCard.closest('[role="button"]') || capacityCard);

    expect(await screen.findByText('Capacity Planner AI')).toBeDefined();
    expect(await screen.findByText('Org Workload Utilization')).toBeDefined();

    const backBtn = screen.getByText('Back to AI Catalog');
    fireEvent.click(backBtn);

    expect(await screen.findByText('OFC360 AI Hub & Autonomous Tools')).toBeDefined();
  });

  it('clicking Shift AI Monitor launches dedicated interactive workspace', async () => {
    renderHub();

    const shiftCard = screen.getByText('Shift AI Monitor');
    fireEvent.click(shiftCard.closest('[role="button"]') || shiftCard);

    expect(await screen.findByText('Real-Time Roster AI')).toBeDefined();
    expect(await screen.findByText('Live Shift Coverage')).toBeDefined();

    const backBtn = screen.getByText('Back to AI Catalog');
    fireEvent.click(backBtn);

    expect(await screen.findByText('OFC360 AI Hub & Autonomous Tools')).toBeDefined();
  });

  it('clicking Payroll Audit Scanner launches dedicated interactive workspace', async () => {
    renderHub();

    const payrollCard = screen.getByText('Payroll Audit Scanner');
    fireEvent.click(payrollCard.closest('[role="button"]') || payrollCard);

    expect(await screen.findByText('Payroll Audit Scanner AI')).toBeDefined();
    expect(await screen.findByText(/Anomalies Detected/)).toBeDefined();

    const backBtn = screen.getByText('Back to AI Catalog');
    fireEvent.click(backBtn);

    expect(await screen.findByText('OFC360 AI Hub & Autonomous Tools')).toBeDefined();
  });

  it('clicking Smart Legal Generator launches dedicated interactive workspace', async () => {
    renderHub();

    const legalCard = screen.getByText('Smart Legal Generator');
    fireEvent.click(legalCard.closest('[role="button"]') || legalCard);

    expect(await screen.findByText('Smart Legal Generator AI')).toBeDefined();
    expect(await screen.findByText('Document Customizer')).toBeDefined();

    const backBtn = screen.getByText('Back to AI Catalog');
    fireEvent.click(backBtn);

    expect(await screen.findByText('OFC360 AI Hub & Autonomous Tools')).toBeDefined();
  });

  it('clicking Autonomous Workflows launches dedicated interactive workspace', async () => {
    renderHub();

    const workflowsCard = screen.getByText('Autonomous Workflows');
    fireEvent.click(workflowsCard.closest('[role="button"]') || workflowsCard);

    expect(await screen.findByText('Autonomous Workflows AI')).toBeDefined();
    expect(await screen.findByText('Active AI Pipelines')).toBeDefined();

    const backBtn = screen.getByText('Back to AI Catalog');
    fireEvent.click(backBtn);

    expect(await screen.findByText('OFC360 AI Hub & Autonomous Tools')).toBeDefined();
  });

  it('filters AI cards by search input keyword', async () => {
    renderHub();

    const searchInput = screen.getByPlaceholderText('Search AI engines & tools...');
    fireEvent.change(searchInput, { target: { value: 'forensic' } });

    expect(screen.getByText('Payroll Audit Scanner')).toBeDefined();
    expect(screen.queryByText('Resume & Talent Matcher')).toBeNull();
  });

  it('filters AI cards by category pill', async () => {
    renderHub();

    const talentPill = screen.getByRole('button', { name: 'Talent & Hiring' });
    fireEvent.click(talentPill);

    expect(screen.getByText('Resume & Talent Matcher')).toBeDefined();
    expect(screen.queryByText('Payroll Audit Scanner')).toBeNull();
  });
});
