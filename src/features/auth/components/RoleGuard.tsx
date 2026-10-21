import React from 'react';
import { useRBAC } from '@/features/auth/hooks/useRBAC';
import { UserRole, Permission } from '@/features/auth/types/auth.types';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requiredPermissions?: Permission[];
  requireAllPermissions?: boolean;
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  requiredPermissions,
  requireAllPermissions = false,
  fallback = null,
}) => {
  const { canAccess } = useRBAC();

  const hasAccess = canAccess({
    requiredRoles: allowedRoles,
    requiredPermissions,
    requireAllPermissions,
  });

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
