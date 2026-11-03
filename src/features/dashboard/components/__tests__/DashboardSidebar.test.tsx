import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { DashboardSidebar } from '@/features/dashboard/components/DashboardSidebar';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRBAC } from '@/features/auth/hooks/useRBAC';
import { useGetSidebarBadgesQuery } from '@/features/recruitment/api/sidebarBadgesApi';

// Mock hooks
vi.mock('@/features/auth/hooks/useAuth', () => ({
  useAuth: vi.fn(() => ({
    user: { fullName: 'Test User', email: 'test@example.com', has_assigned_interviews: true },
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
  const actual = await vi.importActual<any>('@/features/dashboard/components/dashboardTabs.data');
  return {
    ...actual,
    SIDEBAR_SECTIONS: actual.SIDEBAR_SECTIONS,
    DASHBOARD_TABS: actual.DASHBOARD_TABS,
  };
});

const renderSidebar = (props = {}) => {
  return render(
    <BrowserRouter>
      <DashboardSidebar {...props} />
    </BrowserRouter>
  );
};

describe('DashboardSidebar - Recruitment Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      user: { fullName: 'Test User', email: 'test@example.com', has_assigned_interviews: true } as any,
      activeRole: 'EMPLOYEE',
      isAuthenticated: true,
    } as any);
    vi.mocked(useRBAC).mockReturnValue({
      hasAnyRole: vi.fn((roles: string[]) => roles.includes('EMPLOYEE')),
      isSuperAdmin: false,
    } as any);
    vi.mocked(useGetSidebarBadgesQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
    } as any);
  });

  describe('Role-based rendering', () => {
    it('should render recruitment section for HR_ADMIN', () => {
      vi.mocked(useRBAC).mockReturnValue({
        hasAnyRole: vi.fn((roles: string[]) => roles.includes('HR_ADMIN')),
        isSuperAdmin: false,
      } as any);

      vi.mocked(useAuth).mockReturnValue({
        user: { fullName: 'HR Admin', email: 'hr@example.com', has_assigned_interviews: false } as any,
        activeRole: 'HR_ADMIN',
        isAuthenticated: true,
      } as any);

      renderSidebar();
      expect(screen.getByText('Talent & Recruitment')).toBeInTheDocument();
    });

    it('should house submenu modules inside Recruitment Dashboard, not in root sidebar', () => {
      vi.mocked(useRBAC).mockReturnValue({
        hasAnyRole: vi.fn((roles: string[]) => roles.includes('HR_ADMIN')),
        isSuperAdmin: false,
      } as any);

      renderSidebar();
      
      expect(screen.getByText('Talent & Recruitment')).toBeInTheDocument();
      // Internal recruitment tabs are housed inside the dashboard page
      expect(screen.queryByText('Overview Dashboard')).not.toBeInTheDocument();
      expect(screen.queryByText('Job Requisitions')).not.toBeInTheDocument();
      expect(screen.queryByText('Candidates & ATS')).not.toBeInTheDocument();
    });

    it('should render recruitment section for MANAGER role', () => {
      vi.mocked(useRBAC).mockReturnValue({
        hasAnyRole: vi.fn((roles: string[]) => roles.includes('MANAGER')),
        isSuperAdmin: false,
      } as any);

      vi.mocked(useAuth).mockReturnValue({
        user: { fullName: 'Manager', email: 'manager@example.com', has_assigned_interviews: false } as any,
        activeRole: 'MANAGER',
        isAuthenticated: true,
      } as any);

      renderSidebar();
      expect(screen.getByText('Talent & Recruitment')).toBeInTheDocument();
    });

    it('should render recruitment section for IT_ADMIN role', () => {
      vi.mocked(useRBAC).mockReturnValue({
        hasAnyRole: vi.fn((roles: string[]) => roles.includes('IT_ADMIN')),
        isSuperAdmin: false,
      } as any);

      vi.mocked(useAuth).mockReturnValue({
        user: { fullName: 'IT Admin', email: 'it@example.com', has_assigned_interviews: false } as any,
        activeRole: 'IT_ADMIN',
        isAuthenticated: true,
      } as any);

      renderSidebar();
      expect(screen.getByText('Talent & Recruitment')).toBeInTheDocument();
    });

    it('should render recruitment section for EMPLOYEE role', () => {
      renderSidebar();
      expect(screen.getByText('Talent & Recruitment')).toBeInTheDocument();
    });

    it('should render recruitment section for SUPER_ADMIN', () => {
      vi.mocked(useRBAC).mockReturnValue({
        hasAnyRole: vi.fn(() => true),
        isSuperAdmin: true,
      } as any);

      vi.mocked(useAuth).mockReturnValue({
        user: { fullName: 'Super Admin', email: 'super@example.com', has_assigned_interviews: true } as any,
        activeRole: 'SUPER_ADMIN',
        isAuthenticated: true,
      } as any);

      renderSidebar();
      expect(screen.getByText('Talent & Recruitment')).toBeInTheDocument();
    });

    it('should NOT render recruitment section if role access check returns false', () => {
      vi.mocked(useRBAC).mockReturnValue({
        hasAnyRole: vi.fn(() => false),
        isSuperAdmin: false,
      } as any);

      renderSidebar();
      expect(screen.queryByText('Talent & Recruitment')).not.toBeInTheDocument();
    });
  });

  describe('Badge display', () => {
    it('should show badge skeleton while loading', () => {
      vi.mocked(useGetSidebarBadgesQuery).mockReturnValue({
        data: undefined,
        isLoading: true,
      } as any);

      const { container } = renderSidebar();
      
      // Should show skeleton loaders for badges
      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should display badge count when data is available', () => {
      vi.mocked(useGetSidebarBadgesQuery).mockReturnValue({
        data: {
          pending_scorecards_count: 2,
          pending_req_approvals_count: 5,
        },
        isLoading: false,
      } as any);

      renderSidebar();
      expect(screen.getByText('7')).toBeInTheDocument();
    });

    it('should NOT display badge when count is 0', () => {
      vi.mocked(useGetSidebarBadgesQuery).mockReturnValue({
        data: {
          pending_scorecards_count: 0,
        },
        isLoading: false,
      } as any);

      renderSidebar();
      expect(screen.queryByText('0')).not.toBeInTheDocument();
    });

    it('should NOT display badge when count is undefined', () => {
      vi.mocked(useGetSidebarBadgesQuery).mockReturnValue({
        data: {},
        isLoading: false,
      } as any);

      renderSidebar();
      expect(screen.queryByText('0')).not.toBeInTheDocument();
    });
  });

  describe('Collapsed mode', () => {
    it('should render collapsed recruitment link with accessible label', () => {
      renderSidebar({ collapsed: true });
      
      const link = screen.getByTitle('Talent & Recruitment');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/recruitment/dashboard');
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