import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthShell } from '@/shared/layout/AuthShell';
import { Input } from '@/shared/ui/Input';
import { PasswordStrengthMeter } from '@/features/auth/components/PasswordStrengthMeter';
import { resetPasswordSchema, ResetPasswordFormData } from '@/features/auth/schemas/auth.schemas';
import { useResetPasswordMutation } from '@/features/auth/api/authApi';
import { useToast } from '@/shared/ui/Toast';
import { Loader2 } from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();

  const email = searchParams.get('email') || '';
  const verificationToken = searchParams.get('token') || 'demo_token';

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPasswordValue = watch('newPassword');

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      const response = await resetPassword({
        email,
        verificationToken,
        newPassword: data.newPassword,
      }).unwrap();

      toast.success(
        response.message || 'Your password has been reset successfully. Please sign in.',
        'Credentials Updated'
      );
      navigate('/auth/login');
    } catch (err: any) {
      toast.error(
        err?.data?.message || 'Failed to update password. Your reset session may have expired.',
        'Reset Failed'
      );
    }
  };

  return (
    <AuthShell
      title="Create new password"
      subtitle="Enter a strong new password for your account"
      footerText="Remember your credentials?"
      footerLinkText="Sign in"
      footerLinkTo="/auth/login"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <Input
            label="New password"
            isPassword
            placeholder="••••••••••••"
            error={errors.newPassword?.message}
            {...register('newPassword')}
          />
          <PasswordStrengthMeter password={newPasswordValue} />
        </div>

        <Input
          label="Confirm new password"
          isPassword
          placeholder="••••••••••••"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-4 bg-[#0d1527] hover:bg-[#1e293b] text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-sm active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Saving password...</span>
            </>
          ) : (
            <span>Update password & sign in</span>
          )}
        </button>
      </form>
    </AuthShell>
  );
};
