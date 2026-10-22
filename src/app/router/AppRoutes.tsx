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
import { UnauthorizedPage } from '@/features/dashboard/pages/UnauthorizedPage';
import { NotFoundPage } from '@/shared/pages/NotFoundPage';

// Settings Module
import { SettingsLayout } from '@/features/settings/components/SettingsLayout';
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

// Dynamic Index Root Redirection based on Auth State
const RootRedirect: React.FC = () => {
  const { isAuthenticated, activeRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  const destination = (activeRole && ROLE_DASHBOARD_ROUTES[normalizeRole(activeRole)]) || '/dashboard/employee';
  return <Navigate to={destination} replace />;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Root Redirection */}
      <Route path="/" element={<RootRedirect />} />

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
        <Route index element={<Navigate to="/settings/company" replace />} />
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
