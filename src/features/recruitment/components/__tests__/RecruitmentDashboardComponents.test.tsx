import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { RecruitmentTopNav } from '../dashboard/RecruitmentTopNav';
import { RecruitmentKpiRow } from '../dashboard/RecruitmentKpiRow';
import { RecruitmentFunnelChart } from '../dashboard/RecruitmentFunnelChart';
import { RecruitmentPerformanceRow } from '../dashboard/RecruitmentPerformanceRow';
import { RecruitmentRecentActivity } from '../dashboard/RecruitmentRecentActivity';
import { RecruitmentInsightsPanel } from '../dashboard/RecruitmentInsightsPanel';
import { RecruitmentTargetProgress } from '../dashboard/RecruitmentTargetProgress';
import { RecruitmentDepartmentChart } from '../dashboard/RecruitmentDepartmentChart';
import { RecruitmentPriorityChart } from '../dashboard/RecruitmentPriorityChart';

describe('Recruitment Dashboard Redesign Components', () => {
  it('renders RecruitmentTopNav with active dashboard button and handles clicks', () => {
    const onViewChange = vi.fn();
    const onCreateJob = vi.fn();

    render(
      <RecruitmentTopNav
        activeView="dashboard"
        onViewChange={onViewChange}
        onCreateJobClick={onCreateJob}
      />
    );

    expect(screen.getByText('Recruitment Dashboard')).toBeDefined();
    expect(screen.getByText('Recruitment Module')).toBeDefined();
    expect(screen.getByText('Create Job')).toBeDefined();

    fireEvent.click(screen.getByText('Recruitment Module'));
    expect(onViewChange).toHaveBeenCalledWith('modules');

    fireEvent.click(screen.getByText('Create Job'));
    expect(onCreateJob).toHaveBeenCalled();
  });

  it('renders all 6 first-row KPI cards in RecruitmentKpiRow', () => {
    render(
      <RecruitmentKpiRow
        requisitionsTotal={16}
        jobsOpen={18}
        candidatesTotal={420}
        interviewsScheduled={28}
        offersGenerated={18}
        hiredTotal={14}
      />
    );

    expect(screen.getByText('Total Requisitions')).toBeDefined();
    expect(screen.getByText('Open Positions')).toBeDefined();
    expect(screen.getByText('Total Candidates')).toBeDefined();
    expect(screen.getByText('Interviews Scheduled')).toBeDefined();
    expect(screen.getByText('Offers Generated')).toBeDefined();
    expect(screen.getByText('Hired')).toBeDefined();

    expect(screen.getByText('16')).toBeDefined();
    expect(screen.getByText('420')).toBeDefined();
  });

  it('renders RecruitmentFunnelChart with 6 stages', () => {
    render(<RecruitmentFunnelChart />);

    expect(screen.getByText('Hiring Funnel')).toBeDefined();
    expect(screen.getByText('Applications')).toBeDefined();
    expect(screen.getByText('Screened')).toBeDefined();
    expect(screen.getByText('Shortlisted')).toBeDefined();
    expect(screen.getByText('Interviewed')).toBeDefined();
    expect(screen.getByText('Offered')).toBeDefined();
    expect(screen.getByText('Hired')).toBeDefined();
  });

  it('renders RecruitmentPerformanceRow with 4 metrics', () => {
    render(
      <RecruitmentPerformanceRow
        avgTimeToHireDays={22}
        costPerHire={38500}
        offerAcceptanceRate={86.4}
        slaAchievementRate={92.5}
      />
    );

    expect(screen.getByText('Time to Hire')).toBeDefined();
    expect(screen.getByText('Cost per Hire')).toBeDefined();
    expect(screen.getByText('Offer Acceptance Rate')).toBeDefined();
    expect(screen.getByText('Recruitment SLA')).toBeDefined();
    expect(screen.getByText('86.4%')).toBeDefined();
    expect(screen.getByText('92.5%')).toBeDefined();
  });

  it('renders RecruitmentRecentActivity with activity items and link', () => {
    render(
      <MemoryRouter>
        <RecruitmentRecentActivity />
      </MemoryRouter>
    );

    expect(screen.getByText('Recent Recruitment Activity')).toBeDefined();
    expect(screen.getByText('Candidate Hired')).toBeDefined();
    expect(screen.getByText('Offer Letter Generated')).toBeDefined();
    expect(screen.getByText('View All')).toBeDefined();
  });

  it('renders RecruitmentInsightsPanel with 4 insight cards', () => {
    render(<RecruitmentInsightsPanel />);

    expect(screen.getByText('Recruitment Insights')).toBeDefined();
    expect(screen.getByText('Hiring Velocity')).toBeDefined();
    expect(screen.getByText('Top Source')).toBeDefined();
    expect(screen.getByText('Pipeline Bottleneck')).toBeDefined();
    expect(screen.getByText('AI Recommendation')).toBeDefined();
  });

  it('renders RecruitmentTargetProgress with quota calculations', () => {
    render(
      <RecruitmentTargetProgress
        currentHires={38}
        targetHires={50}
        periodLabel="Q4 Hiring Goal"
      />
    );

    expect(screen.getByText('Hiring Target Progress')).toBeDefined();
    expect(screen.getByText('38')).toBeDefined();
    expect(screen.getByText('/ 50')).toBeDefined();
    expect(screen.getByText('76%')).toBeDefined();
    expect(screen.getByText('Q4 Hiring Goal')).toBeDefined();
  });

  it('renders RecruitmentDepartmentChart and RecruitmentPriorityChart', () => {
    render(
      <div>
        <RecruitmentDepartmentChart />
        <RecruitmentPriorityChart />
      </div>
    );

    expect(screen.getByText('Recruitment by Department')).toBeDefined();
    expect(screen.getByText('Engineering')).toBeDefined();
    expect(screen.getByText('Open Positions by Priority')).toBeDefined();
  });
});
