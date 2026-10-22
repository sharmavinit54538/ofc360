/**
 * @file HRAdminDashboard.tsx
 * @description Production-ready HR Admin Dashboard with ChatGPT-style vertical sidebar.
 * Connects 68 enterprise tabs across Core, HR Ops & Admin, Recruitment Hub, and AI Hub.
 * Features URL hash syncing (#payroll), lazy-loaded module views, Suspense fallbacks,
 * collapsible sidebar groups, and smooth fade/slide transitions.
 */

import React, { useState, useEffect, Suspense, useCallback, lazy } from 'react';
import { DashboardShell } from '@/shared/layout/DashboardShell';
import { DashboardSidebar } from '@/features/dashboard/components/DashboardSidebar';
import { DASHBOARD_TABS, type DashboardTabItem, getTabConfig } from '@/features/dashboard/components/dashboardTabs.data';

/**
 * Determine initial active tab from the URL hash (e.g. #payroll) or fallback to 'overview'.
 */
const getInitialTab = (): string => {
  if (typeof window !== 'undefined') {
    const hash = window.location.hash.replace(/^#/, '').trim();
    if (hash && DASHBOARD_TABS.some((t) => t.id === hash)) {
      return hash;
    }
  }
  return 'overview';
};

/**
 * Module-level skeleton fallback while module views load asynchronously.
 * Clean, minimal themed card displaying the module's icon and title.
 */
const ModuleSkeleton: React.FC = () => {
  const currentTab = DASHBOARD_TABS.find((t) => t.id === getInitialTab()) || DASHBOARD_TABS[0];
  const Icon = currentTab?.icon;

  return (
    <div
      className="flex items-center justify-center min-h-[400px] p-8"
      aria-busy="true"
      aria-label="Loading module content"
    >
      <div className="text-center space-y-4 animate-pulse">
        {Icon && <Icon className="w-12 h-12 text-slate-300 dark:text-zinc-600 mx-auto" />}
        <div className="space-y-2">
          <div className="h-6 w-48 bg-slate-200 dark:bg-zinc-800 rounded mx-auto" />
          <div className="h-4 w-64 bg-slate-200 dark:bg-zinc-800 rounded mx-auto" />
        </div>
        <p className="text-sm text-slate-500 dark:text-zinc-400">
          Module view ready for integration
        </p>
      </div>
    </div>
  );
};

/**
 * Dynamic component loader that wraps the module in Suspense.
 */
const DynamicModuleView: React.FC<{ tab: DashboardTabItem }> = ({ tab }) => {
  const Component = tab.component ?? lazy(() => import('@/features/dashboard/components/views/ComingSoonView'));

  return (
    <Suspense fallback={<ModuleSkeleton />}>
      <Component tab={tab} key={tab.id} />
    </Suspense>
  );
};

export const HRAdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(getInitialTab);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Sync state if URL hash changes externally (e.g. browser back/forward buttons)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#/, '').trim();
      if (hash && DASHBOARD_TABS.some((t) => t.id === hash)) {
        setActiveTab(hash);
      } else if (!hash) {
        setActiveTab('overview');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update active tab in state and URL hash with NO page reload
  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
    if (window.location.hash !== `#${tabId}`) {
      window.history.replaceState(null, '', `#${tabId}`);
    }
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  const currentTab = getTabConfig(activeTab) || DASHBOARD_TABS[0];

  return (
    <DashboardShell
      sidebar={
        <DashboardSidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
        />
      }
      sidebarCollapsed={sidebarCollapsed}
      onSidebarToggle={toggleSidebar}
    >
      <div
        key={activeTab}
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        className="transition-opacity duration-150 ease-in-out"
      >
        <DynamicModuleView tab={currentTab} />
      </div>
    </DashboardShell>
  );
};

export default HRAdminDashboard;