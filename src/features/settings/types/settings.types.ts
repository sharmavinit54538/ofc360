/**
 * @file settings.types.ts
 * @description Enterprise TypeScript definitions for Settings Module in OFC360.
 * Covers all configuration domains: Company, Employees, Attendance, Leave, Payroll,
 * Documents, Assets, Notifications, and User Profile/Security.
 */

import { UserRole, Permission } from '@/features/auth/types/auth.types';

// ==========================================
// Base & Utility Types
// ==========================================

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errorCode?: string;
  details?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type SettingCategory =
  | 'company'
  | 'employees'
  | 'attendance'
  | 'leave'
  | 'payroll'
  | 'documents'
  | 'assets'
  | 'notifications'
  | 'profile';

export interface SettingsSection {
  id: SettingCategory;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  requiredPermissions: Permission[];
  order: number;
}

// ==========================================
// Company Settings Types
// ==========================================

export interface CompanyBranding {
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
}

export interface CompanyDetails {
  legalName: string;
  displayName: string;
  registrationNumber: string;
  taxId: string;
  website?: string;
  email: string;
  phone?: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export interface CompanySettings {
  id: string;
  organizationId: string;
  details: CompanyDetails;
  branding: CompanyBranding;
  timezone: string;
  currency: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  weekStartDay: 0 | 1 | 6; // Sunday=0, Monday=1, Saturday=6
  fiscalYearStart: number; // Month 1-12
  language: string;
  updatedAt: string;
  updatedBy: string;
}

export interface UpdateCompanySettingsRequest {
  details?: Partial<CompanyDetails>;
  branding?: Partial<CompanyBranding>;
  timezone?: string;
  currency?: string;
  dateFormat?: string;
  timeFormat?: '12h' | '24h';
  weekStartDay?: 0 | 1 | 6;
  fiscalYearStart?: number;
  language?: string;
}

export interface LogoUploadResponse {
  url: string;
  thumbnailUrl?: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

// ==========================================
// Employee Settings Types
// ==========================================

export interface EmployeeIdFormat {
  prefix: string;
  separator: string;
  sequenceLength: number;
  includeYear: boolean;
  includeDepartment: boolean;
  currentSequence: number;
  example: string;
}

export interface RoleDefaults {
  defaultRole: UserRole;
  defaultDepartment?: string;
  defaultJobTitle?: string;
  probationPeriodDays: number;
  noticePeriodDays: number;
}

export interface VisibilityRules {
  showSalaryToManagers: boolean;
  showPersonalInfoToPeers: boolean;
  showContactInfoToAll: boolean;
  maskSsnInExports: boolean;
  maskBankDetailsInExports: boolean;
}

export interface EmployeeSettings {
  id: string;
  organizationId: string;
  idFormat: EmployeeIdFormat;
  roleDefaults: RoleDefaults;
  visibilityRules: VisibilityRules;
  autoGenerateEmail: boolean;
  emailDomain?: string;
  requireEmployeeCode: boolean;
  updatedAt: string;
  updatedBy: string;
}

export interface UpdateEmployeeSettingsRequest {
  idFormat?: Partial<EmployeeIdFormat>;
  roleDefaults?: Partial<RoleDefaults>;
  visibilityRules?: Partial<VisibilityRules>;
  autoGenerateEmail?: boolean;
  emailDomain?: string;
  requireEmployeeCode?: boolean;
}

// ==========================================
// Attendance Settings Types
// ==========================================

export interface ShiftTiming {
  id: string;
  name: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  breakDurationMinutes: number;
  gracePeriodMinutes: number;
  lateThresholdMinutes: number;
  earlyDepartureThresholdMinutes: number;
  isDefault: boolean;
  color: string;
  daysApplicable: number[]; // 0-6
}

export interface GeofenceConfig {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  address?: string;
  isActive: boolean;
  allowedShiftIds?: string[];
}

export interface IpRestriction {
  id: string;
  name: string;
  ipAddress: string;
  cidr?: string;
  description?: string;
  isActive: boolean;
}

export interface AttendanceSettings {
  id: string;
  organizationId: string;
  shifts: ShiftTiming[];
  geofences: GeofenceConfig[];
  ipRestrictions: IpRestriction[];
  defaultShiftId?: string;
  allowMultipleCheckIns: boolean;
  requireGpsForCheckIn: boolean;
  requirePhotoForCheckIn: boolean;
  enableOfflineMode: boolean;
  autoCheckoutEnabled: boolean;
  autoCheckoutTime?: string; // HH:mm
  overtimeThresholdHours: number;
  updatedAt: string;
  updatedBy: string;
}

export interface UpdateAttendanceSettingsRequest {
  shifts?: ShiftTiming[];
  geofences?: GeofenceConfig[];
  ipRestrictions?: IpRestriction[];
  defaultShiftId?: string;
  allowMultipleCheckIns?: boolean;
  requireGpsForCheckIn?: boolean;
  requirePhotoForCheckIn?: boolean;
  enableOfflineMode?: boolean;
  autoCheckoutEnabled?: boolean;
  autoCheckoutTime?: string;
  overtimeThresholdHours?: number;
}

// ==========================================
// Leave Settings Types
// ==========================================

export type LeaveAccrualFrequency = 'monthly' | 'quarterly' | 'annually' | 'per_pay_period';
export type LeaveCarryForwardType = 'none' | 'limited' | 'unlimited';
export type LeaveApprovalWorkflow = 'auto' | 'manager' | 'hr' | 'multi_level';

export interface LeaveType {
  id: string;
  name: string;
  code: string;
  description?: string;
  color: string;
  icon: string;
  isActive: boolean;
  isPaid: boolean;
  requiresApproval: boolean;
  approvalWorkflow: LeaveApprovalWorkflow;
  approverRoles: UserRole[];
  accrualEnabled: boolean;
  accrualFrequency: LeaveAccrualFrequency;
  accrualRate: number; // days per period
  maxAccrualDays: number;
  carryForwardType: LeaveCarryForwardType;
  maxCarryForwardDays: number;
  carryForwardExpiryMonths: number;
  minAdvanceNoticeDays: number;
  maxConsecutiveDays: number;
  allowedGenders?: ('male' | 'female' | 'other')[];
  minTenureDays: number;
  requiresDocument: boolean;
  documentTypes?: string[];
  sortOrder: number;
}

export interface LeavePolicy {
  id: string;
  name: string;
  description?: string;
  leaveTypeIds: string[];
  eligibilityRule: 'all' | 'tenure' | 'department' | 'role';
  eligibilityValue?: string;
  probationPeriodDays: number;
  isDefault: boolean;
}

export interface LeaveSettings {
  id: string;
  organizationId: string;
  leaveTypes: LeaveType[];
  policies: LeavePolicy[];
  defaultPolicyId?: string;
  globalMinAdvanceNoticeDays: number;
  globalMaxConsecutiveDays: number;
  enableHalfDayLeave: boolean;
  enableHourlyLeave: boolean;
  weekendInclusion: 'exclude' | 'include' | 'count_as_leave';
  holidayInclusion: 'exclude' | 'include' | 'count_as_leave';
  compOffEnabled: boolean;
  compOffExpiryDays: number;
  updatedAt: string;
  updatedBy: string;
}

export interface UpdateLeaveSettingsRequest {
  leaveTypes?: LeaveType[];
  policies?: LeavePolicy[];
  defaultPolicyId?: string;
  globalMinAdvanceNoticeDays?: number;
  globalMaxConsecutiveDays?: number;
  enableHalfDayLeave?: boolean;
  enableHourlyLeave?: boolean;
  weekendInclusion?: 'exclude' | 'include' | 'count_as_leave';
  holidayInclusion?: 'exclude' | 'include' | 'count_as_leave';
  compOffEnabled?: boolean;
  compOffExpiryDays?: number;
}

// ==========================================
// Payroll Settings Types
// ==========================================

export type SalaryComponentType = 'earning' | 'deduction' | 'employer_contribution';
export type SalaryComponentCalculation = 'fixed' | 'percentage' | 'formula';
export type PayFrequency = 'weekly' | 'biweekly' | 'semimonthly' | 'monthly';

export interface SalaryComponent {
  id: string;
  name: string;
  code: string;
  type: SalaryComponentType;
  calculation: SalaryComponentCalculation;
  value: number; // percentage or fixed amount
  formula?: string; // for formula-based
  isTaxable: boolean;
  isStatutory: boolean;
  statutoryType?: 'PF' | 'ESI' | 'PT' | 'TDS' | 'GRATUITY' | 'BONUS' | 'OTHER';
  appliesTo: 'all' | 'specific_roles' | 'specific_departments' | 'specific_employees';
  applicableRoles?: UserRole[];
  applicableDepartmentIds?: string[];
  applicableEmployeeIds?: string[];
  displayOrder: number;
  isActive: boolean;
  glAccountCode?: string;
}

export interface StatutoryConfig {
  pf: {
    enabled: boolean;
    employerRate: number; // percentage
    employeeRate: number;
    wageCeiling: number;
    adminChargesRate: number;
    edliRate: number;
  };
  esi: {
    enabled: boolean;
    employerRate: number;
    employeeRate: number;
    wageCeiling: number;
  };
  pt: {
    enabled: boolean;
    slabs: { min: number; max: number; amount: number }[];
  };
  tds: {
    enabled: boolean;
    regime: 'old' | 'new';
    section80CLimit: number;
    standardDeduction: number;
  };
  gratuity: {
    enabled: boolean;
    vestingYears: number;
    formula: '15/26' | '30/26';
  };
  bonus: {
    enabled: boolean;
    minBonusPercentage: number;
    maxBonusPercentage: number;
    eligibilitySalaryCeiling: number;
  };
}

export interface PayCycle {
  id: string;
  name: string;
  frequency: PayFrequency;
  startDate: string; // ISO date
  endDate: string; // ISO date
  payDate: string; // ISO date
  cutoffDate: string; // ISO date
  isActive: boolean;
  isCurrent: boolean;
  status: 'draft' | 'processing' | 'approved' | 'paid' | 'closed';
}

export interface PayrollSettings {
  id: string;
  organizationId: string;
  salaryComponents: SalaryComponent[];
  statutory: StatutoryConfig;
  payCycles: PayCycle[];
  defaultPayFrequency: PayFrequency;
  bankDetailsRequired: boolean;
  payslipPasswordFormat: string;
  enableArrears: boolean;
  enableReimbursements: boolean;
  updatedAt: string;
  updatedBy: string;
}

export interface UpdatePayrollSettingsRequest {
  salaryComponents?: (Omit<SalaryComponent, 'id'> & { id?: string })[];
  statutory?: Partial<StatutoryConfig>;
  payCycles?: (Omit<PayCycle, 'id'> & { id?: string })[];
  defaultPayFrequency?: PayFrequency;
  bankDetailsRequired?: boolean;
  payslipPasswordFormat?: string;
  enableArrears?: boolean;
  enableReimbursements?: boolean;
}

// ==========================================
// Documents & Templates Types
// ==========================================

export type TemplateType = 'offer_letter' | 'appointment_letter' | 'relieving_letter' | 'experience_letter' | 'nda' | 'employment_contract' | 'promotion_letter' | 'transfer_letter' | 'warning_letter' | 'custom';

export interface DocumentTemplate {
  id: string;
  name: string;
  type: TemplateType;
  subject: string;
  content: string; // HTML content with placeholders
  variables: string[]; // e.g., ['{{employee_name}}', '{{joining_date}}']
  isDefault: boolean;
  isActive: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface DigitalSignatureConfig {
  enabled: boolean;
  provider: 'internal' | 'docusign' | 'adobe_sign' | 'hellosign';
  apiKey?: string;
  apiSecret?: string;
  webhookUrl?: string;
  autoSendOnGenerate: boolean;
  requireAllSignatures: boolean;
  expiryDays: number;
  reminderDays: number[];
}

export interface DocumentsSettings {
  id: string;
  organizationId: string;
  templates: DocumentTemplate[];
  digitalSignature: DigitalSignatureConfig;
  defaultTemplateIds: Partial<Record<TemplateType, string>>;
  documentStorage: 'local' | 's3' | 'azure' | 'gcs';
  storageConfig?: Record<string, string>;
  updatedAt: string;
  updatedBy: string;
}

export interface UpdateDocumentsSettingsRequest {
  templates?: (Omit<DocumentTemplate, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'> & {
    id?: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
  })[];
  digitalSignature?: Partial<DigitalSignatureConfig>;
  defaultTemplateIds?: Partial<Record<TemplateType, string>>;
  documentStorage?: 'local' | 's3' | 'azure' | 'gcs';
  storageConfig?: Record<string, string>;
}

// ==========================================
// Assets Settings Types
// ==========================================

export interface AssetCategory {
  id: string;
  name: string;
  code: string;
  description?: string;
  prefix: string; // e.g., 'LAP', 'MOB', 'FUR'
  icon: string;
  color: string;
  depreciationMethod: 'straight_line' | 'declining_balance' | 'sum_of_years' | 'units_of_production';
  usefulLifeYears: number;
  salvageValuePercentage: number;
  requiresAllocationApproval: boolean;
  allocatableRoles: UserRole[];
  isActive: boolean;
  sortOrder: number;
}

export interface AssetTagConfig {
  prefix: string;
  separator: string;
  sequenceLength: number;
  includeCategoryCode: boolean;
  includeYear: boolean;
  currentSequence: number;
  example: string;
}

export interface AllocationRule {
  id: string;
  categoryId: string;
  condition: 'role' | 'department' | 'employee' | 'location';
  conditionValue: string;
  maxQuantity: number;
  requiresApproval: boolean;
  approverRoles: UserRole[];
}

export interface AssetsSettings {
  id: string;
  organizationId: string;
  categories: AssetCategory[];
  tagConfig: AssetTagConfig;
  allocationRules: AllocationRule[];
  defaultWarrantyMonths: number;
  enableMaintenanceTracking: boolean;
  maintenanceReminderDays: number[];
  enableAssetAudit: boolean;
  auditFrequencyMonths: number;
  updatedAt: string;
  updatedBy: string;
}

export interface UpdateAssetsSettingsRequest {
  categories?: (Omit<AssetCategory, 'id'> & { id?: string })[];
  tagConfig?: Partial<AssetTagConfig>;
  allocationRules?: AllocationRule[];
  defaultWarrantyMonths?: number;
  enableMaintenanceTracking?: boolean;
  maintenanceReminderDays?: number[];
  enableAssetAudit?: boolean;
  auditFrequencyMonths?: number;
}

// ==========================================
// Notifications Settings Types
// ==========================================

export type NotificationChannel = 'email' | 'sms' | 'in_app' | 'push' | 'webhook';
export type NotificationEvent =
  | 'leave_requested'
  | 'leave_approved'
  | 'leave_rejected'
  | 'leave_cancelled'
  | 'attendance_late'
  | 'attendance_missed_checkout'
  | 'attendance_geofence_violation'
  | 'payroll_run_created'
  | 'payroll_run_approved'
  | 'payroll_run_paid'
  | 'payslip_generated'
  | 'expense_submitted'
  | 'expense_approved'
  | 'expense_rejected'
  | 'document_generated'
  | 'document_signed'
  | 'document_expiring'
  | 'asset_allocated'
  | 'asset_returned'
  | 'asset_maintenance_due'
  | 'asset_audit_due'
  | 'announcement_created'
  | 'performance_review_due'
  | 'probation_ending'
  | 'contract_expiring'
  | 'birthday'
  | 'work_anniversary'
  | 'password_changed'
  | 'login_new_device'
  | 'security_alert';

export interface NotificationChannelConfig {
  channel: NotificationChannel;
  enabled: boolean;
  provider?: string;
  config?: Record<string, string>;
}

export interface NotificationEventConfig {
  event: NotificationEvent;
  channels: Partial<Record<NotificationChannel, boolean>>;
  templateId?: string;
  recipients: ('employee' | 'manager' | 'hr' | 'admin' | 'custom')[];
  customRecipients?: string[];
  isActive: boolean;
}

export interface NotificationPreferences {
  id: string;
  userId: string;
  events: Partial<Record<NotificationEvent, Partial<Record<NotificationChannel, boolean>>>>;
  quietHoursEnabled: boolean;
  quietHoursStart: string; // HH:mm
  quietHoursEnd: string; // HH:mm
  timezone: string;
  digestEnabled: boolean;
  digestFrequency: 'daily' | 'weekly';
  digestTime: string; // HH:mm
  updatedAt: string;
}

export interface NotificationsSettings {
  id: string;
  organizationId: string;
  channels: NotificationChannelConfig[];
  events: NotificationEventConfig[];
  defaultPreferences: Omit<NotificationPreferences, 'id' | 'userId' | 'updatedAt'>;
  updatedAt: string;
  updatedBy: string;
}

export interface UpdateNotificationsSettingsRequest {
  channels?: (Omit<NotificationChannelConfig, 'enabled'> & { enabled?: boolean })[];
  events?: NotificationEventConfig[];
  defaultPreferences?: Partial<Omit<NotificationPreferences, 'id' | 'userId' | 'updatedAt'>>;
}

export interface UserNotificationPreference {
  id: string;
  userId: string;
  event: NotificationEvent;
  channel: NotificationChannel;
  enabled: boolean;
  updatedAt: string;
}

// ==========================================
// User Profile / Security Types
// ==========================================

export interface SecuritySettings {
  id: string;
  userId: string;
  passwordLastChanged: string;
  twoFactorEnabled: boolean;
  twoFactorMethod: 'authenticator' | 'sms' | 'email' | 'passkey';
  passkeys: PasskeyInfo[];
  backupCodes?: string[];
  trustedDevices: TrustedDevice[];
  activeSessions: ActiveSession[];
  passwordHistory: string[]; // hashed
  failedLoginAttempts: number;
  lockedUntil?: string;
  securityQuestions?: SecurityQuestion[];
}

export interface PasskeyInfo {
  id: string;
  credentialId: string;
  deviceName: string;
  transports: string[];
  createdAt: string;
  lastUsedAt?: string;
  signCount: number;
}

export interface TrustedDevice {
  id: string;
  name: string;
  userAgent: string;
  ipAddress: string;
  location?: string;
  trustedAt: string;
  lastUsedAt: string;
}

export interface ActiveSession {
  id: string;
  deviceName: string;
  userAgent: string;
  ipAddress: string;
  location?: string;
  startedAt: string;
  lastActivityAt: string;
  isCurrent: boolean;
}

export interface SecurityQuestion {
  id: string;
  question: string;
  answerHash: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface Enable2FARequest {
  method: 'authenticator' | 'sms' | 'email';
  code: string;
}

export interface Disable2FARequest {
  password: string;
  code?: string;
}

export interface RevokeSessionRequest {
  sessionId: string;
}

export interface RevokeAllSessionsRequest {
  excludeCurrent: boolean;
}

export interface RegisterPasskeyRequest {
  deviceName: string;
}

export interface DeletePasskeyRequest {
  credentialId: string;
}

export interface UpdateSecuritySettingsRequest {
  twoFactorEnabled?: boolean;
  twoFactorMethod?: 'authenticator' | 'sms' | 'email' | 'passkey';
}

// ==========================================
// Settings API Response Types
// ==========================================

export interface SettingsResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  lastSyncedAt: string;
}

export interface BulkSettingsUpdateRequest {
  company?: UpdateCompanySettingsRequest;
  employees?: UpdateEmployeeSettingsRequest;
  attendance?: UpdateAttendanceSettingsRequest;
  leave?: UpdateLeaveSettingsRequest;
  payroll?: UpdatePayrollSettingsRequest;
  documents?: UpdateDocumentsSettingsRequest;
  assets?: UpdateAssetsSettingsRequest;
  notifications?: UpdateNotificationsSettingsRequest;
}

export interface BulkSettingsUpdateResponse {
  success: boolean;
  updatedSections: SettingCategory[];
  message: string;
}

// ==========================================
// Constants & Enums
// ==========================================

export const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney',
  'Pacific/Auckland',
] as const;

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
] as const;

