/**
 * @file exit.schemas.ts
 * @description Zod validation schemas for Exit Initiations, Departmental Clearances,
 * Exit Interviews, and FnF Settlements.
 */

import { z } from 'zod';

export const exitTypeEnum = z.enum([
  'RESIGNATION',
  'TERMINATION',
  'RETIREMENT',
  'END_OF_CONTRACT',
]);

export const exitReasonEnum = z.enum([
  'BETTER_OPPORTUNITY',
  'RELOCATION',
  'CAREER_CHANGE',
  'COMPENSATION',
  'WORK_CULTURE',
  'PERSONAL',
  'HEALTH',
  'PERFORMANCE',
  'HIGHER_STUDIES',
  'OTHER',
]);

export const clearanceDepartmentEnum = z.enum(['IT', 'HR', 'FINANCE', 'ADMIN']);

export const clearanceStatusEnum = z.enum(['PENDING', 'CLEARED', 'FLAGGED']);

export const createExitCaseSchema = z.object({
  employeeId: z.string().optional(),
  exitType: exitTypeEnum,
  reason: exitReasonEnum,
  resignationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Please select a valid date (YYYY-MM-DD)'),
  expectedLastWorkingDay: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Please select a valid date (YYYY-MM-DD)'),
  noticePeriodDays: z.coerce.number().min(0, 'Notice period cannot be negative').default(30),
  handoverNotes: z.string().min(5, 'Please provide handover notes (min 5 characters)'),
  notes: z.string().optional(),
});

export type CreateExitCaseFormData = z.infer<typeof createExitCaseSchema>;

export const clearanceChecklistItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  completed: z.boolean(),
});

export const clearanceSignoffSchema = z.object({
  id: z.string().min(1, 'Case ID is required'),
  department: clearanceDepartmentEnum,
  status: clearanceStatusEnum,
  remarks: z.string().optional(),
  checklist: z.array(clearanceChecklistItemSchema),
});

export type ClearanceSignoffFormData = z.infer<typeof clearanceSignoffSchema>;

export const exitInterviewSchema = z.object({
  id: z.string().min(1, 'Case ID is required'),
  primaryReason: z.string().min(3, 'Please describe primary reason for leaving'),
  overallRating: z.coerce.number().min(1).max(5),
  managementRating: z.coerce.number().min(1).max(5),
  cultureRating: z.coerce.number().min(1).max(5),
  wouldRecommend: z.boolean().default(true),
  feedbackComments: z.string().optional(),
  suggestions: z.string().optional(),
});

export type ExitInterviewFormData = z.infer<typeof exitInterviewSchema>;

export const rejectExitSchema = z.object({
  id: z.string().min(1, 'Case ID is required'),
  rejectionReason: z.string().min(5, 'Rejection reason must be at least 5 characters'),
});

export type RejectExitFormData = z.infer<typeof rejectExitSchema>;

export const deactivateEmployeeSchema = z.object({
  id: z.string().min(1, 'Case ID is required'),
  notes: z.string().optional(),
  revokeAccessDate: z.string().optional(),
});

export type DeactivateEmployeeFormData = z.infer<typeof deactivateEmployeeSchema>;

export const settleFnFSchema = z.object({
  id: z.string().min(1, 'Case ID is required'),
  basicPayDues: z.coerce.number().min(0, 'Basic pay cannot be negative'),
  leaveEncashment: z.coerce.number().min(0, 'Leave encashment cannot be negative').default(0),
  bonusGratuity: z.coerce.number().min(0, 'Bonus/Gratuity cannot be negative').default(0),
  deductions: z.coerce.number().min(0, 'Deductions cannot be negative').default(0),
  paymentRef: z.string().optional(),
  remarks: z.string().optional(),
});

export type SettleFnFFormData = z.infer<typeof settleFnFSchema>;
