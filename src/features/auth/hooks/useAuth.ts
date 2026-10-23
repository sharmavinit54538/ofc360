/**
 * @file useAuth.ts
 * @description Enterprise custom hook encapsulating typed Redux selectors, dispatchers,
 * and RBAC authorization utility functions with case-insensitive role matching.
 */

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  selectCurrentUser,
  selectAccessToken,
  selectIsAuthenticated,
  selectAuthRole,
  selectActiveRole,
  selectUserPermissions,
  selectIsAuthLoading,
  selectIsAuthInitialized,
  setRole as setRoleAction,
  setCredentials,
  logout as logoutAction,
} from '../slices/authSlice';
import { useLoginMutation, useLogoutMutation } from '../api/authApi';
import { UserRole, Permission, LoginRequest, LoginResponse, normalizeRole, normalizeAuthResponse, normalizeUser, parseJwtPayload } from '../types/auth.types';

export const useAuth = () => {
  const dispatch = useAppDispatch();

  // Typed Redux Selectors
  const rawUser = useAppSelector(selectCurrentUser);
  const rawAccessToken = useAppSelector(selectAccessToken);
  const rawIsAuthenticated = useAppSelector(selectIsAuthenticated);
  const rawRole = useAppSelector(selectAuthRole);
  const rawActiveRole = useAppSelector(selectActiveRole);
  const permissions = useAppSelector(selectUserPermissions);
  const isLoading = useAppSelector(selectIsAuthLoading);
  const isInitialized = useAppSelector(selectIsAuthInitialized);

  // Storage fallback token
  const storedToken =
    rawAccessToken ||
    (typeof window !== 'undefined'
      ? localStorage.getItem('ofc360_access_token') || sessionStorage.getItem('ofc360_access_token')
      : null);

  // Fallback user resolution to prevent null user trap
  const user: User | null =
    rawUser ||
    (storedToken
      ? (() => {
          try {
            const rawStored = localStorage.getItem('ofc360_user_session') || sessionStorage.getItem('ofc360_user_session');
            if (rawStored) return JSON.parse(rawStored) as User;
          } catch {
            // ignore
          }
          return normalizeUser(null, parseJwtPayload(storedToken));
        })()
      : null);

  const isAuthenticated = rawIsAuthenticated || Boolean(storedToken);
  const accessToken = rawAccessToken || storedToken;

  // Robust canonical role resolution with fallback hierarchy
  const resolvedRole = rawRole || rawActiveRole || user?.activeRole || (user?.roles && user.roles[0]) || null;
  const role: UserRole | null = resolvedRole ? normalizeRole(resolvedRole) : null;
  const activeRole: UserRole | null = rawActiveRole ? normalizeRole(rawActiveRole) : role;

  const allRoles: UserRole[] = Array.from(
    new Set([
      ...(user?.roles ?? []).map((r: string) => normalizeRole(r)),
      ...(role ? [role] : []),
      ...(activeRole ? [activeRole] : []),
    ])
  );

  // RTK Query Mutations
  const [triggerLoginMutation, { isLoading: isLoginLoading }] = useLoginMutation();
  const [triggerLogoutMutation, { isLoading: isLogoutLoading }] = useLogoutMutation();

  /**
   * Executes login mutation and synchronizes session state.
   */
  const handleLogin = useCallback(
    async (credentials: LoginRequest): Promise<LoginResponse> => {
      const response = await triggerLoginMutation(credentials).unwrap();
      const normalized = normalizeAuthResponse(response);
      if (normalized.tokens?.accessToken) {
        dispatch(
          setCredentials({
            user: normalized.user,
            tokens: normalized.tokens,
            rememberMe: credentials.rememberMe,
          })
        );
      }
      return response;
    },
    [triggerLoginMutation, dispatch]
  );

  /**
   * Dispatches logout mutation and clears local state & storage securely.
   */
  const handleLogout = useCallback(async (): Promise<void> => {
    try {
      await triggerLogoutMutation().unwrap();
    } catch {
      // Force local logout even if server communication failed
      dispatch(logoutAction());
    }
  }, [triggerLogoutMutation, dispatch]);

  /**
   * Switches active role for multi-role corporate accounts.
   */
  const switchRole = useCallback(
    (newRole: UserRole | string) => {
      dispatch(setRoleAction(normalizeRole(newRole)));
    },
    [dispatch]
  );

  /**
   * Verifies if the current user matches a single role or any from a list.
   * Case-insensitive, checks user roles array, and grants global clearance to SUPER_ADMIN.
   */
  const hasRole = useCallback(
    (targetRole: UserRole | UserRole[] | string | string[]): boolean => {
      const currentCanonical = activeRole || role || (user?.activeRole ? normalizeRole(user.activeRole) : null);
      const userRolesList = Array.from(
        new Set([
          ...(user?.roles ?? []).map((r: string) => normalizeRole(r)),
          ...(currentCanonical ? [normalizeRole(currentCanonical)] : []),
        ])
      );

      if (userRolesList.length === 0 && !currentCanonical) return false;

      // Super Admins automatically have global clearance across all roles
      if (currentCanonical === 'SUPER_ADMIN' || userRolesList.includes('SUPER_ADMIN')) {
        return true;
      }

      if (Array.isArray(targetRole)) {
        const normalizedTargets = targetRole.map((r) => normalizeRole(r));
        return userRolesList.some((r) => normalizedTargets.includes(r));
      }
      return userRolesList.includes(normalizeRole(targetRole));
    },
    [role, activeRole, user]
  );

  /**
   * Evaluates if the current user possesses a specific action permission.
   * Super Admins automatically bypass permission checks.
   */
  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      if (!user) return false;
      const current = activeRole || role || (user.activeRole ? normalizeRole(user.activeRole) : null);
      if (current === 'SUPER_ADMIN' || (user.roles || []).map((r) => normalizeRole(r)).includes('SUPER_ADMIN')) {
        return true;
      }
      return permissions.includes(permission);
    },
    [user, role, activeRole, permissions]
  );

  const hasAnyPermission = useCallback(
    (perms: Permission[]): boolean => {
      if (!user) return false;
      const current = activeRole || role || (user.activeRole ? normalizeRole(user.activeRole) : null);
      if (current === 'SUPER_ADMIN' || (user.roles || []).map((r) => normalizeRole(r)).includes('SUPER_ADMIN')) {
        return true;
      }
      return perms.some((p) => permissions.includes(p));
    },
    [user, role, activeRole, permissions]
  );

  const hasAllPermissions = useCallback(
    (perms: Permission[]): boolean => {
      if (!user) return false;
      const current = activeRole || role || (user.activeRole ? normalizeRole(user.activeRole) : null);
      if (current === 'SUPER_ADMIN' || (user.roles || []).map((r) => normalizeRole(r)).includes('SUPER_ADMIN')) {
        return true;
      }
      return perms.every((p) => permissions.includes(p));
    },
    [user, role, activeRole, permissions]
  );

  return {
    // Session State
    user,
    accessToken,
    isAuthenticated,
    role,
    activeRole,
    roles: allRoles,
    permissions,
    isLoading: isLoading || isLoginLoading || isLogoutLoading,
    isInitialized,

    // Actions
    login: handleLogin,
    logout: handleLogout,
    setRole: switchRole,
    switchRole,

    // Authorization Matrix Utilities
    hasRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
};

export default useAuth;
