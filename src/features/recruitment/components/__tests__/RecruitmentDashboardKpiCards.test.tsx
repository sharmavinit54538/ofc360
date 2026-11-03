import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { RecruitmentDashboardKpiCards } from '../RecruitmentDashboardKpiCards';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const defaultProps = {
  stats: {
    openPositions: 12,
    totalApplications: 145,
    activePipelineCandidates: 38,
    interviewsThisWeek: 16,
    offersAcceptedThisMonth: 7,
    avgTimeToHireDays: 21,
  },
  badges: {
    pending_req_approvals_count: 3,
    active_openings_count: 12,
    new_applications_count: 24,
    today_interviews_count: 5,
    pending_offer_approvals_count: 2,
    bgv_discrepancy_alerts_count: 1,
  },
  jobsTotal: 18,
  jobsOpen: 12,
  jobsClosed: 6,
  candidatesTotal: 145,
  candidatesApplied: 24,
  candidatesShortlisted: 38,
  interviewsTotal: 30,
  interviewsScheduled: 16,
  interviewsCompleted: 14,
  requisitionsTotal: 15,
  requisitionsPending: 3,
  requisitionsApproved: 12,
  offersTotal: 10,
  offersPending: 2,
  offersAccepted: 7,
  isLoading: false,
};

const renderCards = (props = defaultProps) => {
  return render(
    <BrowserRouter>
      <RecruitmentDashboardKpiCards {...props} />
    </BrowserRouter>
  );
};

describe('RecruitmentDashboardKpiCards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all 8 recruitment module KPI cards', () => {
    renderCards();

    expect(screen.getByText('Overview Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Job Requisitions')).toBeInTheDocument();
    expect(screen.getByText('Job Openings')).toBeInTheDocument();
    expect(screen.getByText('Candidates & ATS')).toBeInTheDocument();
    expect(screen.getByText('Interview Scheduler')).toBeInTheDocument();
    expect(screen.getByText('Offer Management')).toBeInTheDocument();
    expect(screen.getByText('BGV Management')).toBeInTheDocument();
    expect(screen.getByText('Recruitment Reports')).toBeInTheDocument();
  });

  it('displays accurate main KPI counts for all modules', () => {
    renderCards();

    // Requisitions main count
    expect(screen.getByText('15')).toBeInTheDocument();
    // Job openings main count
    expect(screen.getByText('18')).toBeInTheDocument();
    // Candidates main count
    expect(screen.getByText('145')).toBeInTheDocument();
    // Interviews main count
    expect(screen.getByText('16')).toBeInTheDocument();
    // Offers main count
    expect(screen.getByText('10')).toBeInTheDocument();
    // Reports avg time-to-hire
    expect(screen.getByText('21d')).toBeInTheDocument();
  });

  it('renders supporting statistics for each card', () => {
    renderCards();

    // Requisitions supporting stats
    expect(screen.getByText('Pending Approvals')).toBeInTheDocument();
    expect(screen.getByText('Approved Requisitions')).toBeInTheDocument();

    // Job openings supporting stats
    expect(screen.getByText('Active Openings')).toBeInTheDocument();
    expect(screen.getByText('Closed Positions')).toBeInTheDocument();

    // Candidates supporting stats
    expect(screen.getByText('New Applications')).toBeInTheDocument();
    expect(screen.getByText('Shortlisted Candidates')).toBeInTheDocument();

    // Interview scheduler supporting stats
    expect(screen.getByText('Upcoming / Today')).toBeInTheDocument();
    expect(screen.getByText('Completed Interviews')).toBeInTheDocument();

    // Offer management supporting stats
    expect(screen.getByText('Pending Offers')).toBeInTheDocument();
    expect(screen.getByText('Accepted Offers')).toBeInTheDocument();

    // BGV supporting stats
    expect(screen.getByText('Verification Pending')).toBeInTheDocument();
    expect(screen.getByText('Rejected / Discrepancy')).toBeInTheDocument();
  });

  it('navigates to the corresponding module route when clicked', () => {
    renderCards();

    // Click Job Requisitions card
    const requisitionsCard = screen.getByText('Job Requisitions').closest('[role="button"]');
    expect(requisitionsCard).toBeInTheDocument();
    fireEvent.click(requisitionsCard!);
    expect(mockNavigate).toHaveBeenCalledWith('/recruitment/requisitions');

    // Click Job Openings card
    const jobsCard = screen.getByText('Job Openings').closest('[role="button"]');
    expect(jobsCard).toBeInTheDocument();
    fireEvent.click(jobsCard!);
    expect(mockNavigate).toHaveBeenCalledWith('/recruitment/jobs');

    // Click Candidates & ATS card
    const candidatesCard = screen.getByText('Candidates & ATS').closest('[role="button"]');
    expect(candidatesCard).toBeInTheDocument();
    fireEvent.click(candidatesCard!);
    expect(mockNavigate).toHaveBeenCalledWith('/recruitment/candidates');

    // Click Interview Scheduler card
    const interviewsCard = screen.getByText('Interview Scheduler').closest('[role="button"]');
    expect(interviewsCard).toBeInTheDocument();
    fireEvent.click(interviewsCard!);
    expect(mockNavigate).toHaveBeenCalledWith('/recruitment/interviews');

    // Click Offer Management card
    const offersCard = screen.getByText('Offer Management').closest('[role="button"]');
    expect(offersCard).toBeInTheDocument();
    fireEvent.click(offersCard!);
    expect(mockNavigate).toHaveBeenCalledWith('/recruitment/offers');

    // Click BGV Management card
    const bgvCard = screen.getByText('BGV Management').closest('[role="button"]');
    expect(bgvCard).toBeInTheDocument();
    fireEvent.click(bgvCard!);
    expect(mockNavigate).toHaveBeenCalledWith('/recruitment/bgv');

    // Click Recruitment Reports card
    const reportsCard = screen.getByText('Recruitment Reports').closest('[role="button"]');
    expect(reportsCard).toBeInTheDocument();
    fireEvent.click(reportsCard!);
    expect(mockNavigate).toHaveBeenCalledWith('/recruitment/reports');
  });

  it('renders loading skeletons when isLoading is true', () => {
    const { container } = renderCards({ ...defaultProps, isLoading: true });

    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBe(8);
    expect(screen.queryByText('Job Requisitions')).not.toBeInTheDocument();
  });

  it('handles empty stats and zero values safely', () => {
    renderCards({
      stats: undefined,
      badges: undefined,
      isLoading: false,
    });

    expect(screen.getByText('Overview Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Job Requisitions')).toBeInTheDocument();
    expect(screen.getByText('Job Openings')).toBeInTheDocument();
  });
});
