import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthShell } from '@/shared/layout/AuthShell';
import { Input } from '@/shared/ui/Input';
import { useLoginMutation } from '@/features/auth/api/authApi';
import { loginSchema, LoginFormData } from '@/features/auth/schemas/auth.schemas';
import { useToast } from '@/shared/ui/Toast';
import { ROLE_DASHBOARD_ROUTES } from '@/features/auth/types/auth.types';
import { usePasskey } from '@/features/auth/hooks/usePasskey';
import { Loader2, Fingerprint, ShieldCheck, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [login, { isLoading }] = useLoginMutation();
  const {
    canUsePasskey,
    isAuthenticating: isPasskeyLoading,
    error: passkeyError,
    clearError: clearPasskeyError,
    loginWithPasskey,
  } = usePasskey();

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

  const handleSuccessfulAuth = (user: { fullName: string; activeRole: keyof typeof ROLE_DASHBOARD_ROUTES }) => {
    if (redirectUrl) {
      navigate(decodeURIComponent(redirectUrl));
    } else {
      const dest = ROLE_DASHBOARD_ROUTES[user.activeRole] || '/dashboard/employee';
      navigate(dest);
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await login(data).unwrap();
      toast.success(
        `Welcome back, ${response.user.fullName}!`,
        'Authenticated Successfully'
      );
      handleSuccessfulAuth(response.user);
    } catch (err: unknown) {
      const errorMsg =
        typeof err === 'object' && err !== null && 'data' in err && typeof (err as { data?: { message?: string } }).data?.message === 'string'
          ? (err as { data: { message: string } }).data.message
          : 'Invalid credentials. Please verify your corporate email and password.';
      toast.error(errorMsg, 'Login Failed');
    }
  };

  const handlePasskeyLogin = async () => {
    clearPasskeyError();
    try {
      const emailInput = watch('email')?.trim();
      const response = await loginWithPasskey(emailInput || undefined);
      toast.success(
        `Welcome back, ${response.user.fullName}!`,
        'Unlocked with Face / Fingerprint'
      );
      handleSuccessfulAuth(response.user);
    } catch (err: unknown) {
      const clientError = err as { message?: string };
      toast.info(
        clientError?.message || 'Passkey authentication dismissed. Please continue with your password.',
        'Passkey Fallback'
      );
    }
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
        {/* Passkey / Biometric Unlock Button (Feature-detected & Hidden if unsupported) */}
        {canUsePasskey && (
          <div className="space-y-3">
            <button
              type="button"
              id="passkey-login-button"
              onClick={handlePasskeyLogin}
              disabled={isPasskeyLoading || isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-50 to-violet-50 hover:from-indigo-100 hover:to-violet-100 border border-indigo-200 text-indigo-950 font-semibold text-sm rounded-xl transition-all duration-200 shadow-sm active:scale-[0.99] flex items-center justify-between group disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  {isPasskeyLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Fingerprint className="w-4 h-4" />
                  )}
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Unlock with face / fingerprint</span>
                    <span className="text-[10px] font-semibold uppercase px-1.5 py-0.2 bg-indigo-200/60 text-indigo-800 rounded">
                      Passkey
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-normal">
                    Touch ID • Face Unlock • Windows Hello
                  </div>
                </div>
              </div>
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
            </button>

            {/* Inline Error Helper with Fallback Message */}
            {passkeyError && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">{passkeyError.message}</p>
                  <p className="text-amber-700 text-[11px] mt-0.5">
                    You can always enter your standard password below to proceed.
                  </p>
                </div>
              </div>
            )}

            {/* Visual Divider */}
            <div className="relative flex items-center py-1">
              <div className="flex-grow border-t border-slate-200" />
              <span className="flex-shrink mx-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                Or sign in with password
              </span>
              <div className="flex-grow border-t border-slate-200" />
            </div>
          </div>
        )}

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
                className="text-xs text-slate-500 hover:text-indigo-600 transition-colors font-normal"
              >
                Forgot password?
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
                    ? 'border-slate-900 bg-slate-900'
                    : 'border-slate-400/80 bg-white group-hover:border-slate-600'
                }`}
              >
                {rememberMe && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              <span className="text-xs text-slate-600">Remember me on this device</span>
              <input type="checkbox" className="hidden" {...register('rememberMe')} />
            </label>
          </div>

          {/* Full-width Dark Sign In Button */}
          <button
            type="submit"
            disabled={isLoading || isPasskeyLoading}
            className="w-full py-3.5 px-4 bg-[#0d1527] hover:bg-[#1a233a] text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-sm active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign in with password</span>
            )}
          </button>
        </form>
      </div>
    </AuthShell>
  );
};
