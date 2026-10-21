import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { VerifyResetOtpPage } from '@/pages/auth/VerifyResetOtpPage';
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage';
import { VerifyEmailPage } from '@/pages/auth/VerifyEmailPage';

import { SuperAdminDashboard } from '@/pages/dashboard/SuperAdminDashboard';
import { HRAdminDashboard } from '@/pages/dashboard/HRAdminDashboard';
import { ManagerDashboard } from '@/pages/dashboard/ManagerDashboard';
import { EmployeeDashboard } from '@/pages/dashboard/EmployeeDashboard';
import { ITAdminDashboard } from '@/pages/dashboard/ITAdminDashboard';
import { UnauthorizedPage } from '@/pages/dashboard/UnauthorizedPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
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
