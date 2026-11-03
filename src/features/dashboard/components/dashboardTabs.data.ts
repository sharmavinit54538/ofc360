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
  Briefcase,
  FileText,
  Award,
  ShieldCheck,
  BarChart3,
  FilePlus,
  UserCheck,
  CheckSquare,
  FileCheck,
  Laptop,
  HardDrive,
  Compass,
  Gift,
  ClipboardList,
} from 'lucide-react';
import { GeminiIcon } from '@/shared/ui/GeminiIcon';

// Monochrome wrapper — renders GeminiIcon with currentColor (no gradient)
// so it visually matches all other sidebar icons
const GeminiIconMono: React.FC<{ className?: string }> = ({ className }) =>
  React.createElement(GeminiIcon, { className, useGradient: false });

export type SidebarSection =
  | 'overview'
  | 'workforce'
  | 'talent'
  | 'recruitment'
  | 'attendance'
  | 'payroll'
  | 'reports'
  | 'aihub'
  | 'connect'
  | 'documents'
  | 'hrops'
  | 'settings'
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
  roles?: string[];
  badgeKey?: string;
  badgeVariant?: 'default' | 'destructive';
  condition?: (user: { has_assigned_interviews?: boolean } | null) => boolean;
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
    id: 'recruitment',
    label: 'TALENT & RECRUITMENT',
    icon: Briefcase,
    collapsible: true,
    defaultExpanded: true,
    order: 3,
  },
  {
    id: 'attendance',
    label: 'Attendance',
    icon: CalendarDays,
    collapsible: false,
    order: 4,
  },
  {
    id: 'payroll',
    label: 'Payroll & Benefits',
    icon: CreditCard,
    collapsible: false,
    order: 5,
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: LineChart,
    collapsible: false,
    order: 6,
  },
  {
    id: 'aihub',
    label: 'AI Hub',
    icon: GeminiIconMono,
    collapsible: false,
    order: 7,
  },
  {
    id: 'connect',
    label: 'Connect',
    icon: MessageSquare,
    collapsible: false,
    order: 8,
  },
  {
    id: 'documents',
    label: 'Documents',
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
const WorkforceHubPage = React.lazy(() => import('@/features/workforce/pages/WorkforceHubPage'));
const TalentHubPage = React.lazy(() => import('@/features/talent/pages/TalentHubPage'));
const AttendanceHubPage = React.lazy(() => import('@/features/attendance/pages/AttendanceHubPage'));
const PayrollHubPage = React.lazy(() => import('@/features/payroll/pages/PayrollHubPage'));
const ReportsAnalyticsHubPage = React.lazy(() => import('@/features/analytics/pages/ReportsAnalyticsHubPage'));
const AIHubPage = React.lazy(() => import('@/features/ai-hub/pages/AIHubPage'));
const DocumentsComplianceHubPage = React.lazy(() => import('@/features/documents/pages/DocumentsComplianceHubPage'));
const HrOpsHubPage = React.lazy(() => import('@/features/hr-ops/pages/HrOpsHubPage'));
const ConnectPage = React.lazy(() => import('@/features/connect/pages/ConnectPage'));

// Recruitment pages (lazy loaded)
const RecruitmentDashboardPage = React.lazy(() => import('@/features/recruitment/pages/RecruitmentDashboardPage'));
const RequisitionsPage = React.lazy(() => import('@/features/recruitment/pages/RequisitionsPage'));
const JobOpeningsPage = React.lazy(() => import('@/features/recruitment/pages/JobOpeningsPage'));
const CandidatePipelinePage = React.lazy(() => import('@/features/recruitment/pages/CandidatePipelinePage'));
const InterviewSchedulerPage = React.lazy(() => import('@/features/recruitment/pages/InterviewSchedulerPage'));
const OfferManagementPage = React.lazy(() => import('@/features/recruitment/pages/OfferManagementPage'));
const BGVPage = React.lazy(() => import('@/features/recruitment/pages/BGVPage'));
const RecruitmentReportsPage = React.lazy(() => import('@/features/recruitment/pages/RecruitmentReportsPage'));

const ManagerRequisitionsPage = React.lazy(() => import('@/features/recruitment/pages/ManagerRequisitionsPage'));
const ManagerCandidatesPage = React.lazy(() => import('@/features/recruitment/pages/ManagerCandidatesPage'));
const ManagerInterviewsPage = React.lazy(() => import('@/features/recruitment/pages/ManagerInterviewsPage'));
const ManagerOffersPage = React.lazy(() => import('@/features/recruitment/pages/ManagerOffersPage'));

const ITAdminOnboardingPage = React.lazy(() => import('@/features/recruitment/pages/ITAdminOnboardingPage'));
const ITAdminAssetsPage = React.lazy(() => import('@/features/recruitment/pages/ITAdminAssetsPage'));

const EmployeeCareersPage = React.lazy(() => import('@/features/recruitment/pages/EmployeeCareersPage'));
const EmployeeReferralsPage = React.lazy(() => import('@/features/recruitment/pages/EmployeeReferralsPage'));
const EmployeeInterviewsPage = React.lazy(() => import('@/features/recruitment/pages/EmployeeInterviewsPage'));

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
  // Performance & Appraisal Management
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
  // 4. RECRUITMENT (17 tabs) - TALENT & RECRUITMENT section
  // ==========================================
  // GROUP A: HR_ADMIN & HR_EXECUTIVE (8 Tabs)
  {
    id: 'recruitment-dashboard',
    label: 'Overview Dashboard',
    icon: LayoutDashboard,
    group: 'recruitment',
    section: 'recruitment',
    path: '/recruitment/dashboard',
    component: RecruitmentDashboardPage,
    roles: ['HR_ADMIN', 'HR_EXECUTIVE'],
  },
  {
    id: 'recruitment-requisitions',
    label: 'Job Requisitions',
    icon: FileText,
    group: 'recruitment',
    section: 'recruitment',
    path: '/recruitment/requisitions',
    component: RequisitionsPage,
    roles: ['HR_ADMIN', 'HR_EXECUTIVE'],
    badgeKey: 'pending_req_approvals_count',
    badgeVariant: 'default',
  },
  {
    id: 'recruitment-jobs',
    label: 'Job Openings',
    icon: Briefcase,
    group: 'recruitment',
    section: 'recruitment',
    path: '/recruitment/jobs',
    component: JobOpeningsPage,
    roles: ['HR_ADMIN', 'HR_EXECUTIVE'],
    badgeKey: 'active_openings_count',
    badgeVariant: 'default',
  },
  {
    id: 'recruitment-candidates',
    label: 'Candidates & ATS',
    icon: Users,
    group: 'recruitment',
    section: 'recruitment',
    path: '/recruitment/candidates',
    component: CandidatePipelinePage,
    roles: ['HR_ADMIN', 'HR_EXECUTIVE'],
    badgeKey: 'new_applications_count',
    badgeVariant: 'default',
  },
  {
    id: 'recruitment-interviews',
    label: 'Interview Scheduler',
    icon: CalendarDays,
    group: 'recruitment',
    section: 'recruitment',
    path: '/recruitment/interviews',
    component: InterviewSchedulerPage,
    roles: ['HR_ADMIN', 'HR_EXECUTIVE'],
    badgeKey: 'today_interviews_count',
    badgeVariant: 'default',
  },
  {
    id: 'recruitment-offers',
    label: 'Offer Management',
    icon: Award,
    group: 'recruitment',
    section: 'recruitment',
    path: '/recruitment/offers',
    component: OfferManagementPage,
    roles: ['HR_ADMIN', 'HR_EXECUTIVE'],
    badgeKey: 'pending_offer_approvals_count',
    badgeVariant: 'default',
  },
  {
    id: 'recruitment-bgv',
    label: 'BGV Management',
    icon: ShieldCheck,
    group: 'recruitment',
    section: 'recruitment',
    path: '/recruitment/bgv',
    component: BGVPage,
    roles: ['HR_ADMIN', 'HR_EXECUTIVE'],
    badgeKey: 'bgv_discrepancy_alerts_count',
    badgeVariant: 'destructive',
  },
  {
    id: 'recruitment-reports',
    label: 'Recruitment Reports',
    icon: BarChart3,
    group: 'recruitment',
    section: 'recruitment',
    path: '/recruitment/reports',
    component: RecruitmentReportsPage,
    roles: ['HR_ADMIN', 'HR_EXECUTIVE'],
  },

  // GROUP B: MANAGER (4 Tabs)
  {
    id: 'manager-requisitions',
    label: 'Team Requisitions',
    icon: FilePlus,
    group: 'recruitment',
    section: 'recruitment',
    path: '/manager/requisitions',
    component: ManagerRequisitionsPage,
    roles: ['MANAGER'],
    badgeKey: 'my_open_vacancies_count',
    badgeVariant: 'default',
  },
  {
    id: 'manager-candidates',
    label: 'Candidate Reviews',
    icon: UserCheck,
    group: 'recruitment',
    section: 'recruitment',
    path: '/manager/candidates',
    component: ManagerCandidatesPage,
    roles: ['MANAGER'],
    badgeKey: 'pending_profile_reviews_count',
    badgeVariant: 'default',
  },
  {
    id: 'manager-interviews',
    label: 'Panel Interviews',
    icon: CheckSquare,
    group: 'recruitment',
    section: 'recruitment',
    path: '/manager/interviews',
    component: ManagerInterviewsPage,
    roles: ['MANAGER'],
    badgeKey: 'overdue_scorecards_count',
    badgeVariant: 'destructive',
  },
  {
    id: 'manager-offers',
    label: 'Offer Approvals',
    icon: FileCheck,
    group: 'recruitment',
    section: 'recruitment',
    path: '/manager/offers',
    component: ManagerOffersPage,
    roles: ['MANAGER'],
    badgeKey: 'pending_my_offer_approvals_count',
    badgeVariant: 'default',
  },

  // GROUP C: IT_ADMIN (2 Tabs)
  {
    id: 'itadmin-onboarding',
    label: 'Onboarding IT Queue',
    icon: Laptop,
    group: 'recruitment',
    section: 'recruitment',
    path: '/it-admin/onboarding-queue',
    component: ITAdminOnboardingPage,
    roles: ['IT_ADMIN'],
    badgeKey: 'pending_it_provisioning_count',
    badgeVariant: 'default',
  },
  {
    id: 'itadmin-assets',
    label: 'Asset Allocation',
    icon: HardDrive,
    group: 'recruitment',
    section: 'recruitment',
    path: '/it-admin/assets',
    component: ITAdminAssetsPage,
    roles: ['IT_ADMIN'],
  },

  // GROUP D: EMPLOYEE (3 Tabs)
  {
    id: 'employee-careers',
    label: 'Internal Careers (IJP)',
    icon: Compass,
    group: 'recruitment',
    section: 'recruitment',
    path: '/careers/internal',
    component: EmployeeCareersPage,
    roles: ['EMPLOYEE'],
  },
  {
    id: 'employee-referrals',
    label: 'My Referrals',
    icon: Gift,
    group: 'recruitment',
    section: 'recruitment',
    path: '/employee/referrals',
    component: EmployeeReferralsPage,
    roles: ['EMPLOYEE'],
    badgeKey: 'active_referral_updates_count',
    badgeVariant: 'default',
  },
  {
    id: 'employee-interviews',
    label: 'Assigned Interviews',
    icon: ClipboardList,
    group: 'recruitment',
    section: 'recruitment',
    path: '/employee/interviews',
    component: EmployeeInterviewsPage,
    roles: ['EMPLOYEE'],
    badgeKey: 'pending_scorecards_count',
    badgeVariant: 'default',
    condition: (user) => Boolean(user?.has_assigned_interviews),
  },

  // ==========================================
  // 5. ATTENDANCE (1 tab - links to /dashboard/attendance)
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
  // 6. PAYROLL & BENEFITS (1 tab - links to /dashboard/payroll)
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
  // 7. Reports (1 tab - links to /dashboard/reports)
  // ==========================================
  {
    id: 'reports',
    label: 'Reports',
    icon: LineChart,
    group: 'reports',
    section: 'reports',
    path: '/dashboard/reports',
    component: ReportsAnalyticsHubPage,
  },

  // ==========================================
  // 8. AI Hub (1 tab - links to /dashboard/ai-hub)
  // ==========================================
  {
    id: 'aihub',
    label: 'AI Hub',
    icon: GeminiIconMono,
    group: 'aihub',
    section: 'aihub',
    path: '/dashboard/ai-hub',
    component: AIHubPage,
  },

  // ==========================================
  // 9. CONNECT (1 tab - links to /dashboard/connect)
  // ==========================================
  {
    id: 'connect',
    label: 'Connect',
    icon: MessageSquare,
    group: 'connect',
    section: 'connect',
    path: '/dashboard/connect',
    component: ConnectPage,
  },

  // ==========================================
  // 10. Documents (1 tab - links to /dashboard/documents)
  // ==========================================
  {
    id: 'documents',
    label: 'Documents',
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
  'recruitment': 'talent',
  'performance': 'talent',
  'performance-dashboard': 'talent',
  'leave': 'attendance',
  'leaves': 'attendance',
  'ai-insights': 'analytics-center',
  'hrops-dashboard': 'hrops',
  'all-jobs': 'talent',
  'requisitions': 'recruitment-requisitions',
  'candidates': 'recruitment-candidates',
  'pipeline': 'recruitment-candidates',
  'interviews': 'recruitment-interviews',
  'offers': 'recruitment-offers',
  'aihub-dashboard': 'aihub',
  'chat-assistant': 'aihub',
  'meeting-intelligence': 'aihub',
  'ai-recruiter': 'aihub',
  'workforce-insights': 'aihub',
  'autonomous-workflows': 'aihub',
  'analytics-center': 'reports',
  'hiring-reports': 'reports',
  'recruitment-analytics': 'recruitment-reports',
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
  'exit-management': 'hrops',
  'offboarding': 'hrops',
  'job-requisitions': 'recruitment-requisitions',
  'job-openings': 'recruitment-jobs',
  'ats-pipeline': 'recruitment-candidates',
  'interview-scheduler': 'recruitment-interviews',
  'offer-management': 'recruitment-offers',
  'bgv-management': 'recruitment-bgv',
  'recruitment-reports': 'recruitment-reports',
  'team-requisitions': 'manager-requisitions',
  'candidate-reviews': 'manager-candidates',
  'panel-interviews': 'manager-interviews',
  'offer-approvals': 'manager-offers',
  'onboarding-queue': 'itadmin-onboarding',
  'asset-allocation': 'itadmin-assets',
  'internal-careers': 'employee-careers',
  'ijp': 'employee-careers',
  'my-referrals': 'employee-referrals',
  'assigned-interviews': 'employee-interviews',
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