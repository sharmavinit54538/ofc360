/**
 * @file CreateRequisitionModal.tsx
 * @description Production modal dialog for submitting a new Job Requisition (Manpower Request).
 * Built with react-hook-form + zod validation and live department data.
 */

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Textarea } from '@/shared/ui/Textarea';
import { useToast } from '@/shared/ui/Toast';
import { useGetDepartmentsQuery } from '@/features/workforce/api/workforceApi';
import {
  jobRequisitionCreateSchema,
  type JobRequisitionFormValues,
} from '../schemas/requisition.schema';
import { useCreateRequisition } from '../api/requisitionsApi';

interface CreateRequisitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const FieldWrapper: React.FC<{
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}> = ({ label, required, error, children }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    {children}
    {error && (
      <p className="text-xs font-medium text-rose-500 flex items-center gap-1">
        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
        <span>{error}</span>
      </p>
    )}
  </div>
);

export const CreateRequisitionModal: React.FC<CreateRequisitionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();
  const { data: departmentsData, isLoading: isDeptLoading } = useGetDepartmentsQuery();
  const { mutateAsync: createRequisition, isPending, error: apiError } = useCreateRequisition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<JobRequisitionFormValues>({
    resolver: zodResolver(jobRequisitionCreateSchema),
    defaultValues: {
      title: '',
      department: '',
      vacancies: 1,
      min_experience: 0,
      max_experience: null,
      min_salary: '',
      max_salary: '',
      description: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        title: '',
        department: '',
        vacancies: 1,
        min_experience: 0,
        max_experience: null,
        min_salary: '',
        max_salary: '',
        description: '',
      });
    }
  }, [isOpen, reset]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const onSubmit = async (data: JobRequisitionFormValues) => {
    try {
      await createRequisition({
        title: data.title,
        department: data.department,
        vacancies: data.vacancies,
        min_experience: data.min_experience,
        max_experience: data.max_experience,
        min_salary: data.min_salary,
        max_salary: data.max_salary,
        description: data.description,
      });

      toast.success(
        'Job requisition submitted successfully for HR review.',
        'Requisition Raised'
      );
      reset();
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to submit requisition';
      toast.error(message, 'Submission Error');
    }
  };

  const departments = departmentsData || [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-requisition-title"
    >
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200/70 dark:border-teal-800/40 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="create-requisition-title"
                className="text-lg font-bold text-slate-900 dark:text-white"
              >
                Raise Job Requisition
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Submit manpower requirement for HR headcount & budget approval
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-4">
          {apiError && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{apiError}</span>
            </div>
          )}

          {/* Title & Department */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldWrapper label="Job Title" required error={errors.title?.message}>
              <Input
                {...register('title')}
                placeholder="e.g. Senior Backend Engineer"
                disabled={isPending}
              />
            </FieldWrapper>

            <FieldWrapper label="Department" required error={errors.department?.message}>
              {departments.length > 0 ? (
                <select
                  {...register('department')}
                  disabled={isPending || isDeptLoading}
                  className="w-full px-3 py-2 rounded-xl text-sm border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                >
                  <option value="">Select a department...</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  {...register('department')}
                  placeholder="e.g. Engineering, Sales, HR"
                  disabled={isPending}
                />
              )}
            </FieldWrapper>
          </div>

          {/* Vacancies & Experience Range */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FieldWrapper label="Total Vacancies" required error={errors.vacancies?.message}>
              <Input
                type="number"
                min={1}
                {...register('vacancies')}
                placeholder="1"
                disabled={isPending}
              />
            </FieldWrapper>

            <FieldWrapper label="Min Experience (Years)" error={errors.min_experience?.message}>
              <Input
                type="number"
                min={0}
                {...register('min_experience')}
                placeholder="0"
                disabled={isPending}
              />
            </FieldWrapper>

            <FieldWrapper label="Max Experience (Years)" error={errors.max_experience?.message}>
              <Input
                type="number"
                min={0}
                {...register('max_experience')}
                placeholder="Optional"
                disabled={isPending}
              />
            </FieldWrapper>
          </div>

          {/* Salary Budget Range (Annual CTC) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldWrapper label="Min Salary (Annual CTC in ₹)" error={errors.min_salary?.message}>
              <Input
                type="number"
                min={0}
                {...register('min_salary')}
                placeholder="e.g. 800000"
                disabled={isPending}
              />
            </FieldWrapper>

            <FieldWrapper label="Max Salary (Annual CTC in ₹)" error={errors.max_salary?.message}>
              <Input
                type="number"
                min={0}
                {...register('max_salary')}
                placeholder="e.g. 1500000"
                disabled={isPending}
              />
            </FieldWrapper>
          </div>

          {/* Description & Justification */}
          <FieldWrapper
            label="Job Description & Business Justification"
            required
            error={errors.description?.message}
          >
            <Textarea
              {...register('description')}
              rows={4}
              placeholder="Detail the core responsibilities, key deliverables, and reason for this headcount request..."
              disabled={isPending}
            />
          </FieldWrapper>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isPending}
              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-xs"
            >
              {isPending ? 'Submitting...' : 'Submit Requisition'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

