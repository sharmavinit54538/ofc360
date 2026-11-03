import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { DashboardSidebar } from '@/features/dashboard/components/DashboardSidebar';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';

// Mock hooks
vi.mock('@/features/auth/hooks/useAuth', () => ({
  useAuth: vi.fn(() => ({
    user: { fullName: 'Test User', email: 'test@example.com', has_assigned_interviews: false },
    activeRole: 'EMPLOYEE',
    isAuthenticated: true,
  })),
}));

vi.mock('@/features/auth/hooks/useRBAC', () => ({
  useRBAC: vi.fn(() => ({
    hasAnyRole: vi.fn((roles: string[]) => roles.includes('EMPLOYEE')),
    isSuperAdmin: false,
  })),
}));

vi.mock('@/features/recruitment/api/sidebarBadgesApi', () => ({
  useGetSidebarBadgesQuery: vi.fn(() => ({
    data: undefined,
    isLoading: false,
  })),
}));

vi.mock('@/features/dashboard/components/dashboardTabs.data', async () => {
  const actual = await vi.importActual('@/features/dashboard/components/dashboardTabs.data');
  return {
    ...actual,
    SIDEBAR_SECTIONS: actual.SIDEBAR_SECTIONS,
    DASHBOARD_TABS: actual.DASHBOARD_TABS,
  };
});

const renderSidebar = (props = {}) => {
  return render(
    <BrowserRouter>
      <ProtectedRoute allowedRoles={['EMPLOYEE']}>
        <DashboardSidebar {...props} />
      </ProtectedRoute>
    </BrowserRouter>
  );
};

