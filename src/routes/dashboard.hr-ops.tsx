/**
 * @file dashboard.hr-ops.tsx
 * @description Dedicated route component for HR Operations Command Center.
 * Integrates HrOpsPage with the enterprise DashboardShell layout.
 */

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardShell } from '@/shared/layout/DashboardShell';
import { DashboardSidebar } from '@/features/dashboard/components/DashboardSidebar';
import { HrOpsPage } from '@/features/hr-ops/pages/HrOpsPage';

export const DashboardHrOpsRoute: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  const handleTabChange = useCallback(
    (tabId: string) => {
      // If clicking another tab from sidebar, navigate back to HR dashboard with hash
      navigate(`/dashboard/hr-admin#${tabId}`);
    },
    [navigate]
  );

  return (
    <DashboardShell
      sidebar={
        <DashboardSidebar
          activeTab="hrops-dashboard"
          onTabChange={handleTabChange}
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
        />
      }
      sidebarCollapsed={sidebarCollapsed}
      onSidebarToggle={toggleSidebar}
    >
      <HrOpsPage />
    </DashboardShell>
  );
};

export default DashboardHrOpsRoute;
