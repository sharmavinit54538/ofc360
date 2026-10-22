/**
 * @file RegisterVisitorModal.tsx
 * @description React Hook Form + Zod dialog modal for pre-registering visitors,
 * verifying NDA compliance, and assigning host employees.
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, UserPlus, Building2, User, Mail, Phone, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { useToast } from '@/shared/ui/Toast';
import { useRegisterVisitorMutation } from '../api/visitorsApi';
import {
  registerVisitorSchema,
  type RegisterVisitorFormData,
} from '../schemas/visitorForm.schema';

interface RegisterVisitorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegisterVisitorModal: React.FC<RegisterVisitorModalProps> = ({ isOpen, onClose }) => {
  const toast = useToast();
  const [registerVisitor, { isLoading }] = useRegisterVisitorMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterVisitorFormData>({
    resolver: zodResolver(registerVisitorSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      company: '',
      hostEmployeeId: '',
      purpose: '',
      expectedArrival: new Date().toISOString().split('T')[0],
      ndaSigned: true,
      notes: '',
    },
  });

  if (!isOpen) return null;

  const onSubmit = async (data: RegisterVisitorFormData) => {
    try {
      await registerVisitor(data).unwrap();
      toast.success(`Visitor ${data.fullName} registered successfully!`, 'Registration Confirmed');
      reset();
      onClose();
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.data?.detail || 'Failed to register visitor. Please check form inputs.',
        'Registration Failed'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
      <div
        className="w-full max-w-xl bg-white dark:bg-[#171717] rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-labelledby="register-visitor-title"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between shrink-0 bg-gray-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 p-0.5 shadow-sm shadow-brand-500/20">
              <div className="w-full h-full bg-white dark:bg-[#171717] rounded-[10px] flex items-center justify-center text-brand-600 dark:text-brand-400">
                <UserPlus className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 id="register-visitor-title" className="text-base sm:text-lg font-bold text-gray-900 dark:text-[#ececec]">
                Register New Visitor
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Pre-authorize guest arrival, set host employee, and issue digital pass
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-y-auto">
          <div className="p-6 space-y-4">
            {/* Full Name & Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                  Visitor Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    {...register('fullName')}
                    placeholder="e.g. Jane Doe"
                    error={errors.fullName?.message}
                    className="pl-9"
                  />
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                  Company / Organization <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    {...register('company')}
                    placeholder="e.g. Acme Corp"
                    error={errors.company?.message}
                    className="pl-9"
                  />
                  <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    {...register('email')}
                    type="email"
                    placeholder="visitor@example.com"
                    error={errors.email?.message}
                    className="pl-9"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    {...register('phone')}
                    placeholder="+1 (555) 000-0000"
                    error={errors.phone?.message}
                    className="pl-9"
                  />
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Host Employee & Expected Arrival */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                  Host Employee / Contact <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    {...register('hostEmployeeId')}
                    placeholder="Host Name or Staff ID"
                    error={errors.hostEmployeeId?.message}
                    className="pl-9"
                  />
                  <UserPlus className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                  Expected Arrival Date
                </label>
                <div className="relative">
                  <Input
                    {...register('expectedArrival')}
                    type="date"
                    className="pl-9"
                  />
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                Purpose of Visit <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Input
                  {...register('purpose')}
                  placeholder="e.g. Quarterly Strategic Review / Vendor Inspection"
                  error={errors.purpose?.message}
                  className="pl-9"
                />
                <FileText className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Optional Notes */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                Additional Notes / Security Instructions
              </label>
              <textarea
                {...register('notes')}
                rows={2}
                placeholder="Escort required, parking spot reserved, or special equipment..."
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-[#ececec] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            {/* NDA Agreement Checkbox */}
            <div className="p-3.5 rounded-2xl border border-emerald-200/60 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-950/20">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('ndaSigned')}
                  className="mt-0.5 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <div className="text-xs">
                  <div className="font-semibold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    Non-Disclosure & Facility Security Agreement
                  </div>
                  <p className="text-emerald-700 dark:text-emerald-400/80 mt-0.5 text-[11px] leading-relaxed">
                    Visitor acknowledges and agrees to comply with workplace confidentiality policies, safety regulations, and photographic restrictions.
                  </p>
                </div>
              </label>
              {errors.ndaSigned && (
                <p className="mt-1.5 text-xs text-rose-500 font-medium pl-7">
                  {errors.ndaSigned.message}
                </p>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-zinc-800 flex items-center justify-end gap-3 bg-gray-50/50 dark:bg-zinc-900/40">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-xl text-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="rounded-xl text-sm px-5"
            >
              {isLoading ? 'Registering...' : 'Register Visitor'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterVisitorModal;