export const DATE_FORMATS = [
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2024-01-15)', example: '2024-01-15' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (15/01/2024)', example: '15/01/2024' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (01/15/2024)', example: '01/15/2024' },
  { value: 'DD-MM-YYYY', label: 'DD-MM-YYYY (15-01-2024)', example: '15-01-2024' },
  { value: 'DD MMM YYYY', label: 'DD MMM YYYY (15 Jan 2024)', example: '15 Jan 2024' },
] as const;

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ar', name: 'Arabic' },
] as const;
// ==========================================
// User Profile Settings DTOs
// ==========================================

/**
 * Personal profile information for the authenticated user,
 * served by GET /settings/profile.
 */
export interface UserProfileSettings {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  personalEmail?: string;
  avatarUrl?: string;
  department?: string;
  designation?: string;
  emergencyContact?: string;
}

/**
 * Payload for PUT /settings/profile.
 */
export type UpdateProfileRequest = Partial<Omit<UserProfileSettings, 'id' | 'email'>>;

/**
 * Payload for PUT /settings/profile/password.
 * Mirrors {@link ChangePasswordRequest}.
 */
export type ChangePasswordPayload = ChangePasswordRequest;

// ==========================================
// Attendance Rules DTO (rules-focused projection)
// ==========================================

export interface GeofenceCoordinate {
  name: string;
  latitude: number;
  longitude: number;
}

