/**
 * @file exit.schemas.ts
 * @description Zod validation schemas for Exit Management forms and actions.
 */

import { z } from 'zod';

export const EXIT_REASONS = [
  'Better Career Opportunity',
  'Personal Reasons',
  'Higher Education',
  'Relocation',
  'Health Reasons',
  'Salary Issues',
  'Work Environment',
  'Other',
] as const;

export const resignationFormSchema = z.object({
  reason: z.string().min(1, 'Please select a reason for resignation'),
  comments: z.string().min(10, 'Detailed comments must be at least 10 characters long'),
  proposedLastWorkingDay: z.string().min(1, 'Proposed last working day is required'),
  resignationDate: z.string().optional(),
  noticePeriodDays: z.coerce.number().int().min(0, 'Notice period cannot be negative').default(30),
});

export type ResignationFormValues = z.infer<typeof resignationFormSchema>;

export const managerApprovalSchema = z.object({
  comments: z.string().optional(),
});

export const managerRejectionSchema = z.object({
  rejectionReason: z.string().min(10, 'Rejection reason must be at least 10 characters'),
});

export const hrApprovalSchema = z.object({
  comments: z.string().optional(),
  lastWorkingDay: z.string().optional(),
});

export const hrRejectionSchema = z.object({
  rejectionReason: z.string().min(10, 'Rejection reason must be at least 10 characters'),
});

export const clearanceSignoffSchema = z
  .object({
    department: z.enum(['MANAGER', 'IT', 'FINANCE', 'ADMIN', 'HR']),
    status: z.enum(['PENDING', 'CLEARED', 'ON_HOLD', 'REJECTED']),
    remarks: z.string().optional(),
    reason: z.string().optional(),
  })
  .refine(
    (data) => {
      if ((data.status === 'ON_HOLD' || data.status === 'REJECTED') && (!data.reason || data.reason.trim().length < 5)) {
        return false;
      }
      return true;
    },
    {
      message: 'Reason is required (min 5 characters) when placing on hold or rejecting clearance',
      path: ['reason'],
    }
  );

export type ClearanceSignoffValues = z.infer<typeof clearanceSignoffSchema>;

export const assetReturnSchema = z.object({
  assetId: z.string().min(1, 'Asset ID is required'),
  condition: z.enum(['GOOD', 'FAIR', 'DAMAGED', 'LOST']).default('GOOD'),
  recoveryAmount: z.coerce.number().min(0, 'Recovery amount cannot be negative').default(0),
  remarks: z.string().optional(),
});

export type AssetReturnValues = z.infer<typeof assetReturnSchema>;

export const exitInterviewSchema = z.object({
  reasonForLeaving: z.string().min(1, 'Reason for leaving is required'),
  workEnvironmentRating: z.number().int().min(1).max(5),
  managerBehaviourRating: z.number().int().min(1).max(5),
  salaryBenefitsRating: z.number().int().min(1).max(5),
  careerGrowthRating: z.number().int().min(1).max(5),
  whatShouldImprove: z.string().min(5, 'Feedback must be at least 5 characters'),
  wouldRejoin: z.boolean(),
  additionalComments: z.string().optional(),
});

export type ExitInterviewValues = z.infer<typeof exitInterviewSchema>;

export const fnfUpdateSchema = z.object({
  status: z.enum(['DRAFT', 'UNDER_REVIEW', 'PENDING_APPROVAL', 'APPROVED', 'PAYMENT_PROCESSING', 'PAID', 'ON_HOLD']),
  holdReason: z.string().optional(),
  transactionId: z.string().optional(),
  remarks: z.string().optional(),
});

export type FnFUpdateValues = z.infer<typeof fnfUpdateSchema>;
