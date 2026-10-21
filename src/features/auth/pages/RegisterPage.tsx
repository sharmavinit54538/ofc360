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
      cardMaxWidth="max-w-[580px] sm:max-w-[620px]"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3.5 gap-y-2.5">
          {/* Company Name */}
          <div className="sm:col-span-2">
            <Input
              label="Company or organization name"
              placeholder="Acme Global Inc."
              inputSize="sm"
              error={errors.organizationName?.message}
              {...register('organizationName')}
            />
          </div>

          {/* Admin First & Last Name */}
          <Input
            label="First name"
            placeholder="John"
            inputSize="sm"
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <Input
            label="Last name"
            placeholder="Doe"
            inputSize="sm"
            error={errors.lastName?.message}
            {...register('lastName')}
          />

          {/* Work Email & Mobile Number */}
          <Input
            label="Work email"
            type="email"
            placeholder="admin@company.com"
            inputSize="sm"
            error={errors.workEmail?.message}
            {...register('workEmail')}
          />
          <Input
            label="Mobile number"
            type="tel"
            placeholder="+91 98765 43210"
            inputSize="sm"
            error={errors.phone?.message}
            {...register('phone')}
          />

          {/* Password & Confirm Password */}
          <Input
            label="Password"
            isPassword
            placeholder="••••••••••••"
            inputSize="sm"
            error={errors.password?.message}
            {...register('password')}
          />
          <Input
            label="Confirm password"
            isPassword
            placeholder="••••••••••••"
            inputSize="sm"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          {/* Password Strength Meter - compact row */}
          {passwordValue && (
            <div className="sm:col-span-2 -mt-0.5">
              <PasswordStrengthMeter password={passwordValue} compact />
            </div>
          )}
        </div>

        {/* Terms and Privacy - Circular Checkbox */}
        <div className="pt-0.5">
          <label className="flex items-center gap-2 cursor-pointer select-none group">
            <div
              onClick={() => setValue('termsAccepted', !termsAccepted, { shouldValidate: true })}
              className={`w-4 h-4 rounded-full border transition-all flex items-center justify-center shrink-0 ${
                termsAccepted
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-400 bg-white group-hover:border-slate-600'
              }`}
            >
              {termsAccepted && <Check className="w-2.5 h-2.5 stroke-[3]" />}
            </div>
            <span className="text-xs text-slate-600 leading-normal">
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
            <p className="text-[11px] text-rose-500 mt-0.5">{errors.termsAccepted.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 sm:py-3 px-4 bg-[#0d1527] hover:bg-[#1e293b] text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-sm active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
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