export interface AttendanceRulesSettings {
  workHours: {
    fullDayMinMinutes: number;
    halfDayMinMinutes: number;
    gracePeriodMinutes: number;
  };
  geofencing: {
    isEnabled: boolean;
    radiusMeters: number;
    coordinates: GeofenceCoordinate[];
  };
  ipRestriction: {
    isEnabled: boolean;
    whitelistedIps: string[];
  };
  autoClockOut: {
    isEnabled: boolean;
    atTime: string;
  };
}

// ==========================================
// Role Permissions DTO (served by /settings/roles)
// ==========================================

export interface RolePermissionActions {
  read: boolean;
  write: boolean;
  delete: boolean;
}

export interface RolePermissionItem {
  id: string;
  roleName: string;
  roleCode: string;
  permissions: Record<string, RolePermissionActions>;
}

export interface UpdateRolePermissionsRequest {
  id: string;
  permissions: Record<string, RolePermissionActions>;
}

// ==========================================
// Assets & Documents Config DTOs
// ==========================================

export interface AssetsSettingsConfig {
  categories: string[];
  defaultWarrantyReminderDays: number;
  autoTagPrefix: string;
}

export interface DocumentsComplianceSettings {
  mandatoryDocTypes: string[];
  expiryAlertDays: number;
  autoRejectAfterDays: number;
}
