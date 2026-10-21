/**
 * @file passkey.schemas.ts
 * @description Enterprise Zod validation schemas for WebAuthn/Passkey operations.
 * Validates responses from backend before consumption to guarantee type safety without `any`.
 */

import { z } from 'zod';

export const passkeyItemSchema = z.object({
  id: z.string(),
  credentialId: z.string(),
  deviceName: z.string().min(1, 'Device name is required'),
  transports: z.array(z.string()).optional(),
  createdAt: z.string(),
  lastUsedAt: z.string().nullable().optional(),
  signCount: z.number().nonnegative(),
});

export const passkeyLoginOptionsResponseSchema = z.object({
  options: z.object({
    challenge: z.string(),
    rpId: z.string().optional(),
    timeout: z.number().optional(),
    userVerification: z.enum(['required', 'preferred', 'discouraged']).optional(),
    allowCredentials: z
      .array(
        z.object({
          id: z.string(),
          type: z.literal('public-key'),
          transports: z.array(z.string()).optional(),
        })
      )
      .optional(),
  }),
});

export const passkeyLoginVerifyResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    fullName: z.string(),
    avatarUrl: z.string().optional(),
    phone: z.string().optional(),
    jobTitle: z.string().optional(),
    department: z.string().optional(),
    organizationId: z.string(),
    roles: z.array(z.string()),
    activeRole: z.enum(['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'IT_ADMIN']),
    permissions: z.array(z.string()),
    isEmailVerified: z.boolean(),
    isTwoFactorEnabled: z.boolean(),
    lastLoginAt: z.string().optional(),
    createdAt: z.string(),
  }),
  tokens: z.object({
    accessToken: z.string().min(1),
    refreshToken: z.string().optional(),
    expiresIn: z.number(),
    tokenType: z.string().optional(),
  }),
  message: z.string().optional(),
});

export const passkeyRegisterOptionsResponseSchema = z.object({
  options: z.object({
    challenge: z.string(),
    rp: z.object({
      name: z.string(),
      id: z.string().optional(),
    }),
    user: z.object({
      id: z.string(),
      name: z.string(),
      displayName: z.string(),
    }),
    pubKeyCredParams: z.array(
      z.object({
        type: z.literal('public-key'),
        alg: z.number(),
      })
    ),
    timeout: z.number().optional(),
    attestation: z.string().optional(),
    authenticatorSelection: z
      .object({
        authenticatorAttachment: z.enum(['platform', 'cross-platform']).optional(),
        residentKey: z.enum(['required', 'preferred', 'discouraged']).optional(),
        requireResidentKey: z.boolean().optional(),
        userVerification: z.enum(['required', 'preferred', 'discouraged']).optional(),
      })
      .optional(),
    excludeCredentials: z
      .array(
        z.object({
          id: z.string(),
          type: z.literal('public-key'),
          transports: z.array(z.string()).optional(),
        })
      )
      .optional(),
  }),
});

export const passkeyRegisterVerifyResponseSchema = z.object({
  success: z.boolean(),
  passkey: passkeyItemSchema,
  message: z.string(),
});

export const passkeyListResponseSchema = z.object({
  passkeys: z.array(passkeyItemSchema),
  canDeletePasskey: z.boolean(),
  hasPasswordSet: z.boolean(),
});

export const passkeyRenameSchema = z.object({
  deviceName: z.string().trim().min(1, 'Device name cannot be blank').max(50, 'Device name is too long'),
});

export const passkeyReauthSchema = z.object({
  password: z.string().min(1, 'Password is required to confirm identity'),
});

export const passkeyReauthResponseSchema = z.object({
  verified: z.boolean(),
  reauthToken: z.string(),
  expiresInSeconds: z.number(),
});
