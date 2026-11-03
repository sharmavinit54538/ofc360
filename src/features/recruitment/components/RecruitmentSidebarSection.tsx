import React, { useMemo } from 'react';
import { Briefcase } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { Badge } from '@/shared/ui/Badge';
import { Skeleton } from '@/shared/ui/Skeleton';
import { useGetSidebarBadgesQuery } from '@/features/recruitment/api';
import { useRBAC } from '@/features/auth/hooks/useRBAC';
import { useAuth } from '@/features/auth/hooks/useAuth';

export interface RecruitmentSidebarSectionProps {
  activeTab?: string;
  collapsed?: boolean;
  onTabChange?: (tabId: string) => void;
  onMobileClose?: () => void;
}

/**
 * RecruitmentSidebarSection
 *
 * Renders ONLY the primary "Talent & Recruitment" menu item in the sidebar.
 * All nested submenu modules (Overview Dashboard, Requisitions, Jobs, Candidates,
 * Interviews, Offers, BGV, Reports) are housed inside the Talent & Recruitment Dashboard.
 */
export const RecruitmentSidebarSection: React.FC<RecruitmentSidebarSectionProps> = ({
  activeTab,
  collapsed = false,
  onTabChange,
  onMobileClose,
}) => {
  const location = useLocation();
  const rbac = useRBAC();
  const hasAnyRole = rbac?.hasAnyRole;
  const isSuperAdmin = Boolean(rbac?.isSuperAdmin);
  const auth = useAuth();
  const user = auth?.user ?? null;

  // Fetch aggregate sidebar badges for notification indicator
  const { data: badges, isLoading: badgesLoading } = useGetSidebarBadgesQuery(undefined, {
    pollingInterval: 60000,
    skip: !user,
  });

  // Calculate total pending action items across recruitment
  const totalAlertsCount = useMemo(() => {
    if (!badges || typeof badges !== 'object') return 0;
    const values = [
      badges.pending_req_approvals_count,
      badges.new_applications_count,
      badges.today_interviews_count,
      badges.pending_offer_approvals_count,
      badges.bgv_discrepancy_alerts_count,
      badges.pending_scorecards_count,
    ];
    return values.reduce<number>((acc, cur) => {
      if (typeof cur === 'number' && !Number.isNaN(cur) && Number.isFinite(cur) && cur > 0) {
        return acc + cur;
      }
      return acc;
    }, 0);
  }, [badges]);

  // Role visibility clearance: Super Admins, HR roles, Managers, IT Admins, and Employees
  const canAccessRecruitment = useMemo(() => {
    if (isSuperAdmin) return true;
    if (typeof hasAnyRole !== 'function') return true;
    return hasAnyRole(['SUPER_ADMIN', 'HR_ADMIN', 'HR_EXECUTIVE', 'MANAGER', 'IT_ADMIN', 'EMPLOYEE']);
  }, [hasAnyRole, isSuperAdmin]);

  if (!canAccessRecruitment) {
    return null;
  }

  // Active state logic: Matches /recruitment and all sub-routes, or when activeTab is recruitment
  const isRecruitmentActive =
    activeTab === 'recruitment' ||
    location.pathname.startsWith('/recruitment') ||
    location.pathname === '/dashboard/recruitment';

  const handleClick = () => {
    if (typeof onTabChange === 'function') {
      onTabChange('recruitment');
    }
    if (typeof onMobileClose === 'function') {
      onMobileClose();
    }
  };

  const badgeDisplay = totalAlertsCount > 99 ? '99+' : String(totalAlertsCount);

  // Collapsed Mode: Single icon button with tooltip
  if (collapsed) {
    return (
      <NavLink
        to="/recruitment/dashboard"
        onClick={handleClick}
        title="Talent & Recruitment"
        aria-label="Talent & Recruitment"
        className={({ isActive: navActive }) => `
          relative flex items-center justify-center px-3 py-2.5 rounded-lg transition-colors duration-150
          ${navActive || isRecruitmentActive
            ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 font-semibold'
            : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-zinc-100'
          }
        `}
      >
        <Briefcase className="w-[18px] h-[18px] flex-shrink-0" />
        {totalAlertsCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-teal-500 text-white text-[10px] flex items-center justify-center font-medium shadow-sm">
            {badgeDisplay}
          </span>
        )}
        {badgesLoading && (
          <Skeleton className="absolute -top-1 -right-1 w-5 h-5 rounded-full" />
        )}
      </NavLink>
    );
  }

  // Expanded Mode: Single standard sidebar NavLink item
  return (
    <NavLink
      to="/recruitment/dashboard"
      onClick={handleClick}
      className={({ isActive: navActive }) => `
        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 text-left
        ${navActive || isRecruitmentActive
          ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 font-semibold'
          : 'text-slate-600 dark:text-zinc-400 bg-transparent hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-zinc-100'
        }
      `}
    >
      <Briefcase className="w-[18px] h-[18px] flex-shrink-0" />
      <span className="truncate flex-1">Talent & Recruitment</span>
      {totalAlertsCount > 0 && (
        <Badge
          variant="brand"
          size="sm"
          className="shrink-0 bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300 border-teal-200 dark:border-teal-800"
        >
          {badgeDisplay}
        </Badge>
      )}
      {badgesLoading && (
        <Skeleton className="w-5 h-5 rounded-full shrink-0" />
      )}
    </NavLink>
  );
};

export default RecruitmentSidebarSection;
