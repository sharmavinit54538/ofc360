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
import { UnauthorizedPage } from '@/features/dashboard/pages/UnauthorizedPage';
import { NotFoundPage } from '@/shared/pages/NotFoundPage';

import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ROLE_DASHBOARD_ROUTES } from '@/features/auth/types/auth.types';

// Dynamic Index Root Redirection based on Auth State
const RootRedirect: React.FC = () => {
  const { isAuthenticated, activeRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  const destination = (activeRole && ROLE_DASHBOARD_ROUTES[activeRole]) || '/dashboard/employee';
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

      {/* 403 Forbidden Access Screen */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
