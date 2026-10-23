import React from 'react';
import {
  LayoutDashboard,
  Users,
  UserCog,
  Building2,
  CalendarDays,
  Clock,
  FileText,
  CreditCard,
  Gauge,
  FolderKanban,
  Briefcase,
  FileSpreadsheet,
  FilePlus,
  UserSearch,
  UserCheck,
  Layers,
  CalendarCheck,
  ClipboardCheck,
  MessageSquare,
  ScanText,
  Mail,
  Gift,
  Globe,
  Workflow,
  ShieldCheck,
  Search,
  Bell,
  Download,
  BarChart2,
  LineChart,
  Bot,
  Brain,
  Target,
  HeartPulse,
  BookOpen,
  FilePlus2,
  Video,
  LogOut,
  Receipt,
  Plane,
  ShieldAlert,
  Settings,
  Activity,
  Box,
  UserPlus,
  Timer,
  Palmtree,
  ScrollText,
  Sparkles,
  LayoutGrid,
} from 'lucide-react';
import { GeminiIcon } from '@/shared/ui/GeminiIcon';

export type SidebarSection =
  | 'overview'
  | 'workforce'
  | 'recruitment'
  | 'attendance'
  | 'payroll'
  | 'leave'
  | 'performance'
  | 'reports'
  | 'aihub'
  | 'documents'
  | 'hrops'
  | 'settings';

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
    collapsible: true,
    defaultExpanded: true,
    order: 1,
  },
  {
    id: 'recruitment',
    label: 'Recruitment',
    icon: Briefcase,
    collapsible: false,
    order: 2,
  },
  {
    id: 'attendance',
    label: 'Attendance & Time',
    icon: CalendarDays,
    collapsible: true,
    defaultExpanded: true,
    order: 3,
  },
  {
    id: 'payroll',
    label: 'Payroll & Benefits',
    icon: CreditCard,
    collapsible: true,
    defaultExpanded: true,
    order: 4,
  },
  {
    id: 'leave',
    label: 'Leave Management',
    icon: FileText,
    collapsible: true,
    defaultExpanded: true,
    order: 5,
  },
  {
    id: 'performance',
    label: 'Performance',
    icon: Gauge,
    collapsible: true,
    defaultExpanded: true,
    order: 6,
  },
  {
    id: 'reports',
    label: 'Reports & Analytics',
    icon: LineChart,
    collapsible: false,
    order: 7,
  },
  {
    id: 'aihub',
    label: 'AI Intelligence Hub',
    icon: Bot,
    collapsible: false,
    order: 8,
  },
  {
    id: 'documents',
    label: 'Documents & Compliance',
    icon: FolderKanban,
    collapsible: false,
    order: 9,
  },
  {
    id: 'hrops',
    label: 'HR Operations',
    icon: Activity,
    collapsible: false,
    order: 10,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    collapsible: false,
    order: 11,
  },
];

