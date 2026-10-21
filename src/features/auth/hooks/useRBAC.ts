import { useCallback, useMemo } from 'react';
import { useAuth } from './useAuth';
import { UserRole, Permission, ROLE_DASHBOARD_ROUTES } from '../types/auth.types';

export interface RBACCheckOptions {
  requiredRoles?: UserRole[];
  requiredPermissions?: Permission[];
  requireAllPermissions?: boolean;
}

export const useRBAC = () => {
  const { user, activeRole, roles, permissions } = useAuth();

  const hasRole = useCallback(
    (role: UserRole | UserRole[]): boolean => {
      if (!activeRole) return false;
      if (Array.isArray(role)) {
        return role.includes(activeRole);
      }
      return activeRole === role;
    },
    [activeRole]
  );

  const hasAnyRole = useCallback(
    (targetRoles: UserRole[]): boolean => {
      if (!roles || roles.length === 0) return false;
      return targetRoles.some((r) => roles.includes(r));
    },
    [roles]
  );

  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      if (!user) return false;
      // Super Admin automatically bypasses all permission checks
      if (activeRole === 'SUPER_ADMIN') return true;
      return permissions.includes(permission);
    },
    [user, activeRole, permissions]
  );

  const hasAllPermissions = useCallback(
    (perms: Permission[]): boolean => {
      if (!user) return false;
      if (activeRole === 'SUPER_ADMIN') return true;
      return perms.every((p) => permissions.includes(p));
    },
    [user, activeRole, permissions]
  );

  const hasAnyPermission = useCallback(
    (perms: Permission[]): boolean => {
      if (!user) return false;
      if (activeRole === 'SUPER_ADMIN') return true;
      return perms.some((p) => permissions.includes(p));
    },
    [user, activeRole, permissions]
  );

  const canAccess = useCallback(
    (options: RBACCheckOptions): boolean => {
      const { requiredRoles, requiredPermissions, requireAllPermissions = false } = options;

      // Role check
      if (requiredRoles && requiredRoles.length > 0) {
        if (!activeRole || !requiredRoles.includes(activeRole)) {
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
    return ROLE_DASHBOARD_ROUTES[activeRole] || '/dashboard/employee';
  }, [activeRole]);

  return {
    activeRole,
    roles,
    permissions,
    isSuperAdmin: activeRole === 'SUPER_ADMIN',
    isHRAdmin: activeRole === 'HR_ADMIN',
    isManager: activeRole === 'MANAGER',
    isEmployee: activeRole === 'EMPLOYEE',
    isITAdmin: activeRole === 'IT_ADMIN',
    hasRole,
    hasAnyRole,
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    canAccess,
    defaultRedirectRoute,
  };
};
