import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { AuthShell } from '@/shared/layout/AuthShell';
import { OtpInput } from '@/features/auth/components/OtpInput';
import {
  useVerifyEmailMutation,
  useVerifyEmailOtpMutation,
  useResendVerificationEmailMutation,
} from '@/features/auth/api/authApi';
import { useToast } from '@/shared/ui/Toast';
import { ROLE_DASHBOARD_ROUTES, normalizeRole, normalizeAuthResponse } from '@/features/auth/types/auth.types';

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();

  const token = searchParams.get('token');
  const vid = searchParams.get('vid') || searchParams.get('verification_id');
  const email = searchParams.get('email') || 'your work email';

  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState(false);

  const [verifyEmail, { isLoading: isVerifying, isSuccess, isError, error }] = useVerifyEmailMutation();
  const [verifyEmailOtp, { isLoading: isVerifyingOtp }] = useVerifyEmailOtpMutation();
  const [resendVerification, { isLoading: isResending }] = useResendVerificationEmailMutation();

  const [countdown, setCountdown] = useState(0);

  // If token is in query params, verify automatically on mount
  useEffect(() => {
    if (token) {
      verifyEmail({ token });
    }
  }, [token, verifyEmail]);

  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  const handleResend = async () => {
    if (countdown > 0) return;
    try {
      await resendVerification({ email }).unwrap();
      toast.success('Verification code sent to your email.', 'Email Sent');
      setCountdown(60);
    } catch {
      toast.error('Unable to send verification email. Please try again.', 'Error');
    }
  };

  const handleOtpSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (otp.length !== 6) {
      setOtpError(true);
      toast.warning('Please enter the full 6-digit code.', 'Incomplete Code');
      return;
    }

    try {
      setOtpError(false);
      const res = await verifyEmailOtp({
        verification_id: vid || '',
        otp,
        email,
      }).unwrap();

      const normalized = normalizeAuthResponse(res);
      toast.success(
        `Email verified! Welcome back, ${normalized.user.fullName}.`,
        'Identity Confirmed'
      );
      const dest = ROLE_DASHBOARD_ROUTES[normalizeRole(normalized.user.activeRole)] || '/dashboard/employee';
      navigate(dest);
    } catch (err: any) {
      setOtpError(true);
      const msg = err?.data?.message || err?.data?.detail || 'Invalid or expired code. Please try again.';
      toast.error(msg, 'Verification Failed');
    }
  };

  // State 1: Verification in progress via Token
  if (token && isVerifying) {
    return (
      <AuthShell title="Validating email" subtitle="Verifying your workspace activation token...">
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-sm text-slate-500">Please hold while we verify your domain.</p>
        </div>
      </AuthShell>
    );
  }

  // State 2: Verification Successful
  if (isSuccess || (token && !isError)) {
    return (
      <AuthShell
        title="Email verified!"
        subtitle="Your corporate identity is confirmed."
        footerText="Ready to log in?"
        footerLinkText="Sign in to workspace"
        footerLinkTo="/auth/login"
      >
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center space-y-5">
          <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">Workspace Activated</h3>
            <p className="text-xs text-slate-500 max-w-sm">
              Your account <span className="font-semibold text-slate-800">{email}</span> is now fully verified.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/auth/login')}
            className="w-full max-w-sm py-3.5 px-4 bg-[#0d1527] hover:bg-[#1e293b] text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-sm active:scale-[0.99]"
          >
            Continue to Sign in
          </button>
        </div>
      </AuthShell>
    );
  }

  // State 3: Token Invalid or Expired
  if (token && isError) {
    return (
      <AuthShell
        title="Verification failed"
        subtitle="The link may have expired or already been used"
        footerText="Back to"
        footerLinkText="Sign in"
        footerLinkTo="/auth/login"
      >
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center space-y-5">
          <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <p className="text-xs text-slate-500">
              {(error as any)?.data?.message || 'Please request a fresh verification link.'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleResend}
            disabled={countdown > 0}
            className="w-full max-w-sm py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm rounded-xl transition-colors"
          >
            {countdown > 0 ? `Resend in ${countdown}s` : 'Resend verification link'}
          </button>
        </div>
      </AuthShell>
    );
  }

  // State 4: Default - Enter OTP (Minimalist ChatGPT-style)
  return (
    <AuthShell
      title=""
      subtitle=""
      cardMaxWidth="max-w-sm"
    >
      <div className="flex flex-col items-center justify-center py-8 px-4 min-h-[400px]">
        <div className="w-full max-w-sm">
          {/* Header - centered */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Enter code</h1>
            <p className="mt-2 text-sm text-slate-500">
              Please enter the code sent to <span className="font-semibold text-slate-900">{email}</span>
            </p>
          </div>

          {/* OTP Form */}
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div className="flex flex-col items-center space-y-1.5">
              <OtpInput
                value={otp}
                onChange={(val) => {
                  setOtp(val);
                  setOtpError(false);
                }}
                hasError={otpError}
                disabled={isVerifyingOtp}
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={otp.length !== 6 || isVerifyingOtp}
              className="w-full h-12 bg-[#0d0d0d] hover:bg-[#202020] text-white font-medium text-sm rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifyingOtp ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Continue</span>
              )}
            </button>
          </form>

          {/* Footer: Resend */}
          <div className="text-center text-sm text-slate-500 mt-6">
            Didn't receive the email?{' '}
            {countdown > 0 ? (
              <span className="font-medium text-slate-700">Wait {countdown}s to resend</span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-slate-600 hover:text-slate-900 font-semibold underline underline-offset-2 inline-flex items-center gap-1.5 transition-colors"
              >
                {isResending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <span>Resend code</span>
                )}
              </button>
            )}
          </div>

          {/* Back to login link */}
          <div className="text-center text-sm text-slate-500 mt-4">
            <span>Already verified? </span>
            <a
              href="/auth/login"
              className="text-slate-600 hover:text-slate-900 font-semibold underline underline-offset-2 transition-colors"
            >
              Sign in
            </a>
          </div>
        </div>
      </div>
    </AuthShell>
  );
};