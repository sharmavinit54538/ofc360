/**
 * @file ProtectedRoute.tsx
 * @description Enterprise Route Guard verifying user session integrity, authentication state,
 * and role-based clearance before rendering protected route trees.
 */

import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole, Permission, ROLE_DASHBOARD_ROUTES } from '../types/auth.types';
import { AuthLoadingScreen } from '@/components/layout/AuthLoadingScreen';

export interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRoles?: UserRole[];
  requiredPermissions?: Permission[];
  requireAllPermissions?: boolean;
  requireVerifiedEmail?: boolean;
  redirectUnauthenticatedTo?: string;
  redirectUnauthorizedTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requiredPermissions,
  requireAllPermissions = false,
  requireVerifiedEmail = false,
  redirectUnauthenticatedTo = '/auth/login',
  redirectUnauthorizedTo = '/unauthorized',
}) => {
  const location = useLocation();
  const { user, isAuthenticated, role, isInitialized, hasRole, hasPermission } = useAuth();

  // 1. Session Rehydration Screen
  if (!isInitialized) {
    return <AuthLoadingScreen />;
  }

  // 2. Authentication Check
  if (!isAuthenticated || !user) {
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    return (
      <Navigate
        to={`${redirectUnauthenticatedTo}?redirect=${returnUrl}`}
        replace
        state={{ from: location }}
      />
    );
  }

  // 3. Email Verification Enforcement (if flagged)
  if (requireVerifiedEmail && !user.isEmailVerified && location.pathname !== '/auth/verify-email') {
    return <Navigate to="/auth/verify-email" replace />;
  }

  // 4. Role-Based Access Control (RBAC) Clearance
  if (allowedRoles && allowedRoles.length > 0) {
    const isRoleAuthorized = allowedRoles.some((targetRole) => hasRole(targetRole));
    if (!isRoleAuthorized) {
      return (
        <Navigate
          to={redirectUnauthorizedTo}
          replace
          state={{
            from: location,
            currentRole: role,
            allowedRoles,
            homeRoute: role ? ROLE_DASHBOARD_ROUTES[role] : '/auth/login',
          }}
        />
      );
    }
  }

  // 5. Granular Action Permissions Check
  if (requiredPermissions && requiredPermissions.length > 0) {
    const isPermissionAuthorized = requireAllPermissions
      ? requiredPermissions.every((perm) => hasPermission(perm))
      : requiredPermissions.some((perm) => hasPermission(perm));

    if (!isPermissionAuthorized) {
      return (
        <Navigate
          to={redirectUnauthorizedTo}
          replace
          state={{
            from: location,
            currentRole: role,
            requiredPermissions,
            homeRoute: role ? ROLE_DASHBOARD_ROUTES[role] : '/auth/login',
          }}
        />
      );
    }
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
