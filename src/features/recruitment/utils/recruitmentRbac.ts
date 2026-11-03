/**
 * @file recruitmentRbac.ts
 * @description Role-based access control (RBAC) helpers for the Recruitment & ATS module,
 * strictly complying with docs/RECRUITMENT_ROLE_MATRIX.md.
 */

export type UserRole =
  | 'super_admin'
  | 'SUPER_ADMIN'
  | 'hr_admin'
  | 'HR_ADMIN'
  | 'recruiter'
  | 'RECRUITER'
  | 'manager'
  | 'MANAGER'
  | 'employee'
  | 'EMPLOYEE'
  | 'it_admin'
  | 'IT_ADMIN'
  | string;

function normalizeRole(role?: UserRole | null): string {
  if (!role) return '';
  return role.toString().trim().toUpperCase();
}

/**
 * Validates if the user role can access the main Recruitment administrative screens.
 */
export function canAccessRecruitmentModule(role?: UserRole | null): boolean {
  const r = normalizeRole(role);
  return r === 'SUPER_ADMIN' || r === 'HR_ADMIN' || r === 'RECRUITER';
}

/**
 * Validates if the user role can view or manage Interviews and Interview Calendar.
 * Accessible to Admins, Recruiters, and Hiring Managers.
 */
export function canManageInterviews(role?: UserRole | null): boolean {
  const r = normalizeRole(role);
  return r === 'SUPER_ADMIN' || r === 'HR_ADMIN' || r === 'RECRUITER' || r === 'MANAGER';
}

/**
 * Validates if the user role can access the dedicated Hiring Manager Hub.
 */
export function canAccessHiringManagerHub(role?: UserRole | null): boolean {
  const r = normalizeRole(role);
  return r === 'SUPER_ADMIN' || r === 'HR_ADMIN' || r === 'RECRUITER' || r === 'MANAGER';
}

/**
 * Validates if the user role can view and approve workforce requisitions.
 */
export function canManageRequisitions(role?: UserRole | null): boolean {
  const r = normalizeRole(role);
  return r === 'SUPER_ADMIN' || r === 'HR_ADMIN' || r === 'RECRUITER' || r === 'MANAGER';
}

/**
 * Validates if the user can create, edit, or approve candidate compensation and offers.
 * Strictly forbidden for standard Managers; limited to HR Admins, Recruiters, and Super Admins.
 */
export function canEditOffers(role?: UserRole | null): boolean {
  const r = normalizeRole(role);
  return r === 'SUPER_ADMIN' || r === 'HR_ADMIN' || r === 'RECRUITER';
}

/**
 * Validates if the user can view or manage Background Verification (BGV) and compliance checks.
 */
export function canAccessBgv(role?: UserRole | null): boolean {
  const r = normalizeRole(role);
  return r === 'SUPER_ADMIN' || r === 'HR_ADMIN' || r === 'RECRUITER';
}

/**
 * Validates if the user has write access to candidates and pipeline.
 * Managers have READ-ONLY access to candidates.
 */
export function canMutateCandidates(role?: UserRole | null): boolean {
  const r = normalizeRole(role);
  return r === 'SUPER_ADMIN' || r === 'HR_ADMIN' || r === 'RECRUITER';
}

/**
 * Resolves the primary default landing page for a given user role.
 * Recruiter role lands directly on /dashboard/recruitment.
 */
export function getDefaultLandingRoute(role?: UserRole | null): string {
  const r = normalizeRole(role);
  if (r === 'RECRUITER') {
    return '/dashboard/recruitment';
  }
  if (r === 'MANAGER') {
    return '/dashboard/recruitment/hiring-manager';
  }
  return '/dashboard';
}

