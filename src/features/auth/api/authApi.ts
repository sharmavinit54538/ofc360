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
  User,
} from '../types/auth.types';
import { setCredentials, setAccessToken, logout } from '../slices/authSlice';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'User'],
  endpoints: (builder) => ({
    /**
     * Authenticates corporate user with email/password or Google SSO payload.
     */
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth', 'User'],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setCredentials({
              user: data.user,
              tokens: data.tokens,
              rememberMe: args.rememberMe,
            })
          );
        } catch {
          // Handled at component UI boundary
        }
      },
    }),

    /**
     * Registers a new corporate tenant and initial administrator account.
     */
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (registrationData) => ({
        url: '/auth/register',
        method: 'POST',
        body: registrationData,
      }),
      invalidatesTags: ['Auth'],
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.tokens && data.user) {
            dispatch(
              setCredentials({
                user: data.user,
                tokens: data.tokens,
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
        body: body || {},
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAccessToken(data.tokens.accessToken));
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
      providesTags: ['Auth', 'User'],
    }),

    /**
     * Dispatches verification OTP or password recovery email.
     */
    forgotPassword: builder.mutation<ForgotPasswordResponse, ForgotPasswordRequest>({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),

    /**
     * Validates 6-digit one-time authorization passcode.
     */
    verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpRequest>({
      query: (body) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body,
      }),
    }),

    /**
     * Updates account credentials using validated verification token.
     */
    resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordRequest>({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body,
      }),
    }),

    /**
     * Validates token-based corporate email activation link.
     */
    verifyEmail: builder.mutation<VerifyEmailResponse, VerifyEmailRequest>({
      query: (body) => ({
        url: '/auth/verify-email',
        method: 'POST',
        body,
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
        body,
      }),
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
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useResendVerificationEmailMutation,
} = authApi;