const OverviewView = React.lazy(() => import('./views/OverviewView'));
const ComingSoonView = React.lazy(() => import('./views/ComingSoonView'));
const TravelRequestsPage = React.lazy(() => import('@/features/travel/pages/TravelRequestsPage'));
const ExpenseClaimsPage = React.lazy(() => import('@/features/expenses/pages/ExpenseClaimsPage'));
const ExitManagementPage = React.lazy(() => import('@/features/exit-management/pages/ExitManagementPage'));
const OnboardingChecklistPage = React.lazy(() => import('@/features/employee-onboarding/pages/OnboardingChecklistPage'));
const VisitorsPage = React.lazy(() => import('@/features/visitors/pages/VisitorsPage'));
const AssetManagementPage = React.lazy(() => import('@/features/assets/pages/AssetManagementPage'));
const TimelinePage = React.lazy(() => import('@/features/timeline/pages/TimelinePage'));
const HrOpsPage = React.lazy(() => import('@/features/hr-ops/pages/HrOpsPage'));
const HrOpsHubPage = React.lazy(() => import('@/features/hr-ops/pages/HrOpsHubPage'));
const RecruitmentHubPage = React.lazy(() => import('@/features/recruitment/pages/RecruitmentHubPage'));
const AIHubPage = React.lazy(() => import('@/features/ai-hub/pages/AIHubPage'));
const ReportsAnalyticsHubPage = React.lazy(() => import('@/features/analytics/pages/ReportsAnalyticsHubPage'));
const DocumentsComplianceHubPage = React.lazy(() => import('@/features/documents/pages/DocumentsComplianceHubPage'));
const AnalyticsCenterPage = React.lazy(() => import('@/features/analytics/pages/AnalyticsCenterPage'));
const ChatAssistantPage = React.lazy(() => import('@/features/chat-assistant/pages/ChatAssistantPage'));
const MeetingIntelligencePage = React.lazy(() => import('@/features/meeting-intelligence/pages/MeetingIntelligencePage'));
const ShiftsView = React.lazy(() => import('./views/ShiftsView'));
const RostersView = React.lazy(() => import('./views/RostersView'));
const HolidaysView = React.lazy(() => import('./views/HolidaysView'));

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
  // 2. WORKFORCE (4 tabs) - Collapsible group
  // ==========================================
  {
    id: 'employees',
    label: 'Employees',
    icon: Users,
    group: 'workforce',
    section: 'workforce',
    component: ComingSoonView,
  },
  {
    id: 'hr-management',
    label: 'HR Management',
    icon: UserCog,
    group: 'workforce',
    section: 'workforce',
    component: ComingSoonView,
  },
  {
    id: 'managers',
    label: 'Managers',
    icon: UserPlus,
    group: 'workforce',
    section: 'workforce',
    component: ComingSoonView,
  },
  {
    id: 'departments',
    label: 'Departments',
    icon: Building2,
    group: 'workforce',
    section: 'workforce',
    component: ComingSoonView,
  },

  // ==========================================
  // 3. RECRUITMENT (1 tab - links to /dashboard/recruitment)
  // ==========================================
  {
    id: 'recruitment',
    label: 'Recruitment',
    icon: Briefcase,
    group: 'recruitment',
    section: 'recruitment',
    path: '/dashboard/recruitment',
    component: RecruitmentHubPage,
  },

  // ==========================================
  // 4. ATTENDANCE & TIME (5 tabs: 1 parent + 4 children) - Collapsible group
  // ==========================================
  {
    id: 'attendance',
    label: 'Overview',
    icon: CalendarDays,
    group: 'attendance',
    section: 'attendance',
    component: ComingSoonView,
    children: [
      {
        id: 'attendance-shifts',
        label: 'Shifts',
        icon: Clock,
        group: 'attendance',
        section: 'attendance',
        component: ShiftsView,
      },
      {
        id: 'attendance-rosters',
        label: 'Rosters',
        icon: ScrollText,
        group: 'attendance',
        section: 'attendance',
        component: RostersView,
      },
      {
        id: 'attendance-holidays',
        label: 'Holidays',
        icon: Palmtree,
        group: 'attendance',
        section: 'attendance',
        component: HolidaysView,
      },
      {
        id: 'timesheets',
        label: 'Timesheets',
        icon: Timer,
        group: 'attendance',
        section: 'attendance',
        component: ComingSoonView,
      },
    ],
  },

  // ==========================================
  // 5. PAYROLL & BENEFITS (1 tab) - Collapsible group
  // ==========================================
  {
    id: 'payroll',
    label: 'Payroll',
    icon: CreditCard,
    group: 'payroll',
    section: 'payroll',
    component: ComingSoonView,
  },

  // ==========================================
  // 6. LEAVE MANAGEMENT (1 tab) - Collapsible group
  // ==========================================
  {
    id: 'leaves',
    label: 'Leaves',
    icon: FileText,
    group: 'leave',
    section: 'leave',
    component: ComingSoonView,
  },

  // ==========================================
  // 7. PERFORMANCE (1 tab) - Collapsible group
  // ==========================================
  {
    id: 'performance',
    label: 'Performance',
    icon: Gauge,
    group: 'performance',
    section: 'performance',
    component: ComingSoonView,
  },

  // ==========================================
  // 8. REPORTS & ANALYTICS (1 tab - links to /dashboard/reports)
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
  // 9. AI INTELLIGENCE HUB (1 tab - links to /dashboard/ai-hub)
  // ==========================================
  {
    id: 'aihub',
    label: 'AI Intelligence Hub',
    icon: Bot,
    group: 'aihub',
    section: 'aihub',
    path: '/dashboard/ai-hub',
    component: AIHubPage,
  },

  // ==========================================
  // 10. DOCUMENTS & COMPLIANCE (1 tab - links to /dashboard/documents)
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
  // 11. HR OPERATIONS (1 tab - links to /dashboard/hr-ops)
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
  // 12. SETTINGS (1 tab - links to /settings)
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
  'ai-insights': 'analytics-center',
  'hrops-dashboard': 'hrops',
  'recruitment-dashboard': 'recruitment',
  'all-jobs': 'recruitment',
  'requisitions': 'recruitment',
  'candidates': 'recruitment',
  'pipeline': 'recruitment',
  'interviews': 'recruitment',
  'offers': 'recruitment',
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
 * Returns the section/module that a given tab ID belongs to.
 * Resolves aliases and searches top-level and nested child tabs.
 * If passed a section ID directly, returns that section.
 */
export const getModuleOfTab = (id: string): SidebarSection | undefined => {
  if (!id) return undefined;
  const resolvedId = LEGACY_ALIASES[id] || id;

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

  return undefined;
};

/**
 * Finds a tab configuration by ID.
 * Resolves legacy aliases and searches top-level tabs and nested children.
 */
export const getTabConfig = (id: string): DashboardTabItem | undefined => {
  const resolvedId = LEGACY_ALIASES[id] || id;

  for (const tab of DASHBOARD_TABS) {
    if (tab.id === resolvedId) return tab;
    if (tab.children) {
      const child = tab.children.find((c) => c.id === resolvedId);
      if (child) return child;
    }
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