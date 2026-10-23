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
  const clean = String(role).trim().toLowerCase().replace(/[-\s]+/g, '_');

  if (
    clean === 'super_admin' ||
    clean === 'superadmin' ||
    clean === 'super_administrator' ||
    clean === 'superadministrator'
  ) {
    return 'SUPER_ADMIN';
  }
  if (
    clean === 'hr_admin' ||
    clean === 'hradmin' ||
    clean === 'admin' ||
    clean === 'company_admin' ||
    clean === 'companyadmin' ||
    clean === 'hr' ||
    clean === 'hr_manager' ||
    clean === 'hrmanager' ||
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
    clean === 'techadmin' ||
    clean === 'system_admin' ||
    clean === 'systemadmin' ||
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
    clean === 'teamlead' ||
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
 * Safely decodes base64 JWT payload claims without requiring external libraries.
 */
export const parseJwtPayload = (token?: string | null): any => {
  if (!token || typeof token !== 'string') return null;
  try {
    const cleanToken = token.startsWith('Bearer ') ? token.slice(7).trim() : token.trim();
    const parts = cleanToken.split('.');
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

/**
 * Safely parses and normalizes raw user objects from FastAPI backend or legacy mock structures.
 * NEVER returns null or incomplete user when authentication has succeeded.
 */
export const normalizeUser = (
  rawUser: any,
  jwtPayload?: any,
  fallbackEmail?: string
): User => {
  const merged = {
    ...(jwtPayload || {}),
    ...(rawUser || {}),
  };

  const email =
    merged.email ||
    merged.userEmail ||
    merged.workEmail ||
    (typeof merged.sub === 'string' && merged.sub.includes('@') ? merged.sub : '') ||
    fallbackEmail ||
    'user@ofc360.com';

  const roleStr =
    merged.activeRole ||
    merged.active_role ||
    merged.role ||
    merged.user_role ||
    merged.role_name ||
    (Array.isArray(merged.roles) && merged.roles.length > 0 ? merged.roles[0] : null) ||
    (email.toLowerCase().includes('admin') ? 'SUPER_ADMIN' : 'EMPLOYEE');

  const canonicalRole = normalizeRole(roleStr);

  const id = String(
    merged.id ||
    merged._id ||
    merged.userId ||
    merged.user_id ||
    merged.sub ||
    `usr_${Date.now()}`
  );

  const rawName = String(merged.fullName || merged.name || merged.full_name || '').trim();
  let firstName = merged.firstName || merged.first_name || '';
  let lastName = merged.lastName || merged.last_name || '';

  if (!firstName && rawName) {
    const parts = rawName.split(' ');
    firstName = parts[0] || '';
    lastName = parts.slice(1).join(' ') || '';
  }
  if (!firstName) {
    const emailPrefix = email.split('@')[0] || 'Enterprise';
    firstName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
  }
  const fullName = rawName || `${firstName} ${lastName}`.trim() || 'Enterprise User';

  const rawRoles = merged.roles || merged.user_roles || [];
  const roles: UserRole[] = Array.isArray(rawRoles) && rawRoles.length > 0
    ? rawRoles.map((r: string) => normalizeRole(r))
    : [canonicalRole];

  if (!roles.includes(canonicalRole)) {
    roles.unshift(canonicalRole);
  }

  const permissions: Permission[] = Array.isArray(merged.permissions) && merged.permissions.length > 0
    ? merged.permissions
    : ROLE_DEFAULT_PERMISSIONS[canonicalRole] || [];

  return {
    id,
    email,
    firstName,
    lastName,
    fullName,
    avatarUrl: merged.avatarUrl || merged.avatar_url || undefined,
    phone: merged.phone || undefined,
    jobTitle: merged.jobTitle || merged.job_title || undefined,
    department: merged.department || undefined,
    organizationId: String(merged.company_id || merged.organizationId || merged.organization_id || 'org_ofc360'),
    roles,
    activeRole: canonicalRole,
    permissions,
    isEmailVerified: Boolean(merged.is_email_verified ?? merged.is_verified ?? merged.email_verified ?? merged.isEmailVerified ?? true),
    isTwoFactorEnabled: Boolean(merged.isTwoFactorEnabled ?? merged.is_two_factor_enabled ?? false),
    lastLoginAt: merged.lastLoginAt || merged.last_login_at || undefined,
    createdAt: merged.createdAt || merged.created_at || new Date().toISOString(),
  };
};

/**
 * Transforms raw authentication response (FastAPI wrapped payload, OAuth2 token envelope, or mock response)
 * into a typed, reliable frontend structure with JWT claim extraction fallback.
 */
export const normalizeAuthResponse = (
  raw: any,
  fallbackEmail?: string
): {
  user: User;
  tokens: AuthTokens;
  requiresEmailVerification: boolean;
  verificationId?: string;
  maskedEmail?: string;
  email?: string;
  message?: string;
} => {
  const dataObj = raw?.data !== undefined && typeof raw.data === 'object' && raw.data !== null ? raw.data : (raw || {});

  // Robust token extraction: supports token, accessToken, access_token, jwt, tokens.token, etc.
  const accessToken =
    dataObj.access_token ||
    dataObj.accessToken ||
    dataObj.token ||
    dataObj.jwt ||
    raw?.access_token ||
    raw?.accessToken ||
    raw?.token ||
    raw?.jwt ||
    dataObj.tokens?.accessToken ||
    dataObj.tokens?.access_token ||
    dataObj.tokens?.token ||
    raw?.tokens?.accessToken ||
    raw?.tokens?.access_token ||
    raw?.tokens?.token ||
    '';

  const refreshToken =
    dataObj.refresh_token ||
    dataObj.refreshToken ||
    raw?.refresh_token ||
    raw?.refreshToken ||
    dataObj.tokens?.refreshToken ||
    dataObj.tokens?.refresh_token ||
    raw?.tokens?.refreshToken ||
    raw?.tokens?.refresh_token ||
    undefined;

  const jwtPayload = parseJwtPayload(accessToken);

  const requiresEmailVerification = Boolean(
    raw?.requires_email_verification ??
    raw?.requiresEmailVerification ??
    dataObj.requires_email_verification ??
    dataObj.requiresEmailVerification ??
    (!dataObj.user && !raw?.user && !jwtPayload && (dataObj.verification_id || raw?.verification_id))
  );

  const verificationId = dataObj.verification_id || raw?.verification_id || undefined;
  const maskedEmail = dataObj.masked_email || raw?.masked_email || undefined;
  const email = dataObj.email || raw?.email || fallbackEmail || jwtPayload?.email || undefined;
  const message = raw?.message || dataObj.message || undefined;

  // Support envelope where user is at data.user, raw.user, data.userData, or dataObj itself
  const userSource =
    dataObj.user ||
    raw?.user ||
    dataObj.userData ||
    raw?.userData ||
    (dataObj.email || dataObj.id ? dataObj : null);

  const user = normalizeUser(userSource, jwtPayload, fallbackEmail || email);

  const expiresIn = Number(
    dataObj.expires_in ??
    dataObj.expiresIn ??
    raw?.expires_in ??
    raw?.expiresIn ??
    dataObj.tokens?.expiresIn ??
    raw?.tokens?.expiresIn ??
    3600
  );

  const tokenType =
    dataObj.token_type ||
    dataObj.tokenType ||
    raw?.token_type ||
    raw?.tokenType ||
    dataObj.tokens?.tokenType ||
    raw?.tokens?.tokenType ||
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
