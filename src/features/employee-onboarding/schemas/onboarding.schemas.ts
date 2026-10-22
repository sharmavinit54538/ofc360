/**
 * @file onboarding.schemas.ts
 * @description Zod validation schemas for Onboarding Document Uploads,
 * Task Completions, and HR Admin Verifications.
 */

import { z } from 'zod';

export const taskCategoryEnum = z.enum([
  'PERSONAL_INFO',
  'DOCUMENTS',
  'IT_SETUP',
  'COMPLIANCE',
  'PAYROLL_TAX',
  'ORIENTATION',
]);

export const taskStatusEnum = z.enum([
  'PENDING',
  'IN_PROGRESS',
  'SUBMITTED',
  'VERIFIED',
  'REJECTED',
]);

export const documentUploadSchema = z.object({
  taskId: z.string().min(1, 'Task ID is required'),
  employeeId: z.string().optional(),
  documentUrl: z.string().url('A valid document URL is required'),
  documentName: z.string().min(1, 'Document name is required'),
  documentSize: z.number().optional(),
  notes: z.string().optional(),
});

export type DocumentUploadFormData = z.infer<typeof documentUploadSchema>;

export const verifyTaskSchema = z.object({
  taskId: z.string().min(1, 'Task ID is required'),
  employeeId: z.string().min(1, 'Employee ID is required'),
  status: z.enum(['VERIFIED', 'REJECTED']),
  feedback: z.string().max(500, 'Feedback cannot exceed 500 characters').optional(),
});

export type VerifyTaskFormData = z.infer<typeof verifyTaskSchema>;

export const personalInfoTaskSchema = z.object({
  taskId: z.string().min(1, 'Task ID is required'),
  emergencyContactName: z.string().min(2, 'Contact name is required'),
  emergencyContactPhone: z.string().min(7, 'Valid contact number is required'),
  emergencyContactRelation: z.string().min(2, 'Relationship is required'),
  residentialAddress: z.string().min(5, 'Residential address is required'),
  bloodGroup: z.string().optional(),
});

export type PersonalInfoTaskFormData = z.infer<typeof personalInfoTaskSchema>;
