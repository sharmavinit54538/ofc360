import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardShell } from '@/shared/layout/DashboardShell';
import { DashboardSidebar } from '@/features/dashboard/components/DashboardSidebar';
import { TalentHubPage } from '@/features/talent/pages/TalentHubPage';

export const DashboardTalentRoute: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  const handleTabChange = useCallback(
    (tabId: string) => {
      navigate(`/dashboard/hr-admin#${tabId}`);
    },
    [navigate]
  );

  return (
    <DashboardShell
      sidebar={
        <DashboardSidebar
          activeTab="talent"
          onTabChange={handleTabChange}
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
        />
      }
      sidebarCollapsed={sidebarCollapsed}
      onSidebarToggle={toggleSidebar}
      fullWidth
    >
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <TalentHubPage />
      </div>
    </DashboardShell>
  );
};

export default DashboardTalentRoute;
