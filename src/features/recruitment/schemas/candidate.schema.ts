/**
 * @file candidate.schema.ts
 * @description Zod validation schemas for candidate creation, updates, and application submissions.
 * Conforms strictly to backend Pydantic models (CandidateCreate, CandidateUpdate, ApplicationCreate).
 */

import { z } from 'zod';

export const candidateCreateSchema = z.object({
  first_name: z
    .string()
    .min(1, 'First name is required')
    .max(100, 'First name cannot exceed 100 characters')
    .trim(),
  last_name: z
    .string()
    .min(1, 'Last name is required')
    .max(100, 'Last name cannot exceed 100 characters')
    .trim(),
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Please enter a valid RFC-compliant email address')
    .trim()
    .toLowerCase(),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 characters')
    .max(20, 'Phone number cannot exceed 20 characters')
    .trim(),
  location: z
    .string()
    .min(1, 'Location is required')
    .max(100, 'Location cannot exceed 100 characters')
    .trim(),
  summary: z.string().optional().nullable(),
  skills: z
    .union([z.array(z.string()), z.string()])
    .transform((val) => {
      if (Array.isArray(val)) return val;
      if (!val) return [];
      return val
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    })
    .optional()
    .nullable(),
  tags: z
    .union([z.array(z.string()), z.string()])
    .transform((val) => {
      if (Array.isArray(val)) return val;
      if (!val) return [];
      return val
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    })
    .optional()
    .nullable(),
  years_experience: z.coerce
    .number()
    .min(0, 'Years of experience must be 0 or greater')
    .default(0),
  current_company: z.string().max(150, 'Current company cannot exceed 150 characters').optional().nullable(),
  current_role: z.string().max(150, 'Current role cannot exceed 150 characters').optional().nullable(),
  expected_salary: z.coerce
    .number()
    .min(0, 'Salary must be positive')
    .optional()
    .nullable(),
  notice_days: z.coerce
    .number()
    .int('Notice days must be an integer')
    .min(0, 'Notice days must be 0 or greater')
    .default(0),
  source: z.string().default('DIRECT'),
  is_talent_pool: z.boolean().default(false),
  job_id: z.string().optional().nullable(),
});

export type CandidateCreateFormData = z.infer<typeof candidateCreateSchema>;

export const bulkMoveSchema = z.object({
  application_ids: z.array(z.string().uuid('Invalid application UUID')).min(1, 'Select at least one candidate'),
  status: z.enum([
    'APPLIED',
    'UNDER_REVIEW',
    'SHORTLISTED',
    'INTERVIEW_SCHEDULED',
    'INTERVIEW_COMPLETED',
    'SELECTED',
    'REJECTED',
    'HOLD',
    'OFFER_SENT',
    'OFFER_ACCEPTED',
    'OFFER_REJECTED',
    'EMPLOYEE_CREATED',
  ]),
});

export type BulkMoveFormData = z.infer<typeof bulkMoveSchema>;

