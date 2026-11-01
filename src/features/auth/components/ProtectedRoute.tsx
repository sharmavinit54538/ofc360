/**
 * @file ProtectedRoute.tsx
 * @description Enterprise Route Guard verifying user session integrity, authentication state,
 * and role-based clearance before rendering protected route trees.
 * 
 * Authentication States:
 * - initializing: Auth system is booting, session hydration in progress
 * - authenticated: Valid session confirmed, user has access
 * - unauthenticated: No valid session, redirect to login
 * - refreshing: Silent token refresh in progress
 * - error: Authentication system error occurred
 */

import React, { Suspense, useMemo } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole, Permission, ROLE_DASHBOARD_ROUTES, normalizeRole } from '../types/auth.types';
import { AuthLoadingScreen } from '@/shared/layout/AuthLoadingScreen';
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';

export type AuthStatus = 'initializing' | 'authenticated' | 'unauthenticated' | 'refreshing' | 'error';

export interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRoles?: (UserRole | string)[];
  requiredPermissions?: Permission[];
  requireAllPermissions?: boolean;
  requireVerifiedEmail?: boolean;
  redirectUnauthenticatedTo?: string;
  redirectUnauthorizedTo?: string;
}

/**
 * Safe hook to get location, returns null if not in router context
 */
function useSafeLocation() {
  try {
    return useLocation();
  } catch {
    return null;
  }
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
  const location = useSafeLocation();
  const {
    user,
    isAuthenticated,
    accessToken,
    role,
    isInitialized,
    isLoading,
    hasRole,
    hasPermission,
  } = useAuth();

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

  // Determine explicit authentication status
  const getAuthStatus = (): AuthStatus => {
    if (!isInitialized) return 'initializing';
    if (isLoading && !isAuthed) return 'initializing';
    if (isLoading && isAuthed) return 'refreshing';
    if (!isAuthed) return 'unauthenticated';
    if (!effectiveUser && !effectiveRole) return 'initializing';
    return 'authenticated';
  };

  const authStatus = getAuthStatus();

  // Build redirect target with return URL - safe version that handles missing location
  const buildRedirectTarget = useMemo(() => {
    const pathname = location?.pathname ?? '';
    const search = location?.search ?? '';
    const returnUrl = encodeURIComponent(pathname + search);
    return `${redirectUnauthenticatedTo}?redirect=${returnUrl}`;
  }, [location, redirectUnauthenticatedTo]);

  // Build unauthorized redirect with state - safe version
  const buildUnauthorizedNavigate = useMemo(() => {
    if (!location) {
      return <Navigate to={redirectUnauthorizedTo} replace />;
    }
    return (
      <Navigate
        to={redirectUnauthorizedTo}
        replace
        state={{
          from: location,
          currentRole: effectiveRole ? normalizeRole(effectiveRole) : null,
          allowedRoles: allowedRoles?.map((r) => normalizeRole(r)) ?? [],
          homeRoute: effectiveRole ? ROLE_DASHBOARD_ROUTES[normalizeRole(effectiveRole)] : '/dashboard/employee',
        }}
      />
    );
  }, [location, redirectUnauthorizedTo, effectiveRole, allowedRoles]);

  // 1. Session Initialization / Rehydration Screen
  // Prevent premature redirection while authentication or session hydration is in flight
  // Show stable loading fallback during initialization to avoid Suspense conflicts with lazy routes
  if (authStatus === 'initializing' || authStatus === 'refreshing') {
    return <AuthLoadingScreen />;
  }

  // 2. Authentication Check
  // Allow access if isAuthenticated is true OR if a valid access token exists in localStorage / sessionStorage.
  // Never prematurely kick out users to /auth/login if a valid session/token is present.
  if (authStatus === 'unauthenticated') {
    const attemptedPath = location ? `${location.pathname}${location.search}` : 'unknown';
    console.warn('[ProtectedRoute] Access blocked -> redirecting to login.', {
      isAuthenticated,
      hasValidToken,
      hasUser: Boolean(effectiveUser),
      attemptedPath,
    });

    if (!location) {
      // Fallback: redirect without return URL if no router context
      return <Navigate to={redirectUnauthenticatedTo} replace />;
    }

    return <Navigate to={buildRedirectTarget} replace state={{ from: location }} />;
  }

  // 3. Email Verification Enforcement (if flagged)
  const currentPath = location?.pathname ?? '';
  if (
    requireVerifiedEmail &&
    effectiveUser &&
    !effectiveUser.isEmailVerified &&
    currentPath !== '/auth/verify-email'
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
        attemptedPath: location?.pathname ?? 'unknown',
        currentRole: canonicalRole,
        userRoles: effectiveUser?.roles,
        allowedRoles,
      });

      return buildUnauthorizedNavigate;
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

  return (
    <ErrorBoundary
      title="Protected Route Error"
      message="An error occurred while loading this protected page."
    >
      <Suspense
        fallback={
          <div className="min-h-[400px] flex items-center justify-center p-8">
            <div className="space-y-4 w-full max-w-xl animate-pulse">
              <div className="h-8 w-48 bg-gray-200 dark:bg-zinc-800 rounded-xl" />
              <div className="h-32 w-full bg-gray-100 dark:bg-zinc-900 rounded-2xl" />
              <div className="h-64 w-full bg-gray-100 dark:bg-zinc-900 rounded-2xl" />
            </div>
          </div>
        }
      >
        {children ? <>{children}</> : <Outlet />}
      </Suspense>
    </ErrorBoundary>
  );
};

export default ProtectedRoute;