/**
 * @file expenses.schemas.ts
 * @description Zod validation schemas for Expense Claim submissions and status updates.
 */

import { z } from 'zod';

export const expenseCategoryEnum = z.enum([
  'TRAVEL',
  'MEALS',
  'LODGING',
  'OFFICE_SUPPLIES',
  'SOFTWARE',
  'EQUIPMENT',
  'CLIENT_ENTERTAINMENT',
  'TRAINING',
  'OTHER',
]);

export const expenseLineItemSchema = z.object({
  id: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Please select a valid date (YYYY-MM-DD)'),
  merchant: z.string().min(2, 'Merchant/Vendor name is required'),
  category: expenseCategoryEnum,
  description: z.string().min(3, 'Line item description is required'),
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  taxAmount: z.coerce.number().min(0, 'Tax cannot be negative').default(0),
  receiptUrl: z.string().optional(),
});

export const createExpenseClaimSchema = z.object({
  title: z.string().min(3, 'Claim title is required (min 3 characters)'),
  description: z.string().optional(),
  category: expenseCategoryEnum,
  currency: z.string().default('USD'),
  items: z.array(expenseLineItemSchema).min(1, 'At least one expense line item is required'),
  receiptUrls: z.array(z.string()).optional().default([]),
  notes: z.string().optional(),
});

export type CreateExpenseClaimFormData = z.infer<typeof createExpenseClaimSchema>;

export const updateExpenseStatusSchema = z.object({
  id: z.string().min(1, 'Claim ID is required'),
  status: z.enum(['APPROVED', 'PAID', 'REJECTED']),
  comments: z.string().max(500, 'Comments cannot exceed 500 characters').optional(),
});

export type UpdateExpenseStatusFormData = z.infer<typeof updateExpenseStatusSchema>;
