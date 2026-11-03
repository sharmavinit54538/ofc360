/**
 * @file interviewScheduler.schema.ts
 * @description Zod validation schemas for Interview Scheduler & Evaluation Module.
 * Enforces strict backend constraints:
 * - Date must be between today and today + 7 days.
 * - Online mode requires valid meeting_url.
 * - Offline mode requires office_address.
 * - Round feedback requires interviewer_name, score, and feedback.
 */

import { z } from 'zod';

export const initiateInterviewSchema = z.object({
  application_id: z.string().uuid('Invalid application ID format'),
  round_names: z
    .array(z.string().min(1, 'Round name cannot be empty').max(100, 'Round name too long').trim())
    .min(1, 'At least one interview round must be configured'),
});

export type InitiateInterviewFormData = z.infer<typeof initiateInterviewSchema>;

export const scheduleSlotSchema = z
  .object({
    interview_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD')
      .refine(
        (val) => {
          const selected = new Date(val + 'T00:00:00');
          if (isNaN(selected.getTime())) return false;
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const maxDate = new Date(today);
          maxDate.setDate(today.getDate() + 7);

          return selected >= today && selected <= maxDate;
        },
        {
          message: 'Interview date must be within the next 7 days (including today)',
        }
      ),
    interview_time: z
      .string()
      .min(1, 'Interview time is required')
      .regex(
        /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/,
        'Time must be in HH:MM or HH:MM:SS 24-hour format'
      ),
    mode: z.enum(['ONLINE', 'OFFLINE'] as const, {
      required_error: 'Please select interview mode',
    }),
    meeting_url: z.string().optional().nullable(),
    office_address: z.string().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.mode === 'ONLINE') {
      const url = data.meeting_url?.trim();
      if (!url) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['meeting_url'],
          message: 'Meeting URL is required for online interviews (Google Meet, Zoom, Teams)',
        });
      } else {
        try {
          new URL(url);
        } catch {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['meeting_url'],
            message: 'Please enter a valid URL (e.g. https://meet.google.com/abc-defg-hij)',
          });
        }
      }
    }

    if (data.mode === 'OFFLINE') {
      const addr = data.office_address?.trim();
      if (!addr || addr.length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['office_address'],
          message: 'Office address or conference room is required for offline interviews',
        });
      }
    }
  });

export type ScheduleSlotFormData = z.infer<typeof scheduleSlotSchema>;

export const roundEvaluationSchema = z.object({
  interviewer_name: z
    .string()
    .min(1, 'Interviewer name is required')
    .max(100, 'Interviewer name cannot exceed 100 characters')
    .trim(),
  score: z
    .string()
    .min(1, 'Score / rating is required')
    .max(20, 'Score cannot exceed 20 characters')
    .trim(),
  feedback: z
    .string()
    .min(10, 'Feedback must be at least 10 characters long')
    .max(2000, 'Feedback cannot exceed 2000 characters')
    .trim(),
});

export type RoundEvaluationFormData = z.infer<typeof roundEvaluationSchema>;

