import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardShell } from '@/shared/layout/DashboardShell';
import { DashboardSidebar } from '@/features/dashboard/components/DashboardSidebar';
import { Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { UserRole } from '@/features/auth/types/auth.types';

interface RecruitmentPlaceholderPageProps {
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
  description?: string;
}

export const RecruitmentPlaceholderPage: React.FC<RecruitmentPlaceholderPageProps> = ({
  title,
  subtitle,
  icon: Icon,
  roles,
  description,
}) => {
  const navigate = useNavigate();
  const { user, role, activeRole } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  const effectiveRole = (activeRole || role || 'HR_ADMIN').toUpperCase();

  const handleTabChange = useCallback(
    (tabId: string) => {
      if (effectiveRole === 'SUPER_ADMIN') {
        navigate(`/dashboard/super-admin#${tabId}`);
      } else if (effectiveRole === 'MANAGER') {
        navigate(`/dashboard/manager#${tabId}`);
      } else {
        navigate(`/dashboard/hr-admin#${tabId}`);
      }
    },
    [navigate, effectiveRole]
  );

  return (
    <DashboardShell
      title={title}
      subtitle={subtitle}
      sidebar={
        <DashboardSidebar
          activeTab="recruitment"
          onTabChange={handleTabChange}
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
        />
      }
      sidebarCollapsed={sidebarCollapsed}
      onSidebarToggle={toggleSidebar}
    >
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-500/10 flex items-center justify-center">
              <Icon className="w-7 h-7 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
              <p className="text-gray-500 dark:text-zinc-400 mt-1">{description || `Manage ${subtitle.toLowerCase()} for your organization.`}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Access Control</h3>
          <div className="flex flex-wrap gap-2">
            {roles.map((role) => (
              <Badge
                key={role}
                variant="outline"
                role={role}
                size="sm"
                className={activeRole === role ? 'ring-2 ring-brand-500' : ''}
              >
                {role}
              </Badge>
            ))}
            <Badge variant="brand" size="sm">
              Current: {activeRole || 'Unknown'}
            </Badge>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">User Context</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500 dark:text-zinc-400">Name</p>
              <p className="font-medium text-gray-900 dark:text-white">{user?.fullName || 'Not available'}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-zinc-400">Email</p>
              <p className="font-medium text-gray-900 dark:text-white">{user?.email || 'Not available'}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-zinc-400">Active Role</p>
              <p className="font-medium text-gray-900 dark:text-white">{activeRole || 'Not available'}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-amber-200 dark:border-amber-900/30 bg-amber-50 dark:bg-amber-950/20">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Page Under Development</p>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                This recruitment module page is a placeholder. Full implementation including data fetching,
                real-time badges, and interactive features will be completed in subsequent phases.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
};

export default RecruitmentPlaceholderPage;