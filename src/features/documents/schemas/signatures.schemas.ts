/**
 * @file signatures.schemas.ts
 * @description Zod validation schemas for Digital Signatures & E-Signs module.
 */

import { z } from 'zod';

export const documentTypeSchema = z.enum([
  'OFFER_LETTER',
  'APPOINTMENT_LETTER',
  'INCREMENT_LETTER',
  'RELIEVING_LETTER',
  'NDA',
  'POLICY_ACK',
  'CONTRACT',
  'OTHER',
]);

export const signerRoleSchema = z.enum(['SIGNER', 'APPROVER', 'CC']);
export const signerKindSchema = z.enum(['EMPLOYEE', 'EXTERNAL']);
export const signingOrderSchema = z.enum(['SEQUENTIAL', 'PARALLEL']);
export const signatureMethodSchema = z.enum(['DRAW', 'TYPE', 'UPLOAD']);

export const signerInputSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  employeeId: z.string().optional(),
  kind: signerKindSchema,
  role: signerRoleSchema,
  order: z.number().int().min(1),
});

export const newSignatureRequestSchema = z
  .object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(150, 'Title cannot exceed 150 characters'),
    documentType: documentTypeSchema,
    source: z.enum(['GENERATED', 'UPLOADED']),
    sourceDocumentId: z.string().optional(),
    fileName: z.string().min(1, 'File name is required'),
    fileSize: z.number().max(10 * 1024 * 1024, 'File size cannot exceed 10 MB').optional(),
    signingOrder: signingOrderSchema,
    message: z.string().max(1000, 'Message cannot exceed 1000 characters').optional(),
    expiryDays: z.number().int().min(1, 'Expiry must be at least 1 day').max(365, 'Expiry cannot exceed 365 days'),
    reminderDays: z.array(z.number().int().min(1).max(30)).default([3, 7]),
    signers: z.array(signerInputSchema).min(1, 'At least one signer is required'),
  })
  .refine(
    (data) => {
      // Must contain at least one signer with role 'SIGNER'
      return data.signers.some((s) => s.role === 'SIGNER');
    },
    {
      message: 'At least one signer must have the role "SIGNER"',
      path: ['signers'],
    }
  )
  .refine(
    (data) => {
      // No duplicate emails
      const emails = data.signers.map((s) => s.email.toLowerCase().trim());
      return new Set(emails).size === emails.length;
    },
    {
      message: 'Signer emails must be unique. No duplicate signers allowed.',
      path: ['signers'],
    }
  );

export type NewSignatureRequestFormData = z.infer<typeof newSignatureRequestSchema>;

export const signDocumentSchema = z.object({
  signerId: z.string().min(1, 'Signer ID is required'),
  method: signatureMethodSchema,
  signatureImage: z.string().min(20, 'Signature image is required'),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to electronically sign this document' }),
  }),
  otp: z.string().optional(),
});

export type SignDocumentFormData = z.infer<typeof signDocumentSchema>;

export const declineSignatureSchema = z.object({
  signerId: z.string().min(1, 'Signer ID is required'),
  reason: z
    .string()
    .min(10, 'Decline reason must be at least 10 characters long')
    .max(500, 'Decline reason cannot exceed 500 characters'),
});

export type DeclineSignatureFormData = z.infer<typeof declineSignatureSchema>;

export const cancelRequestSchema = z.object({
  reason: z
    .string()
    .min(5, 'Cancellation reason must be at least 5 characters')
    .max(500, 'Cancellation reason cannot exceed 500 characters'),
});

export type CancelRequestFormData = z.infer<typeof cancelRequestSchema>;

export const resendRequestSchema = z.object({
  extendDays: z.number().int().min(1).max(365).optional(),
});

export type ResendRequestFormData = z.infer<typeof resendRequestSchema>;

