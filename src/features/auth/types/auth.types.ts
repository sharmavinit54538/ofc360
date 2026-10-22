/**
 * @file auth.types.ts
 * @description Enterprise TypeScript definitions for Authentication, Session Management,
 * and Role-Based Access Control (RBAC) in OFC360.
 */

export type UserRole =
  | 'SUPER_ADMIN'
  | 'HR_ADMIN'
  | 'MANAGER'
  | 'EMPLOYEE'
  | 'IT_ADMIN';

export type Permission =
  | 'users:read'
  | 'users:write'
  | 'users:delete'
  | 'org:manage'
  | 'hrms:payroll'
  | 'hrms:attendance'
  | 'hrms:leaves'
  | 'hrms:performance'
  | 'it:assets'
  | 'it:security_logs'
  | 'it:system_config'
  | 'reports:view'
  | 'reports:export';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  size: '1-10' | '11-50' | '51-200' | '201-1000' | '1000+';
  industry: string;
  domain?: string;
  logoUrl?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatarUrl?: string;
  phone?: string;
  jobTitle?: string;
  department?: string;
  organizationId: string;
  organization?: Organization;
  roles: UserRole[];
  activeRole: UserRole;
  permissions: Permission[];
  isEmailVerified: boolean;
  isTwoFactorEnabled: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number; // in seconds
  tokenType?: string;
}

/**
 * Global Redux State shape for the authentication slice.
 * Follows strict enterprise state patterns.
 */
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken?: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: UserRole | null;
  activeRole: UserRole | null;
  isInitialized: boolean;
  rememberMe: boolean;
}

// ==========================================
// API DTOs (Data Transfer Objects)
// ==========================================

export interface LoginRequest {
  email: string;
  password?: string;
  identifier?: string;
  rememberMe?: boolean;
  provider?: 'credentials' | 'google';
  googleToken?: string;
}

export interface LoginResponse {
  success?: boolean;
  message?: string;
  requires_email_verification?: boolean;
  requiresEmailVerification?: boolean;
  verification_id?: string;
  data?: {
    user?: any;
    access_token?: string;
    refresh_token?: string;
    token_type?: string;
    expires_in?: number;
    requires_email_verification?: boolean;
    verification_id?: string;
    masked_email?: string;
    email?: string;
  };
  user?: User;
  tokens?: AuthTokens;
  email?: string;
}

export interface RegisterRequest {
  organizationName: string;
  organizationSize?: Organization['size'];
  industry?: string;
  firstName: string;
  lastName: string;
  workEmail: string;
  phone?: string;
  password: string;
}

export interface RegisterResponse {
  success?: boolean;
  message: string;
  requiresEmailVerification?: boolean;
  requires_email_verification?: boolean;
  data?: any;
  user?: User;
  tokens?: AuthTokens;
}

export interface RefreshTokenRequest {
  refreshToken?: string;
  refresh_token?: string;
}

export interface RefreshTokenResponse {
  success?: boolean;
  message?: string;
  data?: {
    access_token: string;
    refresh_token?: string;
    token_type?: string;
    expires_in?: number;
  };
  tokens?: AuthTokens;
  user?: User;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success?: boolean;
  message: string;
  resetToken?: string;
  expiresInMinutes?: number;
  data?: any;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
  purpose?: 'password_reset' | 'email_verification' | 'two_factor';
  verification_id?: string;
}

export interface VerifyOtpResponse {
  success?: boolean;
  valid?: boolean;
  verificationToken?: string;
  resetToken?: string;
  message: string;
  data?: {
    email?: string;
    resetToken?: string;
    access_token?: string;
    refresh_token?: string;
    user?: any;
  };
}

