import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { AuthShell } from '@/shared/layout/AuthShell';
import { Input } from '@/shared/ui/Input';
import { forgotPasswordSchema, ForgotPasswordFormData } from '@/features/auth/schemas/auth.schemas';
import { useForgotPasswordMutation } from '@/features/auth/api/authApi';
import { useToast } from '@/shared/ui/Toast';
import { Loader2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const response = await forgotPassword(data).unwrap();
      toast.success(
        response.message || 'Verification code sent to your email address.',
        'Code Dispatched'
      );
      navigate(`/auth/verify-reset-otp?email=${encodeURIComponent(data.email)}`);
    } catch (err: any) {
      toast.error(
        err?.data?.message || 'Could not dispatch reset code. Please check the email entered.',
        'Request Failed'
      );
    }
  };

  return (
    <AuthShell
      title="Forgot password?"
      subtitle="Enter your work email to receive a 6-digit verification code"
      footerText="Remembered your password?"
      footerLinkText="Back to sign in"
      footerLinkTo="/auth/login"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <Input
          label="Work email"
          type="email"
          placeholder="name@company.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-4 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 font-semibold text-sm rounded-xl transition-all duration-200 shadow-sm active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white dark:text-gray-900" />
              <span>Sending code...</span>
            </>
          ) : (
            <span>Send verification code</span>
          )}
        </button>
      </form>
    </AuthShell>
  );
};
