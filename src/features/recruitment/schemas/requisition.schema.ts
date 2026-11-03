/**
 * @file requisition.schema.ts
 * @description Zod validation schema for creating and validating Job Requisitions.
 */

import { z } from 'zod';

export const jobRequisitionCreateSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, 'Job title is required')
      .max(150, 'Job title must not exceed 150 characters'),
    department: z
      .string()
      .trim()
      .min(1, 'Department is required')
      .max(100, 'Department must not exceed 100 characters'),
    vacancies: z.coerce
      .number({ invalid_type_error: 'Vacancies must be a valid number' })
      .int('Vacancies must be an integer')
      .min(1, 'At least 1 vacancy is required')
      .default(1),
    min_experience: z.coerce
      .number({ invalid_type_error: 'Minimum experience must be a valid number' })
      .int('Minimum experience must be an integer')
      .min(0, 'Minimum experience cannot be negative')
      .default(0),
    max_experience: z
      .union([
        z.coerce
          .number({ invalid_type_error: 'Maximum experience must be a number' })
          .int('Maximum experience must be an integer')
          .min(0, 'Maximum experience cannot be negative'),
        z.literal(''),
        z.null(),
        z.undefined(),
      ])
      .transform((val) => (val === '' || val === null || val === undefined ? null : Number(val))),
    min_salary: z
      .union([
        z.string().trim(),
        z.number(),
        z.literal(''),
        z.null(),
        z.undefined(),
      ])
      .transform((val) => {
        if (val === '' || val === null || val === undefined) return null;
        return String(val);
      }),
    max_salary: z
      .union([
        z.string().trim(),
        z.number(),
        z.literal(''),
        z.null(),
        z.undefined(),
      ])
      .transform((val) => {
        if (val === '' || val === null || val === undefined) return null;
        return String(val);
      }),
    description: z
      .string()
      .trim()
      .min(1, 'Job description / justification is required'),
  })
  .refine(
    (data) => {
      if (data.max_experience !== null && data.max_experience !== undefined) {
        return data.max_experience >= data.min_experience;
      }
      return true;
    },
    {
      message: 'Maximum experience must be greater than or equal to minimum experience',
      path: ['max_experience'],
    }
  )
  .refine(
    (data) => {
      if (data.min_salary && data.max_salary) {
        const minVal = parseFloat(data.min_salary);
        const maxVal = parseFloat(data.max_salary);
        if (!isNaN(minVal) && !isNaN(maxVal)) {
          return maxVal >= minVal;
        }
      }
      return true;
    },
    {
      message: 'Maximum salary must be greater than or equal to minimum salary',
      path: ['max_salary'],
    }
  );

export type JobRequisitionFormValues = z.infer<typeof jobRequisitionCreateSchema>;

