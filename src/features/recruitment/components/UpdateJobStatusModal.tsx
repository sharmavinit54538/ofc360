import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Workflow } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Textarea } from '@/shared/ui/Textarea';
import { useToast } from '@/shared/ui/Toast';
import { useUpdateJobStatusMutation } from '../api/recruitmentApi';
import { updateJobStatusSchema, type UpdateJobStatusFormData } from '../schemas/recruitment.schemas';
import type { JobOpening, JobOpeningStatus } from '../types/recruitment.types';

interface UpdateJobStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobOpening | null;
}

const STATUS_OPTIONS: { id: JobOpeningStatus; label: string }[] = [
  { id: 'DRAFT', label: 'Draft' },
  { id: 'PUBLISHED', label: 'Published' },
  { id: 'ON_HOLD', label: 'On Hold' },
  { id: 'CLOSED', label: 'Closed' },
];

const selectClass =
  'w-full px-3 py-2 rounded-lg text-sm border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';

export const UpdateJobStatusModal: React.FC<UpdateJobStatusModalProps> = ({ isOpen, onClose, job }) => {
  const toast = useToast();
  const [updateStatus, { isLoading: isSaving }] = useUpdateJobStatusMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateJobStatusFormData>({
    resolver: zodResolver(updateJobStatusSchema),
    defaultValues: { status: 'PUBLISHED', reason: '' },
  });

  useEffect(() => {
    if (job && isOpen) {
      reset({ status: job.status, reason: '' });
    }
  }, [job, isOpen, reset]);

  if (!isOpen || !job) return null;

  const onSubmit = async (data: UpdateJobStatusFormData) => {
    try {
      await updateStatus({
        id: job.id,
        data: { status: data.status, reason: data.reason?.trim() ? data.reason.trim() : undefined },
      }).unwrap();
      toast.success(`"${job.title}" marked as ${data.status.replace('_', ' ')}.`, 'Status Updated');
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update job status.', 'Save Error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
      <div
        className="w-full max-w-md bg-white dark:bg-[#171717] rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-labelledby="job-status-headline"
      >
        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between bg-gray-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Workflow className="w-5 h-5" />
            </div>
            <div>
              <h2 id="job-status-headline" className="text-base font-bold text-gray-900 dark:text-[#ececec]">
                Change Job Status
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                {job.title} • {job.jobCode}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="job-status-select" className="text-xs font-semibold text-gray-900 dark:text-[#ececec]">
              New Status
            </label>
            <select id="job-status-select" className={selectClass} {...register('status')}>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.status?.message && <p className="text-xs text-rose-500">{errors.status.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="job-status-reason" className="text-xs font-semibold text-gray-900 dark:text-[#ececec]">
              Reason (optional)
            </label>
            <Textarea
              id="job-status-reason"
              rows={3}
              placeholder="Why is this requisition changing state?"
              error={Boolean(errors.reason)}
              {...register('reason')}
            />
            {errors.reason?.message && <p className="text-xs text-rose-500">{errors.reason.message}</p>}
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100 dark:border-zinc-800">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSaving}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Update Status
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateJobStatusModal;
