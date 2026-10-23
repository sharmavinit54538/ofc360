/**
 * @file authApi.ts
 * @description Enterprise RTK Query API service defining strongly-typed authentication endpoints,
 * tag invalidation matrices, and automated cache synchronization.
 */

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/shared/api/baseQuery';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  FaceLoginRequest,
  FaceLoginResponse,
  User,
  normalizeAuthResponse,
  normalizeUser,
} from '../types/auth.types';
import { setCredentials, setAccessToken, logout } from '../slices/authSlice';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'User', 'Passkey'],
  endpoints: (builder) => ({
    /**
     * Authenticates corporate user with email/password or Google SSO payload.
     * Maps both email and identifier for FastAPI Pydantic compatibility.
     */
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: {
          email: credentials.email,
          identifier: credentials.identifier || credentials.email,
          password: credentials.password,
        },
      }),
      invalidatesTags: ['Auth', 'User'],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const normalized = normalizeAuthResponse(data);
          if (normalized.tokens?.accessToken) {
            dispatch(
              setCredentials({
                user: normalized.user,
                tokens: normalized.tokens,
                rememberMe: args.rememberMe,
              })
            );
          }
        } catch {
          // Handled at component UI boundary
        }
      },
    }),

    /**
     * Registers a new corporate tenant and initial administrator account.
     * Formats keys for FastAPI RegisterRequest schema.
     */
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (registrationData) => ({
        url: '/auth/register',
        method: 'POST',
        body: {
          name: `${registrationData.firstName} ${registrationData.lastName}`.trim(),
          first_name: registrationData.firstName,
          last_name: registrationData.lastName,
          email: registrationData.workEmail,
          identifier: registrationData.workEmail,
          phone: registrationData.phone || '',
          password: registrationData.password,
          company_name: registrationData.organizationName,
          organization_name: registrationData.organizationName,
        },
      }),
      invalidatesTags: ['Auth'],
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const normalized = normalizeAuthResponse(data);
          if (normalized.tokens?.accessToken && normalized.user) {
            dispatch(
              setCredentials({
                user: normalized.user,
                tokens: normalized.tokens,
              })
            );
          }
        } catch {
          // Handled at component UI boundary
        }
      },
    }),

    /**
     * Terminates active corporate session and invalidates server tokens.
     */
    logout: builder.mutation<{ success: boolean; message?: string }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth', 'User'],
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(logout());
        }
      },
    }),

    /**
     * Performs silent access token renewal using refresh token or httpOnly cookie.
     */
    refreshToken: builder.mutation<RefreshTokenResponse, RefreshTokenRequest | void>({
      query: (body) => ({
        url: '/auth/refresh',
        method: 'POST',
        body: body
          ? {
              refresh_token: body.refresh_token || body.refreshToken,
              refreshToken: body.refreshToken || body.refresh_token,
            }
          : {},
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const normalized = normalizeAuthResponse(data);
          if (normalized.tokens?.accessToken) {
            dispatch(setAccessToken(normalized.tokens.accessToken));
          }
        } catch {
          dispatch(logout());
        }
      },
    }),

    /**
     * Fetches current authenticated user profile and permissions matrix.
     */
    getCurrentUser: builder.query<User, void>({
      query: () => '/auth/me',
      transformResponse: (response: any) => {
        const source = response?.data || response;
        return normalizeUser(source);
      },
      providesTags: ['Auth', 'User'],
    }),

    /**
     * Dispatches verification OTP or password recovery email.
     */
    forgotPassword: builder.mutation<ForgotPasswordResponse, ForgotPasswordRequest>({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: {
          email: body.email,
          identifier: body.email,
        },
      }),
    }),

    /**
     * Validates 6-digit one-time authorization passcode for password reset.
     * Aligns with FastAPI route /api/v1/auth/verify-reset-otp.
     */
    verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpRequest>({
      query: (body) => ({
        url: '/auth/verify-reset-otp',
        method: 'POST',
        body: {
          email: body.email,
          identifier: body.email,
          otp: body.otp,
        },
      }),
      transformResponse: (response: any) => {
        const dataObj = response?.data || response;
        return {
          success: Boolean(response?.success ?? true),
          valid: true,
          verificationToken: dataObj?.resetToken || dataObj?.verificationToken || '',
          resetToken: dataObj?.resetToken || '',
          message: response?.message || 'OTP verified successfully.',
          data: dataObj,
        };
      },
    }),

    /**
     * Validates email OTP during multi-step login.
     * Aligns with FastAPI route /api/v1/auth/verify-email-otp.
     */
    verifyEmailOtp: builder.mutation<LoginResponse, { verification_id: string; otp: string; email?: string }>({
      query: (body) => ({
        url: '/auth/verify-email-otp',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth', 'User'],
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const normalized = normalizeAuthResponse(data);
          if (normalized.user && normalized.tokens?.accessToken) {
            dispatch(
              setCredentials({
                user: normalized.user,
                tokens: normalized.tokens,
                rememberMe: true,
              })
            );
          }
        } catch {
          // Handled at component boundary
        }
      },
    }),

    /**
     * Updates account credentials using validated verification token.
     */
    resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordRequest>({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: {
          email: body.email,
          token: body.verificationToken,
          reset_token: body.verificationToken,
          new_password: body.newPassword,
          password: body.newPassword,
        },
      }),
    }),

    /**
     * Validates token-based corporate email activation link.
     */
    verifyEmail: builder.mutation<VerifyEmailResponse, VerifyEmailRequest>({
      query: (body) => ({
        url: '/auth/verify-email',
        method: 'POST',
        body: {
          token: body.token,
          email: body.email,
          otp: body.otp,
        },
      }),
      invalidatesTags: ['User'],
    }),

    /**
     * Re-dispatches corporate email verification token.
     */
    resendVerificationEmail: builder.mutation<{ message: string }, { email: string }>({
      query: (body) => ({
        url: '/auth/resend-verification',
        method: 'POST',
        body: {
          email: body.email,
          identifier: body.email,
        },
      }),
    }),

    /**
     * Authenticates user via face recognition using captured image.
     * Expects base64-encoded JPEG image and email for user lookup.
     */
    faceLogin: builder.mutation<FaceLoginResponse, FaceLoginRequest>({
      query: (body) => ({
        url: '/auth/face-login',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth', 'User'],
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const normalized = normalizeAuthResponse(data);
          if (normalized.user && normalized.tokens?.accessToken) {
            dispatch(
              setCredentials({
                user: normalized.user,
                tokens: normalized.tokens,
                rememberMe: true,
              })
            );
          }
        } catch {
          // Handled at component UI boundary
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useVerifyEmailOtpMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useResendVerificationEmailMutation,
  useFaceLoginMutation,
} = authApi;
