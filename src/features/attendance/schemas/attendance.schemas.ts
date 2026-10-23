/**
 * @file attendance.schemas.ts
 * @description Zod validation schemas for punch actions, regularization forms,
 * shift configuration, and roster assignments.
 */

import { z } from 'zod';

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;
const ISO_DATETIME_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;

export const workModeEnum = z.enum(['OFFICE', 'WFM', 'FIELD']);

/**
 * Validates the punch-in request form state before dispatch.
 */
export const punchInSchema = z.object({
  timestamp: z.string().regex(ISO_DATETIME_REGEX, 'A valid punch-in timestamp is required'),
  workMode: workModeEnum,
});

export type PunchInFormData = z.infer<typeof punchInSchema>;

/**
 * Validates the punch-out request form state before dispatch.
 */
export const punchOutSchema = z.object({
  timestamp: z.string().regex(ISO_DATETIME_REGEX, 'A valid punch-out timestamp is required'),
  workNotes: z
    .string()
    .max(500, 'Work notes cannot exceed 500 characters')
    .optional()
    .or(z.literal('')),
});

export type PunchOutFormData = z.infer<typeof punchOutSchema>;

export const regularizationCorrectionTypeEnum = z.enum([
  'MISSED_PUNCH_IN',
  'MISSED_PUNCH_OUT',
  'BOTH',
  'ON_DUTY',
]);

/**
 * Validates a missed-punch / on-duty regularization application.
 * Requested times are required whenever the correction covers that punch.
 */
export const applyRegularizationSchema = z
  .object({
    attendanceRecordId: z.string().optional(),
    date: z.string().regex(DATE_REGEX, 'Please select a valid date (YYYY-MM-DD)'),
    correctionType: regularizationCorrectionTypeEnum,
    requestedCheckIn: z
      .string()
      .regex(TIME_REGEX, 'Enter time as HH:mm')
      .optional()
      .or(z.literal('')),
    requestedCheckOut: z
      .string()
      .regex(TIME_REGEX, 'Enter time as HH:mm')
      .optional()
      .or(z.literal('')),
    reason: z
      .string()
      .min(10, 'Reason must be at least 10 characters')
      .max(500, 'Reason cannot exceed 500 characters'),
  })
  .superRefine((data, ctx) => {
    const needsIn = data.correctionType === 'MISSED_PUNCH_IN' || data.correctionType === 'BOTH';
    const needsOut = data.correctionType === 'MISSED_PUNCH_OUT' || data.correctionType === 'BOTH';

    if (needsIn && !data.requestedCheckIn) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Requested check-in time is required for this correction type',
        path: ['requestedCheckIn'],
      });
    }
    if (needsOut && !data.requestedCheckOut) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Requested check-out time is required for this correction type',
        path: ['requestedCheckOut'],
      });
    }
  });

export type ApplyRegularizationFormData = z.infer<typeof applyRegularizationSchema>;

/**
 * Validates a manager approve/reject decision on a regularization request.
 * A rejection comment is mandatory when rejecting.
 */
export const reviewRegularizationSchema = z
  .object({
    id: z.string().min(1, 'Regularization request ID is required'),
    status: z.enum(['APPROVED', 'REJECTED']),
    approverComment: z
      .string()
      .max(500, 'Comment cannot exceed 500 characters')
      .optional()
      .or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    if (data.status === 'REJECTED' && (!data.approverComment || data.approverComment.trim().length < 3)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'A rejection comment (min 3 characters) is required',
        path: ['approverComment'],
      });
    }
  });

export type ReviewRegularizationFormData = z.infer<typeof reviewRegularizationSchema>;

/**
 * Validates a shift definition form.
 */
export const shiftFormSchema = z
  .object({
    name: z.string().min(2, 'Shift name is required (min 2 characters)'),
    code: z.string().min(2, 'Shift code is required (min 2 characters)').max(12, 'Code cannot exceed 12 characters'),
    startTime: z.string().regex(TIME_REGEX, 'Enter start time as HH:mm'),
    endTime: z.string().regex(TIME_REGEX, 'Enter end time as HH:mm'),
    gracePeriodMinutes: z.coerce.number().min(0, 'Grace period cannot be negative').max(120, 'Grace period cannot exceed 120 minutes'),
    halfDayMinimumHours: z.coerce.number().positive('Half-day minimum must be greater than 0').max(12, 'Half-day minimum cannot exceed 12 hours'),
    fullDayMinimumHours: z.coerce.number().positive('Full-day minimum must be greater than 0').max(16, 'Full-day minimum cannot exceed 16 hours'),
    isNightShift: z.boolean().default(false),
    isActive: z.boolean().optional().default(true),
  })
  .refine((data) => data.isNightShift || data.startTime !== data.endTime, {
    message: 'Start and end time cannot be identical',
    path: ['endTime'],
  });

export type ShiftFormData = z.infer<typeof shiftFormSchema>;

/**
 * Validates a roster bulk-assignment form.
 */
export const rosterAssignSchema = z
  .object({
    shiftId: z.string().min(1, 'Please select a shift'),
    employeeIds: z.array(z.string()).min(1, 'Select at least one employee'),
    startDate: z.string().regex(DATE_REGEX, 'Please select a valid start date (YYYY-MM-DD)'),
    endDate: z.string().regex(DATE_REGEX, 'Please select a valid end date (YYYY-MM-DD)'),
    overrideExisting: z.boolean().default(false),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: 'End date cannot be before start date',
    path: ['endDate'],
  });

export type RosterAssignFormData = z.infer<typeof rosterAssignSchema>;
