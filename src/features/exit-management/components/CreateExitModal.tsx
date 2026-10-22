import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, UserMinus, Calendar, CheckCircle2 } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { useToast } from '@/shared/ui/Toast';
import { useCreateExitCaseMutation } from '../api/exitsApi';
import { createExitCaseSchema, type CreateExitCaseFormData } from '../schemas/exit.schemas';
import type { ExitType, ExitReason } from '../types/exit.types';

interface CreateExitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateExitModal: React.FC<CreateExitModalProps> = ({ isOpen, onClose }) => {
  const toast = useToast();
  const [createExitCase, { isLoading }] = useCreateExitCaseMutation();

  const todayStr = new Date().toISOString().split('T')[0];
  const defaultLWDStr = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateExitCaseFormData>({
    resolver: zodResolver(createExitCaseSchema),
    defaultValues: {
      exitType: 'RESIGNATION',
      reason: 'BETTER_OPPORTUNITY',
      resignationDate: todayStr,
      expectedLastWorkingDay: defaultLWDStr,
      noticePeriodDays: 30,
      handoverNotes: '',
      notes: '',
    },
  });

  if (!isOpen) return null;

  const onSubmit = async (data: CreateExitCaseFormData) => {
    try {
      await createExitCase(data).unwrap();
      toast.success('Exit case initiated successfully!', 'Offboarding Initiated');
      reset();
      onClose();
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.data?.detail || 'Failed to initiate exit case. Please check inputs and try again.',
        'Submission Error'
      );
    }
  };

  const exitTypes: { value: ExitType; label: string }[] = [
    { value: 'RESIGNATION', label: 'Voluntary Resignation' },
    { value: 'TERMINATION', label: 'Involuntary Termination' },
    { value: 'RETIREMENT', label: 'Retirement' },
    { value: 'END_OF_CONTRACT', label: 'End of Contract / Fixed Term' },
  ];

  const exitReasons: { value: ExitReason; label: string }[] = [
    { value: 'BETTER_OPPORTUNITY', label: 'Better Career Opportunity' },
    { value: 'COMPENSATION', label: 'Higher Compensation / Benefits' },
    { value: 'RELOCATION', label: 'Relocation / Geographical Move' },
    { value: 'CAREER_CHANGE', label: 'Career or Industry Change' },
    { value: 'WORK_CULTURE', label: 'Work Culture / Management' },
    { value: 'HIGHER_STUDIES', label: 'Higher Education / Studies' },
    { value: 'HEALTH', label: 'Health / Medical Reasons' },
    { value: 'PERSONAL', label: 'Personal & Family Reasons' },
    { value: 'PERFORMANCE', label: 'Mutual Separation / Performance' },
    { value: 'OTHER', label: 'Other Miscellaneous' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
      <div
        className="w-full max-w-xl bg-white dark:bg-[#171717] rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-exit-modal"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between flex-shrink-0 bg-gray-50/50 dark:bg-[#1f1f1f]/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <UserMinus className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="create-exit-modal"
                className="text-lg font-bold text-gray-900 dark:text-[#ececec]"
              >
                Initiate Employee Exit Case
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Log resignation, set last working day, and trigger departmental clearance workflows.
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
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                  Exit Type
                </label>
                <select
                  {...register('exitType')}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-[#212121] text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer"
                >
                  {exitTypes.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                  Primary Reason
                </label>
                <select
                  {...register('reason')}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-[#212121] text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer"
                >
                  {exitReasons.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Input
                  label="Resignation Date"
                  type="date"
                  leftIcon={<Calendar className="w-3.5 h-3.5 text-gray-400" />}
                  error={errors.resignationDate?.message}
                  {...register('resignationDate')}
                />
              </div>

              <div>
                <Input
                  label="Notice Days"
                  type="number"
                  error={errors.noticePeriodDays?.message}
                  {...register('noticePeriodDays', { valueAsNumber: true })}
                />
              </div>

              <div>
                <Input
                  label="Expected LWD"
                  type="date"
                  leftIcon={<Calendar className="w-3.5 h-3.5 text-gray-400" />}
                  error={errors.expectedLastWorkingDay?.message}
                  {...register('expectedLastWorkingDay')}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                Handover Notes & Knowledge Transfer Plan *
              </label>
              <textarea
                {...register('handoverNotes')}
                rows={3}
                placeholder="Detail assigned replacement, ongoing projects, document repositories, and transfer checklist..."
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-[#212121] text-gray-900 dark:text-[#ececec] placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none"
              />
              {errors.handoverNotes?.message && (
                <p className="text-xs text-rose-500 mt-1">{errors.handoverNotes.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                Internal HR Notes (Optional)
              </label>
              <textarea
                {...register('notes')}
                rows={2}
                placeholder="Optional notes visible to HR and management..."
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-[#212121] text-gray-900 dark:text-[#ececec] placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-[#1f1f1f]/50 flex items-center justify-end gap-3 flex-shrink-0">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              isLoading={isLoading}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Initiate Exit Workflow
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
