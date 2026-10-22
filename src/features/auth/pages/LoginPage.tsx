import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthShell } from '@/shared/layout/AuthShell';
import { Input } from '@/shared/ui/Input';
import { useLoginMutation } from '@/features/auth/api/authApi';
import { loginSchema, LoginFormData } from '@/features/auth/schemas/auth.schemas';
import { useToast } from '@/shared/ui/Toast';
import { ROLE_DASHBOARD_ROUTES, normalizeRole, normalizeAuthResponse } from '@/features/auth/types/auth.types';
import { FaceLoginModal } from '@/features/auth/components/FaceLoginModal';
import { Loader2, ScanFace } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';

export const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [login, { isLoading }] = useLoginMutation();
  const { isAuthenticated, isInitialized, user } = useAuth();

  const [isFaceModalOpen, setIsFaceModalOpen] = useState(false);
  const [pendingRedirect, setPendingRedirect] = useState<string | null>(null);

  const redirectUrl = searchParams.get('redirect');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'superadmin@ofc360.com',
      password: 'Enterprise@Pass123',
      rememberMe: false,
    },
  });

  const rememberMe = watch('rememberMe');

  // Navigate when Redux auth state is fully initialized after successful login
  useEffect(() => {
    if (pendingRedirect && isAuthenticated && isInitialized && user) {
      navigate(pendingRedirect, { replace: true });
      setPendingRedirect(null);
    }
  }, [pendingRedirect, isAuthenticated, isInitialized, user, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const rawResponse = await login({
        email: data.email,
        identifier: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      }).unwrap();

      // Safely parse user profile & tokens first
      const normalized = normalizeAuthResponse(rawResponse);

      // Check if multi-step email verification / OTP is required by FastAPI
      // Only redirect to verify-email if user is NOT already verified
      const isVerificationRequired = Boolean(
        normalized.requiresEmailVerification &&
        !normalized.user.isEmailVerified &&
        (rawResponse.verification_id || rawResponse.data?.verification_id)
      );

      if (isVerificationRequired) {
        const emailToVerify =
          rawResponse.data?.email ||
          rawResponse.email ||
          rawResponse.data?.masked_email ||
          data.email;
        const verificationId =
          rawResponse.data?.verification_id ||
          rawResponse.verification_id ||
          '';

        toast.info(
          rawResponse.message || 'Email verification is required. An OTP has been dispatched to your email.',
          'Verification Required'
        );
        navigate(
          `/auth/verify-email?email=${encodeURIComponent(emailToVerify)}&vid=${encodeURIComponent(verificationId)}`
        );
        return;
      }

      const displayName = normalized.user.fullName || normalized.user.firstName || 'User';

      toast.success(
        `Welcome back, ${displayName}!`,
        'Authenticated Successfully'
      );

      const canonicalRole = normalizeRole(normalized.user.activeRole || (normalized.user as any).role);
      const dest = redirectUrl
        ? decodeURIComponent(redirectUrl)
        : ROLE_DASHBOARD_ROUTES[canonicalRole] || '/dashboard/employee';
      setPendingRedirect(dest);
    } catch (err: unknown) {
      let errorMsg = 'Invalid credentials. Please verify your corporate email and password.';
      if (typeof err === 'object' && err !== null) {
        const e = err as any;
        if (e.data?.message) {
          errorMsg = e.data.message;
        } else if (e.data?.detail) {
          errorMsg = typeof e.data.detail === 'string' ? e.data.detail : JSON.stringify(e.data.detail);
        } else if (Array.isArray(e.data?.errors) && e.data.errors[0]?.message) {
          errorMsg = e.data.errors[0].message;
        } else if (e.error) {
          errorMsg =
            e.error === 'FETCH_ERROR'
              ? 'Unable to connect to the authentication server. Please verify the backend is running.'
              : e.error;
        }
      }
      toast.error(errorMsg, 'Login Failed');
    }
  };

  const openFaceLoginModal = () => {
    setIsFaceModalOpen(true);
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your OFC360 workspace"
      footerText="New to OFC360?"
      footerLinkText="Create a workspace"
      footerLinkTo="/auth/register"
    >
      <div className="space-y-5">
        {/* Standard Password Form (Always available as primary or fallback) */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          {/* Work email */}
          <Input
            label="Work email"
            type="email"
            placeholder="superadmin@ofc360.com"
            error={errors.email?.message}
            {...register('email')}
          />

          {/* Password with Forgot password? link aligned right on label */}
          <Input
            label="Password"
            labelRight={
              <Link
                to="/auth/forgot-password"
                className="text-xs text-gray-500 dark:text-zinc-400 hover:text-indigo-600 transition-colors font-normal"
              >
                Forgot Password
              </Link>
            }
            isPassword
            placeholder="••••••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          {/* Circular "Remember me on this device" Checkbox */}
          <div className="pt-0.5">
            <label className="flex items-center gap-2.5 cursor-pointer select-none group">
              <div
                onClick={() => setValue('rememberMe', !rememberMe)}
                className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                  rememberMe
                    ? 'border-gray-900 dark:border-white bg-gray-900 dark:bg-white'
                    : 'border-gray-300 dark:border-zinc-600 bg-white dark:bg-[#171717] group-hover:border-gray-500 dark:group-hover:border-zinc-400'
                }`}
              >
                {rememberMe && <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-gray-900" />}
              </div>
              <span className="text-xs text-gray-600 dark:text-zinc-400">Remember me on this device</span>
              <input type="checkbox" className="hidden" {...register('rememberMe')} />
            </label>
          </div>

          {/* Full-width Sign In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 font-semibold text-sm rounded-xl transition-all duration-200 shadow-sm active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white dark:text-gray-900" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign in with password</span>
            )}
          </button>
        </form>

        {/* Quick Face Unlock Button */}
        <button
          type="button"
          onClick={openFaceLoginModal}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] hover:bg-gray-50 dark:hover:bg-[#2f2f2f] text-gray-900 dark:text-[#ececec] text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-[0.99] relative group"
          title="Quick Face Unlock"
          aria-label="Quick Face Unlock"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <ScanFace className="w-4 h-4 text-white" />
          </div>
          <span className="font-medium text-gray-900 dark:text-[#ececec]">Quick Face Unlock</span>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-semibold uppercase px-1.5 py-0.2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            Face Login
          </div>
        </button>

        {/* Face Login Modal */}
        <FaceLoginModal
          isOpen={isFaceModalOpen}
          onClose={() => setIsFaceModalOpen(false)}
          email={watch('email')?.trim() || undefined}
        />
      </div>
    </AuthShell>
  );
};