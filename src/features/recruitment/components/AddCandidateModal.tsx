/**
 * @file AddCandidateModal.tsx
 * @description Modal for creating a master candidate profile in OFC360 RMS / Talent Pool.
 * Strictly implements the verified Pydantic CandidateCreate contract schema.
 */

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, UserPlus, Building2, MapPin, Mail, Phone, DollarSign, Clock, Tag } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { useToast } from '@/shared/ui/Toast';
import { candidatesClient } from '../api/candidatesApi';
import { candidateCreateSchema, type CandidateCreateFormData } from '../schemas/candidate.schema';
import type { JobOpening } from '../types/recruitment.types';

interface AddCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobs?: JobOpening[];
  onSuccess?: () => void;
}

const SOURCE_OPTIONS = [
  { id: 'DIRECT', label: 'Direct Sourcing' },
  { id: 'LinkedIn', label: 'LinkedIn' },
  { id: 'Naukri', label: 'Naukri' },
  { id: 'Referral', label: 'Employee Referral' },
  { id: 'Career Site', label: 'Company Career Site' },
  { id: 'Agency', label: 'Recruitment Agency' },
];

export const AddCandidateModal: React.FC<AddCandidateModalProps> = ({
  isOpen,
  onClose,
  jobs = [],
  onSuccess,
}) => {
  const toast = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CandidateCreateFormData>({
    resolver: zodResolver(candidateCreateSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      location: '',
      summary: '',
      skills: [],
      tags: [],
      years_experience: 0,
      current_company: '',
      current_role: '',
      expected_salary: undefined,
      notice_days: 0,
      source: 'DIRECT',
      is_talent_pool: false,
    },
  });

  useEffect(() => {
    if (isOpen) reset();
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: CandidateCreateFormData) => {
    try {
      await candidatesClient.createCandidate({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        location: data.location,
        summary: data.summary || null,
        skills: Array.isArray(data.skills) ? data.skills : [],
        tags: Array.isArray(data.tags) ? data.tags : [],
        years_experience: Number(data.years_experience) || 0,
        current_company: data.current_company || null,
        current_role: data.current_role || null,
        expected_salary: data.expected_salary ? Number(data.expected_salary) : null,
        notice_days: Number(data.notice_days) || 0,
        source: data.source || 'DIRECT',
        is_talent_pool: Boolean(data.is_talent_pool),
      });

      toast.success(
        `${data.first_name} ${data.last_name} profile created successfully.`,
        'Candidate Registered'
      );
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to register candidate.', 'Save Error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in-50">
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 dark:border-zinc-800 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-500/20">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Add New Candidate</h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Register candidate profile into master ATS talent pipeline
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Row 1: First Name & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                First Name <span className="text-rose-500">*</span>
              </label>
              <Input
                {...register('first_name')}
                placeholder="e.g. Aman"
                className="w-full text-xs"
              />
              {errors.first_name && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.first_name.message}</p>
              )}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                Last Name <span className="text-rose-500">*</span>
              </label>
              <Input
                {...register('last_name')}
                placeholder="e.g. Sharma"
                className="w-full text-xs"
              />
              {errors.last_name && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.last_name.message}</p>
              )}
            </div>
          </div>

          {/* Row 2: Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <Input
                {...register('email')}
                type="email"
                placeholder="aman.sharma@example.com"
                className="w-full text-xs"
              />
              {errors.email && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                Contact Phone <span className="text-rose-500">*</span>
              </label>
              <Input
                {...register('phone')}
                placeholder="+919876543210 (min 10 chars)"
                className="w-full text-xs"
              />
              {errors.phone && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>

          {/* Row 3: Location & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                Current Location <span className="text-rose-500">*</span>
              </label>
              <Input
                {...register('location')}
                placeholder="City, State, Country"
                className="w-full text-xs"
              />
              {errors.location && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.location.message}</p>
              )}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                Total Experience (Years)
              </label>
              <Input
                {...register('years_experience')}
                type="number"
                step="0.5"
                min="0"
                placeholder="e.g. 5.5"
                className="w-full text-xs"
              />
            </div>
          </div>

          {/* Row 4: Current Employer & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                Current Company
              </label>
              <Input
                {...register('current_company')}
                placeholder="e.g. Acme Tech"
                className="w-full text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                Current Role / Designation
              </label>
              <Input
                {...register('current_role')}
                placeholder="e.g. Senior Software Engineer"
                className="w-full text-xs"
              />
            </div>
          </div>

          {/* Row 5: Expected Salary & Notice Period */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                Expected Annual CTC (₹)
              </label>
              <Input
                {...register('expected_salary')}
                type="number"
                step="50000"
                placeholder="e.g. 2400000"
                className="w-full text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                Notice Period (Days)
              </label>
              <Input
                {...register('notice_days')}
                type="number"
                min="0"
                placeholder="e.g. 30"
                className="w-full text-xs"
              />
            </div>
          </div>

          {/* Row 6: Skills & Sourcing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                Key Skills (Comma separated)
              </label>
              <Input
                {...register('skills')}
                placeholder="Python, FastAPI, React, PostgreSQL"
                className="w-full text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                Sourcing Channel
              </label>
              <select
                {...register('source')}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {SOURCE_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Talent Pool Checkbox */}
          <div className="pt-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="is_talent_pool"
              {...register('is_talent_pool')}
              className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            <label htmlFor="is_talent_pool" className="text-xs font-semibold text-slate-700 dark:text-zinc-300 cursor-pointer">
              Add directly to Talent Pool database for future matching
            </label>
          </div>

          {/* Footer CTA */}
          <div className="pt-4 border-t border-slate-200/80 dark:border-zinc-800 flex justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={isSubmitting}
              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold"
            >
              {isSubmitting ? 'Registering...' : 'Register Candidate'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
