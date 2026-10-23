/**
 * @file sidebarNav.ts
 * @description Sidebar navigation configuration and data contracts.
 * Canonical re-export referencing dashboardTabs.data.ts.
 */

export * from '@/features/dashboard/components/dashboardTabs.data';

export const CONNECT_NAV_ITEM = {
  id: 'connect',
  label: 'OFC Connect',
  path: '/dashboard/connect',
  section: 'workforce' as const,
};
