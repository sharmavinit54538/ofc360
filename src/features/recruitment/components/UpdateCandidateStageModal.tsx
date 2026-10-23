import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Workflow } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Textarea } from '@/shared/ui/Textarea';
import { useToast } from '@/shared/ui/Toast';
import { useUpdateCandidateStageMutation } from '../api/recruitmentApi';
import {
  updateCandidateStageSchema,
  type UpdateCandidateStageFormData,
} from '../schemas/recruitment.schemas';
import type { CandidateItem, CandidateStage } from '../types/recruitment.types';

interface UpdateCandidateStageModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: CandidateItem | null;
}

const STAGE_OPTIONS: { id: CandidateStage; label: string }[] = [
  { id: 'APPLIED', label: 'Applied' },
  { id: 'SCREENING', label: 'Screening' },
  { id: 'INTERVIEW', label: 'Interview' },
  { id: 'OFFERED', label: 'Offered' },
  { id: 'HIRED', label: 'Hired' },
  { id: 'REJECTED', label: 'Rejected' },
];

const selectClass =
  'w-full px-3 py-2 rounded-lg text-sm border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';

export const UpdateCandidateStageModal: React.FC<UpdateCandidateStageModalProps> = ({
  isOpen,
  onClose,
  candidate,
}) => {
  const toast = useToast();
  const [updateStage, { isLoading: isSaving }] = useUpdateCandidateStageMutation();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<UpdateCandidateStageFormData>({
    resolver: zodResolver(updateCandidateStageSchema),
    defaultValues: {
      stage: 'SCREENING',
      notes: '',
      rejectionReason: '',
    },
  });

  useEffect(() => {
    if (candidate && isOpen) {
      const ordered: CandidateStage[] = ['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFERED', 'HIRED', 'REJECTED'];
      const currentIndex = ordered.indexOf(candidate.currentStage);
      const nextStage = ordered[Math.min(currentIndex + 1, ordered.length - 1)];
      reset({ stage: nextStage, notes: '', rejectionReason: '' });
    }
  }, [candidate, isOpen, reset]);

  const watchedStage = watch('stage');

  if (!isOpen || !candidate) return null;

  const onSubmit = async (data: UpdateCandidateStageFormData) => {
    try {
      await updateStage({
        id: candidate.id,
        data: {
          stage: data.stage,
          notes: data.notes?.trim() ? data.notes.trim() : undefined,
          rejectionReason:
            data.stage === 'REJECTED' && data.rejectionReason?.trim()
              ? data.rejectionReason.trim()
              : undefined,
        },
      }).unwrap();
      toast.success(
        `${candidate.fullName} moved to ${data.stage.replace('_', ' ')}.`,
        'Stage Updated'
      );
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to move the candidate stage.', 'Save Error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
      <div
        className="w-full max-w-md bg-white dark:bg-[#171717] rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-labelledby="move-stage-headline"
      >
        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between bg-gray-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Workflow className="w-5 h-5" />
            </div>
            <div>
              <h2 id="move-stage-headline" className="text-base font-bold text-gray-900 dark:text-[#ececec]">
                Move Candidate Stage
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                {candidate.fullName} • currently {candidate.currentStage.replace('_', ' ')}
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
            <label htmlFor="stage-select" className="text-xs font-semibold text-gray-900 dark:text-[#ececec]">
              New Stage
            </label>
            <select id="stage-select" className={selectClass} {...register('stage')}>
              {STAGE_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.stage?.message && <p className="text-xs text-rose-500">{errors.stage.message}</p>}
          </div>

          {watchedStage === 'REJECTED' && (
            <div className="space-y-1.5">
              <label htmlFor="rejection-reason" className="text-xs font-semibold text-gray-900 dark:text-[#ececec]">
                Rejection Reason
              </label>
              <Textarea
                id="rejection-reason"
                rows={3}
                placeholder="Document why the candidate is being rejected (min 10 characters)..."
                error={Boolean(errors.rejectionReason)}
                {...register('rejectionReason')}
              />
              {errors.rejectionReason?.message && (
                <p className="text-xs text-rose-500">{errors.rejectionReason.message}</p>
              )}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="stage-notes" className="text-xs font-semibold text-gray-900 dark:text-[#ececec]">
              Notes (optional)
            </label>
            <Textarea
              id="stage-notes"
              rows={2}
              placeholder="Any context for the hiring team..."
              error={Boolean(errors.notes)}
              {...register('notes')}
            />
            {errors.notes?.message && <p className="text-xs text-rose-500">{errors.notes.message}</p>}
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
              Update Stage
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCandidateStageModal;
