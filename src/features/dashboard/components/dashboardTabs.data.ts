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
    collapsible: true,
    defaultExpanded: true,
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
    collapsible: true,
    defaultExpanded: true,
    order: 7,
  },
  {
    id: 'aihub',
    label: 'AI Intelligence Hub',
    icon: Bot,
    collapsible: true,
    defaultExpanded: true,
    order: 8,
  },
  {
    id: 'documents',
    label: 'Documents & Compliance',
    icon: FolderKanban,
    collapsible: true,
    defaultExpanded: true,
    order: 9,
  },
  {
    id: 'hrops',
    label: 'HR Operations',
    icon: Activity,
    collapsible: true,
    defaultExpanded: true,
    order: 10,
  },
  {
    id: 'settings',
    label: 'Settings & Integrations',
    icon: Settings,
    collapsible: true,
    defaultExpanded: false,
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
  // 3. RECRUITMENT (27 tabs) - Collapsible group
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
  // 4. ATTENDANCE & TIME (5 tabs: 1 parent + 4 children) - Collapsible group
  // ==========================================
  {
    id: 'attendance',
    label: 'Attendance',
    icon: CalendarDays,
    group: 'attendance',
    section: 'attendance',
    component: ComingSoonView,
    children: [
      {
        id: 'attendance-shifts',
        label: 'Shifts',
        icon: Clock,
        path: '/dashboard/attendance/shifts',
        group: 'attendance',
        section: 'attendance',
        component: ShiftsView,
      },
      {
        id: 'attendance-rosters',
        label: 'Rosters',
        icon: ScrollText,
        path: '/dashboard/attendance/rosters',
        group: 'attendance',
        section: 'attendance',
        component: RostersView,
      },
      {
        id: 'attendance-holidays',
        label: 'Holidays',
        icon: Palmtree,
        path: '/dashboard/attendance/holidays',
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
  // 8. REPORTS & ANALYTICS (4 tabs) - Collapsible group
  // ==========================================
  {
    id: 'ai-insights',
    label: 'AI Insights',
    icon: Sparkles,
    group: 'reports',
    section: 'reports',
    component: AnalyticsCenterPage,
  },
  {
    id: 'hiring-reports',
    label: 'Hiring Reports',
    icon: BarChart2,
    group: 'reports',
    section: 'reports',
    component: ComingSoonView,
  },
  {
    id: 'recruitment-analytics',
    label: 'Recruitment Analytics',
    icon: LineChart,
    group: 'reports',
    section: 'reports',
    component: ComingSoonView,
  },
  {
    id: 'analytics-center',
    label: 'Analytics Center',
    icon: LineChart,
    group: 'reports',
    section: 'reports',
    component: AnalyticsCenterPage,
  },

  // ==========================================
  // 9. AI INTELLIGENCE HUB (17 tabs) - Collapsible group
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
    label: 'AI Recruiter',
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
    icon: GeminiIcon,
    group: 'aihub',
    section: 'aihub',
    component: ChatAssistantPage,
  },
  {
    id: 'recruitment-ai',
    label: 'Recruitment AI',
    icon: Sparkles,
    group: 'aihub',
    section: 'aihub',
    component: ComingSoonView,
  },
  {
    id: 'ai-copilot',
    label: 'AI Copilot',
    icon: Bot,
    group: 'aihub',
    section: 'aihub',
    component: ComingSoonView,
  },

  // ==========================================
  // 10. DOCUMENTS & COMPLIANCE (5 tabs) - Collapsible group
  // ==========================================
  {
    id: 'documents',
    label: 'Documents',
    icon: FolderKanban,
    group: 'documents',
    section: 'documents',
    component: ComingSoonView,
  },
  {
    id: 'recruitment-compliance',
    label: 'Recruitment Compliance',
    icon: ShieldCheck,
    group: 'documents',
    section: 'documents',
    component: ComingSoonView,
  },
  {
    id: 'compliance-monitor',
    label: 'Compliance Monitor',
    icon: ShieldAlert,
    group: 'documents',
    section: 'documents',
    component: ComingSoonView,
  },
  {
    id: 'policy-assistant',
    label: 'Policy Assistant',
    icon: BookOpen,
    group: 'documents',
    section: 'documents',
    component: ComingSoonView,
  },
  {
    id: 'document-generator',
    label: 'Document Generator',
    icon: FilePlus2,
    group: 'documents',
    section: 'documents',
    component: ComingSoonView,
  },

  // ==========================================
  // 11. HR OPERATIONS (9 tabs) - Collapsible group
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
    id: 'exit-management',
    label: 'Exit Management',
    icon: LogOut,
    group: 'hrops',
    section: 'hrops',
    component: ExitManagementPage,
  },

  // ==========================================
  // 12. SETTINGS & INTEGRATIONS (1 tab - links to /settings)
  // ==========================================
  {
    id: 'settings',
    label: 'Settings & Integrations',
    icon: Settings,
    group: 'settings',
    section: 'settings',
    path: '/settings',
    component: ComingSoonView,
  },
];

export const getTabConfig = (id: string): DashboardTabItem | undefined => {
  return DASHBOARD_TABS.find((tab) => tab.id === id);
};

export const getTabsBySection = (section: SidebarSection): DashboardTabItem[] => {
  return DASHBOARD_TABS.filter((tab) => tab.section === section);
};

export const getSidebarSection = (id: SidebarSection): SidebarSectionConfig | undefined => {
  return SIDEBAR_SECTIONS.find((s) => s.id === id);
};

export const ALL_DASHBOARD_TABS = DASHBOARD_TABS;

export type DashboardTabConfig = DashboardTabItem;