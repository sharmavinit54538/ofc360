/**
 * @file timelineForm.schema.ts
 * @description Zod validation schema for recording employee milestones, achievements,
 * role transitions, and performance records.
 */

import { z } from 'zod';

export const timelineEventTypeEnum = z.enum([
  'JOINING',
  'PROMOTION',
  'ROLE_CHANGE',
  'DEPARTMENT_TRANSFER',
  'PERFORMANCE_REVIEW',
  'AWARD_RECOGNITION',
  'TRAINING_CERTIFICATION',
  'LEAVE_SABBATICAL',
  'DOCUMENT_UPLOAD',
  'EXIT_INITIATED',
]);

export const addTimelineEventSchema = z.object({
  employeeId: z
    .string()
    .trim()
    .min(1, 'Please select or enter the employee ID'),
  employeeName: z
    .string()
    .trim()
    .min(2, 'Employee full name is required'),
  eventType: timelineEventTypeEnum,
  title: z
    .string()
    .trim()
    .min(3, 'Event title is required (min 3 characters)')
    .max(120, 'Event title cannot exceed 120 characters'),
  description: z
    .string()
    .trim()
    .min(5, 'Event description is required (min 5 characters)')
    .max(1000, 'Description cannot exceed 1000 characters'),
  timestamp: z
    .string()
    .min(1, 'Please select an event date'),
  oldRole: z.string().optional(),
  newRole: z.string().optional(),
  department: z.string().optional(),
  rating: z.string().optional(),
  awardTitle: z.string().optional(),
  certificationName: z.string().optional(),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
});

export type AddTimelineEventFormData = z.infer<typeof addTimelineEventSchema>;
