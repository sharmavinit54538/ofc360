import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthShell } from '@/shared/layout/AuthShell';
import { Input } from '@/shared/ui/Input';
import { useLoginMutation } from '@/features/auth/api/authApi';
import { loginSchema, LoginFormData } from '@/features/auth/schemas/auth.schemas';
import { useToast } from '@/shared/ui/Toast';
import { ROLE_DASHBOARD_ROUTES } from '@/features/auth/types/auth.types';
import { FaceLoginModal } from '@/features/auth/components/FaceLoginModal';
import { Loader2, ScanFace } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [login, { isLoading }] = useLoginMutation();

  const [isFaceModalOpen, setIsFaceModalOpen] = useState(false);

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
                className="text-xs text-slate-500 hover:text-indigo-600 transition-colors font-normal"
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
            disabled={isLoading}
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

        {/* Quick Face Unlock Button */}
        <button
          type="button"
          onClick={openFaceLoginModal}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-[0.99] relative group"
          title="Quick Face Unlock"
          aria-label="Quick Face Unlock"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <ScanFace className="w-4 h-4 text-white" />
          </div>
          <span className="font-medium text-slate-900">Quick Face Unlock</span>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-semibold uppercase px-1.5 py-0.2 bg-indigo-100 text-indigo-700 rounded opacity-0 group-hover:opacity-100 transition-opacity">
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