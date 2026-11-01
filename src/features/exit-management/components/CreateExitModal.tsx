import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, UserMinus, Calendar } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { useToast } from '@/shared/ui/Toast';
import { useSubmitResignationMutation } from '../api/exitsApi';
import { resignationFormSchema, type ResignationFormValues, EXIT_REASONS } from '../schemas/exit.schemas';

interface CreateExitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateExitModal: React.FC<CreateExitModalProps> = ({ isOpen, onClose }) => {
  const toast = useToast();
  const [submitResignation, { isLoading }] = useSubmitResignationMutation();

  const todayStr = new Date().toISOString().split('T')[0];
  const defaultLWDStr = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResignationFormValues>({
    resolver: zodResolver(resignationFormSchema),
    defaultValues: {
      reason: EXIT_REASONS[0],
      comments: '',
      resignationDate: todayStr,
      proposedLastWorkingDay: defaultLWDStr,
      noticePeriodDays: 30,
    },
  });

  if (!isOpen) return null;

  const onSubmit = async (data: ResignationFormValues) => {
    try {
      await submitResignation(data).unwrap();
      toast.success('Exit case initiated successfully!', 'Offboarding Initiated');
      reset();
      onClose();
    } catch (err: any) {
      toast.error(
        err?.data?.detail || err?.data?.message || 'Failed to initiate exit case. Please check inputs and try again.',
        'Submission Error'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
      <div
        className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/40">
              <UserMinus className="w-5 h-5" />
            </div>
            <div>
              <h3 id="modal-title" className="text-base font-semibold text-gray-900 dark:text-[#ececec]">
                Initiate Employee Exit Case
              </h3>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Submit a new exit or resignation request for workflow approval
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 overflow-y-auto space-y-4">
          {/* Reason */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
              Primary Reason for Departure *
            </label>
            <select
              {...register('reason')}
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#212121] text-gray-900 dark:text-[#ececec] focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
            >
              {EXIT_REASONS.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
            {errors.reason && (
              <p className="mt-1 text-xs text-rose-500 font-medium">{errors.reason.message}</p>
            )}
          </div>

          {/* Dates & Notice Period Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                Resignation Date
              </label>
              <div className="relative">
                <Input
                  type="date"
                  {...register('resignationDate')}
                  className="w-full text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                Notice Period (Days) *
              </label>
              <Input
                type="number"
                {...register('noticePeriodDays', { valueAsNumber: true })}
                className="w-full text-xs"
                min={0}
              />
              {errors.noticePeriodDays && (
                <p className="mt-1 text-xs text-rose-500 font-medium">
                  {errors.noticePeriodDays.message}
                </p>
              )}
            </div>
          </div>

          {/* Proposed Last Working Day */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
              Proposed Last Working Day *
            </label>
            <Input
              type="date"
              {...register('proposedLastWorkingDay')}
              className="w-full text-xs"
            />
            {errors.proposedLastWorkingDay && (
              <p className="mt-1 text-xs text-rose-500 font-medium">
                {errors.proposedLastWorkingDay.message}
              </p>
            )}
          </div>

          {/* Detailed Comments */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
              Detailed Comments & Notes *
            </label>
            <textarea
              {...register('comments')}
              rows={3}
              placeholder="State context, knowledge handover arrangements, or project notes..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#212121] text-gray-900 dark:text-[#ececec] placeholder-gray-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors resize-none"
            />
            {errors.comments && (
              <p className="mt-1 text-xs text-rose-500 font-medium">{errors.comments.message}</p>
            )}
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isLoading}
              className="text-xs bg-rose-600 hover:bg-rose-700 text-white"
            >
              {isLoading ? 'Initiating...' : 'Submit Exit Case'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
