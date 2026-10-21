import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { AuthShell } from '@/shared/layout/AuthShell';
import { Input } from '@/shared/ui/Input';
import { PasswordStrengthMeter } from '@/features/auth/components/PasswordStrengthMeter';
import { registerSchema, RegisterFormData } from '@/features/auth/schemas/auth.schemas';
import { useRegisterMutation } from '@/features/auth/api/authApi';
import { useToast } from '@/shared/ui/Toast';
import { Loader2, Check } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [registerAccount, { isLoading }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      organizationName: '',
      organizationSize: '11-50',
      industry: 'Technology & SaaS',
      firstName: '',
      lastName: '',
      workEmail: '',
      phone: '',
      password: '',
      confirmPassword: '',
      termsAccepted: true,
    },
  });

  const passwordValue = watch('password');
  const termsAccepted = watch('termsAccepted');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await registerAccount(data).unwrap();
      toast.success(
        response.message || 'Workspace initialized! Please verify your corporate email.',
        'Registration Successful'
      );
      navigate(`/auth/verify-email?email=${encodeURIComponent(data.workEmail)}`);
    } catch (err: any) {
      toast.error(
        err?.data?.message || 'Failed to complete corporate registration. Please try again.',
        'Registration Failed'
      );
    }
  };

  return (
    <AuthShell
      title="Create a workspace"
      subtitle="Set up your OFC360 corporate instance"
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerLinkTo="/auth/login"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {/* Company Name */}
        <Input
          label="Company or organization name"
          placeholder="Acme Global Inc."
          error={errors.organizationName?.message}
          {...register('organizationName')}
        />

        {/* Mobile Number */}
        <Input
          label="Mobile number"
          type="tel"
          placeholder="+91 98765 43210"
          error={errors.phone?.message}
          {...register('phone')}
        />

        {/* Admin First & Last Name */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First name"
            placeholder="John"
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <Input
            label="Last name"
            placeholder="Doe"
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>

        {/* Work Email */}
        <Input
          label="Work email"
          type="email"
          placeholder="admin@company.com"
          error={errors.workEmail?.message}
          {...register('workEmail')}
        />

        {/* Password */}
        <div>
          <Input
            label="Password"
            isPassword
            placeholder="••••••••••••"
            error={errors.password?.message}
            {...register('password')}
          />
          <PasswordStrengthMeter password={passwordValue} />
        </div>

        {/* Confirm Password */}
        <Input
          label="Confirm password"
          isPassword
          placeholder="••••••••••••"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        {/* Terms and Privacy - Circular Checkbox */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer select-none group">
            <div
              onClick={() => setValue('termsAccepted', !termsAccepted, { shouldValidate: true })}
              className={`w-4 h-4 mt-0.5 rounded-full border transition-all flex items-center justify-center shrink-0 ${
                termsAccepted
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-400 bg-white group-hover:border-slate-600'
              }`}
            >
              {termsAccepted && <Check className="w-2.5 h-2.5 stroke-[3]" />}
            </div>
            <span className="text-xs text-slate-600 leading-relaxed">
              I agree to the OFC360{' '}
              <a href="#terms" className="text-slate-900 font-semibold hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#privacy" className="text-slate-900 font-semibold hover:underline">
                Privacy Policy
              </a>
              .
            </span>
            <input type="checkbox" className="hidden" {...register('termsAccepted')} />
          </label>
          {errors.termsAccepted?.message && (
            <p className="text-xs text-rose-500 mt-1">{errors.termsAccepted.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-4 bg-[#0d1527] hover:bg-[#1e293b] text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-sm active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Creating workspace...</span>
            </>
          ) : (
            <span>Create workspace</span>
          )}
        </button>
      </form>
    </AuthShell>
  );
};
