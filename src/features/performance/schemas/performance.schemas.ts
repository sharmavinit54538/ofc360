/**
 * @file performance.schemas.ts
 * @description Zod validation schemas for appraisal review submissions,
 * goal creation / progress updates, and peer feedback.
 */

import { z } from 'zod';

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const RATING_MIN = 1;
const RATING_MAX = 5;

/**
 * Validates one competency rating line inside a review submission.
 */
export const competencyRatingSchema = z.object({
  competencyId: z.string().min(1, 'Competency identifier is required'),
  name: z.string().min(1, 'Competency name is required'),
  rating: z.coerce
    .number()
    .min(RATING_MIN, 'Rating must be at least 1')
    .max(RATING_MAX, 'Rating cannot exceed 5'),
  comments: z
    .string()
    .max(500, 'Comments cannot exceed 500 characters')
    .optional()
    .or(z.literal('')),
});

export type CompetencyRatingFormData = z.infer<typeof competencyRatingSchema>;

/**
 * Validates a self / manager / HR appraisal review submission.
 */
export const submitReviewSchema = z.object({
  role: z.enum(['SELF', 'MANAGER', 'HR']),
  ratings: z
    .array(competencyRatingSchema)
    .min(1, 'At least one competency must be rated before submitting'),
  overallRating: z.coerce
    .number()
    .min(RATING_MIN, 'Overall rating must be at least 1')
    .max(RATING_MAX, 'Overall rating cannot exceed 5'),
  strengths: z
    .string()
    .min(10, 'Strengths must be at least 10 characters')
    .max(1000, 'Strengths cannot exceed 1000 characters'),
  areasOfImprovement: z
    .string()
    .min(10, 'Areas of improvement must be at least 10 characters')
    .max(1000, 'Areas of improvement cannot exceed 1000 characters'),
  recommendedPromotion: z.boolean().optional(),
  status: z.string().min(1, 'Review status is required'),
});

export type SubmitReviewFormData = z.infer<typeof submitReviewSchema>;

/**
 * Validates creation of a new goal / OKR objective. Target date must not
 * already be in the past.
 */
export const createGoalSchema = z
  .object({
    title: z
      .string()
      .min(3, 'Goal title must be at least 3 characters')
      .max(120, 'Goal title cannot exceed 120 characters'),
    description: z
      .string()
      .max(1000, 'Description cannot exceed 1000 characters')
      .optional()
      .or(z.literal('')),
    category: z.enum(['ORGANIZATIONAL', 'DEPARTMENTAL', 'INDIVIDUAL', 'TECHNICAL', 'PROFESSIONAL']).default('INDIVIDUAL'),
    metricType: z.enum(['PERCENTAGE', 'NUMERIC', 'BOOLEAN']).default('PERCENTAGE'),
    targetValue: z.coerce.number().min(0, 'Target value must be at least 0').default(100),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
    targetDate: z.string().regex(DATE_REGEX, 'Please select a valid target date (YYYY-MM-DD)'),
    assigneeId: z.string().optional().or(z.literal('')),
  })
  .refine(
    (data) => {
      const target = new Date(data.targetDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return target >= today;
    },
    {
      message: 'Target date must be a valid future date',
      path: ['targetDate'],
    }
  );

export type CreateGoalFormData = z.infer<typeof createGoalSchema>;

/**
 * Validates a goal progress update.
 */
export const updateGoalProgressSchema = z.object({
  currentValue: z.coerce.number().min(0, 'Current value cannot be negative'),
  notes: z
    .string()
    .max(500, 'Notes cannot exceed 500 characters')
    .optional()
    .or(z.literal('')),
});

export type UpdateGoalProgressFormData = z.infer<typeof updateGoalProgressSchema>;

/**
 * Validates a 360-degree peer feedback submission.
 */
export const peerFeedbackSchema = z.object({
  toEmployeeId: z.string().min(1, 'Please specify the employee receiving feedback'),
  cycleId: z.string().optional().or(z.literal('')),
  feedback: z
    .string()
    .min(10, 'Feedback must be at least 10 characters')
    .max(1000, 'Feedback cannot exceed 1000 characters'),
  rating: z.coerce
    .number()
    .min(RATING_MIN, 'Rating must be at least 1')
    .max(RATING_MAX, 'Rating cannot exceed 5'),
});

export type PeerFeedbackFormData = z.infer<typeof peerFeedbackSchema>;
