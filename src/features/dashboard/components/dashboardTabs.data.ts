import React from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  CreditCard,
  LineChart,
  FolderKanban,
  Activity,
  Settings,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { GeminiIcon } from '@/shared/ui/GeminiIcon';

export type SidebarSection =
  | 'overview'
  | 'workforce'
  | 'talent'
  | 'attendance'
  | 'payroll'
  | 'reports'
  | 'aihub'
  | 'documents'
  | 'hrops'
  | 'settings'
  | 'recruitment'
  | 'leave'
  | 'performance';

export type TabGroup = SidebarSection;

export interface DashboardTabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  group: TabGroup;
  section: SidebarSection;
  path?: string;
  badge?: string;
  children?: DashboardTabItem[];
  component?: React.LazyExoticComponent<React.ComponentType<any>>;
}

export interface SidebarSectionConfig {
  id: SidebarSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  collapsible: boolean;
  defaultExpanded?: boolean;
  order: number;
}

export const SIDEBAR_SECTIONS: SidebarSectionConfig[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: LayoutDashboard,
    collapsible: false,
    order: 0,
  },
  {
    id: 'workforce',
    label: 'Workforce',
    icon: Users,
    collapsible: false,
    order: 1,
  },
  {
    id: 'talent',
    label: 'Talent',
    icon: Sparkles,
    collapsible: false,
    order: 2,
  },
  {
    id: 'attendance',
    label: 'Attendance',
    icon: CalendarDays,
    collapsible: false,
    order: 3,
  },
  {
    id: 'payroll',
    label: 'Payroll & Benefits',
    icon: CreditCard,
    collapsible: false,
    order: 4,
  },
  {
    id: 'reports',
    label: 'Reports & Analytics',
    icon: LineChart,
    collapsible: false,
    order: 5,
  },
  {
    id: 'aihub',
    label: 'AI Intelligence Hub',
    icon: GeminiIcon,
    collapsible: false,
    order: 6,
  },
  {
    id: 'documents',
    label: 'Documents & Compliance',
    icon: FolderKanban,
    collapsible: false,
    order: 7,
  },
  {
    id: 'hrops',
    label: 'HR Operations',
    icon: Activity,
    collapsible: false,
    order: 8,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    collapsible: false,
    order: 9,
  },
];

const OverviewView = React.lazy(() => import('./views/OverviewView'));
const ComingSoonView = React.lazy(() => import('./views/ComingSoonView'));
const WorkforceHubPage = React.lazy(() => import('@/features/workforce/pages/WorkforceHubPage'));
const TalentHubPage = React.lazy(() => import('@/features/talent/pages/TalentHubPage'));
const AttendanceHubPage = React.lazy(() => import('@/features/attendance/pages/AttendanceHubPage'));
const PayrollHubPage = React.lazy(() => import('@/features/payroll/pages/PayrollHubPage'));
const ReportsAnalyticsHubPage = React.lazy(() => import('@/features/analytics/pages/ReportsAnalyticsHubPage'));
const AIHubPage = React.lazy(() => import('@/features/ai-hub/pages/AIHubPage'));
const DocumentsComplianceHubPage = React.lazy(() => import('@/features/documents/pages/DocumentsComplianceHubPage'));
const HrOpsHubPage = React.lazy(() => import('@/features/hr-ops/pages/HrOpsHubPage'));

export const DASHBOARD_TABS: DashboardTabItem[] = [
  // ==========================================
  // 1. OVERVIEW (1 tab) - Always visible at top
  // ==========================================
  {
    id: 'overview',
    label: 'Overview',
    icon: LayoutDashboard,
    group: 'overview',
    section: 'overview',
    component: OverviewView,
  },

  // ==========================================
  // 2. WORKFORCE (1 tab - links to /dashboard/workforce)
  // ==========================================
  {
    id: 'workforce',
    label: 'Workforce',
    icon: Users,
    group: 'workforce',
    section: 'workforce',
    path: '/dashboard/workforce',
    component: WorkforceHubPage,
  },

  // ==========================================
  // 3. TALENT (1 tab - links to /dashboard/talent)
  // Combines Recruitment & Performance
  // ==========================================
  {
    id: 'talent',
    label: 'Talent',
    icon: Sparkles,
    group: 'talent',
    section: 'talent',
    path: '/dashboard/talent',
    component: TalentHubPage,
  },

  // ==========================================
  // 4. ATTENDANCE (1 tab - links to /dashboard/attendance)
  // Combines Attendance & Leave Management
  // ==========================================
  {
    id: 'attendance',
    label: 'Attendance',
    icon: CalendarDays,
    group: 'attendance',
    section: 'attendance',
    path: '/dashboard/attendance',
    component: AttendanceHubPage,
  },

  // ==========================================
  // 5. PAYROLL & BENEFITS (1 tab - links to /dashboard/payroll)
  // ==========================================
  {
    id: 'payroll',
    label: 'Payroll',
    icon: CreditCard,
    group: 'payroll',
    section: 'payroll',
    path: '/dashboard/payroll',
    component: PayrollHubPage,
  },

  // ==========================================
  // 6. REPORTS & ANALYTICS (1 tab - links to /dashboard/reports)
  // ==========================================
  {
    id: 'reports',
    label: 'Reports & Analytics',
    icon: LineChart,
    group: 'reports',
    section: 'reports',
    path: '/dashboard/reports',
    component: ReportsAnalyticsHubPage,
  },

  // ==========================================
  // 7. AI INTELLIGENCE HUB (1 tab - links to /dashboard/ai-hub)
  // ==========================================
  {
    id: 'aihub',
    label: 'AI Intelligence Hub',
    icon: GeminiIcon,
    group: 'aihub',
    section: 'aihub',
    path: '/dashboard/ai-hub',
    component: AIHubPage,
  },

  // ==========================================
  // 8. DOCUMENTS & COMPLIANCE (1 tab - links to /dashboard/documents)
  // ==========================================
  {
    id: 'documents',
    label: 'Documents & Compliance',
    icon: FolderKanban,
    group: 'documents',
    section: 'documents',
    path: '/dashboard/documents',
    component: DocumentsComplianceHubPage,
  },

  // ==========================================
  // 9. HR OPERATIONS (1 tab - links to /dashboard/hr-ops)
  // ==========================================
  {
    id: 'hrops',
    label: 'HR Operations',
    icon: Activity,
    group: 'hrops',
    section: 'hrops',
    path: '/dashboard/hr-ops',
    component: HrOpsHubPage,
  },

  // ==========================================
  // 10. SETTINGS (1 tab - links to /settings)
  // ==========================================
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    group: 'settings',
    section: 'settings',
    path: '/settings',
    component: ComingSoonView,
  },
];

