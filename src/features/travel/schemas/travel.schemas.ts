/**
 * @file travel.schemas.ts
 * @description Zod validation schemas for travel request submission and status updates.
 */

import { z } from 'zod';

export const expenseBreakdownSchema = z.object({
  flights: z.coerce.number().min(0, 'Flight expense cannot be negative'),
  hotel: z.coerce.number().min(0, 'Hotel expense cannot be negative'),
  cabs: z.coerce.number().min(0, 'Cab expense cannot be negative'),
  perDiem: z.coerce.number().min(0, 'Per diem cannot be negative'),
  other: z.coerce.number().min(0, 'Other expense cannot be negative').optional().default(0),
  currency: z.string().default('USD'),
});

export const createTravelRequestSchema = z
  .object({
    origin: z.string().min(2, 'Origin city/location is required (min 2 characters)'),
    destination: z.string().min(2, 'Destination city/location is required (min 2 characters)'),
    travelType: z.enum(['DOMESTIC', 'INTERNATIONAL'], {
      required_error: 'Please select a travel type',
    }),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Please select a valid start date (YYYY-MM-DD)'),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Please select a valid end date (YYYY-MM-DD)'),
    purpose: z.string().min(5, 'Travel purpose is required (min 5 characters)'),
    businessJustification: z.string().optional(),
    urgency: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
    expenses: expenseBreakdownSchema,
    emergencyContact: z.string().optional(),
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate).getTime();
      const end = new Date(data.endDate).getTime();
      return end >= start;
    },
    {
      message: 'End date must be on or after start date',
      path: ['endDate'],
    }
  );

export type CreateTravelRequestFormData = z.infer<typeof createTravelRequestSchema>;

export const updateTravelStatusSchema = z.object({
  id: z.string().min(1, 'Trip ID is required'),
  status: z.enum(['APPROVED', 'REJECTED']),
  comments: z.string().max(500, 'Comments cannot exceed 500 characters').optional(),
});

export type UpdateTravelStatusFormData = z.infer<typeof updateTravelStatusSchema>;
