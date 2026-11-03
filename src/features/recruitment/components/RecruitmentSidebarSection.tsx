import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  Briefcase,
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
import { NavLink, useLocation } from 'react-router-dom';
import { Badge } from '@/shared/ui/Badge';
import { Skeleton } from '@/shared/ui/Skeleton';
import { useGetSidebarBadgesQuery } from '@/features/recruitment/api';
import { useRBAC } from '@/features/auth/hooks/useRBAC';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { User } from '@/features/auth/types/auth.types';

export interface RecruitmentSidebarSectionProps {
  collapsed?: boolean;
  onTabChange?: (tabId: string) => void;
  onMobileClose?: () => void;
}

export interface RecruitmentTabConfig {
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

const FallbackIcon: React.ComponentType<{ className?: string }> = Briefcase;

const isValidComponent = (comp: unknown): comp is React.ComponentType<{ className?: string }> => {
  return typeof comp === 'function' || (typeof comp === 'object' && comp !== null && '$$typeof' in comp);
};

export const RecruitmentSidebarSection: React.FC<RecruitmentSidebarSectionProps> = ({
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

  const { data: badges, isLoading: badgesLoading } = useGetSidebarBadgesQuery(undefined, {
    pollingInterval: 60000,
    skip: !user,
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
        icon: iconMap['recruitment-dashboard'] || FallbackIcon,
        group: 'recruitment',
        section: 'recruitment',
        path: '/recruitment/dashboard',
        roles: ['HR_ADMIN', 'HR_EXECUTIVE'],
      },
      {
        id: 'recruitment-requisitions',
        label: 'Job Requisitions',
        icon: iconMap['recruitment-requisitions'] || FallbackIcon,
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
        icon: iconMap['recruitment-jobs'] || FallbackIcon,
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
        icon: iconMap['recruitment-candidates'] || FallbackIcon,
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
        icon: iconMap['recruitment-interviews'] || FallbackIcon,
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
        icon: iconMap['recruitment-offers'] || FallbackIcon,
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
        icon: iconMap['recruitment-bgv'] || FallbackIcon,
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
        icon: iconMap['recruitment-reports'] || FallbackIcon,
        group: 'recruitment',
        section: 'recruitment',
        path: '/recruitment/reports',
        roles: ['HR_ADMIN', 'HR_EXECUTIVE'],
      },

      // GROUP B: MANAGER (4 Tabs)
      {
        id: 'manager-requisitions',
        label: 'Team Requisitions',
        icon: iconMap['manager-requisitions'] || FallbackIcon,
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
        icon: iconMap['manager-candidates'] || FallbackIcon,
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
        icon: iconMap['manager-interviews'] || FallbackIcon,
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
        icon: iconMap['manager-offers'] || FallbackIcon,
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
        icon: iconMap['itadmin-onboarding'] || FallbackIcon,
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
        icon: iconMap['itadmin-assets'] || FallbackIcon,
        group: 'recruitment',
        section: 'recruitment',
        path: '/it-admin/assets',
        roles: ['IT_ADMIN'],
      },

      // GROUP D: EMPLOYEE (3 Tabs)
      {
        id: 'employee-careers',
        label: 'Internal Careers (IJP)',
        icon: iconMap['employee-careers'] || FallbackIcon,
        group: 'recruitment',
        section: 'recruitment',
        path: '/careers/internal',
        roles: ['EMPLOYEE'],
      },
      {
        id: 'employee-referrals',
        label: 'My Referrals',
        icon: iconMap['employee-referrals'] || FallbackIcon,
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
        icon: iconMap['employee-interviews'] || FallbackIcon,
        group: 'recruitment',
        section: 'recruitment',
        path: '/employee/interviews',
        roles: ['EMPLOYEE'],
        badgeKey: 'pending_scorecards_count',
        badgeVariant: 'default',
        condition: (u) => Boolean(u && typeof u === 'object' && (u as { has_assigned_interviews?: boolean }).has_assigned_interviews),
      },
    ];

    return tabs.map((tab) => ({
      ...tab,
      icon: (iconMap[tab.id] && isValidComponent(iconMap[tab.id])) ? iconMap[tab.id] : FallbackIcon,
    }));
  }, []);

