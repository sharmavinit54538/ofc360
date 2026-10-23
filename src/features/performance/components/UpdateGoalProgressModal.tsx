import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, TrendingUp } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Textarea } from '@/shared/ui/Textarea';
import { useToast } from '@/shared/ui/Toast';
import { useUpdateGoalProgressMutation } from '../api/performanceApi';
import {
  updateGoalProgressSchema,
  type UpdateGoalProgressFormData,
} from '../schemas/performance.schemas';
import type { GoalItem } from '../types/performance.types';

interface UpdateGoalProgressModalProps {
  goal: GoalItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const UpdateGoalProgressModal: React.FC<UpdateGoalProgressModalProps> = ({
  goal,
  isOpen,
  onClose,
}) => {
  const toast = useToast();
  const [updateProgress, { isLoading: isSaving }] = useUpdateGoalProgressMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateGoalProgressFormData>({
    resolver: zodResolver(updateGoalProgressSchema),
    defaultValues: { currentValue: undefined, notes: '' },
  });

  useEffect(() => {
    if (goal && isOpen) {
      reset({ currentValue: goal.currentValue, notes: '' });
    }
  }, [goal, isOpen, reset]);

  if (!isOpen || !goal) return null;

  const onSubmit = async (data: UpdateGoalProgressFormData) => {
    try {
      await updateProgress({
        id: goal.id,
        currentValue: Number(data.currentValue),
        notes: data.notes || undefined,
      }).unwrap();
      toast.success(`Progress updated for "${goal.title}".`, 'Progress Saved');
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update goal progress.', 'Save Error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
      <div
        className="w-full max-w-md bg-white dark:bg-[#171717] rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-labelledby="update-goal-progress-headline"
      >
        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between bg-gray-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 id="update-goal-progress-headline" className="text-base font-bold text-gray-900 dark:text-[#ececec]">
                Update Progress
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400 truncate max-w-[260px]">
                {goal.title}
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
          <div className="rounded-xl bg-gray-50 dark:bg-zinc-900/60 border border-gray-100 dark:border-zinc-800 p-3.5 text-xs text-gray-600 dark:text-zinc-300">
            Current: <span className="font-semibold">{goal.currentValue}</span>
            {' '}of target <span className="font-semibold">{goal.targetValue}</span>
            {' '}({Math.round(goal.progressPercentage)}% complete)
          </div>

          <Input
            label="New Current Value"
            type="number"
            step="0.1"
            min="0"
            placeholder="Enter the updated progress value"
            error={errors.currentValue?.message}
            {...register('currentValue')}
          />

          <div className="space-y-1.5">
            <label htmlFor="goal-progress-notes" className="text-xs font-semibold text-gray-900 dark:text-[#ececec]">
              Progress Notes
            </label>
            <Textarea
              id="goal-progress-notes"
              rows={3}
              placeholder="What moved since the last update? Blockers, wins, next steps (optional)..."
              error={Boolean(errors.notes)}
              {...register('notes')}
            />
            {errors.notes?.message && (
              <p className="text-xs text-rose-500">{errors.notes.message}</p>
            )}
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
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Save Progress
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateGoalProgressModal;
