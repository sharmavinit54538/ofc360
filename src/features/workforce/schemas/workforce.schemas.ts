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
export const employeeStatusActionEnum = z.enum([
  'ACTIVE',
  'PROBATION',
  'NOTICE_PERIOD',
  'SUSPENDED',
  'TERMINATED',
]);

/**
 * Validates creation of a new employee record.
 */
export const createEmployeeSchema = z.object({
  employeeCode: z.string().optional().or(z.literal('')),
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(60, 'First name cannot exceed 60 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(60, 'Last name cannot exceed 60 characters'),
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Enter a valid work email address'),
  personalEmail: z
    .string()
    .trim()
    .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: 'Enter a valid personal email address',
    })
    .optional()
    .or(z.literal('')),
  phone: z.string().regex(PHONE_REGEX, 'Enter a valid 10-15 digit phone number'),
  gender: genderEnum,
  joiningDate: z
    .string()
    .regex(DATE_REGEX, 'Please select a valid joining date (YYYY-MM-DD)')
    .refine((value) => !Number.isNaN(Date.parse(value)), 'Joining date must be a valid date'),
  departmentId: z.string().min(1, 'Please select a department'),
  designationId: z.string().min(1, 'Please select a designation'),
  reportingManagerId: z.string().optional().or(z.literal('')),
  employmentType: employmentTypeEnum,
  workLocation: z.string().min(2, 'Work location is required').max(120, 'Work location cannot exceed 120 characters'),
  workMode: workModeEnum,
});

export type CreateEmployeeFormData = z.infer<typeof createEmployeeSchema>;

/**
 * Validates partial updates of an existing employee record.
 */
export const updateEmployeeSchema = createEmployeeSchema.partial();

export type UpdateEmployeeFormData = z.infer<typeof updateEmployeeSchema>;

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
 * Validates creation of a new department.
 */
export const departmentFormSchema = z.object({
  name: z.string().min(3, 'Department name must be at least 3 characters').max(120, 'Department name cannot exceed 120 characters'),
  code: z.string().min(2, 'Department code must be at least 2 characters').max(12, 'Department code cannot exceed 12 characters'),
});

export type DepartmentFormData = z.infer<typeof departmentFormSchema>;