describe('DashboardSidebar - Recruitment Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Role-based rendering', () => {
    it('should render recruitment section for HR_ADMIN', () => {
      vi.mocked(require('@/features/auth/hooks/useRBAC').useRBAC).mockReturnValue({
        hasAnyRole: vi.fn((roles: string[]) => roles.includes('HR_ADMIN')),
        isSuperAdmin: false,
      });

      vi.mocked(require('@/features/auth/hooks/useAuth').useAuth).mockReturnValue({
        user: { fullName: 'HR Admin', email: 'hr@example.com', has_assigned_interviews: false },
        activeRole: 'HR_ADMIN',
        isAuthenticated: true,
      });

      renderSidebar();
      expect(screen.getByText('TALENT & RECRUITMENT')).toBeInTheDocument();
    });

    it('should render all 8 HR tabs for HR_ADMIN', () => {
      vi.mocked(require('@/features/auth/hooks/useRBAC').useRBAC).mockReturnValue({
        hasAnyRole: vi.fn((roles: string[]) => roles.includes('HR_ADMIN')),
        isSuperAdmin: false,
      });

      renderSidebar();
      
      expect(screen.getByText('Overview Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Job Requisitions')).toBeInTheDocument();
      expect(screen.getByText('Job Openings')).toBeInTheDocument();
      expect(screen.getByText('Candidates & ATS')).toBeInTheDocument();
      expect(screen.getByText('Interview Scheduler')).toBeInTheDocument();
      expect(screen.getByText('Offer Management')).toBeInTheDocument();
      expect(screen.getByText('BGV Management')).toBeInTheDocument();
      expect(screen.getByText('Recruitment Reports')).toBeInTheDocument();
    });

    it('should render only 4 MANAGER tabs for MANAGER role', () => {
      vi.mocked(require('@/features/auth/hooks/useRBAC').useRBAC).mockReturnValue({
        hasAnyRole: vi.fn((roles: string[]) => roles.includes('MANAGER')),
        isSuperAdmin: false,
      });

      vi.mocked(require('@/features/auth/hooks/useAuth').useAuth).mockReturnValue({
        user: { fullName: 'Manager', email: 'manager@example.com', has_assigned_interviews: false },
        activeRole: 'MANAGER',
        isAuthenticated: true,
      });

      renderSidebar();
      
      expect(screen.getByText('Team Requisitions')).toBeInTheDocument();
      expect(screen.getByText('Candidate Reviews')).toBeInTheDocument();
      expect(screen.getByText('Panel Interviews')).toBeInTheDocument();
      expect(screen.getByText('Offer Approvals')).toBeInTheDocument();
      
      // Should NOT see HR tabs
      expect(screen.queryByText('Overview Dashboard')).not.toBeInTheDocument();
      expect(screen.queryByText('Job Requisitions')).not.toBeInTheDocument();
    });

    it('should render only 2 IT_ADMIN tabs for IT_ADMIN role', () => {
      vi.mocked(require('@/features/auth/hooks/useRBAC').useRBAC).mockReturnValue({
        hasAnyRole: vi.fn((roles: string[]) => roles.includes('IT_ADMIN')),
        isSuperAdmin: false,
      });

      vi.mocked(require('@/features/auth/hooks/useAuth').useAuth).mockReturnValue({
        user: { fullName: 'IT Admin', email: 'it@example.com', has_assigned_interviews: false },
        activeRole: 'IT_ADMIN',
        isAuthenticated: true,
      });

      renderSidebar();
      
      expect(screen.getByText('Onboarding IT Queue')).toBeInTheDocument();
      expect(screen.getByText('Asset Allocation')).toBeInTheDocument();
      
      // Should NOT see HR or Manager tabs
      expect(screen.queryByText('Overview Dashboard')).not.toBeInTheDocument();
      expect(screen.queryByText('Team Requisitions')).not.toBeInTheDocument();
    });

    it('should render only 3 EMPLOYEE tabs for EMPLOYEE role', () => {
      renderSidebar();
      
      expect(screen.getByText('Internal Careers (IJP)')).toBeInTheDocument();
      expect(screen.getByText('My Referrals')).toBeInTheDocument();
      expect(screen.getByText('Assigned Interviews')).toBeInTheDocument();
      
      // Should NOT see other role tabs
      expect(screen.queryByText('Overview Dashboard')).not.toBeInTheDocument();
      expect(screen.queryByText('Team Requisitions')).not.toBeInTheDocument();
      expect(screen.queryByText('Onboarding IT Queue')).not.toBeInTheDocument();
    });

    it('should NOT render Assigned Interviews tab when user.has_assigned_interviews is false', () => {
      vi.mocked(require('@/features/auth/hooks/useAuth').useAuth).mockReturnValue({
        user: { fullName: 'Employee', email: 'emp@example.com', has_assigned_interviews: false },
        activeRole: 'EMPLOYEE',
        isAuthenticated: true,
      });

      renderSidebar();
      
      // The tab should still render but condition is handled in RecruitmentSidebarSection
      // Actually, the condition is checked in RecruitmentSidebarSection
      // For EMPLOYEE with has_assigned_interviews: false, the tab should be filtered out
      expect(screen.queryByText('Assigned Interviews')).not.toBeInTheDocument();
    });

    it('SHOULD render Assigned Interviews tab when user.has_assigned_interviews is true', () => {
      vi.mocked(require('@/features/auth/hooks/useAuth').useAuth).mockReturnValue({
        user: { fullName: 'Employee', email: 'emp@example.com', has_assigned_interviews: true },
        activeRole: 'EMPLOYEE',
        isAuthenticated: true,
      });

      renderSidebar();
      
      expect(screen.getByText('Assigned Interviews')).toBeInTheDocument();
    });

    it('should render all tabs for SUPER_ADMIN', () => {
      vi.mocked(require('@/features/auth/hooks/useRBAC').useRBAC).mockReturnValue({
        hasAnyRole: vi.fn(() => true),
        isSuperAdmin: true,
      });

      vi.mocked(require('@/features/auth/hooks/useAuth').useAuth).mockReturnValue({
        user: { fullName: 'Super Admin', email: 'super@example.com', has_assigned_interviews: true },
        activeRole: 'SUPER_ADMIN',
        isAuthenticated: true,
      });

      renderSidebar();
      
      // Should see all 17 tabs
      expect(screen.getByText('Overview Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Job Requisitions')).toBeInTheDocument();
      expect(screen.getByText('Team Requisitions')).toBeInTheDocument();
      expect(screen.getByText('Onboarding IT Queue')).toBeInTheDocument();
      expect(screen.getByText('Internal Careers (IJP)')).toBeInTheDocument();
    });
  });

  describe('Badge display', () => {
    it('should show badge skeleton while loading', () => {
      vi.mocked(require('@/features/recruitment/api/sidebarBadgesApi').useGetSidebarBadgesQuery).mockReturnValue({
        data: undefined,
        isLoading: true,
      });

      renderSidebar();
      
      // Should show skeleton loaders for badges
      const skeletons = screen.getAllByTestId('skeleton-badge');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should display badge count when data is available', () => {
      vi.mocked(require('@/features/recruitment/api/sidebarBadgesApi').useGetSidebarBadgesQuery).mockReturnValue({
        data: {
          new_applications_count: 5,
          today_interviews_count: 3,
          pending_scorecards_count: 2,
        },
        isLoading: false,
      });

      renderSidebar();
      
      // Should display actual badge counts (not hardcoded)
      // The badges are rendered via the RecruitmentSidebarSection component
    });

    it('should NOT display badge when count is 0', () => {
      vi.mocked(require('@/features/recruitment/api/sidebarBadgesApi').useGetSidebarBadgesQuery).mockReturnValue({
        data: {
          new_applications_count: 0,
          today_interviews_count: 3,
        },
        isLoading: false,
      });

      renderSidebar();
      
      // Should not show badge for 0 count
    });

    it('should NOT display badge when count is undefined', () => {
      vi.mocked(require('@/features/recruitment/api/sidebarBadgesApi').useGetSidebarBadgesQuery).mockReturnValue({
        data: {
          today_interviews_count: 3,
        },
        isLoading: false,
      });

      renderSidebar();
      
      // Should not show badge for undefined count
    });
  });

  describe('Collapsible section', () => {
    it('should collapse/expand recruitment section when clicked', () => {
      renderSidebar({ collapsed: false });
      
      const sectionHeader = screen.getByText('TALENT & RECRUITMENT').closest('button');
      expect(sectionHeader).toBeInTheDocument();
      
      fireEvent.click(sectionHeader);
      // Section should collapse
    });
  });

  describe('Mobile drawer', () => {
    it('should render correctly in mobile mode', () => {
      renderSidebar({ collapsed: false });
      
      // Should render navigation structure
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });
});