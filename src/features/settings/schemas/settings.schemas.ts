/**
 * @file settings.schemas.ts
 * @description Zod validation schemas for all Settings sections.
 * Provides runtime type safety and form validation for React Hook Form integration.
 */

import { z } from 'zod';
import type {
  UpdateCompanySettingsRequest,
  UpdateEmployeeSettingsRequest,
  UpdateAttendanceSettingsRequest,
  UpdateLeaveSettingsRequest,
  UpdatePayrollSettingsRequest,
  UpdateDocumentsSettingsRequest,
  UpdateAssetsSettingsRequest,
  UpdateNotificationsSettingsRequest,
  ChangePasswordRequest,
  Enable2FARequest,
  Disable2FARequest,
  RegisterPasskeyRequest,
  DeletePasskeyRequest,
} from '../types/settings.types';

// ==========================================
// Company Schemas
// ==========================================

export const companyAddressSchema = z.object({
  line1: z.string().min(1, 'Address line 1 is required').max(200),
  line2: z.string().max(200).optional(),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().min(1, 'State/Province is required').max(100),
  postalCode: z.string().min(1, 'Postal code is required').max(20),
  country: z.string().min(1, 'Country is required').max(100),
});

export const companyDetailsSchema = z.object({
  legalName: z.string().min(1, 'Legal name is required').max(200),
  displayName: z.string().min(1, 'Display name is required').max(200),
  registrationNumber: z.string().min(1, 'Registration number is required').max(100),
  taxId: z.string().min(1, 'Tax ID is required').max(100),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  email: z.string().email('Invalid email address'),
  phone: z.string().max(30).optional(),
  address: companyAddressSchema,
});

export const companyBrandingSchema = z.object({
  logoUrl: z.string().url('Invalid logo URL').optional(),
  faviconUrl: z.string().url('Invalid favicon URL').optional(),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').default('#3B82F6'),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').default('#1E40AF'),
  fontFamily: z.string().min(1).max(100).default('Inter'),
});

export const updateCompanySettingsSchema = z.object({
  details: companyDetailsSchema.partial().optional(),
  branding: companyBrandingSchema.partial().optional(),
  timezone: z.string().min(1).optional(),
  currency: z.string().length(3).optional(),
  dateFormat: z.string().min(1).optional(),
  timeFormat: z.enum(['12h', '24h']).optional(),
  weekStartDay: z.enum([0, 1, 6]).optional(),
  fiscalYearStart: z.number().int().min(1).max(12).optional(),
  language: z.string().length(2).optional(),
}) satisfies z.ZodType<UpdateCompanySettingsRequest>;

// ==========================================
// Employee Schemas
// ==========================================

export const employeeIdFormatSchema = z.object({
  prefix: z.string().min(1, 'Prefix is required').max(10).regex(/^[A-Z0-9]+$/, 'Only uppercase letters and numbers'),
  separator: z.string().max(3).default('-'),
  sequenceLength: z.number().int().min(3).max(10).default(5),
  includeYear: z.boolean().default(true),
  includeDepartment: z.boolean().default(false),
  currentSequence: z.number().int().min(0).default(0),
  example: z.string().optional(),
});

export const roleDefaultsSchema = z.object({
  defaultRole: z.enum(['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']).default('EMPLOYEE'),
  defaultDepartment: z.string().optional(),
  defaultJobTitle: z.string().optional(),
  probationPeriodDays: z.number().int().min(0).max(365).default(90),
  noticePeriodDays: z.number().int().min(0).max(365).default(30),
});

export const visibilityRulesSchema = z.object({
  showSalaryToManagers: z.boolean().default(false),
  showPersonalInfoToPeers: z.boolean().default(false),
  showContactInfoToAll: z.boolean().default(false),
  maskSsnInExports: z.boolean().default(true),
  maskBankDetailsInExports: z.boolean().default(true),
});

