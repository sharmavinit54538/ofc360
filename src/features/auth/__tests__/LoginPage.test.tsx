/**
 * @file LoginPage.test.tsx
 * @description Unit tests for LoginPage verification and token-priority routing logic.
 * Requirements:
 * - token + verification_id => dashboard (TOKEN WINS)
 * - no token + verification_id => verify-email
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { LoginPage } from '../pages/LoginPage';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();
const mockToastInfo = vi.fn();
vi.mock('@/shared/ui/Toast', () => ({
  useToast: () => ({
    success: mockToastSuccess,
    error: mockToastError,
    info: mockToastInfo,
  }),
}));

const mockLogin = vi.fn();
vi.mock('@/features/auth/api/authApi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/features/auth/api/authApi')>();
  return {
    ...actual,
    useLoginMutation: () => [mockLogin, { isLoading: false }],
  };
});

vi.mock('@/features/auth/hooks/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    isInitialized: true,
    user: null,
  }),
}));

describe('LoginPage - Token Priority & Verification Routing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('token + verification_id => navigates to dashboard (TOKEN WINS, never sends to verify-email)', async () => {
    mockLogin.mockReturnValueOnce({
      unwrap: () =>
        Promise.resolve({
          access_token: 'fake_jwt_access_token',
          verification_id: 'vid_12345',
          requires_email_verification: true,
          data: {
            user: {
              id: 'usr_1',
              email: 'verified_user@ofc360.com',
              role: 'EMPLOYEE',
              is_email_verified: false, // Even if stale flag says false
              is_verified: true,
            },
          },
        }),
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/auth/login']}>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'verified_user@ofc360.com' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'Password@123' },
    });

    const submitBtn = screen.getByRole('button', { name: /Sign in/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      // Must navigate to dashboard
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard/employee', { replace: true });
      // Must NOT navigate to verify-email
      expect(mockNavigate).not.toHaveBeenCalledWith(
        expect.stringContaining('/auth/verify-email'),
        expect.anything()
      );
      expect(mockToastSuccess).toHaveBeenCalled();
      // Credentials must be stored in localStorage
      expect(localStorage.getItem('ofc360_access_token')).toBe('fake_jwt_access_token');
    });
  });

  it('no token + verification_id => redirects to /auth/verify-email', async () => {
    mockLogin.mockReturnValueOnce({
      unwrap: () =>
        Promise.resolve({
          verification_id: 'vid_67890',
          message: 'Email verification is required.',
          data: {
            email: 'unverified_user@ofc360.com',
          },
        }),
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/auth/login']}>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'unverified_user@ofc360.com' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'Password@123' },
    });

    const submitBtn = screen.getByRole('button', { name: /Sign in/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      // Must redirect to verify-email with email and vid params
      expect(mockNavigate).toHaveBeenCalledWith(
        '/auth/verify-email?email=unverified_user%40ofc360.com&vid=vid_67890'
      );
      expect(mockToastInfo).toHaveBeenCalled();
      // No token stored
      expect(localStorage.getItem('ofc360_access_token')).toBeNull();
    });
  });
});