  const visibleTabs = useMemo(() => {
    return recruitmentTabs.filter((tab) => {
      if (!tab) return false;
      if (!tab.roles || !Array.isArray(tab.roles) || tab.roles.length === 0) return true;
      if (isSuperAdmin) return true;
      if (typeof hasAnyRole === 'function' && !hasAnyRole(tab.roles)) return false;
      if (tab.condition) {
        try {
          if (typeof tab.condition === 'function' && !tab.condition(user)) {
            return false;
          }
        } catch {
          return false;
        }
      }
      return true;
    });
  }, [hasAnyRole, isSuperAdmin, user, recruitmentTabs]);

  const getBadgeCount = (tab: RecruitmentTabConfig): number | undefined => {
    if (!tab?.badgeKey || !badges || typeof badges !== 'object') return undefined;
    const rawValue = (badges as Record<string, unknown>)[tab.badgeKey];
    if (typeof rawValue === 'number' && !Number.isNaN(rawValue) && Number.isFinite(rawValue)) {
      return rawValue;
    }
    if (typeof rawValue === 'string') {
      const parsed = parseInt(rawValue, 10);
      return Number.isNaN(parsed) ? undefined : parsed;
    }
    if (rawValue && typeof rawValue === 'object') {
      const nested = (rawValue as Record<string, unknown>).count ?? (rawValue as Record<string, unknown>).value;
      if (typeof nested === 'number' && !Number.isNaN(nested) && Number.isFinite(nested)) {
        return nested;
      }
      if (typeof nested === 'string') {
        const parsed = parseInt(nested, 10);
        return Number.isNaN(parsed) ? undefined : parsed;
      }
    }
    return undefined;
  };

  const isTabActive = (tab: RecruitmentTabConfig): boolean => {
    if (!tab?.path || !location?.pathname) return false;
    return location.pathname === tab.path || location.pathname.startsWith(`${tab.path}/`);
  };

  const renderTabItem = (tab: RecruitmentTabConfig) => {
    const isActive = isTabActive(tab);
    const badgeCount = getBadgeCount(tab);
    const showBadge = typeof badgeCount === 'number' && badgeCount > 0;
    const badgeLoading = Boolean(badgesLoading && tab?.badgeKey);
    const IconComponent = isValidComponent(tab?.icon) ? tab.icon : FallbackIcon;
    const badgeDisplay = typeof badgeCount === 'number' ? (badgeCount > 99 ? '99+' : String(badgeCount)) : '';

    if (collapsed) {
      if (tab.path) {
        return (
          <NavLink
            key={tab.id}
            to={tab.path}
            onClick={() => {
              if (typeof onTabChange === 'function') onTabChange(tab.id);
              if (typeof onMobileClose === 'function') onMobileClose();
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
            <IconComponent className="w-[18px] h-[18px] flex-shrink-0" />
            {showBadge && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-500 text-white text-[10px] flex items-center justify-center font-medium">
                {badgeDisplay}
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
            if (typeof onTabChange === 'function') onTabChange(tab.id);
            if (typeof onMobileClose === 'function') onMobileClose();
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
          <IconComponent className="w-[18px] h-[18px] flex-shrink-0" />
          {showBadge && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-500 text-white text-[10px] flex items-center justify-center font-medium">
              {badgeDisplay}
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
          if (typeof onTabChange === 'function') onTabChange(tab.id);
          if (typeof onMobileClose === 'function') onMobileClose();
        }}
        className={({ isActive: navActive }) => `
          w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 text-left
          ${navActive || isActive
            ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white font-semibold'
            : 'text-slate-600 dark:text-zinc-400 bg-transparent hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-zinc-100'
          }
        `}
      >
        <IconComponent className="w-[18px] h-[18px] flex-shrink-0" />
        <span className="truncate flex-1">{tab.label}</span>
        {showBadge && (
          <Badge variant={tab.badgeVariant === 'destructive' ? 'destructive' : 'brand'} size="sm" className="shrink-0">
            {badgeDisplay}
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
          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider hover:text-slate-700 dark:hover:text-zinc-200 transition-colors w-full text-left"
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
