/**
 * @file dashboard.recruitment.tsx
 * @description Dedicated route component for OFC360 Recruitment Dashboard.
 * Integrates RecruitmentDashboardPage with the enterprise DashboardShell layout and DashboardSidebar.
 */

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardShell } from '@/shared/layout/DashboardShell';
import { DashboardSidebar } from '@/features/dashboard/components/DashboardSidebar';
import { RecruitmentDashboardPage } from '@/features/recruitment/pages/RecruitmentDashboardPage';
import { useAuth } from '@/features/auth/hooks/useAuth';

export const DashboardRecruitmentRoute: React.FC = () => {
  const navigate = useNavigate();
  const { role, activeRole } = useAuth();
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
      fullWidth
    >
      <RecruitmentDashboardPage />
    </DashboardShell>
  );
};

export default DashboardRecruitmentRoute;