export const updateEmployeeSettingsSchema = z.object({
  idFormat: employeeIdFormatSchema.partial().optional(),
  roleDefaults: roleDefaultsSchema.partial().optional(),
  visibilityRules: visibilityRulesSchema.partial().optional(),
  autoGenerateEmail: z.boolean().optional(),
  emailDomain: z.string().email('Invalid email domain').optional(),
  requireEmployeeCode: z.boolean().optional(),
}) satisfies z.ZodType<UpdateEmployeeSettingsRequest>;

// ==========================================
// Attendance Schemas
// ==========================================

export const shiftTimingSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Shift name is required').max(50),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:mm)'),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:mm)'),
  breakDurationMinutes: z.number().int().min(0).max(480).default(60),
  gracePeriodMinutes: z.number().int().min(0).max(120).default(15),
  lateThresholdMinutes: z.number().int().min(0).max(240).default(30),
  earlyDepartureThresholdMinutes: z.number().int().min(0).max(240).default(30),
  isDefault: z.boolean().default(false),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#3B82F6'),
  daysApplicable: z.array(z.number().int().min(0).max(6)).min(1, 'At least one day required').max(7),
});

export const geofenceConfigSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Geofence name is required').max(100),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radiusMeters: z.number().int().min(50, 'Geofence radius must be at least 50 meters').max(5000).default(100),
  address: z.string().max(500).optional(),
  isActive: z.boolean().default(true),
  allowedShiftIds: z.array(z.string()).optional(),
});

export const ipRestrictionSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required').max(100),
  ipAddress: z.string().ip({ version: 'v4' }).or(z.string().ip({ version: 'v6' })),
  cidr: z.string().optional(),
  description: z.string().max(500).optional(),
  isActive: z.boolean().default(true),
});

export const updateAttendanceSettingsSchema = z.object({
  shifts: z.array(shiftTimingSchema).optional(),
  geofences: z.array(geofenceConfigSchema).optional(),
  ipRestrictions: z.array(ipRestrictionSchema).optional(),
  defaultShiftId: z.string().optional(),
  allowMultipleCheckIns: z.boolean().optional(),
  requireGpsForCheckIn: z.boolean().optional(),
  requirePhotoForCheckIn: z.boolean().optional(),
  enableOfflineMode: z.boolean().optional(),
  autoCheckoutEnabled: z.boolean().optional(),
  autoCheckoutTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
  overtimeThresholdHours: z.number().min(0).max(24).optional(),
}) satisfies z.ZodType<UpdateAttendanceSettingsRequest>;

// ==========================================
// Leave Schemas
// ==========================================

export const leaveTypeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Leave type name is required').max(50),
  code: z.string().min(1, 'Code is required').max(10).regex(/^[A-Z0-9_]+$/, 'Only uppercase, numbers, underscore'),
  description: z.string().max(500).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#10B981'),
  icon: z.string().max(50).default('calendar'),
  isActive: z.boolean().default(true),
  isPaid: z.boolean().default(true),
  requiresApproval: z.boolean().default(true),
  approvalWorkflow: z.enum(['auto', 'manager', 'hr', 'multi_level']).default('manager'),
  approverRoles: z.array(z.enum(['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN'])).default(['MANAGER']),
  accrualEnabled: z.boolean().default(false),
  accrualFrequency: z.enum(['monthly', 'quarterly', 'annually', 'per_pay_period']).default('monthly'),
  accrualRate: z.number().min(0).max(365).default(1),
  maxAccrualDays: z.number().int().min(0).max(365).default(30),
  carryForwardType: z.enum(['none', 'limited', 'unlimited']).default('limited'),
  maxCarryForwardDays: z.number().int().min(0).max(365).default(15),
  carryForwardExpiryMonths: z.number().int().min(0).max(24).default(12),
  minAdvanceNoticeDays: z.number().int().min(0).max(365).default(1),
  maxConsecutiveDays: z.number().int().min(1).max(365).default(30),
  allowedGenders: z.array(z.enum(['male', 'female', 'other'])).optional(),
  minTenureDays: z.number().int().min(0).max(3650).default(0),
  requiresDocument: z.boolean().default(false),
  documentTypes: z.array(z.string()).optional(),
  sortOrder: z.number().int().min(0).default(0),
});