export const LEGACY_ALIASES: Record<string, string> = {
  'recruitment': 'talent',
  'recruitment-dashboard': 'talent',
  'performance': 'talent',
  'performance-dashboard': 'talent',
  'leave': 'attendance',
  'leaves': 'attendance',
  'ai-insights': 'analytics-center',
  'hrops-dashboard': 'hrops',
  'all-jobs': 'talent',
  'requisitions': 'talent',
  'candidates': 'talent',
  'pipeline': 'talent',
  'interviews': 'talent',
  'offers': 'talent',
  'aihub-dashboard': 'aihub',
  'chat-assistant': 'aihub',
  'meeting-intelligence': 'aihub',
  'ai-recruiter': 'aihub',
  'workforce-insights': 'aihub',
  'analytics-center': 'reports',
  'hiring-reports': 'reports',
  'recruitment-analytics': 'reports',
  'recruitment-compliance': 'documents',
  'compliance-monitor': 'documents',
  'policy-assistant': 'documents',
  'document-generator': 'documents',
  'employees': 'workforce',
  'managers': 'workforce',
  'departments': 'workforce',
  'hr-management': 'workforce',
  'attendance-shifts': 'attendance',
  'attendance-rosters': 'attendance',
  'attendance-holidays': 'attendance',
  'attendance-timesheet': 'attendance',
  'shifts': 'attendance',
  'rosters': 'attendance',
  'holidays': 'attendance',
  'timesheets': 'attendance',
};

/**
 * Returns all sub-tabs belonging to a given sidebar section/module.
 * Flattens any nested children (e.g. attendance children).
 */
export const getModuleTabs = (sectionId: SidebarSection): DashboardTabItem[] => {
  const result: DashboardTabItem[] = [];
  for (const tab of DASHBOARD_TABS) {
    if (tab.section === sectionId) {
      result.push(tab);
      if (tab.children && tab.children.length > 0) {
        result.push(...tab.children);
      }
    }
  }
  return result;
};

/**
 * Resolves legacy aliases transitively until a stable ID is reached.
 */
export const resolveLegacyAlias = (id: string): string => {
  let resolvedId = id;
  const visited = new Set<string>();
  while (LEGACY_ALIASES[resolvedId] && !visited.has(resolvedId)) {
    visited.add(resolvedId);
    resolvedId = LEGACY_ALIASES[resolvedId];
  }
  return resolvedId;
};

/**
 * Returns the section/module that a given tab ID belongs to.
 * Resolves aliases and searches top-level and nested child tabs.
 * If passed a section ID directly, returns that section.
 */
export const getModuleOfTab = (id: string): SidebarSection | undefined => {
  if (!id) return undefined;
  const resolvedId = resolveLegacyAlias(id);

  // Direct match on section ID
  if (SIDEBAR_SECTIONS.some((s) => s.id === resolvedId)) {
    return resolvedId as SidebarSection;
  }

  for (const tab of DASHBOARD_TABS) {
    if (tab.id === resolvedId) return tab.section;
    if (tab.children) {
      const child = tab.children.find((c) => c.id === resolvedId);
      if (child) return child.section || tab.section;
    }
  }

  if (resolvedId === 'connect') {
    return 'workforce';
  }

  return undefined;
};

/**
 * Finds a tab configuration by ID.
 * Resolves legacy aliases and searches top-level tabs and nested children.
 */
export const getTabConfig = (id: string): DashboardTabItem | undefined => {
  const resolvedId = resolveLegacyAlias(id);

  for (const tab of DASHBOARD_TABS) {
    if (tab.id === resolvedId) return tab;
    if (tab.children) {
      const child = tab.children.find((c) => c.id === resolvedId);
      if (child) return child;
    }
  }

  if (resolvedId === 'connect') {
    return {
      id: 'connect',
      label: 'OFC Connect',
      icon: MessageSquare,
      group: 'workforce',
      section: 'workforce',
      path: '/dashboard/connect',
    };
  }

  return undefined;
};

export const getTabsBySection = (section: SidebarSection): DashboardTabItem[] => {
  return DASHBOARD_TABS.filter((tab) => tab.section === section);
};

export const getSidebarSection = (id: SidebarSection): SidebarSectionConfig | undefined => {
  return SIDEBAR_SECTIONS.find((s) => s.id === id);
};

export const ALL_DASHBOARD_TABS = DASHBOARD_TABS;

export type DashboardTabConfig = DashboardTabItem;