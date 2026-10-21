import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, RefreshCw, Mail, Sparkles, Loader2 } from 'lucide-react';
import { AuthShell } from '@/shared/layout/AuthShell';
import {
  useVerifyEmailMutation,
  useResendVerificationEmailMutation,
} from '@/features/auth/api/authApi';
import { useToast } from '@/shared/ui/Toast';

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();

  const token = searchParams.get('token');
  const email = searchParams.get('email') || 'your work email';

  const [verifyEmail, { isLoading: isVerifying, isSuccess, isError, error }] = useVerifyEmailMutation();
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
      toast.success('Verification link has been re-dispatched to your email.', 'Email Sent');
      setCountdown(60);
    } catch {
      toast.error('Unable to send verification email. Please try again.', 'Error');
    }
  };

  const handleSimulateTokenClick = () => {
    navigate(`/auth/verify-email?token=tk_demo_verified_${Date.now()}&email=${encodeURIComponent(email)}`);
  };

  // State 1: Verification in progress via Token
  if (token && isVerifying) {
    return (
      <AuthShell
        title="Validating email"
        subtitle="Verifying your workspace activation token..."
      >
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
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
        <div className="py-6 flex flex-col items-center justify-center text-center space-y-5">
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
            className="w-full py-3.5 px-4 bg-[#0d1527] hover:bg-[#1e293b] text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-sm active:scale-[0.99]"
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
        <div className="py-6 flex flex-col items-center justify-center text-center space-y-5">
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
            className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm rounded-xl transition-colors"
          >
            {countdown > 0 ? `Resend in ${countdown}s` : 'Resend verification link'}
          </button>
        </div>
      </AuthShell>
    );
  }

  // State 4: Default Waiting for Email Click (Prompt Screen)
  return (
    <AuthShell
      title="Verify your email"
      subtitle={`We sent a confirmation link to ${email}`}
      footerText="Wrong email address?"
      footerLinkText="Create new workspace"
      footerLinkTo="/auth/register"
    >
      <div className="space-y-5 py-2">
        <div className="flex flex-col items-center justify-center text-center p-5 rounded-2xl bg-[#eef4ff] space-y-2">
          <Mail className="w-8 h-8 text-indigo-600" />
          <p className="text-xs text-slate-600 leading-relaxed">
            Please click the link inside your email to activate your account and access your dashboard.
          </p>
        </div>

        {/* Demo Fast-Track Button */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Demo Simulation</span>
          </div>
          <button
            type="button"
            onClick={handleSimulateTokenClick}
            className="w-full text-xs font-semibold py-2 px-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 transition-colors flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Simulate Receiving & Clicking Email Token</span>
          </button>
        </div>

        {/* Resend Action */}
        <div className="text-center text-xs text-slate-500 pt-1">
          Didn&apos;t get the email?{' '}
          {countdown > 0 ? (
            <span className="font-medium text-slate-700">Wait {countdown}s to resend</span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="text-indigo-600 hover:underline font-semibold inline-flex items-center gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${isResending ? 'animate-spin' : ''}`} />
              <span>Resend email</span>
            </button>
          )}
        </div>
      </div>
    </AuthShell>
  );
};
