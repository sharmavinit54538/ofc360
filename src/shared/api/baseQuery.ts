/**
 * @file apiInstance.ts
 * @description Enterprise custom baseQuery wrapper featuring serialized Mutex locking,
 * silent JWT token refresh, HTTP header injection, and resilient fallback handling.
 */

import { fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { Mutex } from 'async-mutex';
import { RootState } from '@/app/store';
import { setAccessToken, logout } from '@/features/auth/slices/authSlice';
import { RefreshTokenResponse } from '@/features/auth/types/auth.types';

/**
 * Global mutex instance to synchronize concurrent 401 token refresh requests.
 * Prevents multiple parallel API failures from triggering redundant refresh cycles.
 */
const mutex = new Mutex();

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.ofc360.com';

/**
 * Raw fetchBaseQuery with Authorization header injection and credentials handling.
 */
export const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include', // Ensures httpOnly session cookies are transmitted
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.accessToken;

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    headers.set('X-Client-Platform', 'OFC360-Enterprise-Web');
    headers.set('Accept', 'application/json');
    return headers;
  },
});

/**
 * Enterprise BaseQuery with Mutex-guarded automated token re-authentication.
 * 
 * Flow:
 * 1. Execute incoming query.
 * 2. If result returns 401 Unauthorized:
 *    a. If Mutex is already locked, wait for the ongoing refresh to finish, then retry.
 *    b. If Mutex is unlocked, acquire lock and perform silent refresh to `/auth/refresh`.
 *    c. If refresh succeeds: update Redux state with new accessToken, release lock, retry original request.
 *    d. If refresh fails: dispatch logout, clear state/storage, release lock.
 */
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Wait if another request is currently refreshing the token
  await mutex.waitForUnlock();

  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const state = api.getState() as RootState;
        const currentRefreshToken = state.auth.refreshToken;

        // Perform token refresh request
        const refreshResult = await rawBaseQuery(
          {
            url: '/auth/refresh',
            method: 'POST',
            body: currentRefreshToken ? { refreshToken: currentRefreshToken } : undefined,
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          const payload = refreshResult.data as RefreshTokenResponse;
          // Store updated access token into Redux state
          api.dispatch(setAccessToken(payload.tokens.accessToken));

          // Retry the original query with the new access token
          result = await rawBaseQuery(args, api, extraOptions);
        } else {
          // Token refresh failed or session revoked by server
          api.dispatch(logout());
        }
      } finally {
        release();
      }
    } else {
      // Another thread was executing the refresh; wait for it to release then retry
      await mutex.waitForUnlock();
      result = await rawBaseQuery(args, api, extraOptions);
    }
  }

  // Optional Developer Experience Fallback (only active when VITE_ENABLE_MOCK_FALLBACK="true")
  const enableMock = import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true';

  if (enableMock && result.error && (result.error.status === 'FETCH_ERROR' || result.error.status === 404)) {
    const url = typeof args === 'string' ? args : args.url;
    const body = typeof args === 'object' && 'body' in args ? (args.body as any) : {};

    // Simulated network latency
    await new Promise((res) => setTimeout(res, 350));

    if (url === '/auth/login') {
      const email = (body.email || '').toLowerCase();
      const mockRole = email.includes('admin')
        ? 'SUPER_ADMIN'
        : email.includes('hr')
        ? 'HR_ADMIN'
        : email.includes('manager')
        ? 'MANAGER'
        : email.includes('it')
        ? 'IT_ADMIN'
        : 'EMPLOYEE';

      const mockResponse = {
        user: {
          id: `usr_${Date.now()}`,
          email,
          firstName: email.split('@')[0] || 'Enterprise',
          lastName: 'User',
          fullName: `${email.split('@')[0]} User`,
          roles: [mockRole],
          activeRole: mockRole,
          permissions: ['users:read', 'hrms:attendance', 'hrms:leaves'],
          organizationId: 'org_ofc360_demo',
          isEmailVerified: true,
          isTwoFactorEnabled: false,
          createdAt: new Date().toISOString(),
        },
        tokens: {
          accessToken: `mock_jwt_access_${Date.now()}`,
          refreshToken: `mock_jwt_refresh_${Date.now()}`,
          expiresIn: 3600,
        },
        message: 'Authentication successful',
      };
      return { data: mockResponse };
    }

    if (url === '/auth/register') {
      return {
        data: {
          user: {
            id: `usr_reg_${Date.now()}`,
            email: body.workEmail,
            firstName: body.firstName,
            lastName: body.lastName,
            fullName: `${body.firstName} ${body.lastName}`,
            roles: ['SUPER_ADMIN'],
            activeRole: 'SUPER_ADMIN',
            permissions: ['users:read', 'org:manage'],
            organizationId: 'org_new_reg',
            isEmailVerified: false,
            isTwoFactorEnabled: false,
            createdAt: new Date().toISOString(),
          },
          requiresEmailVerification: true,
          message: 'Workspace registered. Please verify your email.',
        },
      };
    }

    if (url === '/auth/forgot-password') {
      return {
        data: {
          message: 'Verification code sent to corporate email.',
          resetToken: `tok_reset_${Date.now()}`,
          expiresInMinutes: 10,
        },
      };
    }

    if (url === '/auth/verify-otp') {
      return {
        data: {
          valid: true,
          verificationToken: `vtoken_${Date.now()}`,
          message: 'One-time passcode validated.',
        },
      };
    }

    if (url === '/auth/reset-password') {
      return {
        data: {
          success: true,
          message: 'Credentials updated successfully.',
        },
      };
    }

    if (url === '/auth/verify-email') {
      return {
        data: {
          success: true,
          message: 'Email verified successfully.',
        },
      };
    }

    if (url === '/auth/me') {
      const state = api.getState() as RootState;
      if (state.auth.user) {
        return { data: state.auth.user };
      }
    }
  }

  return result;
};
