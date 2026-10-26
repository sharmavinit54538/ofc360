/**
 * @file announcements.schemas.ts
 * @description Zod validation schemas for Company and Super Admin Announcements.
 */

import { z } from 'zod';

export const announcementPriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']);
export const announcementStatusEnum = z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']);

export const createAnnouncementSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(150, 'Title must not exceed 150 characters'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().optional().default('General'),
  priority: announcementPriorityEnum.optional().default('MEDIUM'),
  department: z.string().nullable().optional(),
  branch: z.string().nullable().optional(),
  visibility: z.string().optional().default('ALL_EMPLOYEES'),
  publish_date: z
    .string()
    .optional()
    .default(() => new Date().toISOString().split('T')[0]),
  expiry_date: z.string().nullable().optional(),
  is_pinned: z.boolean().optional().default(false),
  status: announcementStatusEnum.optional().default('DRAFT'),
});

export const updateAnnouncementSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(150, 'Title must not exceed 150 characters'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().optional().default('General'),
  priority: announcementPriorityEnum.optional().default('MEDIUM'),
  department: z.string().nullable().optional(),
  branch: z.string().nullable().optional(),
  visibility: z.string().optional().default('ALL_EMPLOYEES'),
  publish_date: z.string().optional(),
  expiry_date: z.string().nullable().optional(),
  is_pinned: z.boolean().optional().default(false),
  status: announcementStatusEnum.optional().default('DRAFT'),
});

export const superAdminAnnouncementSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(150, 'Title must not exceed 150 characters'),
  content: z.string().min(1, 'Content is required'),
  target_audience: z.string().optional().default('ALL_TENANTS'),
});

export type CreateAnnouncementFormData = z.infer<typeof createAnnouncementSchema>;
export type UpdateAnnouncementFormData = z.infer<typeof updateAnnouncementSchema>;
export type SuperAdminAnnouncementFormData = z.infer<typeof superAdminAnnouncementSchema>;

