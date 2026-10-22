import React from 'react';
import {
  LayoutGrid,
  Sparkles,
  Users,
  UserCog,
  UserPlus,
  Building2,
  CalendarDays,
  Timer,
  FileText,
  CreditCard,
  Gauge,
  FolderKanban,
  Box,
  Activity,
  LayoutDashboard,
  FileSpreadsheet,
  Briefcase,
  FilePlus,
  UserSearch,
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
  UserCheck,
  PackageMinus,
  LogOut,
  KeyRound,
  Receipt,
  Plane,
  ShieldAlert,
  Settings,
  Layers,
  Clock,
  ScrollText,
  Palmtree,
} from 'lucide-react';

export type TabGroup = 'core' | 'hrops' | 'recruitment' | 'aihub';
export type SidebarSection = 'core' | 'recruitment' | 'aihub' | 'hrops';

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

// Sidebar section configuration
export const SIDEBAR_SECTIONS: SidebarSectionConfig[] = [
  {
    id: 'core',
    label: 'Core',
    icon: LayoutGrid,
    collapsible: false,
    order: 0,
  },
  {
    id: 'recruitment',
    label: 'Recruitment',
    icon: Briefcase,
    collapsible: true,
    defaultExpanded: true,
    order: 1,
  },
  {
    id: 'aihub',
    label: 'AI Hub',
    icon: Bot,
    collapsible: true,
    defaultExpanded: true,
    order: 2,
  },
  {
    id: 'hrops',
    label: 'HR Ops & Administration',
    icon: Settings,
    collapsible: true,
    defaultExpanded: true,
    order: 3,
  },
];

// Lazy loaded views
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
const AnalyticsCenterPage = React.lazy(() => import('@/features/analytics/pages/AnalyticsCenterPage'));
const ChatAssistantPage = React.lazy(() => import('@/features/chat-assistant/pages/ChatAssistantPage'));
const MeetingIntelligencePage = React.lazy(() => import('@/features/meeting-intelligence/pages/MeetingIntelligencePage'));
const ShiftsView = React.lazy(() => import('./views/ShiftsView'));
const RostersView = React.lazy(() => import('./views/RostersView'));
const HolidaysView = React.lazy(() => import('./views/HolidaysView'));

/**
 * Complete typed configuration array for all 68 tabs across the 4 groups.
 */
