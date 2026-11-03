import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { RecruitmentSidebarSection } from '../RecruitmentSidebarSection';
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

const renderSection = (props: React.ComponentProps<typeof RecruitmentSidebarSection> = {}) => {
  return render(
    <BrowserRouter>
      <RecruitmentSidebarSection {...props} />
    </BrowserRouter>
  );
};

describe('RecruitmentSidebarSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      user: { fullName: 'Employee', email: 'emp@example.com', has_assigned_interviews: true } as any,
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

  describe('Null safety & Object Child Prevention', () => {
    it('does not throw when badges contains complex objects instead of primitives', () => {
      vi.mocked(useGetSidebarBadgesQuery).mockReturnValue({
        data: {
          pending_scorecards_count: { count: 4, label: 'Pending' },
          active_referral_updates_count: '15',
        } as any,
        isLoading: false,
      } as any);

      expect(() => renderSection()).not.toThrow();
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('15')).toBeInTheDocument();
    });

    it('renders 99+ for badge counts greater than 99', () => {
      vi.mocked(useGetSidebarBadgesQuery).mockReturnValue({
        data: {
          pending_scorecards_count: 142,
        } as any,
        isLoading: false,
      } as any);

      renderSection();
      expect(screen.getByText('99+')).toBeInTheDocument();
    });

    it('handles undefined user and null RBAC safely', () => {
      vi.mocked(useAuth).mockReturnValue({
        user: null,
        activeRole: null,
        isAuthenticated: false,
      } as any);
      vi.mocked(useRBAC).mockReturnValue({
        hasAnyRole: undefined as any,
        isSuperAdmin: false,
      } as any);

      expect(() => renderSection()).not.toThrow();
    });
  });

  describe('Role-based tab visibility', () => {
    it('renders HR tabs for HR_ADMIN', () => {
      vi.mocked(useRBAC).mockReturnValue({
        hasAnyRole: vi.fn((roles: string[]) => roles.includes('HR_ADMIN')),
        isSuperAdmin: false,
      } as any);

      renderSection();
      expect(screen.getByText('Overview Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Job Requisitions')).toBeInTheDocument();
      expect(screen.getByText('Job Openings')).toBeInTheDocument();
      expect(screen.getByText('Candidates & ATS')).toBeInTheDocument();
      expect(screen.getByText('Interview Scheduler')).toBeInTheDocument();
      expect(screen.getByText('Offer Management')).toBeInTheDocument();
      expect(screen.getByText('BGV Management')).toBeInTheDocument();
      expect(screen.getByText('Recruitment Reports')).toBeInTheDocument();
    });

    it('renders Manager tabs for MANAGER', () => {
      vi.mocked(useRBAC).mockReturnValue({
        hasAnyRole: vi.fn((roles: string[]) => roles.includes('MANAGER')),
        isSuperAdmin: false,
      } as any);

      renderSection();
      expect(screen.getByText('Team Requisitions')).toBeInTheDocument();
      expect(screen.getByText('Candidate Reviews')).toBeInTheDocument();
      expect(screen.getByText('Panel Interviews')).toBeInTheDocument();
      expect(screen.getByText('Offer Approvals')).toBeInTheDocument();
    });

    it('filters out Assigned Interviews when user has no assigned interviews', () => {
      vi.mocked(useAuth).mockReturnValue({
        user: { fullName: 'Employee', email: 'emp@example.com', has_assigned_interviews: false } as any,
        activeRole: 'EMPLOYEE',
        isAuthenticated: true,
      } as any);

      renderSection();
      expect(screen.queryByText('Assigned Interviews')).not.toBeInTheDocument();
      expect(screen.getByText('Internal Careers (IJP)')).toBeInTheDocument();
      expect(screen.getByText('My Referrals')).toBeInTheDocument();
    });
  });

  describe('Navigation & Callbacks', () => {
    it('triggers onTabChange and onMobileClose when a tab is clicked', () => {
      const onTabChange = vi.fn();
      const onMobileClose = vi.fn();

      renderSection({ onTabChange, onMobileClose });

      const link = screen.getByText('Internal Careers (IJP)').closest('a');
      expect(link).toBeInTheDocument();
      fireEvent.click(link!);

      expect(onTabChange).toHaveBeenCalledWith('employee-careers');
      expect(onMobileClose).toHaveBeenCalled();
    });

    it('collapses and expands the section when header is clicked', () => {
      renderSection({ collapsed: false });

      const toggleBtn = screen.getByText('TALENT & RECRUITMENT').closest('button');
      expect(toggleBtn).toBeInTheDocument();

      expect(toggleBtn).toHaveAttribute('aria-expanded', 'true');
      fireEvent.click(toggleBtn!);
      expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');
    });

    it('renders compact icon-only representation in collapsed mode without crashing', () => {
      expect(() => renderSection({ collapsed: true })).not.toThrow();
    });
  });
});
