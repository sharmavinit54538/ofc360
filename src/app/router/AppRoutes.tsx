import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage';
import { VerifyResetOtpPage } from '@/features/auth/pages/VerifyResetOtpPage';
import { ResetPasswordPage } from '@/features/auth/pages/ResetPasswordPage';
import { VerifyEmailPage } from '@/features/auth/pages/VerifyEmailPage';

import { SuperAdminDashboard } from '@/features/dashboard/pages/SuperAdminDashboard';
import { HRAdminDashboard } from '@/features/dashboard/pages/HRAdminDashboard';
import { ManagerDashboard } from '@/features/dashboard/pages/ManagerDashboard';
import { EmployeeDashboard } from '@/features/dashboard/pages/EmployeeDashboard';
import { ITAdminDashboard } from '@/features/dashboard/pages/ITAdminDashboard';
import { DashboardTravelRoute } from '@/routes/dashboard.travel';
import { DashboardExpensesRoute } from '@/routes/dashboard.expenses';
import { DashboardExitManagementRoute } from '@/routes/dashboard.exit-management';
import { DashboardOnboardingChecklistRoute } from '@/routes/dashboard.onboarding-checklist';
import { DashboardVisitorsRoute } from '@/routes/dashboard.visitors';
import { DashboardAssetManagementRoute } from '@/routes/dashboard.asset-management';
import { DashboardTimelineRoute } from '@/routes/dashboard.timeline';
import { DashboardHrOpsRoute } from '@/routes/dashboard.hr-ops';
import { DashboardWorkforceRoute } from '@/routes/dashboard.workforce';
import { DashboardEmployeeProfileRoute } from '@/routes/dashboard.employee-profile';
import { DashboardTalentRoute } from '@/routes/dashboard.talent';
import { DashboardDocumentsRoute } from '@/routes/dashboard.documents';
import { DashboardPayrollRoute } from '@/routes/dashboard.payroll';
import { AIAnalyticsCenterRoute } from '@/routes/ai.analytics-center';
import { DashboardReportsRoute } from '@/routes/dashboard.reports';
import { AIChatAssistantRoute } from '@/routes/ai.chat-assistant';
import { AIMeetingIntelligenceRoute } from '@/routes/ai.meeting-intelligence';
import { DashboardAIHubRoute } from '@/routes/dashboard.ai-hub';
import { AIDocumentGeneratorRoute } from '@/routes/ai.document-generator';
import { AIAutonomousWorkflowsRoute } from '@/routes/ai.autonomous-workflows';
import { DashboardConnectRoute } from '@/routes/dashboard.connect';
import { DashboardRecruitmentRoute } from '@/routes/dashboard.recruitment';
import { DashboardAttendanceRoute } from '@/routes/dashboard.attendance';
import { DashboardAttendanceShiftsRoute } from '@/routes/dashboard.attendance.shifts';
import { DashboardAttendanceRostersRoute } from '@/routes/dashboard.attendance.rosters';
import { DashboardAttendanceHolidaysRoute } from '@/routes/dashboard.attendance.holidays';
import { UnauthorizedPage } from '@/features/dashboard/pages/UnauthorizedPage';
import { NotFoundPage } from '@/shared/pages/NotFoundPage';

// Recruitment Module (lazy loaded)
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

// Settings Module
import { SettingsLayout } from '@/features/settings/components/SettingsLayout';
import { SettingsOverview } from '@/features/settings/components/SettingsOverview';
import { CompanySection } from '@/features/settings/components/CompanySection';
import { EmployeesSection } from '@/features/settings/components/EmployeesSection';
import { AttendanceSection } from '@/features/settings/components/AttendanceSection';
import { LeaveSection } from '@/features/settings/components/LeaveSection';
import { PayrollSection } from '@/features/settings/components/PayrollSection';
import { DocumentsSection } from '@/features/settings/components/DocumentsSection';
import { AssetsSection } from '@/features/settings/components/AssetsSection';
import { NotificationsSection } from '@/features/settings/components/NotificationsSection';
import { MyProfileSection } from '@/features/settings/components/MyProfileSection';