export const DASHBOARD_TABS: DashboardTabItem[] = [
  // ==========================================
  // 1. CORE (13 tabs) - Always visible at top
  // ==========================================
  {
    id: 'overview',
    label: 'Overview',
    icon: LayoutGrid,
    group: 'core',
    section: 'core',
    component: OverviewView,
  },
  {
    id: 'ai-insights',
    label: 'AI Insights',
    icon: Sparkles,
    group: 'core',
    section: 'core',
    component: AnalyticsCenterPage,
  },
  {
    id: 'employees',
    label: 'Employees',
    icon: Users,
    group: 'core',
    section: 'core',
    component: ComingSoonView,
  },
  {
    id: 'hr-management',
    label: 'HR Management',
    icon: UserCog,
    group: 'core',
    section: 'core',
    component: ComingSoonView,
  },
  {
    id: 'managers',
    label: 'Managers',
    icon: UserPlus,
    group: 'core',
    section: 'core',
    component: ComingSoonView,
  },
  {
    id: 'departments',
    label: 'Departments',
    icon: Building2,
    group: 'core',
    section: 'core',
    component: ComingSoonView,
  },
  {
    id: 'attendance',
    label: 'Attendance',
    icon: CalendarDays,
    group: 'core',
    section: 'core',
    component: ComingSoonView,
    children: [
      {
        id: 'attendance-shifts',
        label: 'Shifts',
        icon: Clock,
        path: '/dashboard/attendance/shifts',
        group: 'core',
        section: 'core',
        component: ShiftsView,
      },
      {
        id: 'attendance-rosters',
        label: 'Rosters',
        icon: ScrollText,
        path: '/dashboard/attendance/rosters',
        group: 'core',
        section: 'core',
        component: RostersView,
      },
      {
        id: 'attendance-holidays',
        label: 'Holidays',
        icon: Palmtree,
        path: '/dashboard/attendance/holidays',
        group: 'core',
        section: 'core',
        component: HolidaysView,
      },
    ],
  },
  {
    id: 'shifts',
    label: 'Shifts',
    icon: Clock,
    path: '/dashboard/attendance/shifts',
    group: 'core',
    section: 'core',
    component: ShiftsView,
  },
  {
    id: 'rosters',
    label: 'Rosters',
    icon: ScrollText,
    path: '/dashboard/attendance/rosters',
    group: 'core',
    section: 'core',
    component: RostersView,
  },
  {
    id: 'holidays',
    label: 'Holidays',
    icon: Palmtree,
    path: '/dashboard/attendance/holidays',
    group: 'core',
    section: 'core',
    component: HolidaysView,
  },
  {
    id: 'timesheets',
    label: 'Timesheets',
    icon: Timer,
    group: 'core',
    section: 'core',
    component: ComingSoonView,
  },
  {
    id: 'leaves',
    label: 'Leaves',
    icon: FileText,
    group: 'core',
    section: 'core',
    component: ComingSoonView,
  },
  {
    id: 'payroll',
    label: 'Payroll',
    icon: CreditCard,
    group: 'core',
    section: 'core',
    component: ComingSoonView,
  },
  {
    id: 'performance',
    label: 'Performance',
    icon: Gauge,
    group: 'core',
    section: 'core',
    component: ComingSoonView,
  },
  {
    id: 'documents',
    label: 'Documents',
    icon: FolderKanban,
    group: 'core',
    section: 'core',
    component: ComingSoonView,
  },
  {
    id: 'assets',
    label: 'Assets',
    icon: Box,
    group: 'core',
    section: 'core',
    component: ComingSoonView,
  },

  // ==========================================
  // 2. RECRUITMENT HUB (27 tabs) - Collapsible group
  // ==========================================
  {
    id: 'recruitment-dashboard',
    label: 'Dashboard',
    icon: LayoutGrid,
    group: 'recruitment',
    section: 'recruitment',
    component: ComingSoonView,
  },
  {
    id: 'requisitions',
    label: 'Requisitions',
    icon: FileSpreadsheet,
    group: 'recruitment',
    section: 'recruitment',
    component: ComingSoonView,
  },
  {
    id: 'all-jobs',
    label: 'All Jobs',
    icon: Briefcase,
    group: 'recruitment',
    section: 'recruitment',
    component: ComingSoonView,
  },
  {
    id: 'create-job',
    label: 'Create Job',
    icon: FilePlus,
    group: 'recruitment',
    section: 'recruitment',
    component: ComingSoonView,
  },
  {
    id: 'candidates',
    label: 'Candidates',
    icon: UserSearch,
    group: 'recruitment',
    section: 'recruitment',
    component: ComingSoonView,
  },
  {
    id: 'talent-pool',
    label: 'Talent Pool',
    icon: UserCheck,
    group: 'recruitment',
    section: 'recruitment',
    component: ComingSoonView,
  },
  {
    id: 'pipeline',
    label: 'Pipeline',
    icon: Layers,
    group: 'recruitment',
    section: 'recruitment',
    component: ComingSoonView,
  },
  {
    id: 'interviews',
    label: 'Interviews',
    icon: CalendarCheck,
    group: 'recruitment',
    section: 'recruitment',
    component: ComingSoonView,
  },
  {
    id: 'interview-calendar',
    label: 'Interview Calendar',
    icon: CalendarDays,
    group: 'recruitment',
    section: 'recruitment',
    component: ComingSoonView,
  },
  {
    id: 'scorecards',
    label: 'Scorecards',
    icon: ClipboardCheck,
    group: 'recruitment',
    section: 'recruitment',
    component: ComingSoonView,
  },
  {
    id: 'offers',
    label: 'Offers',
    icon: FileText,
    group: 'recruitment',
    section: 'recruitment',
    component: ComingSoonView,
  },
  {
    id: 'recruitment-onboarding',
    label: 'Onboarding',
    icon: UserCheck,
    group: 'recruitment',
    section: 'recruitment',
    component: ComingSoonView,
  },
  {
    id: 'candidate-crm',
    label: 'Candidate CRM',
    icon: MessageSquare,
    group: 'recruitment',
    section: 'recruitment',
    component: ComingSoonView,
  },
  {
    id: 'resume-intelligence',
    label: 'Resume Intelligence',
    icon: ScanText,
    group: 'recruitment',
    section: 'recruitment',
    component: ComingSoonView,
  },
  {
    id: 'email-templates',
    label: 'Email Templates',
    icon: Mail,
    group: 'recruitment',
    section: 'recruitment',
    component: ComingSoonView,
  },
  {
    id: 'referrals',
    label: 'Referrals',
    icon: Gift,
    group: 'recruitment',
    section: 'recruitment',
    component: ComingSoonView,
  },
  {
    id: 'vendors',
    label: 'Vendors',
    icon: Building2,
    group: 'recruitment',
    section: 'recruitment',
    component: ComingSoonView,
  },
  {
    id: 'career-site',
    label: 'Career Site',
    icon: Globe,
    group: 'recruitment',
    section: 'recruitment',
    component: ComingSoonView,
  },
  {
    id: 'automation',
    label: 'Automation',
    icon: Workflow,
    group: 'recruitment',
    section: 'recruitment',
    component: ComingSoonView,
  },
  {
    id: 'compliance',
    label: 'Compliance',
    icon: ShieldCheck,
    group: 'recruitment',
    section: 'recruitment',
    component: ComingSoonView,
  },
  {
    id: 'global-search',
    label: 'Global Search',
    icon: Search,
    group: 'recruitment',
    section: 'recruitment',
    component: ComingSoonView,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    group: 'recruitment',
    section: 'recruitment',
    component: ComingSoonView,
  },
  {
    id: 'import-export',
    label: 'Import/Export',
    icon: Download,
    group: 'recruitment',
    section: 'recruitment',
    component: ComingSoonView,
  },
  {
    id: 'hiring-reports',
    label: 'Hiring Reports',
    icon: BarChart2,
    group: 'recruitment',
    section: 'recruitment',
    component: ComingSoonView,
  },
  {
    id: 'recruitment-analytics',
    label: 'Analytics',
    icon: LineChart,
    group: 'recruitment',
    section: 'recruitment',
    component: ComingSoonView,
  },
  {
    id: 'recruitment-ai',
    label: 'Recruitment AI',
    icon: Sparkles,
    group: 'recruitment',
    section: 'recruitment',
    component: ComingSoonView,
  },
  {
    id: 'ai-copilot',
    label: 'AI Copilot',
    icon: Bot,
    group: 'recruitment',
    section: 'recruitment',
    component: ComingSoonView,
  },

  // ==========================================
  // 3. AI HUB (15 tabs) - Collapsible group
  // ==========================================
  {
    id: 'aihub-dashboard',
    label: 'Hub Dashboard',
    icon: LayoutGrid,
    group: 'aihub',
    section: 'aihub',
    component: ComingSoonView,
  },
  {
    id: 'workforce-insights',
    label: 'Workforce Insights',
    icon: Brain,
    group: 'aihub',
    section: 'aihub',
    component: ComingSoonView,
  },
  {
    id: 'ai-recruiter',
    label: 'Recruiter',
    icon: Briefcase,
    group: 'aihub',
    section: 'aihub',
    component: ComingSoonView,
  },
  {
    id: 'attendance-monitor',
    label: 'Attendance Monitor',
    icon: Clock,
    group: 'aihub',
    section: 'aihub',
    component: ComingSoonView,
  },
  {
    id: 'leave-assistant',
    label: 'Leave Assistant',
    icon: FileText,
    group: 'aihub',
    section: 'aihub',
    component: ComingSoonView,
  },
  {
    id: 'performance-coach',
    label: 'Performance Coach',
    icon: Gauge,
    group: 'aihub',
    section: 'aihub',
    component: ComingSoonView,
  },
  {
    id: 'payroll-insights',
    label: 'Payroll Insights',
    icon: CreditCard,
    group: 'aihub',
    section: 'aihub',
    component: ComingSoonView,
  },
  {
    id: 'workforce-planning',
    label: 'Workforce Planning',
    icon: Target,
    group: 'aihub',
    section: 'aihub',
    component: ComingSoonView,
  },
  {
    id: 'employee-health',
    label: 'Employee Health',
    icon: HeartPulse,
    group: 'aihub',
    section: 'aihub',
    component: ComingSoonView,
  },
  {
    id: 'policy-assistant',
    label: 'Policy Assistant',
    icon: BookOpen,
    group: 'aihub',
    section: 'aihub',
    component: ComingSoonView,
  },
  {
    id: 'document-generator',
    label: 'Document Generator',
    icon: FilePlus2,
    group: 'aihub',
    section: 'aihub',
    component: ComingSoonView,
  },
  {
    id: 'meeting-intelligence',
    label: 'Meeting Intelligence',
    icon: Video,
    group: 'aihub',
    section: 'aihub',
    component: MeetingIntelligencePage,
  },
  {
    id: 'compliance-monitor',
    label: 'Compliance Monitor',
    icon: ShieldAlert,
    group: 'aihub',
    section: 'aihub',
    component: ComingSoonView,
  },
  {
    id: 'chat-assistant',
    label: 'Chat Assistant',
    icon: MessageSquare,
    group: 'aihub',
    section: 'aihub',
    component: ChatAssistantPage,
  },
  {
    id: 'analytics-center',
    label: 'Analytics Center',
    icon: LineChart,
    group: 'aihub',
    section: 'aihub',
    component: AnalyticsCenterPage,
  },

  // ==========================================
  // 4. HR OPS & ADMIN (13 tabs) - Collapsible group
  // ==========================================
  {
    id: 'hrops-dashboard',
    label: 'HR Ops Dashboard',
    icon: LayoutDashboard,
    group: 'hrops',
    section: 'hrops',
    component: HrOpsPage,
  },
  {
    id: 'employee-timeline',
    label: 'Employee Timeline',
    icon: Activity,
    group: 'hrops',
    section: 'hrops',
    component: TimelinePage,
  },
  {
    id: 'asset-management',
    label: 'Asset Management',
    icon: Box,
    group: 'hrops',
    section: 'hrops',
    component: AssetManagementPage,
  },
  {
    id: 'visitor-management',
    label: 'Visitor Management',
    icon: Users,
    group: 'hrops',
    section: 'hrops',
    component: VisitorsPage,
  },
  {
    id: 'expense-claims',
    label: 'Expense Claims',
    icon: Receipt,
    group: 'hrops',
    section: 'hrops',
    component: ExpenseClaimsPage,
  },
  {
    id: 'travel-requests',
    label: 'Travel Requests',
    icon: Plane,
    group: 'hrops',
    section: 'hrops',
    component: TravelRequestsPage,
  },
  {
    id: 'onboarding-checklist',
    label: 'Onboarding Checklist',
    icon: UserCheck,
    group: 'hrops',
    section: 'hrops',
    component: OnboardingChecklistPage,
  },
  {
    id: 'offboarding',
    label: 'Offboarding',
    icon: PackageMinus,
    group: 'hrops',
    section: 'hrops',
    component: ExitManagementPage,
  },
  {
    id: 'exit-management',
    label: 'Exit Management',
    icon: LogOut,
    group: 'hrops',
    section: 'hrops',
    component: ExitManagementPage,
  },
  {
    id: 'roles-permissions',
    label: 'Roles & Permissions',
    icon: ShieldCheck,
    group: 'hrops',
    section: 'hrops',
    component: ComingSoonView,
  },
  {
    id: 'audit-logs',
    label: 'Audit Logs',
    icon: KeyRound,
    group: 'hrops',
    section: 'hrops',
    component: ComingSoonView,
  },
  {
    id: 'billing',
    label: 'Billing',
    icon: CreditCard,
    group: 'hrops',
    section: 'hrops',
    component: ComingSoonView,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    group: 'hrops',
    section: 'hrops',
    component: ComingSoonView,
  },
];

/**
 * Helper to find a tab configuration by id.
 */
export const getTabConfig = (id: string): DashboardTabItem | undefined => {
  return DASHBOARD_TABS.find((tab) => tab.id === id);
};

/**
 * Get tabs filtered by sidebar section
 */
export const getTabsBySection = (section: SidebarSection): DashboardTabItem[] => {
  return DASHBOARD_TABS.filter((tab) => tab.section === section);
};

/**
 * Get sidebar section config
 */
export const getSidebarSection = (id: SidebarSection): SidebarSectionConfig | undefined => {
  return SIDEBAR_SECTIONS.find((s) => s.id === id);
};

// Aliases for compatibility
export const ALL_DASHBOARD_TABS = DASHBOARD_TABS;

// Export the type for backward compatibility
export type DashboardTabConfig = DashboardTabItem;
