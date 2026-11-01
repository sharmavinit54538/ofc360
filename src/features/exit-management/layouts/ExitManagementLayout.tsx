import React, { Suspense } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';
import {
  LayoutDashboard,
  UserMinus,
  CheckSquare,
  Calendar,
  FileCheck,
  Box,
  ShieldCheck,
  CreditCard,
  MessageSquare,
  FileText,
  UserX,
  History,
  BarChart3,
  Settings,
} from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { UserRole } from '@/features/auth/types/auth.types';

export interface ExitNavigationTab {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  allowedRoles: UserRole[];
  badge?: string;
}

export const EXIT_NAV_TABS: ExitNavigationTab[] = [
  {
    id: 'overview',
    label: 'Overview',
    path: '/dashboard/exit-management/overview',
    icon: LayoutDashboard,
    allowedRoles: ['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'IT_ADMIN'],
  },
  {
    id: 'my-exit',
    label: 'My Exit',
    path: '/dashboard/exit-management/my-exit',
    icon: UserMinus,
    allowedRoles: ['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN'],
  },
  {
    id: 'approvals',
    label: 'Approvals',
    path: '/dashboard/exit-management/approvals',
    icon: CheckSquare,
    allowedRoles: ['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER'],
  },
  {
    id: 'notice-period',
    label: 'Notice Period',
    path: '/dashboard/exit-management/notice-period',
    icon: Calendar,
    allowedRoles: ['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER'],
  },
  {
    id: 'knowledge-transfer',
    label: 'Knowledge Transfer',
    path: '/dashboard/exit-management/knowledge-transfer',
    icon: FileCheck,
    allowedRoles: ['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER'],
  },
  {
    id: 'asset-recovery',
    label: 'Asset Recovery',
    path: '/dashboard/exit-management/asset-recovery',
    icon: Box,
    allowedRoles: ['SUPER_ADMIN', 'HR_ADMIN', 'IT_ADMIN'],
  },
  {
    id: 'clearance',
    label: 'Department Clearance',
    path: '/dashboard/exit-management/clearance',
    icon: ShieldCheck,
    allowedRoles: ['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'IT_ADMIN'],
  },
  {
    id: 'fnf',
    label: 'Full & Final',
    path: '/dashboard/exit-management/fnf',
    icon: CreditCard,
    allowedRoles: ['SUPER_ADMIN', 'HR_ADMIN'],
  },
  {
    id: 'interview',
    label: 'Exit Interview',
    path: '/dashboard/exit-management/interview',
    icon: MessageSquare,
    allowedRoles: ['SUPER_ADMIN', 'HR_ADMIN'], // Manager strictly disallowed
  },
  {
    id: 'documents',
    label: 'Exit Documents',
    path: '/dashboard/exit-management/documents',
    icon: FileText,
    allowedRoles: ['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER'],
  },
  {
    id: 'access-deactivation',
    label: 'Access Revocation',
    path: '/dashboard/exit-management/access-deactivation',
    icon: UserX,
    allowedRoles: ['SUPER_ADMIN', 'HR_ADMIN', 'IT_ADMIN'],
  },
  {
    id: 'exited-employees',
    label: 'Exited Employees',
    path: '/dashboard/exit-management/exited-employees',
    icon: History,
    allowedRoles: ['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'IT_ADMIN'],
  },
  {
    id: 'analytics',
    label: 'Exit Analytics',
    path: '/dashboard/exit-management/analytics',
    icon: BarChart3,
    allowedRoles: ['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER'],
  },
  {
    id: 'settings',
    label: 'Exit Settings',
    path: '/dashboard/exit-management/settings',
    icon: Settings,
    allowedRoles: ['SUPER_ADMIN', 'HR_ADMIN'],
  },
];

export const ExitManagementLayout: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const userRole = (user?.role || 'EMPLOYEE') as UserRole;

  // Filter tabs by active user role
  const visibleTabs = EXIT_NAV_TABS.filter((tab) =>
    tab.allowedRoles.includes(userRole)
  );

  return (
    <div className="space-y-6">
      {/* Sub-Navigation Tabs */}
      <nav
        aria-label="Exit Management Sub-Navigation"
        className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-gray-100 dark:border-zinc-800/80 no-scrollbar"
      >
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          const isOverview = tab.id === 'overview';
          const isActive =
            location.pathname === tab.path ||
            (isOverview && location.pathname === '/dashboard/exit-management');

          return (
            <NavLink
              key={tab.id}
              to={tab.path}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/30 font-semibold shadow-xs'
                  : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 hover:bg-gray-100/80 dark:hover:bg-zinc-800/60 border border-transparent'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-brand-500 text-white font-bold">
                  {tab.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Page Content with Error Boundary & Skeleton Fallback */}
      <ErrorBoundary title="Exit Management Tab Error" message="An error occurred while loading this section.">
        <Suspense
          fallback={
            <div className="p-8 space-y-4">
              <div className="flex items-center justify-center space-y-3">
                <div className="w-10 h-10 border-3 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
                <span className="text-sm font-medium text-gray-500 dark:text-zinc-400">Loading exit management...</span>
              </div>
              <div className="h-32 w-full bg-gray-100 dark:bg-zinc-900 rounded-2xl animate-pulse" />
              <div className="h-64 w-full bg-gray-100 dark:bg-zinc-900 rounded-2xl animate-pulse" />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default ExitManagementLayout;