export const leavePolicySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Policy name is required').max(100),
  description: z.string().max(500).optional(),
  leaveTypeIds: z.array(z.string()).min(1, 'At least one leave type required'),
  eligibilityRule: z.enum(['all', 'tenure', 'department', 'role']).default('all'),
  eligibilityValue: z.string().optional(),
  probationPeriodDays: z.number().int().min(0).max(365).default(90),
  isDefault: z.boolean().default(false),
});

export const updateLeaveSettingsSchema = z.object({
  leaveTypes: z.array(leaveTypeSchema).optional(),
  policies: z.array(leavePolicySchema).optional(),
  defaultPolicyId: z.string().optional(),
  globalMinAdvanceNoticeDays: z.number().int().min(0).max(365).optional(),
  globalMaxConsecutiveDays: z.number().int().min(1).max(365).optional(),
  enableHalfDayLeave: z.boolean().optional(),
  enableHourlyLeave: z.boolean().optional(),
  weekendInclusion: z.enum(['exclude', 'include', 'count_as_leave']).optional(),
  holidayInclusion: z.enum(['exclude', 'include', 'count_as_leave']).optional(),
  compOffEnabled: z.boolean().optional(),
  compOffExpiryDays: z.number().int().min(0).max(365).optional(),
}) satisfies z.ZodType<UpdateLeaveSettingsRequest>;

// ==========================================
// Payroll Schemas
// ==========================================

export const salaryComponentSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Component name is required').max(100),
  code: z.string().min(1, 'Code is required').max(20).regex(/^[A-Z0-9_]+$/, 'Only uppercase, numbers, underscore'),
  type: z.enum(['earning', 'deduction', 'employer_contribution']),
  calculation: z.enum(['fixed', 'percentage', 'formula']),
  value: z.number().default(0),
  formula: z.string().max(1000).optional(),
  isTaxable: z.boolean().default(true),
  isStatutory: z.boolean().default(false),
  statutoryType: z.enum(['PF', 'ESI', 'PT', 'TDS', 'GRATUITY', 'BONUS', 'OTHER']).optional(),
  appliesTo: z.enum(['all', 'specific_roles', 'specific_departments', 'specific_employees']).default('all'),
  applicableRoles: z.array(z.enum(['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN'])).optional(),
  applicableDepartmentIds: z.array(z.string()).optional(),
  applicableEmployeeIds: z.array(z.string()).optional(),
  displayOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  glAccountCode: z.string().max(50).optional(),
});

export const statutoryConfigSchema = z.object({
  pf: z.object({
    enabled: z.boolean().default(true),
    employerRate: z.number().min(0).max(100).default(12),
    employeeRate: z.number().min(0).max(100).default(12),
    wageCeiling: z.number().min(0).default(15000),
    adminChargesRate: z.number().min(0).max(100).default(0.5),
    edliRate: z.number().min(0).max(100).default(0.5),
  }),
  esi: z.object({
    enabled: z.boolean().default(true),
    employerRate: z.number().min(0).max(100).default(3.25),
    employeeRate: z.number().min(0).max(100).default(0.75),
    wageCeiling: z.number().min(0).default(21000),
  }),
  pt: z.object({
    enabled: z.boolean().default(true),
    slabs: z.array(z.object({
      min: z.number().min(0),
      max: z.number().min(0),
      amount: z.number().min(0),
    })).default([]),
  }),
  tds: z.object({
    enabled: z.boolean().default(true),
    regime: z.enum(['old', 'new']).default('new'),
    section80CLimit: z.number().min(0).default(150000),
    standardDeduction: z.number().min(0).default(50000),
  }),
  gratuity: z.object({
    enabled: z.boolean().default(true),
    vestingYears: z.number().int().min(0).max(20).default(5),
    formula: z.enum(['15/26', '30/26']).default('15/26'),
  }),
  bonus: z.object({
    enabled: z.boolean().default(true),
    minBonusPercentage: z.number().min(0).max(100).default(8.33),
    maxBonusPercentage: z.number().min(0).max(100).default(20),
    eligibilitySalaryCeiling: z.number().min(0).default(21000),
  }),
});

