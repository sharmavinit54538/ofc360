import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardShell } from '@/shared/layout/DashboardShell';
import { DashboardSidebar } from '@/features/dashboard/components/DashboardSidebar';
import { PayrollHubPage } from '@/features/payroll/pages/PayrollHubPage';

export const DashboardPayrollRoute: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((previous) => !previous);
  }, []);

  const handleTabChange = useCallback((tabId: string) => {
    navigate(`/dashboard/hr-admin#${tabId}`);
  }, [navigate]);

  return (
    <DashboardShell
      sidebar={
        <DashboardSidebar
          activeTab="payroll"
          onTabChange={handleTabChange}
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
        />
      }
      sidebarCollapsed={sidebarCollapsed}
      onSidebarToggle={toggleSidebar}
    >
      <div className="p-4 md:p-6 lg:p-8 max-w-[1500px] mx-auto w-full">
        <PayrollHubPage />
      </div>
    </DashboardShell>
  );
};

export default DashboardPayrollRoute;
