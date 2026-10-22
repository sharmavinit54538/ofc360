/**
 * @file visitorForm.schema.ts
 * @description Zod validation schema for Visitor Pre-Registration and On-Premises Check-in.
 */

import { z } from 'zod';

export const registerVisitorSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be under 100 characters'),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .trim()
    .min(7, 'Phone number must be at least 7 digits')
    .max(20, 'Phone number cannot exceed 20 characters'),
  company: z
    .string()
    .trim()
    .min(2, 'Company / Organization name is required')
    .max(100, 'Company name is too long'),
  hostEmployeeId: z
    .string()
    .trim()
    .min(1, 'Please select or enter the host employee / department contact'),
  purpose: z
    .string()
    .trim()
    .min(3, 'Purpose of visit is required (min 3 characters)')
    .max(200, 'Purpose cannot exceed 200 characters'),
  ndaSigned: z
    .boolean()
    .refine((val) => val === true, {
      message: 'Visitor must acknowledge and sign the Non-Disclosure Agreement (NDA)',
    }),
  expectedArrival: z.string().optional(),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
});

export type RegisterVisitorFormData = z.infer<typeof registerVisitorSchema>;
