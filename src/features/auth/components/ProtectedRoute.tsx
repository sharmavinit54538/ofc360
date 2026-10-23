/**
 * @file ProtectedRoute.tsx
 * @description Enterprise Route Guard verifying user session integrity, authentication state,
 * and role-based clearance before rendering protected route trees.
 */

import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole, Permission, ROLE_DASHBOARD_ROUTES, normalizeRole } from '../types/auth.types';
import { AuthLoadingScreen } from '@/shared/layout/AuthLoadingScreen';

export interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRoles?: (UserRole | string)[];
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
  const { user, isAuthenticated, accessToken, role, isInitialized, isLoading, hasRole, hasPermission } = useAuth();

  // Storage fallback verification to prevent premature kickout during hydration race condition
  const storedToken =
    typeof window !== 'undefined'
      ? localStorage.getItem('ofc360_access_token') || sessionStorage.getItem('ofc360_access_token')
      : null;
  const hasValidToken = Boolean(accessToken) || Boolean(storedToken);
  const isAuthed = isAuthenticated || hasValidToken;

  // Resilient fallback user resolution from persistent storage if Redux state is hydrating
  const effectiveUser =
    user ||
    (typeof window !== 'undefined'
      ? (() => {
          try {
            const rawStored =
              localStorage.getItem('ofc360_user_session') ||
              sessionStorage.getItem('ofc360_user_session');
            if (rawStored) return JSON.parse(rawStored);
          } catch {}
          return null;
        })()
      : null);

  const storedRole =
    typeof window !== 'undefined'
      ? localStorage.getItem('ofc360_active_role') || sessionStorage.getItem('ofc360_active_role')
      : null;

  const effectiveRole =
    role ||
    (effectiveUser?.activeRole ? normalizeRole(effectiveUser.activeRole) : null) ||
    (storedRole ? normalizeRole(storedRole) : null);

  // 1. Session Rehydration Screen
  // Prevent premature redirection while authentication or session hydration is in flight
  if (!isInitialized || (isLoading && !isAuthed) || (isAuthed && !effectiveUser && !effectiveRole)) {
    return <AuthLoadingScreen />;
  }

  // 2. Authentication Check
  // Allow access if isAuthenticated is true OR if a valid access token exists in localStorage / sessionStorage.
  // Never prematurely kick out users to /auth/login if a valid session/token is present.
  if (!isAuthed) {
    console.warn('[ProtectedRoute] Access blocked -> redirecting to login.', {
      isAuthenticated,
      hasValidToken,
      hasUser: Boolean(effectiveUser),
      attemptedPath: location.pathname + location.search,
    });
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
  if (
    requireVerifiedEmail &&
    effectiveUser &&
    !effectiveUser.isEmailVerified &&
    location.pathname !== '/auth/verify-email'
  ) {
    return <Navigate to="/auth/verify-email" replace />;
  }

  // 4. Role-Based Access Control (RBAC) Clearance
  if (allowedRoles && allowedRoles.length > 0) {
    const isRoleAuthorized =
      effectiveRole === 'SUPER_ADMIN' ||
      allowedRoles.some(
        (targetRole) =>
          hasRole(targetRole) ||
          (effectiveRole && normalizeRole(effectiveRole) === normalizeRole(targetRole))
      );

    if (!isRoleAuthorized) {
      const canonicalRole = effectiveRole ? normalizeRole(effectiveRole) : null;
      console.warn('[ProtectedRoute] RBAC clearance rejected.', {
        attemptedPath: location.pathname,
        currentRole: canonicalRole,
        userRoles: effectiveUser?.roles,
        allowedRoles,
      });
      return (
        <Navigate
          to={redirectUnauthorizedTo}
          replace
          state={{
            from: location,
            currentRole: canonicalRole,
            allowedRoles: allowedRoles.map((r) => normalizeRole(r)),
            homeRoute: canonicalRole ? ROLE_DASHBOARD_ROUTES[canonicalRole] : '/dashboard/employee',
          }}
        />
      );
    }
  }

  // 5. Granular Action Permissions Check
  if (requiredPermissions && requiredPermissions.length > 0) {
    const isPermissionAuthorized =
      effectiveRole === 'SUPER_ADMIN' ||
      (requireAllPermissions
        ? requiredPermissions.every((perm) => hasPermission(perm))
        : requiredPermissions.some((perm) => hasPermission(perm)));

    if (!isPermissionAuthorized) {
      const canonicalRole = effectiveRole ? normalizeRole(effectiveRole) : null;
      return (
        <Navigate
          to={redirectUnauthorizedTo}
          replace
          state={{
            from: location,
            currentRole: canonicalRole,
            requiredPermissions,
            homeRoute: canonicalRole ? ROLE_DASHBOARD_ROUTES[canonicalRole] : '/dashboard/employee',
          }}
        />
      );
    }
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
