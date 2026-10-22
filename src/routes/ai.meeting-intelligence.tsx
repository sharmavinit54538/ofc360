/**
 * @file ai.meeting-intelligence.tsx
 * @description Dedicated route component for AI Meeting Intelligence.
 * Integrates MeetingIntelligencePage with the enterprise DashboardShell layout.
 */

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardShell } from '@/shared/layout/DashboardShell';
import { DashboardSidebar } from '@/features/dashboard/components/DashboardSidebar';
import { MeetingIntelligencePage } from '@/features/meeting-intelligence/pages/MeetingIntelligencePage';

export const AIMeetingIntelligenceRoute: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  const handleTabChange = useCallback(
    (tabId: string) => {
      if (tabId === 'meeting-intelligence') return;
      navigate(`/dashboard/hr-admin#${tabId}`);
    },
    [navigate]
  );

  return (
    <DashboardShell
      sidebar={
        <DashboardSidebar
          activeTab="meeting-intelligence"
          onTabChange={handleTabChange}
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
        />
      }
      sidebarCollapsed={sidebarCollapsed}
      onSidebarToggle={toggleSidebar}
    >
      <MeetingIntelligencePage />
    </DashboardShell>
  );
};

export default AIMeetingIntelligenceRoute;
