/**
 * @file useAuth.ts
 * @description Enterprise custom hook encapsulating typed Redux selectors, dispatchers,
 * and RBAC authorization utility functions.
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
  logout as logoutAction,
} from '../slices/authSlice';
import { useLoginMutation, useLogoutMutation } from '../api/authApi';
import { UserRole, Permission, LoginRequest, LoginResponse } from '../types/auth.types';

export const useAuth = () => {
  const dispatch = useAppDispatch();

  // Typed Redux Selectors
  const user = useAppSelector(selectCurrentUser);
  const accessToken = useAppSelector(selectAccessToken);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const role = useAppSelector(selectAuthRole);
  const activeRole = useAppSelector(selectActiveRole);
  const permissions = useAppSelector(selectUserPermissions);
  const isLoading = useAppSelector(selectIsAuthLoading);
  const isInitialized = useAppSelector(selectIsAuthInitialized);

  // RTK Query Mutations
  const [triggerLoginMutation, { isLoading: isLoginLoading }] = useLoginMutation();
  const [triggerLogoutMutation, { isLoading: isLogoutLoading }] = useLogoutMutation();

  /**
   * Executes login mutation and synchronizes session state.
   */
  const handleLogin = useCallback(
    async (credentials: LoginRequest): Promise<LoginResponse> => {
      const response = await triggerLoginMutation(credentials).unwrap();
      return response;
    },
    [triggerLoginMutation]
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
    (newRole: UserRole) => {
      dispatch(setRoleAction(newRole));
    },
    [dispatch]
  );

  /**
   * Verifies if the current user matches a single role or any from a list.
   */
  const hasRole = useCallback(
    (targetRole: UserRole | UserRole[]): boolean => {
      if (!role) return false;
      if (Array.isArray(targetRole)) {
        return targetRole.includes(role);
      }
      return role === targetRole;
    },
    [role]
  );

  /**
   * Evaluates if the current user possesses a specific action permission.
   * Super Admins automatically bypass permission checks.
   */
  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      if (!user) return false;
      if (role === 'SUPER_ADMIN') return true;
      return permissions.includes(permission);
    },
    [user, role, permissions]
  );

  const hasAnyPermission = useCallback(
    (perms: Permission[]): boolean => {
      if (!user) return false;
      if (role === 'SUPER_ADMIN') return true;
      return perms.some((p) => permissions.includes(p));
    },
    [user, role, permissions]
  );

  const hasAllPermissions = useCallback(
    (perms: Permission[]): boolean => {
      if (!user) return false;
      if (role === 'SUPER_ADMIN') return true;
      return perms.every((p) => permissions.includes(p));
    },
    [user, role, permissions]
  );

  return {
    // Session State
    user,
    accessToken,
    isAuthenticated,
    role,
    activeRole,
    roles: user?.roles ?? [],
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
