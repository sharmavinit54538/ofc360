import React from 'react';
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
import { DashboardRecruitmentRoute } from '@/routes/dashboard.recruitment';
import { DashboardDocumentsRoute } from '@/routes/dashboard.documents';
import { DashboardLeaveRoute } from '@/routes/dashboard.leave';
import { DashboardPerformanceRoute } from '@/routes/dashboard.performance';
import { AIAnalyticsCenterRoute } from '@/routes/ai.analytics-center';
import { DashboardReportsRoute } from '@/routes/dashboard.reports';
import { AIChatAssistantRoute } from '@/routes/ai.chat-assistant';
import { AIMeetingIntelligenceRoute } from '@/routes/ai.meeting-intelligence';
import { DashboardAIHubRoute } from '@/routes/dashboard.ai-hub';
import { DashboardAttendanceRoute } from '@/routes/dashboard.attendance';
import { DashboardAttendanceShiftsRoute } from '@/routes/dashboard.attendance.shifts';
import { DashboardAttendanceRostersRoute } from '@/routes/dashboard.attendance.rosters';
import { DashboardAttendanceHolidaysRoute } from '@/routes/dashboard.attendance.holidays';
import { UnauthorizedPage } from '@/features/dashboard/pages/UnauthorizedPage';
import { NotFoundPage } from '@/shared/pages/NotFoundPage';

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
  const { isAuthenticated, activeRole, role, user, accessToken } = useAuth();

  const storedToken =
    typeof window !== 'undefined'
      ? localStorage.getItem('ofc360_access_token') || sessionStorage.getItem('ofc360_access_token')
      : null;
  const hasToken = Boolean(accessToken) || Boolean(storedToken);
  const isAuthed = isAuthenticated || hasToken;

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
      } catch {}
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
  return (
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

      {/* Recruitment & Talent Acquisition Hub */}
      <Route
        path="/dashboard/recruitment"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER']}
          >
            <DashboardRecruitmentRoute />
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

      {/* Exit Management & Offboarding */}
      <Route
        path="/dashboard/exit-management"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER']}
          >
            <DashboardExitManagementRoute />
          </ProtectedRoute>
        }
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
        path="/dashboard/workforce"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <DashboardWorkforceRoute />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/employees"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <DashboardWorkforceRoute />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/managers"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <DashboardWorkforceRoute />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/departments"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <DashboardWorkforceRoute />
          </ProtectedRoute>
        }
      />

      {/* Recruitment Hub & Applicant Pipeline */}
      <Route
        path="/dashboard/recruitment"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <DashboardRecruitmentRoute />
          </ProtectedRoute>
        }
      />

      {/* Documents & Compliance Hub */}
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
      {/* Leave Management & Time Off */}
      <Route
        path="/dashboard/leave"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <DashboardLeaveRoute />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/leaves"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <DashboardLeaveRoute />
          </ProtectedRoute>
        }
      />

      {/* Performance Reviews, OKRs & Appraisals */}
      <Route
        path="/dashboard/performance"
        element={
          <ProtectedRoute
            allowedRoles={['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']}
          >
            <DashboardPerformanceRoute />
          </ProtectedRoute>
        }
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

      {/* AI Intelligence Hub Control Center */}
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
  );
};

export default AppRoutes;
