import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { RefreshCw, Loader2 } from 'lucide-react';
import { AuthShell } from '@/shared/layout/AuthShell';
import { OtpInput } from '@/features/auth/components/OtpInput';
import { useVerifyOtpMutation, useForgotPasswordMutation } from '@/features/auth/api/authApi';
import { useToast } from '@/shared/ui/Toast';

export const VerifyResetOtpPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();

  const email = searchParams.get('email') || '';

  const [otp, setOtp] = useState('');
  const [hasError, setHasError] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(60);

  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resendCode, { isLoading: isResending }] = useForgotPasswordMutation();

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setInterval(() => {
      setResendCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCountdown]);

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (otp.length !== 6) {
      setHasError(true);
      toast.warning('Please enter all 6 numeric digits of your code', 'Incomplete Code');
      return;
    }

    try {
      setHasError(false);
      const res = await verifyOtp({
        email,
        otp,
        purpose: 'password_reset',
      }).unwrap();

      toast.success('Authorization code verified!', 'Identity Confirmed');
      const tokenVal = res.verificationToken || res.resetToken || (res.data as any)?.resetToken || '';
      navigate(
        `/auth/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(tokenVal)}`
      );
    } catch (err: any) {
      setHasError(true);
      toast.error(
        err?.data?.message || 'Invalid or expired authorization code. Try again.',
        'Verification Failed'
      );
    }
  };

  const handleResend = async () => {
    if (resendCountdown > 0 || !email) return;
    try {
      await resendCode({ email }).unwrap();
      toast.info('A new 6-digit code has been dispatched to your email.', 'Code Resent');
      setResendCountdown(60);
      setOtp('');
      setHasError(false);
    } catch (err: any) {
      toast.error('Could not resend verification code. Please try again.', 'Resend Failed');
    }
  };

  return (
    <AuthShell
      title="Enter verification code"
      subtitle={`We sent a 6-digit code to ${email || 'your email'}`}
      footerText="Entered the wrong email?"
      footerLinkText="Change email"
      footerLinkTo="/auth/forgot-password"
    >
      <form onSubmit={handleVerify} className="space-y-6">
        <div className="flex flex-col items-center justify-center space-y-2">
          <OtpInput
            value={otp}
            onChange={(val) => {
              setOtp(val);
              setHasError(false);
            }}
            hasError={hasError}
            disabled={isVerifying}
          />
          <p className="text-xs text-gray-600 dark:text-zinc-400 pt-1">
            Enter the 6 digits or paste the code directly
          </p>
        </div>

        <button
          type="submit"
          disabled={otp.length !== 6 || isVerifying}
          className="w-full py-3.5 px-4 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 font-semibold text-sm rounded-xl transition-all duration-200 shadow-sm active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isVerifying ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white dark:text-gray-900" />
              <span>Verifying code...</span>
            </>
          ) : (
            <span>Continue</span>
          )}
        </button>

        <div className="text-center text-xs text-gray-600 dark:text-zinc-400">
          Didn&apos;t receive the code?{' '}
          {resendCountdown > 0 ? (
            <span className="font-medium text-gray-900 dark:text-[#ececec]">Resend in {resendCountdown}s</span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="text-indigo-600 hover:underline font-semibold inline-flex items-center gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${isResending ? 'animate-spin' : ''}`} />
              <span>Resend code</span>
            </button>
          )}
        </div>
      </form>
    </AuthShell>
  );
};