export interface ResetPasswordRequest {
  email: string;
  verificationToken: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface VerifyEmailRequest {
  token?: string;
  otp?: string;
  email?: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
  data?: any;
  user?: User;
}

export interface ApiErrorResponse {
  status: number;
  message: string;
  errorCode?: string;
  details?: Record<string, string[]>;
}

export interface FaceLoginRequest {
  email: string;
  image: string;
}

export interface FaceLoginResponse {
  user?: User;
  tokens?: AuthTokens;
  data?: any;
  message?: string;
}

// Default role permissions mapping
export const ROLE_DEFAULT_PERMISSIONS: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: [
    'users:read', 'users:write', 'users:delete',
    'org:manage',
    'hrms:payroll', 'hrms:attendance', 'hrms:leaves', 'hrms:performance',
    'it:assets', 'it:security_logs', 'it:system_config',
    'reports:view', 'reports:export',
  ],
  HR_ADMIN: [
    'users:read', 'users:write',
    'hrms:payroll', 'hrms:attendance', 'hrms:leaves', 'hrms:performance',
    'reports:view', 'reports:export',
  ],
  MANAGER: [
    'users:read',
    'hrms:attendance', 'hrms:leaves', 'hrms:performance',
    'reports:view',
  ],
  EMPLOYEE: [
    'hrms:attendance', 'hrms:leaves',
  ],
  IT_ADMIN: [
    'users:read',
    'it:assets', 'it:security_logs', 'it:system_config',
    'reports:view',
  ],
};

/**
 * Normalizes any role representation (case-insensitive, backend snake_case or frontend camel/UPPERCASE)
 * to canonical UserRole enum value.
 */
export const normalizeRole = (role?: string | null): UserRole => {
  if (!role) return 'EMPLOYEE';
  const clean = String(role).trim().toLowerCase();

  if (
    clean === 'super_admin' ||
    clean === 'superadmin' ||
    clean === 'super_administrator'
  ) {
    return 'SUPER_ADMIN';
  }
  if (
    clean === 'hr_admin' ||
    clean === 'hradmin' ||
    clean === 'admin' ||
    clean === 'company_admin' ||
    clean === 'hr' ||
    clean === 'hr_manager' ||
    clean === 'payroll_admin' ||
    clean === 'finance'
  ) {
    return 'HR_ADMIN';
  }
  if (
    clean === 'it_admin' ||
    clean === 'itadmin' ||
    clean === 'it' ||
    clean === 'tech_admin' ||
    clean === 'system_admin' ||
    clean === 'it_system_admin' ||
    clean === 'sysadmin' ||
    clean === 'sys_admin'
  ) {
    return 'IT_ADMIN';
  }
  if (
    clean === 'manager' ||
    clean === 'lead' ||
    clean === 'team_lead' ||
    clean === 'executive' ||
    clean === 'cxo' ||
    clean === 'ceo' ||
    clean === 'cto' ||
    clean === 'cfo' ||
    clean === 'coo'
  ) {
    return 'MANAGER';
  }
  return 'EMPLOYEE';
};

// Role-to-Dashboard route mapping (supports canonical uppercase and lowercase aliases)
export const ROLE_DASHBOARD_ROUTES: Record<string, string> = {
  SUPER_ADMIN: '/dashboard/super-admin',
  HR_ADMIN: '/dashboard/hr-admin',
  MANAGER: '/dashboard/manager',
  EMPLOYEE: '/dashboard/employee',
  IT_ADMIN: '/dashboard/it-admin',
  super_admin: '/dashboard/super-admin',
  hr_admin: '/dashboard/hr-admin',
  manager: '/dashboard/manager',
  employee: '/dashboard/employee',
  it_admin: '/dashboard/it-admin',
};

/**
 * Safely parses and normalizes raw user objects from FastAPI backend or legacy mock structures.
 */