export const payCycleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Cycle name is required').max(100),
  frequency: z.enum(['weekly', 'biweekly', 'semimonthly', 'monthly']),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  payDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  cutoffDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  isActive: z.boolean().default(true),
  isCurrent: z.boolean().default(false),
  status: z.enum(['draft', 'processing', 'approved', 'paid', 'closed']).default('draft'),
});

export const updatePayrollSettingsSchema = z.object({
  salaryComponents: z.array(salaryComponentSchema).optional(),
  statutory: statutoryConfigSchema.partial().optional(),
  payCycles: z.array(payCycleSchema).optional(),
  defaultPayFrequency: z.enum(['weekly', 'biweekly', 'semimonthly', 'monthly']).optional(),
  bankDetailsRequired: z.boolean().optional(),
  payslipPasswordFormat: z.string().max(100).optional(),
  enableArrears: z.boolean().optional(),
  enableReimbursements: z.boolean().optional(),
}) satisfies z.ZodType<UpdatePayrollSettingsRequest>;

// ==========================================
// Documents Schemas
// ==========================================

export const documentTemplateSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Template name is required').max(200),
  type: z.enum(['offer_letter', 'appointment_letter', 'relieving_letter', 'experience_letter', 'nda', 'employment_contract', 'promotion_letter', 'transfer_letter', 'warning_letter', 'custom']),
  subject: z.string().min(1, 'Subject is required').max(500),
  content: z.string().min(1, 'Content is required'),
  variables: z.array(z.string()).default([]),
  isDefault: z.boolean().default(false),
  isActive: z.boolean().default(true),
  version: z.number().int().min(1).default(1),
});

export const digitalSignatureConfigSchema = z.object({
  enabled: z.boolean().default(false),
  provider: z.enum(['internal', 'docusign', 'adobe_sign', 'hellosign']).default('internal'),
  apiKey: z.string().optional(),
  apiSecret: z.string().optional(),
  webhookUrl: z.string().url('Invalid webhook URL').optional(),
  autoSendOnGenerate: z.boolean().default(true),
  requireAllSignatures: z.boolean().default(true),
  expiryDays: z.number().int().min(1).max(365).default(30),
  reminderDays: z.array(z.number().int().min(1).max(365)).default([7, 3, 1]),
});

export const updateDocumentsSettingsSchema = z.object({
  templates: z.array(documentTemplateSchema).optional(),
  digitalSignature: digitalSignatureConfigSchema.partial().optional(),
  defaultTemplateIds: z.record(z.string()).optional(),
  documentStorage: z.enum(['local', 's3', 'azure', 'gcs']).optional(),
  storageConfig: z.record(z.string()).optional(),
}) satisfies z.ZodType<UpdateDocumentsSettingsRequest>;

// ==========================================
// Assets Schemas
// ==========================================

export const assetCategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Category name is required').max(100),
  code: z.string().min(1, 'Code is required').max(20).regex(/^[A-Z0-9_]+$/, 'Only uppercase, numbers, underscore'),
  description: z.string().max(500).optional(),
  prefix: z.string().min(1, 'Prefix is required').max(10).regex(/^[A-Z0-9]+$/, 'Only uppercase letters and numbers'),
  icon: z.string().max(50).default('box'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#6366F1'),
  depreciationMethod: z.enum(['straight_line', 'declining_balance', 'sum_of_years', 'units_of_production']).default('straight_line'),
  usefulLifeYears: z.number().int().min(1).max(50).default(5),
  salvageValuePercentage: z.number().min(0).max(100).default(10),
  requiresAllocationApproval: z.boolean().default(false),
  allocatableRoles: z.array(z.enum(['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN'])).default(['IT_ADMIN', 'HR_ADMIN']),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().min(0).default(0),
});

