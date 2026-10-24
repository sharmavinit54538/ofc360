/**
 * @file dashboard.attendance.rosters.tsx
 * @description Dedicated route component for Rosters management.
 * Integrates RostersView with the enterprise DashboardShell layout.
 */

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardShell } from '@/shared/layout/DashboardShell';
import { DashboardSidebar } from '@/features/dashboard/components/DashboardSidebar';
import { RostersView } from '@/features/dashboard/components/views/RostersView';

export const DashboardAttendanceRostersRoute: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  const handleTabChange = useCallback(
    (tabId: string) => {
      if (tabId === 'attendance-rosters' || tabId === 'rosters') return;
      navigate(`/dashboard/hr-admin#${tabId}`);
    },
    [navigate]
  );

  return (
    <DashboardShell
      sidebar={
        <DashboardSidebar
          activeTab="attendance-rosters"
          onTabChange={handleTabChange}
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
        />
      }
      sidebarCollapsed={sidebarCollapsed}
      onSidebarToggle={toggleSidebar}
      fullWidth
    >
      <RostersView />
    </DashboardShell>
  );
};

export default DashboardAttendanceRostersRoute;
