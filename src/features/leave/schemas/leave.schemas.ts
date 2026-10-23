/**
 * @file leave.schemas.ts
 * @description Zod validation schemas for Leave Application, Approval/Rejection,
 * Cancellation, and Comp-Off request forms.
 */

import { z } from 'zod';

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const leaveDurationEnum = z.enum([
  'FULL_DAY',
  'HALF_DAY_FIRST_HALF',
  'HALF_DAY_SECOND_HALF',
]);

export const leaveStatusEnum = z.enum(['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED']);

/**
 * Schema for the Apply Leave form.
 * Enforces valid ISO dates and that endDate is not before startDate.
 */
export const applyLeaveSchema = z
  .object({
    leaveTypeId: z.string().min(1, 'Please select a leave type'),
    startDate: z.string().regex(DATE_REGEX, 'Please select a valid start date (YYYY-MM-DD)'),
    endDate: z.string().regex(DATE_REGEX, 'Please select a valid end date (YYYY-MM-DD)'),
    duration: leaveDurationEnum.default('FULL_DAY'),
    reason: z
      .string()
      .min(10, 'Reason must be at least 10 characters')
      .max(500, 'Reason cannot exceed 500 characters'),
    contactDuringLeave: z
      .string()
      .max(120, 'Emergency contact cannot exceed 120 characters')
      .optional()
      .or(z.literal('')),
    attachmentUrls: z.array(z.string()).optional().default([]),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: 'End date cannot be before start date',
    path: ['endDate'],
  });

export type ApplyLeaveFormData = z.infer<typeof applyLeaveSchema>;

/**
 * Schema for the Approve / Reject decision modal.
 * A comment is mandatory whenever a request is rejected.
 */
export const leaveApprovalSchema = z
  .object({
    id: z.string().min(1, 'Leave request ID is required'),
    status: z.enum(['APPROVED', 'REJECTED']),
    comments: z
      .string()
      .max(500, 'Comments cannot exceed 500 characters')
      .optional()
      .or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    if (data.status === 'REJECTED' && (!data.comments || data.comments.trim().length < 3)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'A rejection reason (min 3 characters) is required',
        path: ['comments'],
      });
    }
  });

export type LeaveApprovalFormData = z.infer<typeof leaveApprovalSchema>;

/**
 * Schema for cancelling an own pending leave request.
 */
export const cancelLeaveSchema = z.object({
  id: z.string().min(1, 'Leave request ID is required'),
  reason: z
    .string()
    .max(300, 'Cancellation reason cannot exceed 300 characters')
    .optional()
    .or(z.literal('')),
});

export type CancelLeaveFormData = z.infer<typeof cancelLeaveSchema>;

/**
 * Schema for claiming a compensatory off for extra hours worked.
 */
export const compOffRequestSchema = z.object({
  workedDate: z.string().regex(DATE_REGEX, 'Please select the extra-duty date (YYYY-MM-DD)'),
  hoursWorked: z.coerce
    .number()
    .positive('Hours worked must be greater than 0')
    .max(24, 'Hours worked cannot exceed 24 in a day'),
  reason: z
    .string()
    .min(10, 'Please describe the extra duty (min 10 characters)')
    .max(500, 'Reason cannot exceed 500 characters'),
});

export type CompOffRequestFormData = z.infer<typeof compOffRequestSchema>;
