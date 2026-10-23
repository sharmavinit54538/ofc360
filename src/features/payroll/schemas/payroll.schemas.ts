/**
 * @file payroll.schemas.ts
 * @description Form validation contracts for payroll operations.
 */

import { z } from 'zod';

const monthSchema = z.coerce
  .number()
  .int('Month must be a whole number')
  .min(1, 'Month must be between 1 and 12')
  .max(12, 'Month must be between 1 and 12');

const yearSchema = z.coerce
  .number()
  .int('Year must be a whole number')
  .min(2020, 'Year must be 2020 or later');

const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid date in YYYY-MM-DD format')
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }, 'Enter a valid calendar date');

export const initiatePayrollSchema = z.object({
  month: monthSchema,
  year: yearSchema,
  includeApprovedExpenses: z.boolean(),
  syncAttendanceLop: z.boolean(),
  notes: z.string().trim().max(500, 'Notes cannot exceed 500 characters').optional(),
});

export const updatePayrollRunStatusSchema = z
  .object({
    status: z.enum(['APPROVED', 'PAID', 'REJECTED']),
    transactionReference: z.string().trim().max(100).optional().or(z.literal('')),
    remarks: z.string().trim().max(500).optional().or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    if (data.status === 'PAID' && (!data.transactionReference || data.transactionReference.trim().length < 5)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Transaction reference must contain at least 5 characters',
        path: ['transactionReference'],
      });
    }

    if (data.status === 'REJECTED' && (!data.remarks || data.remarks.trim().length < 10)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Rejection remarks must contain at least 10 characters',
        path: ['remarks'],
      });
    }
  });

export const payrollAdjustmentSchema = z.object({
  employeeId: z.string().min(1, 'Select an employee'),
  month: monthSchema,
  year: yearSchema,
  type: z.enum(['BONUS', 'ARREAR', 'INCENTIVE', 'DEDUCTION', 'RECOVERY']),
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  isTaxable: z.boolean(),
  reason: z.string().trim().min(5, 'Reason must contain at least 5 characters').max(500),
});

export const updateSalaryStructureSchema = z.object({
  annualCtc: z.coerce.number().positive('Annual CTC must be greater than 0'),
  basic: z.coerce.number().positive('Basic salary must be greater than 0'),
  hra: z.coerce.number().min(0, 'HRA cannot be negative'),
  specialAllowance: z.coerce.number().min(0, 'Special allowance cannot be negative'),
  taxRegime: z.enum(['NEW_REGIME', 'OLD_REGIME']),
  effectiveFrom: isoDateSchema,
});

export const taxDeclarationSchema = z.object({
  financialYear: z.string().trim().min(1, 'Financial year is required'),
  regime: z.enum(['NEW_REGIME', 'OLD_REGIME']),
  section80C: z.coerce.number().min(0, 'Section 80C cannot be negative').max(150000, 'Section 80C cannot exceed 150000'),
  section80D: z.coerce.number().min(0, 'Section 80D cannot be negative').max(100000, 'Section 80D cannot exceed 100000'),
  hraRentAnnual: z.coerce.number().min(0, 'Annual HRA rent cannot be negative'),
});

export type InitiatePayrollFormData = z.infer<typeof initiatePayrollSchema>;
export type UpdatePayrollRunStatusFormData = z.infer<typeof updatePayrollRunStatusSchema>;
export type PayrollAdjustmentFormData = z.infer<typeof payrollAdjustmentSchema>;
export type UpdateSalaryStructureFormData = z.infer<typeof updateSalaryStructureSchema>;
export type TaxDeclarationFormData = z.infer<typeof taxDeclarationSchema>;
