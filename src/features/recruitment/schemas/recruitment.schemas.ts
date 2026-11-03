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


/* =========================================================================
   EXTENDED RECRUITMENT WORKFLOW SCHEMAS
   ========================================================================= */

/** Interview cancellation schema — requires reason >= 5 characters */
export const cancelInterviewSchema = z.object({
  reason: z.string().min(5, 'Cancellation reason must be at least 5 characters'),
});

/** Interview feedback submission schema — requires notes >= 10 characters */
export const interviewFeedbackSchema = z
  .object({
    recommendation: z.enum(['PASS', 'HOLD', 'REJECT'], { message: 'Recommendation is required' }),
    rating: z
      .number({ message: 'Rating is required' })
      .min(1, 'Rating must be at least 1')
      .max(5, 'Rating cannot exceed 5'),
    notes: z.string().min(10, 'Feedback notes must be at least 10 characters'),
    interviewerName: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.recommendation === 'REJECT' && data.notes.trim().length < 15) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['notes'],
        message: 'A detailed rejection explanation (minimum 15 characters) is required',
      });
    }
  });

/** AI Screening human override decision schema */
export const screeningDecisionSchema = z
  .object({
    action: z.enum(['SHORTLIST', 'REJECT', 'KEEP_REVIEW'], { message: 'Action is required' }),
    reason: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.action === 'REJECT') {
      if (!data.reason || data.reason.trim().length < 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['reason'],
          message: 'A rejection reason of at least 10 characters is required',
        });
      }
    }
  });

/** Compensation and Offer creation schema */
export const createOfferSchema = z.object({
  ctc: z.number().positive('Annual CTC must be positive'),
  joiningDate: z
    .string()
    .regex(DATE_REGEX, 'Joining date must be in YYYY-MM-DD format')
    .refine((val) => !Number.isNaN(Date.parse(val)), 'Joining date must be valid'),
  offerExpiryDate: z
    .string()
    .regex(DATE_REGEX, 'Expiry date must be in YYYY-MM-DD format')
    .optional()
    .or(z.literal('')),
  benefits: z.array(z.string()).default([]),
});

/** Requisition creation schema */
export const createRequisitionSchema = z
  .object({
    title: z.string().min(3, 'Requisition title must be at least 3 characters'),
    department: z.string().min(1, 'Department is required'),
    headcount: z.number().int('Headcount must be an integer').positive('Headcount must be at least 1'),
    plannedQuarter: z.string().min(2, 'Planned quarter is required (e.g. Q1 2026)'),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
    budgetMin: z.number().nonnegative('Minimum budget cannot be negative'),
    budgetMax: z.number().positive('Maximum budget must be greater than zero'),
    currency: z.string().default('INR'),
    skills: z.array(z.string().min(1)).min(1, 'Add at least one required skill'),
    experienceLevel: z.string().min(1, 'Experience level is required'),
    justification: z.string().min(10, 'Business justification must be at least 10 characters'),
  })
  .superRefine((data, ctx) => {
    if (data.budgetMax < data.budgetMin) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['budgetMax'],
        message: 'Maximum budget must be greater than or equal to minimum budget',
      });
    }
  });

/** Agency Vendor creation schema */
export const createVendorSchema = z.object({
  name: z.string().min(2, 'Agency name is required'),
  contactName: z.string().min(2, 'Contact person name is required'),
  email: z.string().regex(EMAIL_REGEX, 'Valid agency email is required'),
  phone: z.string().regex(PHONE_REGEX, 'Valid agency phone number is required'),
  commissionRate: z
    .number()
    .min(0, 'Commission cannot be negative')
    .max(100, 'Commission cannot exceed 100%'),
  status: z.enum(['ACTIVE', 'PAUSED', 'TERMINATED']).default('ACTIVE'),
});

/** Employee Referral creation schema */
export const createReferralSchema = z.object({
  candidateId: z.string().min(1, 'Candidate is required'),
  employeeId: z.string().min(1, 'Referring employee is required'),
  jobId: z.string().optional().nullable(),
  rewardAmount: z.number().nonnegative('Reward amount cannot be negative').default(0),
});

/** Recruitment Automation rule schema */
export const createAutomationRuleSchema = z.object({
  name: z.string().min(3, 'Rule name must be at least 3 characters'),
  description: z.string().min(5, 'Rule description must be at least 5 characters'),
  triggerEvent: z.enum([
    'application_received',
    'interview_scheduled',
    'offer_accepted',
    'orientation_done',
  ]),
  action: z.enum([
    'send_email',
    'send_whatsapp',
    'move_stage',
    'create_it_ticket',
    'assign_mentor',
  ]),
  enabled: z.boolean().default(true),
});

/** Public candidate job application form schema */
export const publicJobApplySchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().regex(EMAIL_REGEX, 'Enter a valid email address'),
  phone: z.string().min(8, 'Phone number is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  experienceYears: z.number().min(0, 'Years of experience cannot be negative'),
  declarationChecked: z
    .boolean()
    .refine((val) => val === true, 'You must agree to the data declaration'),
  highestQualification: z.string().optional(),
  currentCompany: z.string().optional(),
  currentDesignation: z.string().optional(),
  currentCtc: z.number().optional(),
  expectedCtc: z.number().optional(),
  noticePeriod: z.number().optional(),
  linkedinUrl: z.string().url('Enter a valid LinkedIn URL').optional().or(z.literal('')),
  portfolioUrl: z.string().url('Enter a valid Portfolio URL').optional().or(z.literal('')),
  coverLetter: z.string().optional(),
  resumeFile: z
    .any()
    .refine((file) => file instanceof File, 'Resume file is required')
    .refine(
      (file: File) => file && file.size <= 5 * 1024 * 1024,
      'Resume file size must not exceed 5MB'
    )
    .refine(
      (file: File) =>
        file &&
        ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(
          file.type
        ) ||
        /\.(pdf|doc|docx)$/i.test(file?.name || ''),
      'Resume must be in PDF, DOC, or DOCX format'
    ),
});

/** Public interview self-booking slot schema */
export const publicInterviewBookSchema = z.object({
  token: z.string().min(1, 'Booking token is required'),
  slotId: z.string().optional(),
  startTime: z.string().min(1, 'Please select an available slot'),
  timezone: z.string().min(1, 'Timezone is required'),
});

export type CancelInterviewFormData = z.infer<typeof cancelInterviewSchema>;
export type InterviewFeedbackFormData = z.infer<typeof interviewFeedbackSchema>;
export type ScreeningDecisionFormData = z.infer<typeof screeningDecisionSchema>;
export type CreateOfferFormData = z.infer<typeof createOfferSchema>;
export type CreateRequisitionFormData = z.infer<typeof createRequisitionSchema>;
export type CreateVendorFormData = z.infer<typeof createVendorSchema>;
export type CreateReferralFormData = z.infer<typeof createReferralSchema>;
export type CreateAutomationRuleFormData = z.infer<typeof createAutomationRuleSchema>;
export type PublicJobApplyFormData = z.infer<typeof publicJobApplySchema>;
export type PublicInterviewBookFormData = z.infer<typeof publicInterviewBookSchema>;
