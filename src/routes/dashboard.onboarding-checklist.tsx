/**
 * @file dashboard.onboarding-checklist.tsx
 * @description Dedicated route component for New Hire Onboarding Checklist.
 * Integrates OnboardingChecklistPage with the enterprise DashboardShell layout.
 */

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardShell } from '@/shared/layout/DashboardShell';
import { DashboardSidebar } from '@/features/dashboard/components/DashboardSidebar';
import { OnboardingChecklistPage } from '@/features/employee-onboarding/pages/OnboardingChecklistPage';

export const DashboardOnboardingChecklistRoute: React.FC = () => {
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
          activeTab="onboarding-checklist"
          onTabChange={handleTabChange}
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
        />
      }
      sidebarCollapsed={sidebarCollapsed}
      onSidebarToggle={toggleSidebar}
    >
      <OnboardingChecklistPage />
    </DashboardShell>
  );
};

export default DashboardOnboardingChecklistRoute;
