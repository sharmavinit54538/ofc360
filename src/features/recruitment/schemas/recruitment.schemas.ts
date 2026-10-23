/**
 * @file recruitment.schemas.ts
 * @description Zod validation schemas for Recruitment forms: job
 * requisition creation, candidate intake, pipeline stage transitions,
 * and interview scheduling. Enforces the business rules used by the
 * Recruitment hub (salary ranges, future interview dates, conditional
 * rejection reasons and meeting links).
 */

import { z } from 'zod';

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^([01]?\d|2[0-3]):[0-5]\d$/;
const PHONE_REGEX = /^\+?[0-9][0-9\s\-]{8,14}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const JOB_TYPE_VALUES = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN'] as const;
const JOB_STATUS_VALUES = ['DRAFT', 'PUBLISHED', 'ON_HOLD', 'CLOSED'] as const;
const CANDIDATE_STAGE_VALUES = ['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFERED', 'HIRED', 'REJECTED'] as const;
const MEETING_TYPE_VALUES = ['ONLINE', 'IN_PERSON'] as const;

/**
 * New job requisition form — enforces salary range ordering and a valid
 * target close date.
 */
export const createJobSchema = z
  .object({
    title: z.string().min(3, 'Job title must be at least 3 characters'),
    departmentId: z.string().min(1, 'Please select a department'),
    location: z.string().min(2, 'Work location is required'),
    jobType: z.enum(JOB_TYPE_VALUES, { message: 'Please select a job type' }),
    openingsCount: z
      .number({ message: 'Enter the number of openings' })
      .int('Openings must be a whole number')
      .positive('Openings must be at least 1'),
    experienceMinYears: z
      .number({ message: 'Enter minimum experience' })
      .int('Experience must be a whole number')
      .min(0, 'Minimum experience cannot be negative'),
    experienceMaxYears: z
      .number({ message: 'Enter maximum experience' })
      .int('Experience must be a whole number')
      .min(0, 'Maximum experience cannot be negative'),
    minSalary: z
      .number({ message: 'Enter the minimum salary' })
      .nonnegative('Minimum salary cannot be negative'),
    maxSalary: z
      .number({ message: 'Enter the maximum salary' })
      .nonnegative('Maximum salary cannot be negative'),
    currency: z.string().min(3, 'Currency code is required'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    skills: z.array(z.string().min(1)).min(1, 'Add at least one required skill'),
    hiringManagerId: z.string().min(1, 'Please select a hiring manager'),
    targetCloseDate: z
      .string()
      .regex(DATE_REGEX, 'Please select a valid target date (YYYY-MM-DD)')
      .refine((val) => !Number.isNaN(Date.parse(val)), 'Target date must be a valid date'),
  })
  .superRefine((data, ctx) => {
    if (data.maxSalary < data.minSalary) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['maxSalary'],
        message: 'Maximum salary must be greater than or equal to the minimum salary',
      });
    }
    if (data.experienceMaxYears < data.experienceMinYears) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['experienceMaxYears'],
        message: 'Maximum experience must be greater than or equal to the minimum',
      });
    }
  });

/**
 * Add candidate form — basic validation of the candidate identity and
 * the job they are being attached to.
 */
export const addCandidateSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().regex(EMAIL_REGEX, 'Enter a valid email address'),
  phone: z.string().regex(PHONE_REGEX, 'Enter a valid 10-15 digit phone number'),
  jobId: z.string().min(1, 'Please select the job being applied for'),
  currentCompany: z.string().optional(),
  experienceYears: z
    .number({ message: 'Enter total experience' })
    .min(0, 'Experience cannot be negative'),
  noticePeriodDays: z
    .number({ message: 'Enter notice period length' })
    .int('Notice period must be a whole number of days')
    .min(0, 'Notice period cannot be negative'),
  resumeUrl: z
    .string()
    .url('Enter a valid resume URL')
    .optional()
    .or(z.literal('')),
  source: z.string().optional(),
});

/**
 * Pipeline stage transition — a rejection must be justified with a
 * written reason of at least 10 characters.
 */
export const updateCandidateStageSchema = z
  .object({
    stage: z.enum(CANDIDATE_STAGE_VALUES, { message: 'Please choose the new stage' }),
    notes: z.string().max(500, 'Notes must stay under 500 characters').optional(),
    rejectionReason: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.stage === 'REJECTED') {
      if (!data.rejectionReason || data.rejectionReason.trim().length < 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['rejectionReason'],
          message: 'A rejection reason of at least 10 characters is required',
        });
      }
    }
  });

/**
 * Job status transition — a reason helps audit the change.
 */
export const updateJobStatusSchema = z.object({
  status: z.enum(JOB_STATUS_VALUES, { message: 'Please choose the new status' }),
  reason: z.string().max(300, 'Reason must stay under 300 characters').optional(),
});

/**
 * Interview scheduling — interview date must be today or later, the end
 * time must follow the start time, at least one interviewer is required,
 * and an online round must carry a valid meeting link.
 */
export const scheduleInterviewSchema = z
  .object({
    candidateId: z.string().min(1, 'Please select a candidate'),
    jobId: z.string().min(1, 'Please select the job'),
    roundName: z.string().min(2, 'Round name is required'),
    roundNumber: z
      .number({ message: 'Enter the round number' })
      .int('Round number must be a whole number')
      .min(1, 'Round number starts at 1')
      .max(10, 'Round number cannot exceed 10'),
    interviewDate: z
      .string()
      .regex(DATE_REGEX, 'Please select a valid date (YYYY-MM-DD)')
      .refine((val) => !Number.isNaN(Date.parse(val)), 'Interview date must be a valid date'),
    startTime: z.string().regex(TIME_REGEX, 'Enter a valid start time (HH:MM)'),
    endTime: z.string().regex(TIME_REGEX, 'Enter a valid end time (HH:MM)'),
    interviewerIds: z.array(z.string().min(1)).min(1, 'Select at least one interviewer'),
    meetingType: z.enum(MEETING_TYPE_VALUES, { message: 'Choose how the round is conducted' }),
    meetingLink: z.string().optional(),
    instructions: z.string().max(500, 'Instructions must stay under 500 characters').optional(),
  })
  .superRefine((data, ctx) => {
    if (!Number.isNaN(Date.parse(data.interviewDate))) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const chosen = new Date(data.interviewDate);
      if (chosen < today) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['interviewDate'],
          message: 'Interview date cannot be in the past',
        });
      }
    }
    if (data.endTime <= data.startTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endTime'],
        message: 'End time must be after the start time',
      });
    }
    if (data.meetingType === 'ONLINE') {
      const link = data.meetingLink?.trim() ?? '';
      if (!link || !/^https?:\/\/.+\..+/.test(link)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['meetingLink'],
          message: 'A valid meeting URL is required for online rounds',
        });
      }
    }
  });

export type CreateJobFormData = z.infer<typeof createJobSchema>;
export type AddCandidateFormData = z.infer<typeof addCandidateSchema>;
export type UpdateCandidateStageFormData = z.infer<typeof updateCandidateStageSchema>;
export type UpdateJobStatusFormData = z.infer<typeof updateJobStatusSchema>;
export type ScheduleInterviewFormData = z.infer<typeof scheduleInterviewSchema>;
