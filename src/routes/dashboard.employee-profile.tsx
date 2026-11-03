/**
 * @file dashboard.employee-profile.tsx
 * @description Dedicated route component for 360 Employee Profile View.
 * Integrates EmployeeProfilePage with the enterprise DashboardShell layout.
 */

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardShell } from '@/shared/layout/DashboardShell';
import { DashboardSidebar } from '@/features/dashboard/components/DashboardSidebar';
import { EmployeeProfilePage } from '@/features/workforce/pages/EmployeeProfilePage';
import { useAuth } from '@/features/auth/hooks/useAuth';

export const DashboardEmployeeProfileRoute: React.FC = () => {
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
          activeTab="workforce"
          onTabChange={handleTabChange}
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
        />
      }
      sidebarCollapsed={sidebarCollapsed}
      onSidebarToggle={toggleSidebar}
      fullWidth
    >
      <EmployeeProfilePage />
    </DashboardShell>
  );
};

export default DashboardEmployeeProfileRoute;