export const assetTagConfigSchema = z.object({
  prefix: z.string().min(1, 'Prefix is required').max(10).regex(/^[A-Z0-9]+$/, 'Only uppercase letters and numbers'),
  separator: z.string().max(3).default('-'),
  sequenceLength: z.number().int().min(3).max(10).default(6),
  includeCategoryCode: z.boolean().default(true),
  includeYear: z.boolean().default(true),
  currentSequence: z.number().int().min(0).default(0),
  example: z.string().optional(),
});

export const allocationRuleSchema = z.object({
  id: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  condition: z.enum(['role', 'department', 'employee', 'location']),
  conditionValue: z.string().min(1, 'Condition value is required'),
  maxQuantity: z.number().int().min(1).max(100).default(1),
  requiresApproval: z.boolean().default(true),
  approverRoles: z.array(z.enum(['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN'])).default(['MANAGER']),
});

export const updateAssetsSettingsSchema = z.object({
  categories: z.array(assetCategorySchema).optional(),
  tagConfig: assetTagConfigSchema.partial().optional(),
  allocationRules: z.array(allocationRuleSchema).optional(),
  defaultWarrantyMonths: z.number().int().min(0).max(120).optional(),
  enableMaintenanceTracking: z.boolean().optional(),
  maintenanceReminderDays: z.array(z.number().int().min(1).max(365)).optional(),
  enableAssetAudit: z.boolean().optional(),
  auditFrequencyMonths: z.number().int().min(1).max(24).optional(),
}) satisfies z.ZodType<UpdateAssetsSettingsRequest>;

// ==========================================
// Notifications Schemas
// ==========================================

export const notificationChannelConfigSchema = z.object({
  channel: z.enum(['email', 'sms', 'in_app', 'push', 'webhook']),
  enabled: z.boolean().default(false),
  provider: z.string().optional(),
  config: z.record(z.string()).optional(),
});

export const notificationEventConfigSchema = z.object({
  event: z.enum([
    'leave_requested', 'leave_approved', 'leave_rejected', 'leave_cancelled',
    'attendance_late', 'attendance_missed_checkout', 'attendance_geofence_violation',
    'payroll_run_created', 'payroll_run_approved', 'payroll_run_paid', 'payslip_generated',
    'expense_submitted', 'expense_approved', 'expense_rejected',
    'document_generated', 'document_signed', 'document_expiring',
    'asset_allocated', 'asset_returned', 'asset_maintenance_due', 'asset_audit_due',
    'announcement_created',
    'performance_review_due', 'probation_ending', 'contract_expiring',
    'birthday', 'work_anniversary',
    'password_changed', 'login_new_device', 'security_alert',
  ]),
  channels: z.record(z.boolean()).default({}),
  templateId: z.string().optional(),
  recipients: z.array(z.enum(['employee', 'manager', 'hr', 'admin', 'custom'])).default(['employee']),
  customRecipients: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
});

export const defaultNotificationPreferencesSchema = z.object({
  events: z.record(z.record(z.boolean())).default({}),
  quietHoursEnabled: z.boolean().default(false),
  quietHoursStart: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).default('22:00'),
  quietHoursEnd: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).default('07:00'),
  timezone: z.string().default('UTC'),
  digestEnabled: z.boolean().default(false),
  digestFrequency: z.enum(['daily', 'weekly']).default('daily'),
  digestTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).default('09:00'),
});

export const updateNotificationsSettingsSchema = z.object({
  channels: z.array(notificationChannelConfigSchema).optional(),
  events: z.array(notificationEventConfigSchema).optional(),
  defaultPreferences: defaultNotificationPreferencesSchema.partial().optional(),
}) satisfies z.ZodType<UpdateNotificationsSettingsRequest>;

// ==========================================
// User Profile / Security Schemas
// ==========================================

// ==========================================
// Profile Schemas
// ==========================================

const PHONE_REGEX = /^\+?[0-9][0-9\s\-()]{6,19}$/;

/**
 * Validates the personal profile info form (GET/PUT /settings/profile).
 */