export const normalizeUser = (rawUser: any): User => {
  if (!rawUser) {
    return {
      id: '',
      email: '',
      firstName: 'User',
      lastName: '',
      fullName: 'User',
      roles: ['EMPLOYEE'],
      activeRole: 'EMPLOYEE',
      permissions: ROLE_DEFAULT_PERMISSIONS.EMPLOYEE,
      organizationId: '',
      isEmailVerified: true,
      isTwoFactorEnabled: false,
      createdAt: new Date().toISOString(),
    };
  }

  const roleStr = rawUser.activeRole || rawUser.role || (Array.isArray(rawUser.roles) ? rawUser.roles[0] : null);
  const canonicalRole = normalizeRole(roleStr);

  const rawName = String(rawUser.fullName || rawUser.name || '').trim();
  let firstName = rawUser.firstName || '';
  let lastName = rawUser.lastName || '';

  if (!firstName && rawName) {
    const parts = rawName.split(' ');
    firstName = parts[0] || 'User';
    lastName = parts.slice(1).join(' ') || '';
  }
  if (!firstName) firstName = 'User';
  const fullName = rawName || `${firstName} ${lastName}`.trim() || 'User';

  const roles: UserRole[] = Array.isArray(rawUser.roles) && rawUser.roles.length > 0
    ? rawUser.roles.map((r: string) => normalizeRole(r))
    : [canonicalRole];

  const permissions: Permission[] = Array.isArray(rawUser.permissions) && rawUser.permissions.length > 0
    ? rawUser.permissions
    : ROLE_DEFAULT_PERMISSIONS[canonicalRole] || [];

  return {
    id: String(rawUser.id || ''),
    email: String(rawUser.email || ''),
    firstName,
    lastName,
    fullName,
    avatarUrl: rawUser.avatarUrl || undefined,
    phone: rawUser.phone || undefined,
    jobTitle: rawUser.jobTitle || undefined,
    department: rawUser.department || undefined,
    organizationId: String(rawUser.company_id || rawUser.organizationId || ''),
    roles,
    activeRole: canonicalRole,
    permissions,
    isEmailVerified: Boolean(rawUser.is_verified ?? rawUser.email_verified ?? rawUser.isEmailVerified ?? true),
    isTwoFactorEnabled: Boolean(rawUser.isTwoFactorEnabled ?? false),
    lastLoginAt: rawUser.lastLoginAt || undefined,
    createdAt: rawUser.createdAt || new Date().toISOString(),
  };
};

/**
 * Transforms raw authentication response (FastAPI wrapped payload or mock response)
 * into a typed, reliable frontend structure.
 */
export const normalizeAuthResponse = (
  raw: any
): {
  user: User;
  tokens: AuthTokens;
  requiresEmailVerification: boolean;
  verificationId?: string;
  maskedEmail?: string;
  email?: string;
  message?: string;
} => {
  if (!raw) {
    return {
      user: normalizeUser(null),
      tokens: { accessToken: '', expiresIn: 0 },
      requiresEmailVerification: false,
    };
  }

  // Check if raw is wrapped in FastAPI APIResponse { success, message, data }
  const dataObj = raw.data !== undefined && typeof raw.data === 'object' && raw.data !== null ? raw.data : raw;

  const requiresEmailVerification = Boolean(
    raw.requires_email_verification ??
    raw.requiresEmailVerification ??
    dataObj.requires_email_verification ??
    dataObj.requiresEmailVerification ??
    (!dataObj.user && !raw.user && (dataObj.verification_id || raw.verification_id))
  );

  const verificationId = dataObj.verification_id || raw.verification_id || undefined;
  const maskedEmail = dataObj.masked_email || raw.masked_email || undefined;
  const email = dataObj.email || raw.email || undefined;
  const message = raw.message || dataObj.message || undefined;

  const userSource = dataObj.user || raw.user || null;
  const user = normalizeUser(userSource);

  const accessToken =
    dataObj.access_token ||
    dataObj.accessToken ||
    raw.access_token ||
    raw.accessToken ||
    dataObj.tokens?.accessToken ||
    raw.tokens?.accessToken ||
    '';

  const refreshToken =
    dataObj.refresh_token ||
    dataObj.refreshToken ||
    raw.refresh_token ||
    raw.refreshToken ||
    dataObj.tokens?.refreshToken ||
    raw.tokens?.refreshToken ||
    undefined;

  const expiresIn = Number(
    dataObj.expires_in ??
    dataObj.expiresIn ??
    raw.expires_in ??
    raw.expiresIn ??
    dataObj.tokens?.expiresIn ??
    raw.tokens?.expiresIn ??
    3600
  );

  const tokenType =
    dataObj.token_type ||
    dataObj.tokenType ||
    raw.token_type ||
    raw.tokenType ||
    dataObj.tokens?.tokenType ||
    raw.tokens?.tokenType ||
    'Bearer';

  return {
    user,
    tokens: {
      accessToken,
      refreshToken,
      expiresIn,
      tokenType,
    },
    requiresEmailVerification,
    verificationId,
    maskedEmail,
    email,
    message,
  };
};
