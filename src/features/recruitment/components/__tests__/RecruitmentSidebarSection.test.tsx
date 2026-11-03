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
    user: { fullName: 'Test User', email: 'test@example.com' },
    activeRole: 'HR_ADMIN',
    isAuthenticated: true,
  })),
}));

vi.mock('@/features/auth/hooks/useRBAC', () => ({
  useRBAC: vi.fn(() => ({
    hasAnyRole: vi.fn(() => true),
    isSuperAdmin: true,
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

describe('RecruitmentSidebarSection (Single Menu Item Redesign)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      user: { fullName: 'HR Admin', email: 'hr@example.com' } as any,
      activeRole: 'HR_ADMIN',
      isAuthenticated: true,
    } as any);
    vi.mocked(useRBAC).mockReturnValue({
      hasAnyRole: vi.fn(() => true),
      isSuperAdmin: true,
    } as any);
    vi.mocked(useGetSidebarBadgesQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
    } as any);
  });

  it('renders ONLY the single "Talent & Recruitment" menu item in the sidebar', () => {
    renderSection();

    expect(screen.getByText('Talent & Recruitment')).toBeInTheDocument();

    // Verify all 8 submenu modules are NOT rendered in the sidebar
    expect(screen.queryByText('Overview Dashboard')).not.toBeInTheDocument();
    expect(screen.queryByText('Job Requisitions')).not.toBeInTheDocument();
    expect(screen.queryByText('Job Openings')).not.toBeInTheDocument();
    expect(screen.queryByText('Candidates & ATS')).not.toBeInTheDocument();
    expect(screen.queryByText('Interview Scheduler')).not.toBeInTheDocument();
    expect(screen.queryByText('Offer Management')).not.toBeInTheDocument();
    expect(screen.queryByText('BGV Management')).not.toBeInTheDocument();
    expect(screen.queryByText('Recruitment Reports')).not.toBeInTheDocument();
  });

  it('renders a NavLink targeting /recruitment/dashboard', () => {
    renderSection();

    const link = screen.getByText('Talent & Recruitment').closest('a');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/recruitment/dashboard');
  });

  it('triggers onTabChange and onMobileClose when clicked', () => {
    const onTabChange = vi.fn();
    const onMobileClose = vi.fn();

    renderSection({ onTabChange, onMobileClose });

    const link = screen.getByText('Talent & Recruitment').closest('a');
    expect(link).toBeInTheDocument();
    fireEvent.click(link!);

    expect(onTabChange).toHaveBeenCalledWith('recruitment');
    expect(onMobileClose).toHaveBeenCalled();
  });

  it('renders total alert count badge when badges exist', () => {
    vi.mocked(useGetSidebarBadgesQuery).mockReturnValue({
      data: {
        pending_req_approvals_count: 3,
        new_applications_count: 5,
      } as any,
      isLoading: false,
    } as any);

    renderSection();
    // 3 + 5 = 8 total alerts
    expect(screen.getByText('8')).toBeInTheDocument();
  });

  it('renders compact icon-only representation in collapsed mode with tooltip', () => {
    renderSection({ collapsed: true });

    // In collapsed mode, text label is hidden, tooltip title is present
    expect(screen.queryByText('Talent & Recruitment')).not.toBeInTheDocument();
    const link = screen.getByRole('link', { name: 'Talent & Recruitment' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('title', 'Talent & Recruitment');
    expect(link).toHaveAttribute('href', '/recruitment/dashboard');
  });

  it('hides sidebar entry when user role lacks clearance', () => {
    vi.mocked(useRBAC).mockReturnValue({
      hasAnyRole: vi.fn(() => false),
      isSuperAdmin: false,
    } as any);

    const { container } = renderSection();
    expect(container.firstChild).toBeNull();
  });
});