export const profileFormSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(60, 'First name cannot exceed 60 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(60, 'Last name cannot exceed 60 characters'),
  phone: z
    .string()
    .regex(PHONE_REGEX, 'Enter a valid phone number')
    .optional()
    .or(z.literal('')),
  personalEmail: z
    .string()
    .email('Enter a valid email address')
    .optional()
    .or(z.literal('')),
  department: z.string().max(80, 'Department cannot exceed 80 characters').optional().or(z.literal('')),
  designation: z.string().max(80, 'Designation cannot exceed 80 characters').optional().or(z.literal('')),
  emergencyContact: z
    .string()
    .regex(PHONE_REGEX, 'Enter a valid emergency contact number')
    .optional()
    .or(z.literal('')),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;

/**
 * Password change with strength rules and confirmation cross-check.
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, 'Current password must be at least 6 characters'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128)
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      });
    }
  }) satisfies z.ZodType<ChangePasswordRequest>;

export const enable2FASchema = z.object({
  method: z.enum(['authenticator', 'sms', 'email']),
  code: z.string().length(6, 'Code must be 6 digits').regex(/^\d{6}$/, 'Code must be numeric'),
}) satisfies z.ZodType<Enable2FARequest>;

export const disable2FASchema = z.object({
  password: z.string().min(1, 'Password is required'),
  code: z.string().length(6, 'Code must be 6 digits').regex(/^\d{6}$/).optional(),
}) satisfies z.ZodType<Disable2FARequest>;

export const registerPasskeySchema = z.object({
  deviceName: z.string().min(1, 'Device name is required').max(100),
}) satisfies z.ZodType<RegisterPasskeyRequest>;

export const deletePasskeySchema = z.object({
  credentialId: z.string().min(1, 'Credential ID is required'),
}) satisfies z.ZodType<DeletePasskeyRequest>;

// ==========================================
// Type Exports for React Hook Form
// ==========================================

export type CompanySettingsFormData = z.infer<typeof updateCompanySettingsSchema>;
export type EmployeeSettingsFormData = z.infer<typeof updateEmployeeSettingsSchema>;
export type AttendanceSettingsFormData = z.infer<typeof updateAttendanceSettingsSchema>;
export type LeaveSettingsFormData = z.infer<typeof updateLeaveSettingsSchema>;
export type PayrollSettingsFormData = z.infer<typeof updatePayrollSettingsSchema>;
export type DocumentsSettingsFormData = z.infer<typeof updateDocumentsSettingsSchema>;
export type AssetsSettingsFormData = z.infer<typeof updateAssetsSettingsSchema>;
export type NotificationsSettingsFormData = z.infer<typeof updateNotificationsSettingsSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type Enable2FAFormData = z.infer<typeof enable2FASchema>;
export type Disable2FAFormData = z.infer<typeof disable2FASchema>;
export type RegisterPasskeyFormData = z.infer<typeof registerPasskeySchema>;
export type DeletePasskeyFormData = z.infer<typeof deletePasskeySchema>;
// ==========================================
// Rule-focused alias exports
// ==========================================
// These alias the section update schemas so rule-level validations
// (positive minutes, geofence radius bounds, pay-cycle day bounds,
// statutory percentage bounds) stay enforced from a single source.
export const companySettingsSchema = updateCompanySettingsSchema;
export const attendanceSettingsSchema = updateAttendanceSettingsSchema;
export const payrollSettingsSchema = updatePayrollSettingsSchema.extend({
  // Day-of-month pay cycle bounds (1-31) for day-based pay cycle configs
  startDay: z.number().int().min(1, 'Pay cycle start day must be between 1 and 31').max(31, 'Pay cycle start day must be between 1 and 31').optional(),
  endDay: z.number().int().min(1, 'Pay cycle end day must be between 1 and 31').max(31, 'Pay cycle end day must be between 1 and 31').optional(),
  disbursementDay: z.number().int().min(1, 'Disbursement day must be between 1 and 31').max(31, 'Disbursement day must be between 1 and 31').optional(),
});
