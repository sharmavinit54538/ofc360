import React, { useState, useMemo } from 'react';
import { ChevronDown, Briefcase } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { Badge } from '@/shared/ui/Badge';
import { Skeleton } from '@/shared/ui/Skeleton';
import { useGetSidebarBadgesQuery } from '@/features/recruitment/api';
import { useRBAC } from '@/features/auth/hooks/useRBAC';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { User } from '@/features/auth/types/auth.types';
import {
  LayoutDashboard,
  FileText,
  Users,
  CalendarDays,
  Award,
  ShieldCheck,
  BarChart3,
  FilePlus,
  UserCheck,
  CheckSquare,
  FileCheck,
  Laptop,
  HardDrive,
  Compass,
  Gift,
  ClipboardList,
} from 'lucide-react';

interface RecruitmentSidebarSectionProps {
  collapsed: boolean;
  onTabChange?: (tabId: string) => void;
  onMobileClose?: () => void;
}

interface RecruitmentTabConfig {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  group: string;
  section: string;
  path?: string;
  roles?: string[];
  badgeKey?: string;
  badgeVariant?: 'default' | 'destructive';
  condition?: (user: User | null) => boolean;
}

export const RecruitmentSidebarSection: React.FC<RecruitmentSidebarSectionProps> = ({
  collapsed,
  onTabChange,
  onMobileClose,
}) => {
  const location = useLocation();
  const { hasAnyRole, isSuperAdmin } = useRBAC();
  const { user } = useAuth();

  const { data: badges, isLoading: badgesLoading } = useGetSidebarBadgesQuery(undefined, {
    pollingInterval: 60000,
  });

  const [expanded, setExpanded] = useState(true);

  const recruitmentTabs = useMemo((): RecruitmentTabConfig[] => {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      'recruitment-dashboard': LayoutDashboard,
      'recruitment-requisitions': FileText,
      'recruitment-jobs': Briefcase,
      'recruitment-candidates': Users,
      'recruitment-interviews': CalendarDays,
      'recruitment-offers': Award,
      'recruitment-bgv': ShieldCheck,
      'recruitment-reports': BarChart3,
      'manager-requisitions': FilePlus,
      'manager-candidates': UserCheck,
      'manager-interviews': CheckSquare,
      'manager-offers': FileCheck,
      'itadmin-onboarding': Laptop,
      'itadmin-assets': HardDrive,
      'employee-careers': Compass,
      'employee-referrals': Gift,
      'employee-interviews': ClipboardList,
    };

    const tabs: RecruitmentTabConfig[] = [
      // GROUP A: HR_ADMIN & HR_EXECUTIVE (8 Tabs)
      {
        id: 'recruitment-dashboard',
        label: 'Overview Dashboard',
        icon: iconMap['recruitment-dashboard'],
        group: 'recruitment',
        section: 'recruitment',
        path: '/recruitment/dashboard',
        roles: ['HR_ADMIN', 'HR_EXECUTIVE'],
      },
      {
        id: 'recruitment-requisitions',
        label: 'Job Requisitions',
        icon: iconMap['recruitment-requisitions'],
        group: 'recruitment',
        section: 'recruitment',
        path: '/recruitment/requisitions',
        roles: ['HR_ADMIN', 'HR_EXECUTIVE'],
        badgeKey: 'pending_req_approvals_count',
        badgeVariant: 'default',
      },
      {
        id: 'recruitment-jobs',
        label: 'Job Openings',
        icon: iconMap['recruitment-jobs'],
        group: 'recruitment',
        section: 'recruitment',
        path: '/recruitment/jobs',
        roles: ['HR_ADMIN', 'HR_EXECUTIVE'],
        badgeKey: 'active_openings_count',
        badgeVariant: 'default',
      },
      {
        id: 'recruitment-candidates',
        label: 'Candidates & ATS',
        icon: iconMap['recruitment-candidates'],
        group: 'recruitment',
        section: 'recruitment',
        path: '/recruitment/candidates',
        roles: ['HR_ADMIN', 'HR_EXECUTIVE'],
        badgeKey: 'new_applications_count',
        badgeVariant: 'default',
      },
      {
        id: 'recruitment-interviews',
        label: 'Interview Scheduler',
        icon: iconMap['recruitment-interviews'],
        group: 'recruitment',
        section: 'recruitment',
        path: '/recruitment/interviews',
        roles: ['HR_ADMIN', 'HR_EXECUTIVE'],
        badgeKey: 'today_interviews_count',
        badgeVariant: 'default',
      },
      {
        id: 'recruitment-offers',
        label: 'Offer Management',
        icon: iconMap['recruitment-offers'],
        group: 'recruitment',
        section: 'recruitment',
        path: '/recruitment/offers',
        roles: ['HR_ADMIN', 'HR_EXECUTIVE'],
        badgeKey: 'pending_offer_approvals_count',
        badgeVariant: 'default',
      },
      {
        id: 'recruitment-bgv',
        label: 'BGV Management',
        icon: iconMap['recruitment-bgv'],
        group: 'recruitment',
        section: 'recruitment',
        path: '/recruitment/bgv',
        roles: ['HR_ADMIN', 'HR_EXECUTIVE'],
        badgeKey: 'bgv_discrepancy_alerts_count',
        badgeVariant: 'destructive',
      },
      {
        id: 'recruitment-reports',
        label: 'Recruitment Reports',
        icon: iconMap['recruitment-reports'],
        group: 'recruitment',
        section: 'recruitment',
        path: '/recruitment/reports',
        roles: ['HR_ADMIN', 'HR_EXECUTIVE'],
      },

      // GROUP B: MANAGER (4 Tabs)
      {
        id: 'manager-requisitions',
        label: 'Team Requisitions',
        icon: iconMap['manager-requisitions'],
        group: 'recruitment',
        section: 'recruitment',
        path: '/manager/requisitions',
        roles: ['MANAGER'],
        badgeKey: 'my_open_vacancies_count',
        badgeVariant: 'default',
      },
      {
        id: 'manager-candidates',
        label: 'Candidate Reviews',
        icon: iconMap['manager-candidates'],
        group: 'recruitment',
        section: 'recruitment',
        path: '/manager/candidates',
        roles: ['MANAGER'],
        badgeKey: 'pending_profile_reviews_count',
        badgeVariant: 'default',
      },
      {
        id: 'manager-interviews',
        label: 'Panel Interviews',
        icon: iconMap['manager-interviews'],
        group: 'recruitment',
        section: 'recruitment',
        path: '/manager/interviews',
        roles: ['MANAGER'],
        badgeKey: 'overdue_scorecards_count',
        badgeVariant: 'destructive',
      },
      {
        id: 'manager-offers',
        label: 'Offer Approvals',
        icon: iconMap['manager-offers'],
        group: 'recruitment',
        section: 'recruitment',
        path: '/manager/offers',
        roles: ['MANAGER'],
        badgeKey: 'pending_my_offer_approvals_count',
        badgeVariant: 'default',
      },

      // GROUP C: IT_ADMIN (2 Tabs)
      {
        id: 'itadmin-onboarding',
        label: 'Onboarding IT Queue',
        icon: iconMap['itadmin-onboarding'],
        group: 'recruitment',
        section: 'recruitment',
        path: '/it-admin/onboarding-queue',
        roles: ['IT_ADMIN'],
        badgeKey: 'pending_it_provisioning_count',
        badgeVariant: 'default',
      },
      {
        id: 'itadmin-assets',
        label: 'Asset Allocation',
        icon: iconMap['itadmin-assets'],
        group: 'recruitment',
        section: 'recruitment',
        path: '/it-admin/assets',
        roles: ['IT_ADMIN'],
      },

      // GROUP D: EMPLOYEE (3 Tabs)
      {
        id: 'employee-careers',
        label: 'Internal Careers (IJP)',
        icon: iconMap['employee-careers'],
        group: 'recruitment',
        section: 'recruitment',
        path: '/careers/internal',
        roles: ['EMPLOYEE'],
      },
      {
        id: 'employee-referrals',
        label: 'My Referrals',
        icon: iconMap['employee-referrals'],
        group: 'recruitment',
        section: 'recruitment',
        path: '/employee/referrals',
        roles: ['EMPLOYEE'],
        badgeKey: 'active_referral_updates_count',
        badgeVariant: 'default',
      },
      {
        id: 'employee-interviews',
        label: 'Assigned Interviews',
        icon: iconMap['employee-interviews'],
        group: 'recruitment',
        section: 'recruitment',
        path: '/employee/interviews',
        roles: ['EMPLOYEE'],
        badgeKey: 'pending_scorecards_count',
        badgeVariant: 'default',
        condition: (u) => Boolean(u?.has_assigned_interviews),
      },
    ];

    return tabs.map((tab) => ({
      ...tab,
      icon: iconMap[tab.id],
    }));
  }, []);

  const visibleTabs = useMemo(() => {
    return recruitmentTabs.filter((tab) => {
      if (!tab.roles || tab.roles.length === 0) return true;
      if (isSuperAdmin) return true;
      if (!hasAnyRole(tab.roles)) return false;
      if (tab.condition && !tab.condition(user)) return false;
      return true;
    });
  }, [hasAnyRole, isSuperAdmin, user]);

  const getBadgeCount = (tab: RecruitmentTabConfig): number | undefined => {
    if (!tab.badgeKey || !badges) return undefined;
    return badges[tab.badgeKey as keyof typeof badges];
  };

  const isTabActive = (tab: RecruitmentTabConfig): boolean => {
    if (!tab.path) return false;
    return location.pathname === tab.path;
  };

  const renderTabItem = (tab: RecruitmentTabConfig) => {
    const isActive = isTabActive(tab);
    const badgeCount = getBadgeCount(tab);
    const showBadge = badgeCount !== undefined && badgeCount > 0;
    const badgeLoading = badgesLoading && tab.badgeKey;
    const Icon = tab.icon;

    if (collapsed) {
      if (tab.path) {
        return (
          <NavLink
            key={tab.id}
            to={tab.path}
            onClick={() => {
              onTabChange?.(tab.id);
              onMobileClose?.();
            }}
            title={tab.label}
            className={({ isActive: navActive }) => `
              relative flex items-center justify-center px-3 py-2.5 rounded-lg transition-colors duration-150
              ${navActive || isActive
                ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white'
                : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-zinc-100'
              }
            `}
          >
            <Icon className="w-[18px] h-[18px] flex-shrink-0" />
            {showBadge && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-500 text-white text-[10px] flex items-center justify-center">
                {badgeCount > 99 ? '99+' : badgeCount}
              </span>
            )}
            {badgeLoading && (
              <Skeleton className="absolute -top-1 -right-1 w-5 h-5 rounded-full" />
            )}
          </NavLink>
        );
      }
      return (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={isActive}
          aria-label={tab.label}
          onClick={() => {
            onTabChange?.(tab.id);
            onMobileClose?.();
          }}
          className={`
            relative flex items-center justify-center px-3 py-2.5 rounded-lg transition-colors duration-150
            ${isActive
              ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white'
              : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-zinc-100'
            }
          `}
          title={tab.label}
        >
          <Icon className="w-[18px] h-[18px] flex-shrink-0" />
          {showBadge && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-500 text-white text-[10px] flex items-center justify-center">
              {badgeCount > 99 ? '99+' : badgeCount}
            </span>
          )}
          {badgeLoading && (
            <Skeleton className="absolute -top-1 -right-1 w-5 h-5 rounded-full" />
          )}
        </button>
      );
    }

    return (
      <NavLink
        key={tab.id}
        to={tab.path || '#'}
        onClick={() => {
          onTabChange?.(tab.id);
          onMobileClose?.();
        }}
        className={({ isActive: navActive }) => `
          w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 text-left
          ${navActive || isActive
            ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white font-semibold'
            : 'text-slate-600 dark:text-zinc-400 bg-transparent hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-zinc-100'
          }
        `}
      >
        <Icon className="w-[18px] h-[18px] flex-shrink-0" />
        <span className="truncate flex-1">{tab.label}</span>
        {showBadge && (
          <Badge variant={tab.badgeVariant === 'destructive' ? 'destructive' : 'brand'} size="sm" className="shrink-0">
            {badgeCount > 99 ? '99+' : badgeCount}
          </Badge>
        )}
        {badgeLoading && (
          <Skeleton className="w-5 h-5 rounded-full shrink-0" />
        )}
      </NavLink>
    );
  };

  if (visibleTabs.length === 0) return null;

  const handleToggle = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <div className="flex flex-col gap-1">
      {!collapsed && (
        <button
          type="button"
          onClick={handleToggle}
          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider hover:text-slate-700 dark:hover:text-zinc-200 transition-colors"
          aria-expanded={expanded}
        >
          <Briefcase className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1 truncate">TALENT & RECRUITMENT</span>
          <ChevronDown
            className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          />
        </button>
      )}

      <div className={`flex flex-col gap-1 ${!collapsed && !expanded ? 'hidden' : ''}`}>
        {visibleTabs.map((tab) => renderTabItem(tab))}
      </div>
    </div>
  );
};

export default RecruitmentSidebarSection;