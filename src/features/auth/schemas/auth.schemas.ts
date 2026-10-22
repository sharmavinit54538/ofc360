import { z } from 'zod';

// Strong password regex requirement: 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_+=\-[\]{}|;:,.<>])[A-Za-z\d@$!%*?&^#()_+=\-[\]{}|;:,.<>]{8,}$/;

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Corporate email or identifier is required')
    .refine((val) => {
      const trimmed = val.trim();
      // Allow valid email format or corporate identifier / username
      if (trimmed.includes('@')) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
      }
      return trimmed.length >= 3;
    }, 'Please enter a valid work email or corporate identifier')
    .transform((val) => val.trim().toLowerCase()),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password is too long'),
  rememberMe: z.boolean().default(false),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    organizationName: z
      .string()
      .min(2, 'Company name must be at least 2 characters')
      .max(100, 'Company name is too long')
      .trim(),
    organizationSize: z.enum(['1-10', '11-50', '51-200', '201-1000', '1000+']).optional().default('11-50'),
    industry: z.string().optional().default('Technology & SaaS'),
    firstName: z
      .string()
      .min(2, 'First name must be at least 2 characters')
      .trim(),
    lastName: z
      .string()
      .min(1, 'Last name is required')
      .trim(),
    workEmail: z
      .string()
      .min(1, 'Work email is required')
      .email('Please enter a valid work email address')
      .toLowerCase()
      .trim(),
    phone: z
      .string()
      .min(10, 'Mobile number must be at least 10 digits')
      .max(15, 'Mobile number is too long')
      .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/, 'Invalid mobile number format'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        passwordRegex,
        'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: 'You must agree to the Terms of Service and Privacy Policy',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Please enter a valid corporate email')
    .toLowerCase()
    .trim(),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const verifyOtpSchema = z.object({
  otp: z
    .string()
    .length(6, 'Verification code must be exactly 6 digits')
    .regex(/^\d{6}$/, 'Code must contain only numeric digits'),
});

export type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        passwordRegex,
        'Must contain 1 uppercase, 1 lowercase, 1 number, and 1 special symbol'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
