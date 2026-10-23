import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Target } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Textarea } from '@/shared/ui/Textarea';
import { useToast } from '@/shared/ui/Toast';
import { useCreateGoalMutation } from '../api/performanceApi';
import { createGoalSchema, type CreateGoalFormData } from '../schemas/performance.schemas';

interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SELECT_CLASSES =
  'w-full px-3 py-2 rounded-lg text-sm border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent';

export const CreateGoalModal: React.FC<CreateGoalModalProps> = ({ isOpen, onClose }) => {
  const toast = useToast();
  const [createGoal, { isLoading: isCreating }] = useCreateGoalMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateGoalFormData>({
    resolver: zodResolver(createGoalSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'INDIVIDUAL',
      metricType: 'PERCENTAGE',
      targetValue: undefined,
      priority: 'MEDIUM',
      targetDate: '',
      assigneeId: '',
    },
  });

  if (!isOpen) return null;

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: CreateGoalFormData) => {
    try {
      await createGoal({
        title: data.title,
        description: data.description || undefined,
        category: data.category,
        metricType: data.metricType,
        targetValue: Number(data.targetValue),
        priority: data.priority,
        targetDate: data.targetDate,
        assigneeId: data.assigneeId || undefined,
      }).unwrap();
      toast.success(`Goal "${data.title}" created successfully.`, 'Goal Created');
      handleClose();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to create the goal.', 'Save Error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
      <div
        className="w-full max-w-lg bg-white dark:bg-[#171717] rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-goal-headline"
      >
        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between bg-gray-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 id="create-goal-headline" className="text-base font-bold text-gray-900 dark:text-[#ececec]">
                Create New Goal
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Define a measurable objective with a target date
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <Input
            label="Goal Title"
            placeholder="e.g. Increase monthly active users by 20%"
            error={errors.title?.message}
            {...register('title')}
          />

          <div className="space-y-1.5">
            <label htmlFor="goal-description" className="text-xs font-semibold text-gray-900 dark:text-[#ececec]">
              Description
            </label>
            <Textarea
              id="goal-description"
              rows={2}
              placeholder="Context, key results, and alignment notes (optional)..."
              error={Boolean(errors.description)}
              {...register('description')}
            />
            {errors.description?.message && (
              <p className="text-xs text-rose-500">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="goal-category" className="text-xs font-semibold text-gray-900 dark:text-[#ececec]">
                Category
              </label>
              <select id="goal-category" className={SELECT_CLASSES} {...register('category')}>
                <option value="INDIVIDUAL">Individual</option>
                <option value="DEPARTMENTAL">Departmental</option>
                <option value="ORGANIZATIONAL">Organizational</option>
                <option value="TECHNICAL">Technical</option>
              </select>
              {errors.category?.message && (
                <p className="text-xs text-rose-500">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="goal-priority" className="text-xs font-semibold text-gray-900 dark:text-[#ececec]">
                Priority
              </label>
              <select id="goal-priority" className={SELECT_CLASSES} {...register('priority')}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
              {errors.priority?.message && (
                <p className="text-xs text-rose-500">{errors.priority.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="goal-metric" className="text-xs font-semibold text-gray-900 dark:text-[#ececec]">
                Metric Type
              </label>
              <select id="goal-metric" className={SELECT_CLASSES} {...register('metricType')}>
                <option value="PERCENTAGE">Percentage</option>
                <option value="NUMERIC">Numeric</option>
                <option value="BOOLEAN">Boolean (Done / Not Done)</option>
              </select>
              {errors.metricType?.message && (
                <p className="text-xs text-rose-500">{errors.metricType.message}</p>
              )}
            </div>

            <Input
              label="Target Value"
              type="number"
              step="0.1"
              min="0"
              placeholder="e.g. 100"
              error={errors.targetValue?.message}
              {...register('targetValue')}
            />
          </div>

          <Input
            label="Target Date"
            type="date"
            error={errors.targetDate?.message}
            {...register('targetDate')}
          />

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100 dark:border-zinc-800">
            <Button type="button" variant="ghost" size="sm" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isCreating}
              disabled={isCreating}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Create Goal
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGoalModal;