// Exit Management Module (14-Stage Workflow)
const ExitManagementPage = React.lazy(() => import('@/features/exit-management/pages/ExitManagementPage'));
const ExitStagePage = React.lazy(() => import('@/features/exit-management/pages/ExitStagePage'));
const DashboardExitStageRoute = React.lazy(() => import('@/routes/dashboard.exit-stage'));
const MyExitPage = React.lazy(() => import('@/features/exit-management/pages/MyExitPage'));
const ExitApprovalsPage = React.lazy(() => import('@/features/exit-management/pages/ExitApprovalsPage'));
const ExitNoticePeriodPage = React.lazy(() => import('@/features/exit-management/pages/ExitNoticePeriodPage'));
const ExitKnowledgeTransferPage = React.lazy(() => import('@/features/exit-management/pages/ExitKnowledgeTransferPage'));
const ExitAssetRecoveryPage = React.lazy(() => import('@/features/exit-management/pages/ExitAssetRecoveryPage'));
const ExitClearancePage = React.lazy(() => import('@/features/exit-management/pages/ExitClearancePage'));
const ExitFnFPage = React.lazy(() => import('@/features/exit-management/pages/ExitFnFPage'));
const ExitInterviewPage = React.lazy(() => import('@/features/exit-management/pages/ExitInterviewPage'));
const ExitDocumentsPage = React.lazy(() => import('@/features/exit-management/pages/ExitDocumentsPage'));
const ExitAccessDeactivationPage = React.lazy(() => import('@/features/exit-management/pages/ExitAccessDeactivationPage'));
const ExitedEmployeesPage = React.lazy(() => import('@/features/exit-management/pages/ExitedEmployeesPage'));
const ExitAnalyticsPage = React.lazy(() => import('@/features/exit-management/pages/ExitAnalyticsPage'));
const ExitSettingsPage = React.lazy(() => import('@/features/exit-management/pages/ExitSettingsPage'));

import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ROLE_DASHBOARD_ROUTES, normalizeRole } from '@/features/auth/types/auth.types';

// Helper to resolve role-based dashboard destination
export const getDashboardRouteForRole = (role?: string | null): string => {
  if (!role) return '/dashboard/employee';
  const canonical = normalizeRole(role);
  return (
    ROLE_DASHBOARD_ROUTES[canonical] ||
    ROLE_DASHBOARD_ROUTES[role] ||
    ROLE_DASHBOARD_ROUTES[role.toLowerCase()] ||
    '/dashboard/employee'
  );
};

// Dynamic Index Root Redirection based on Auth State
const RootRedirect: React.FC = () => {
  const { isAuthenticated, activeRole, role, user, accessToken, isInitialized } = useAuth();

  const storedToken =
    typeof window !== 'undefined'
      ? localStorage.getItem('ofc360_access_token') || sessionStorage.getItem('ofc360_access_token')
      : null;
  const hasToken = Boolean(accessToken) || Boolean(storedToken);
  const isAuthed = isAuthenticated || hasToken;

  // Wait for auth initialization to complete before making redirect decisions
  // This prevents redirect loops and premature navigation during hydration
  if (!isInitialized) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-[#212121] p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-3 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
          <p className="text-sm font-medium text-gray-900 dark:text-[#ececec]">Initializing session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthed) {
    return <Navigate to="/auth/login" replace />;
  }

  let storedRole: string | null = null;
  if (typeof window !== 'undefined') {
    storedRole =
      localStorage.getItem('ofc360_active_role') || sessionStorage.getItem('ofc360_active_role');
    if (!storedRole) {
      try {
        const rawUser =
          localStorage.getItem('ofc360_user_session') || sessionStorage.getItem('ofc360_user_session');
        if (rawUser) {
          const parsed = JSON.parse(rawUser);
          storedRole = parsed.activeRole || parsed.role || (parsed.roles && parsed.roles[0]);
        }
      } catch { }
    }
  }

  const effectiveRole =
    activeRole ||
    role ||
    user?.activeRole ||
    (user as any)?.role ||
    (user?.roles && user.roles[0]) ||
    storedRole ||
    'EMPLOYEE';

  const destination = getDashboardRouteForRole(effectiveRole);
  return <Navigate to={destination} replace />;
};

