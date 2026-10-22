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
  rememberMe?: boolean;
  provider?: 'credentials' | 'google';
  googleToken?: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
  message?: string;
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
  user: User;
  tokens?: AuthTokens;
  requiresEmailVerification: boolean;
  message: string;
}

export interface RefreshTokenRequest {
  refreshToken?: string;
}

export interface RefreshTokenResponse {
  tokens: AuthTokens;
  user?: User;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
  resetToken?: string;
  expiresInMinutes: number;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
  purpose: 'password_reset' | 'email_verification' | 'two_factor';
}

export interface VerifyOtpResponse {
  valid: boolean;
  verificationToken: string;
  message: string;
}

export interface ResetPasswordRequest {
  email: string;
  verificationToken: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
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
  user: User;
  tokens: AuthTokens;
  message?: string;
}

// Role-to-Dashboard route mapping
export const ROLE_DASHBOARD_ROUTES: Record<UserRole, string> = {
  SUPER_ADMIN: '/dashboard/super-admin',
  HR_ADMIN: '/dashboard/hr-admin',
  MANAGER: '/dashboard/manager',
  EMPLOYEE: '/dashboard/employee',
  IT_ADMIN: '/dashboard/it-admin',
};

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
