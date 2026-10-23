import { useCallback, useMemo } from 'react';
import { useAuth } from './useAuth';
import { UserRole, Permission, ROLE_DASHBOARD_ROUTES, normalizeRole } from '../types/auth.types';

export interface RBACCheckOptions {
  requiredRoles?: (UserRole | string)[];
  requiredPermissions?: Permission[];
  requireAllPermissions?: boolean;
}

export const useRBAC = () => {
  const { user, role, activeRole, roles, permissions } = useAuth();

  const currentRole = activeRole || role || user?.activeRole || (roles && roles[0]);
  const canonicalActiveRole = currentRole ? normalizeRole(currentRole) : null;
  const normalizedRoles = Array.from(
    new Set([
      ...(roles || []).map((r) => normalizeRole(r)),
      ...(user?.roles || []).map((r) => normalizeRole(r)),
      ...(canonicalActiveRole ? [canonicalActiveRole] : []),
    ])
  );

  const isSuperAdmin = canonicalActiveRole === 'SUPER_ADMIN' || normalizedRoles.includes('SUPER_ADMIN');

  const hasRole = useCallback(
    (targetRole: UserRole | UserRole[] | string | string[]): boolean => {
      if (!canonicalActiveRole && normalizedRoles.length === 0) return false;
      if (isSuperAdmin) return true;

      if (Array.isArray(targetRole)) {
        const targets = targetRole.map((r) => normalizeRole(r));
        return normalizedRoles.some((r) => targets.includes(r));
      }
      return normalizedRoles.includes(normalizeRole(targetRole));
    },
    [canonicalActiveRole, normalizedRoles, isSuperAdmin]
  );

  const hasAnyRole = useCallback(
    (targetRoles: (UserRole | string)[]): boolean => {
      if (normalizedRoles.length === 0) return false;
      if (isSuperAdmin) return true;
      const targets = targetRoles.map((r) => normalizeRole(r));
      return targets.some((r) => normalizedRoles.includes(r));
    },
    [normalizedRoles, isSuperAdmin]
  );

  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      if (!user) return false;
      // Super Admin automatically bypasses all permission checks
      if (isSuperAdmin) return true;
      return permissions.includes(permission);
    },
    [user, isSuperAdmin, permissions]
  );

  const hasAllPermissions = useCallback(
    (perms: Permission[]): boolean => {
      if (!user) return false;
      if (isSuperAdmin) return true;
      return perms.every((p) => permissions.includes(p));
    },
    [user, isSuperAdmin, permissions]
  );

  const hasAnyPermission = useCallback(
    (perms: Permission[]): boolean => {
      if (!user) return false;
      if (isSuperAdmin) return true;
      return perms.some((p) => permissions.includes(p));
    },
    [user, isSuperAdmin, permissions]
  );

  const canAccess = useCallback(
    (options: RBACCheckOptions): boolean => {
      const { requiredRoles, requiredPermissions, requireAllPermissions = false } = options;

      // Super admin has unrestricted access
      if (isSuperAdmin) return true;

      // Role check
      if (requiredRoles && requiredRoles.length > 0) {
        if (!canonicalActiveRole && normalizedRoles.length === 0) return false;
        const targets = requiredRoles.map((r) => normalizeRole(r));
        const isAuthorized = normalizedRoles.some((r) => targets.includes(r));
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
    [canonicalActiveRole, normalizedRoles, isSuperAdmin, hasAllPermissions, hasAnyPermission]
  );

  const defaultRedirectRoute = useMemo(() => {
    if (!canonicalActiveRole) return '/auth/login';
    return ROLE_DASHBOARD_ROUTES[canonicalActiveRole] || '/dashboard/employee';
  }, [canonicalActiveRole]);

  return {
    activeRole: canonicalActiveRole,
    roles: normalizedRoles,
    permissions,
    isSuperAdmin,
    isHRAdmin: canonicalActiveRole === 'HR_ADMIN',
    isManager: canonicalActiveRole === 'MANAGER',
    isEmployee: canonicalActiveRole === 'EMPLOYEE',
    isITAdmin: canonicalActiveRole === 'IT_ADMIN',
    hasRole,
    hasAnyRole,
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    canAccess,
    defaultRedirectRoute,
  };
};