export const AppRoutes: React.FC = () => {
  // Root-level Suspense boundary for all lazy-loaded route components
  // This prevents "A component suspended while responding to synchronous input" errors
  // when navigating between routes with React.lazy() components
  const RouteSuspenseFallback = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-[#212121] p-6">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-3 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
        <p className="text-sm font-medium text-gray-900 dark:text-[#ececec]">Loading page...</p>
      </div>
    </div>
  );

  return (
    <Suspense fallback={<RouteSuspenseFallback />}>
      <Routes>
      {/* Root Redirection */}
      <Route path="/" element={<RootRedirect />} />
      <Route path="/dashboard" element={<RootRedirect />} />

      {/* Top-Level Route Aliases */}
      <Route path="/super-admin" element={<Navigate to="/dashboard/super-admin" replace />} />
      <Route path="/superadmin" element={<Navigate to="/dashboard/super-admin" replace />} />
      <Route path="/dashboard/superadmin" element={<Navigate to="/dashboard/super-admin" replace />} />
      <Route path="/hr-admin" element={<Navigate to="/dashboard/hr-admin" replace />} />
      <Route path="/admin" element={<Navigate to="/dashboard/hr-admin" replace />} />
      <Route path="/dashboard/admin" element={<Navigate to="/dashboard/hr-admin" replace />} />
      <Route path="/manager" element={<Navigate to="/dashboard/manager" replace />} />
      <Route path="/employee" element={<Navigate to="/dashboard/employee" replace />} />
      <Route path="/it-admin" element={<Navigate to="/dashboard/it-admin" replace />} />

      {/* Public Authentication Pages */}
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/auth/verify-reset-otp" element={<VerifyResetOtpPage />} />
      <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
      <Route path="/auth/verify-email" element={<VerifyEmailPage />} />

      {/* Role-Based Protected Dashboards */}
      <Route
        path="/dashboard/super-admin"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
            <SuperAdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/hr-admin"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_ADMIN']}>
            <HRAdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/manager"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER']}>
            <ManagerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/employee"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/it-admin"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'IT_ADMIN']}>
            <ITAdminDashboard />
          </ProtectedRoute>
        }
      />


      {/* Corporate Travel Requests & Approvals */}
      <Route
        path="/dashboard/travel"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE']}
          >
            <DashboardTravelRoute />
          </ProtectedRoute>
        }
      />

      {/* Corporate Expense Claims & Reimbursements */}
      <Route
        path="/dashboard/expenses"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE']}
          >
            <DashboardExpensesRoute />
          </ProtectedRoute>
        }
      />

      {/* Exit Management & Offboarding 14-Stage Nested Workflow */}
      <Route
        path="/dashboard/exit-management"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <DashboardExitManagementRoute />
          </ProtectedRoute>
        }
      >
        <Route index element={<ExitManagementPage />} />
        <Route path="overview" element={<ExitManagementPage />} />
        <Route
          path="my-exit"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}>
              <MyExitPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="approvals"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER']}>
              <ExitApprovalsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="notice-period"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER']}>
              <ExitNoticePeriodPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="knowledge-transfer"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER']}>
              <ExitKnowledgeTransferPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="asset-recovery"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'IT_ADMIN']}>
              <ExitAssetRecoveryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="clearance"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'IT_ADMIN']}>
              <ExitClearancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="fnf"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_ADMIN']}>
              <ExitFnFPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="interview"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_ADMIN']}>
              <ExitInterviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="documents"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER']}>
              <ExitDocumentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="access-deactivation"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'IT_ADMIN']}>
              <ExitAccessDeactivationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="exited-employees"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'IT_ADMIN']}>
              <ExitedEmployeesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="analytics"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER']}>
              <ExitAnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="settings"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_ADMIN']}>
              <ExitSettingsPage />
            </ProtectedRoute>
          }
        />
        <Route path="stage/:stageSlug" element={<ExitStagePage />} />
        <Route path="stages" element={<ExitStagePage />} />
        <Route path="resignation-submitted" element={<ExitStagePage />} />
        <Route path="manager-review" element={<ExitStagePage />} />
        <Route path="hr-review" element={<ExitStagePage />} />
        <Route path="clearance-pending" element={<ExitStagePage />} />
        <Route path="fnf-settlement" element={<ExitStagePage />} />
        <Route path="exit-interview" element={<ExitStagePage />} />
        <Route path="documents-pending" element={<ExitStagePage />} />
        <Route path="access-revocation" element={<ExitStagePage />} />
        <Route path="completed" element={<ExitStagePage />} />
        <Route path="rejected" element={<ExitStagePage />} />
        <Route path="withdrawn" element={<ExitStagePage />} />
      </Route>
      <Route
        path="/dashboard/my-exit"
        element={<Navigate to="/dashboard/exit-management/my-exit" replace />}
      />

      {/* Dedicated Exit Management Stage Pages (All 14 KPI Routes) */}
      <Route
        path="/exit-management/:stageSlug"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <DashboardExitStageRoute />
          </ProtectedRoute>
        }
      />
      <Route
        path="/exit-management"
        element={<Navigate to="/exit-management/stages" replace />}
      />

      {/* Employee Onboarding Checklist & Progress */}
      <Route
        path="/dashboard/onboarding-checklist"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE']}
          >
            <DashboardOnboardingChecklistRoute />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/onboarding"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE']}
          >
            <DashboardOnboardingChecklistRoute />
          </ProtectedRoute>
        }
      />

      {/* Visitor Management & Facility Access */}
      <Route
        path="/dashboard/visitors"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <DashboardVisitorsRoute />
          </ProtectedRoute>
        }
      />

      {/* Asset Management & Equipment Inventory */}
      <Route
        path="/dashboard/asset-management"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <DashboardAssetManagementRoute />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/assets"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <DashboardAssetManagementRoute />
          </ProtectedRoute>
        }
      />

      {/* Employee Career Timeline & Milestones */}
      <Route
        path="/dashboard/timeline"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <DashboardTimelineRoute />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/employee-timeline"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <DashboardTimelineRoute />
          </ProtectedRoute>
        }
      />

      {/* HR Operations Command Center & Dispatch */}
      <Route
        path="/dashboard/hr-ops"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <DashboardHrOpsRoute />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/hrops"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <DashboardHrOpsRoute />
          </ProtectedRoute>
        }
      />

      {/* Workforce Management Hub (Employees, Managers, Departments) */}
      <Route
        path="/dashboard/workforce/employees/:employeeId"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <DashboardEmployeeProfileRoute />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/employees/:employeeId"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <DashboardEmployeeProfileRoute />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/workforce"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <DashboardWorkforceRoute />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/employees"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <DashboardWorkforceRoute />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/managers"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <DashboardWorkforceRoute />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/departments"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <DashboardWorkforceRoute />
          </ProtectedRoute>
        }
      />

      {/* Talent & Performance Management Hub */}
      <Route
        path="/dashboard/talent"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <DashboardTalentRoute />
          </ProtectedRoute>
        }
      />

      {/* Recruitment Management System (RMS/ATS) */}
      {/* HR_ADMIN & HR_EXECUTIVE routes */}
      <Route
        path="/recruitment/dashboard"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'HR_EXECUTIVE']}>
            <DashboardRecruitmentRoute />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruitment/requisitions"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'HR_EXECUTIVE']}>
            <RequisitionsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruitment/jobs"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'HR_EXECUTIVE']}>
            <JobOpeningsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruitment/candidates"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'HR_EXECUTIVE']}>
            <CandidatePipelinePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruitment/interviews"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'HR_EXECUTIVE', 'MANAGER']}>
            <InterviewSchedulerPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruitment/offers"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'HR_EXECUTIVE']}>
            <OfferManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruitment/bgv"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'HR_EXECUTIVE']}>
            <BGVPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruitment/reports"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'HR_EXECUTIVE']}>
            <RecruitmentReportsPage />
          </ProtectedRoute>
        }
      />

      {/* MANAGER routes */}
      <Route
        path="/manager/requisitions"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER']}>
            <ManagerRequisitionsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/candidates"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER']}>
            <ManagerCandidatesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/interviews"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER']}>
            <ManagerInterviewsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/offers"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER']}>
            <ManagerOffersPage />
          </ProtectedRoute>
        }
      />

      {/* IT_ADMIN routes */}
      <Route
        path="/it-admin/onboarding-queue"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'IT_ADMIN']}>
            <ITAdminOnboardingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/it-admin/assets"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'IT_ADMIN']}>
            <ITAdminAssetsPage />
          </ProtectedRoute>
        }
      />

      {/* EMPLOYEE routes */}
      <Route
        path="/careers/internal"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}>
            <EmployeeCareersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/referrals"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}>
            <EmployeeReferralsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/interviews"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}>
            <EmployeeInterviewsPage />
          </ProtectedRoute>
        }
      />

      {/* Legacy redirects */}
      <Route
        path="/dashboard/recruitment"
        element={<Navigate to="/recruitment/dashboard" replace />}
      />
      <Route
        path="/dashboard/performance"
        element={<Navigate to="/dashboard/talent" replace />}
      />

      {/* Documents Hub */}
      <Route
        path="/dashboard/documents"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <DashboardDocumentsRoute />
          </ProtectedRoute>
        }
      />
      {/* Payroll Processing & Payslips */}
      <Route
        path="/dashboard/payroll"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <DashboardPayrollRoute />
          </ProtectedRoute>
        }
      />

      {/* Leave Management redirected into Attendance Hub */}
      <Route
        path="/dashboard/leave"
        element={<Navigate to="/dashboard/attendance?tab=leave" replace />}
      />
      <Route
        path="/dashboard/leaves"
        element={<Navigate to="/dashboard/attendance?tab=leave" replace />}
      />
      <Route
        path="/dashboard/attendance/leave"
        element={<Navigate to="/dashboard/attendance?tab=leave" replace />}
      />

      {/* Workforce Analytics & AI Intelligence Center */}
      <Route
        path="/dashboard/reports"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <DashboardReportsRoute />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/analytics"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <AIAnalyticsCenterRoute />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai/analytics-center"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <AIAnalyticsCenterRoute />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/ai-insights"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <AIAnalyticsCenterRoute />
          </ProtectedRoute>
        }
      />

      {/* AI Hub Conversational Assistant */}
      <Route
        path="/ai/chat-assistant"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <AIChatAssistantRoute />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/ai-hub/assistant"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <AIChatAssistantRoute />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/chat-assistant"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <AIChatAssistantRoute />
          </ProtectedRoute>
        }
      />

      {/* AI Meeting Intelligence & Action Tracking */}
      <Route
        path="/ai/meeting-intelligence"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <AIMeetingIntelligenceRoute />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/ai-hub/meetings"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <AIMeetingIntelligenceRoute />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/meeting-intelligence"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <AIMeetingIntelligenceRoute />
          </ProtectedRoute>
        }
      />

      {/* AI Hub Document Generator */}
      <Route
        path="/ai/document-generator"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <AIDocumentGeneratorRoute />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/ai-hub/document-generator"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <AIDocumentGeneratorRoute />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/document-generator"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <AIDocumentGeneratorRoute />
          </ProtectedRoute>
        }
      />

      {/* AI Hub Autonomous Workflows */}
      <Route
        path="/ai/autonomous-workflows"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <AIAutonomousWorkflowsRoute />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/ai-hub/workflows"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <AIAutonomousWorkflowsRoute />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/autonomous-workflows"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <AIAutonomousWorkflowsRoute />
          </ProtectedRoute>
        }
      />

      {/* AI Hub Control Center */}
      <Route
        path="/dashboard/ai-hub"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <DashboardAIHubRoute />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/aihub"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <DashboardAIHubRoute />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai/hub"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <DashboardAIHubRoute />
          </ProtectedRoute>
        }
      />

      {/* OFC360 Connect - Employee-to-Employee Real-Time Chat */}
      <Route
        path="/dashboard/connect"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <DashboardConnectRoute />
          </ProtectedRoute>
        }
      />

      {/* Attendance Hub & Workforce Time */}
      <Route
        path="/dashboard/attendance"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <DashboardAttendanceRoute />
          </ProtectedRoute>
        }
      />

      {/* Workforce Attendance: Shifts, Rosters & Holidays */}
      <Route
        path="/dashboard/attendance/shifts"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <DashboardAttendanceShiftsRoute />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/attendance/rosters"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <DashboardAttendanceRostersRoute />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/attendance/holidays"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <DashboardAttendanceHolidaysRoute />
          </ProtectedRoute>
        }
      />

      {/* Settings Module */}
      <Route
        path="/settings/*"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'IT_ADMIN', 'EMPLOYEE']}
          >
            <SettingsLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<SettingsOverview />} />
        <Route path="company" element={<CompanySection />} />
        <Route path="employees" element={<EmployeesSection />} />
        <Route path="attendance" element={<AttendanceSection />} />
        <Route path="leave" element={<LeaveSection />} />
        <Route path="payroll" element={<PayrollSection />} />
        <Route path="documents" element={<DocumentsSection />} />
        <Route path="assets" element={<AssetsSection />} />
        <Route path="notifications" element={<NotificationsSection />} />
        <Route path="profile" element={<MyProfileSection />} />
      </Route>

      {/* 403 Forbidden Access Screen */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Suspense>
);
};

export default AppRoutes;
