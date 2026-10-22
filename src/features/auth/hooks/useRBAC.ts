import { useCallback, useMemo } from 'react';
import { useAuth } from './useAuth';
import { UserRole, Permission, ROLE_DASHBOARD_ROUTES, normalizeRole } from '../types/auth.types';

export interface RBACCheckOptions {
  requiredRoles?: (UserRole | string)[];
  requiredPermissions?: Permission[];
  requireAllPermissions?: boolean;
}

export const useRBAC = () => {
  const { user, activeRole, roles, permissions } = useAuth();

  const hasRole = useCallback(
    (role: UserRole | UserRole[] | string | string[]): boolean => {
      if (!activeRole) return false;
      const current = normalizeRole(activeRole);
      if (Array.isArray(role)) {
        return role.map((r) => normalizeRole(r)).includes(current);
      }
      return current === normalizeRole(role);
    },
    [activeRole]
  );

  const hasAnyRole = useCallback(
    (targetRoles: (UserRole | string)[]): boolean => {
      if (!roles || roles.length === 0) return false;
      const currentRoles = roles.map((r) => normalizeRole(r));
      return targetRoles.some((r) => currentRoles.includes(normalizeRole(r)));
    },
    [roles]
  );

  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      if (!user) return false;
      // Super Admin automatically bypasses all permission checks
      if (normalizeRole(activeRole) === 'SUPER_ADMIN') return true;
      return permissions.includes(permission);
    },
    [user, activeRole, permissions]
  );

  const hasAllPermissions = useCallback(
    (perms: Permission[]): boolean => {
      if (!user) return false;
      if (normalizeRole(activeRole) === 'SUPER_ADMIN') return true;
      return perms.every((p) => permissions.includes(p));
    },
    [user, activeRole, permissions]
  );

  const hasAnyPermission = useCallback(
    (perms: Permission[]): boolean => {
      if (!user) return false;
      if (normalizeRole(activeRole) === 'SUPER_ADMIN') return true;
      return perms.some((p) => permissions.includes(p));
    },
    [user, activeRole, permissions]
  );

  const canAccess = useCallback(
    (options: RBACCheckOptions): boolean => {
      const { requiredRoles, requiredPermissions, requireAllPermissions = false } = options;

      // Role check
      if (requiredRoles && requiredRoles.length > 0) {
        if (!activeRole) return false;
        const currentNormalized = normalizeRole(activeRole);
        const isAuthorized = requiredRoles.some((r) => normalizeRole(r) === currentNormalized);
        if (!isAuthorized) {
          return false;
        }
      }

      // Permission check
      if (requiredPermissions && requiredPermissions.length > 0) {
        if (requireAllPermissions) {
          if (!hasAllPermissions(requiredPermissions)) return false;
        } else {
          if (!hasAnyPermission(requiredPermissions)) return false;
        }
      }

      return true;
    },
    [activeRole, hasAllPermissions, hasAnyPermission]
  );

  const defaultRedirectRoute = useMemo(() => {
    if (!activeRole) return '/auth/login';
    const canonical = normalizeRole(activeRole);
    return ROLE_DASHBOARD_ROUTES[canonical] || '/dashboard/employee';
  }, [activeRole]);

  return {
    activeRole: activeRole ? normalizeRole(activeRole) : null,
    roles: (roles || []).map((r) => normalizeRole(r)),
    permissions,
    isSuperAdmin: normalizeRole(activeRole) === 'SUPER_ADMIN',
    isHRAdmin: normalizeRole(activeRole) === 'HR_ADMIN',
    isManager: normalizeRole(activeRole) === 'MANAGER',
    isEmployee: normalizeRole(activeRole) === 'EMPLOYEE',
    isITAdmin: normalizeRole(activeRole) === 'IT_ADMIN',
    hasRole,
    hasAnyRole,
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    canAccess,
    defaultRedirectRoute,
  };
};
