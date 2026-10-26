/**
 * @file workforce.schemas.ts
 * @description Zod validation schemas for employee creation/update,
 * lifecycle status transitions, and department forms.
 */

import { z } from 'zod';

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const PHONE_REGEX = /^\+?[0-9][0-9\s\-]{8,14}$/;

export const employmentTypeEnum = z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN']);
export const genderEnum = z.enum(['MALE', 'FEMALE', 'OTHER']);
export const workModeEnum = z.enum(['OFFICE', 'REMOTE', 'HYBRID']);
export const workforceRoleEnum = z.enum(['EMPLOYEE', 'MANAGER', 'IT_ADMIN', 'EXECUTIVE']);
export type WorkforceRole = z.infer<typeof workforceRoleEnum>;
export const employeeStatusActionEnum = z.enum([
  'ACTIVE',
  'INACTIVE',
  'INVITED',
  'PENDING',
  'ONBOARDING',
  'PROBATION',
  'ON_LEAVE',
  'NOTICE_PERIOD',
  'SUSPENDED',
  'DEACTIVATED',
  'TERMINATED',
]);

/**
 * Validates creation of a new employee record matching FastAPI EmployeeCreate contract:
 * REQUIRED: first_name, last_name (1-100 chars), personal_email (valid email), phone (10-15 chars),
 * department (1-100 chars), designation (1-100 chars), joining_date (YYYY-MM-DD).
 */
export const baseEmployeeSchema = z.object({
  firstName: z
    .string({ required_error: 'First name is required' })
    .trim()
    .min(1, 'First name is required (1-100 characters)')
    .max(100, 'First name cannot exceed 100 characters'),
  lastName: z
    .string({ required_error: 'Last name is required' })
    .trim()
    .min(1, 'Last name is required (1-100 characters)')
    .max(100, 'Last name cannot exceed 100 characters'),
  personalEmail: z
    .string({ required_error: 'Personal email is required' })
    .trim()
    .email('Enter a valid personal email address'),
  phone: z
    .string({ required_error: 'Phone number is required' })
    .trim()
    .min(10, 'Phone number must be 10-15 characters')
    .max(15, 'Phone number must be 10-15 characters'),
  departmentId: z.string().min(1, 'Please select a department').optional().or(z.literal('')),
  department: z.string().min(1, 'Department is required (1-100 characters)').max(100).optional(),
  designationId: z.string().min(1, 'Please select a designation').optional().or(z.literal('')),
  designation: z.string().min(1, 'Designation is required (1-100 characters)').max(100).optional(),
  joiningDate: z
    .string({ required_error: 'Joining date is required' })
    .regex(DATE_REGEX, 'Please select a valid joining date (YYYY-MM-DD)')
    .refine((value) => !Number.isNaN(Date.parse(value)), 'Joining date must be a valid date'),
  email: z
    .string()
    .trim()
    .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: 'Enter a valid company email address',
    })
    .optional()
    .or(z.literal('')),
  employeeCode: z.string().optional().or(z.literal('')),
  gender: genderEnum.optional(),
  reportingManagerId: z.string().optional().or(z.literal('')),
  employmentType: employmentTypeEnum.optional().default('FULL_TIME'),
  workLocation: z.string().max(120, 'Work location cannot exceed 120 characters').optional().or(z.literal('')),
  workMode: workModeEnum.optional(),
  role: z.string().optional().default('employee'),
});

export const updateEmployeeSchema = baseEmployeeSchema.partial();
export type UpdateEmployeeFormData = z.infer<typeof updateEmployeeSchema>;

export const createEmployeeSchema = baseEmployeeSchema
  .refine(
    (data) => Boolean(data.department || data.departmentId),
    {
      message: 'Please select a department',
      path: ['departmentId'],
    }
  )
  .refine(
    (data) => Boolean(data.designation || data.designationId),
    {
      message: 'Please select a designation',
      path: ['designationId'],
    }
  );

export type CreateEmployeeFormData = z.infer<typeof createEmployeeSchema>;

/**
 * Validates a lifecycle status transition of an employee.
 */
export const updateEmployeeStatusSchema = z.object({
  status: employeeStatusActionEnum,
  effectiveDate: z
    .string()
    .regex(DATE_REGEX, 'Please select a valid effective date (YYYY-MM-DD)')
    .refine((value) => !Number.isNaN(Date.parse(value)), 'Effective date must be a valid date'),
  reason: z
    .string()
    .min(10, 'Reason must be at least 10 characters')
    .max(500, 'Reason cannot exceed 500 characters'),
});

export type UpdateEmployeeStatusFormData = z.infer<typeof updateEmployeeStatusSchema>;

/**
 * Department status enum matching FastAPI backend contract.
 */
export const departmentStatusEnum = z.enum(['ACTIVE', 'INACTIVE', 'HIRING', 'GROWING']);
export type DepartmentStatus = z.infer<typeof departmentStatusEnum>;

/**
 * Validates Create/Edit Department form.
 * Backend full payload specifications:
 * - department_name: string, REQUIRED, 1-100 chars
 * - description: string, REQUIRED, 1-1000 chars
 * - location: string, REQUIRED, 1-100 chars
 * - manager_id: UUID (user with MANAGER role), optional
 * - parent_department_id: UUID, optional
 * - branch_id: UUID, optional
 * - cost_center: string, max 50 chars, optional
 * - budget: number (default 0)
 * - extension_number: string, max 50 chars, optional
 * - employee_capacity: integer >= 0 (default 100)
 * - status: "ACTIVE" | "INACTIVE" | "HIRING" | "GROWING" (default "ACTIVE")
 */
export const departmentFormSchema = z.object({
  department_name: z
    .string({ required_error: 'Department name is required' })
    .trim()
    .min(1, 'Department name is required (1-100 characters)')
    .max(100, 'Department name cannot exceed 100 characters'),
  description: z
    .string({ required_error: 'Description is required' })
    .trim()
    .min(1, 'Description is required (1-1000 characters)')
    .max(1000, 'Description cannot exceed 1000 characters'),
  location: z
    .string({ required_error: 'Location is required' })
    .trim()
    .min(1, 'Location is required (1-100 characters)')
    .max(100, 'Location cannot exceed 100 characters'),
  manager_id: z.string().optional().or(z.literal('')),
  parent_department_id: z.string().optional().or(z.literal('')),
  branch_id: z.string().optional().or(z.literal('')),
  cost_center: z
    .string()
    .max(50, 'Cost center cannot exceed 50 characters')
    .optional()
    .or(z.literal('')),
  budget: z
    .preprocess(
      (val) => (val === '' || val === null || val === undefined ? 0 : Number(val)),
      z.number({ invalid_type_error: 'Budget must be a valid number' }).min(0, 'Budget must be at least 0')
    )
    .default(0),
  extension_number: z
    .string()
    .max(50, 'Extension number cannot exceed 50 characters')
    .optional()
    .or(z.literal('')),
  employee_capacity: z
    .preprocess(
      (val) => (val === '' || val === null || val === undefined ? 100 : Number(val)),
      z
        .number({ invalid_type_error: 'Employee capacity must be a valid number' })
        .int('Employee capacity must be an integer')
        .min(0, 'Employee capacity must be at least 0')
    )
    .default(100),
  status: departmentStatusEnum.default('ACTIVE'),

  // Legacy aliases supported for backwards compatibility
  name: z.string().optional(),
  code: z.string().optional(),
});

export type DepartmentFormData = z.infer<typeof departmentFormSchema>;
