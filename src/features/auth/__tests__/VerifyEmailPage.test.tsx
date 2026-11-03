/**
 * @file VerifyEmailPage.test.tsx
 * @description Unit tests for VerifyEmailPage handling of missing vid/token and "already verified" resend errors.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { VerifyEmailPage } from '../pages/VerifyEmailPage';

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
const mockToastWarning = vi.fn();
vi.mock('@/shared/ui/Toast', () => ({
  useToast: () => ({
    success: mockToastSuccess,
    error: mockToastError,
    info: mockToastInfo,
    warning: mockToastWarning,
  }),
}));

const mockVerifyEmail = vi.fn();
const mockVerifyEmailOtp = vi.fn();
const mockResendVerification = vi.fn();

vi.mock('@/features/auth/api/authApi', () => ({
  useVerifyEmailMutation: () => [mockVerifyEmail, { isLoading: false, isSuccess: false, isError: false }],
  useVerifyEmailOtpMutation: () => [mockVerifyEmailOtp, { isLoading: false }],
  useResendVerificationEmailMutation: () => [mockResendVerification, { isLoading: false }],
}));

vi.mock('@/features/auth/hooks/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    isInitialized: true,
    user: null,
  }),
}));

describe('VerifyEmailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('navigates to /auth/login when neither token nor vid is present', () => {
    render(
      <MemoryRouter initialEntries={['/auth/verify-email']}>
        <VerifyEmailPage />
      </MemoryRouter>
    );
    expect(mockNavigate).toHaveBeenCalledWith('/auth/login', { replace: true });
  });

  it('navigates to /auth/login with info toast when resend returns 400 "already verified"', async () => {
    mockResendVerification.mockReturnValueOnce({
      unwrap: () =>
        Promise.reject({
          status: 400,
          data: { message: 'Email already verified' },
        }),
    });

    render(
      <MemoryRouter initialEntries={['/auth/verify-email?vid=vid_123&email=user@ofc360.com']}>
        <VerifyEmailPage />
      </MemoryRouter>
    );

    const resendBtn = screen.getByRole('button', { name: /Resend code/i });
    fireEvent.click(resendBtn);

    await waitFor(() => {
      expect(mockToastInfo).toHaveBeenCalledWith(
        'Email already verified, please sign in',
        'Already Verified'
      );
      expect(mockNavigate).toHaveBeenCalledWith('/auth/login', { replace: true });
    });
  });
});
