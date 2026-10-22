/**
 * @file assetForm.schema.ts
 * @description Zod validation schemas for adding/editing equipment, hardware specifications,
 * and allocating assets to employees.
 */

import { z } from 'zod';

export const assetCategoryEnum = z.enum([
  'LAPTOP',
  'DESKTOP',
  'MOBILE',
  'MONITOR',
  'PERIPHERAL',
  'SERVER',
  'NETWORKING',
  'FURNITURE',
  'OTHER',
]);

export const assetFormSchema = z.object({
  assetName: z
    .string()
    .trim()
    .min(2, 'Asset name is required (min 2 characters)')
    .max(100, 'Asset name cannot exceed 100 characters'),
  assetTag: z
    .string()
    .trim()
    .min(2, 'Asset Tag / Barcode ID is required (min 2 characters)')
    .max(50, 'Asset tag cannot exceed 50 characters'),
  serialNumber: z
    .string()
    .trim()
    .min(2, 'Serial number is required')
    .max(80, 'Serial number cannot exceed 80 characters'),
  category: assetCategoryEnum,
  purchaseDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Please select a valid purchase date (YYYY-MM-DD)'),
  cost: z.coerce
    .number()
    .min(0, 'Purchase cost cannot be negative'),
  currency: z.string().default('USD'),
  warrantyExpiry: z
    .string()
    .optional()
    .or(z.literal('')),
  vendor: z
    .string()
    .trim()
    .max(100, 'Vendor name is too long')
    .optional()
    .or(z.literal('')),
  location: z
    .string()
    .trim()
    .max(100, 'Location is too long')
    .optional()
    .or(z.literal('')),
  notes: z
    .string()
    .max(500, 'Notes cannot exceed 500 characters')
    .optional()
    .or(z.literal('')),
});

export type AssetFormData = z.infer<typeof assetFormSchema>;

export const assignAssetSchema = z.object({
  employeeId: z.string().trim().min(1, 'Employee ID is required'),
  employeeName: z.string().trim().min(2, 'Employee full name is required'),
  employeeEmail: z.string().trim().email('Valid email address is required').optional().or(z.literal('')),
  department: z.string().trim().optional().or(z.literal('')),
  assignedDate: z.string().default(() => new Date().toISOString().split('T')[0]),
  condition: z.string().default('Good - Working Order'),
  notes: z.string().max(300, 'Notes cannot exceed 300 characters').optional().or(z.literal('')),
});

export type AssignAssetFormData = z.infer<typeof assignAssetSchema>;
