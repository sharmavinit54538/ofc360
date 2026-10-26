import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Clock } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { useToast } from '@/shared/ui/Toast';
import { useCreateShiftMutation, useUpdateShiftMutation } from '../api/attendanceApi';
import { shiftFormSchema, type ShiftFormData } from '../schemas/attendance.schemas';
import type { ShiftItem } from '../types/attendance.types';

interface ShiftFormModalProps {
  shift: ShiftItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShiftFormModal: React.FC<ShiftFormModalProps> = ({ shift, isOpen, onClose }) => {
  const toast = useToast();
  const isEditMode = Boolean(shift);
  const [createShift, { isLoading: isCreating }] = useCreateShiftMutation();
  const [updateShift, { isLoading: isUpdating }] = useUpdateShiftMutation();
  const isBusy = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ShiftFormData>({
    resolver: zodResolver(shiftFormSchema),
    defaultValues: {
      name: '',
      code: '',
      startTime: '09:00',
      endTime: '18:00',
      gracePeriodMinutes: 15,
      halfDayMinimumHours: 4,
      fullDayMinimumHours: 8,
      isNightShift: false,
      isActive: true,
    },
  });

  useEffect(() => {
    if (shift) {
      reset({
        name: shift.name,
        code: shift.code,
        startTime: shift.startTime,
        endTime: shift.endTime,
        gracePeriodMinutes: shift.gracePeriodMinutes,
        halfDayMinimumHours: shift.halfDayMinimumHours,
        fullDayMinimumHours: shift.fullDayMinimumHours,
        isNightShift: shift.isNightShift,
        isActive: shift.isActive,
      });
    } else {
      reset({
        name: '',
        code: '',
        startTime: '09:00',
        endTime: '18:00',
        gracePeriodMinutes: 15,
        halfDayMinimumHours: 4,
        fullDayMinimumHours: 8,
        isNightShift: false,
        isActive: true,
      });
    }
  }, [shift, reset]);

  const watchNightShift = watch('isNightShift');

  if (!isOpen) return null;

  const onSubmit = async (data: ShiftFormData) => {
    try {
      if (isEditMode && shift) {
        await updateShift({ id: shift.id, data }).unwrap();
        toast.success(`Shift "${data.name}" updated successfully.`, 'Shift Updated');
      } else {
        await createShift(data).unwrap();
        toast.success(`Shift "${data.name}" created successfully.`, 'Shift Created');
      }
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to save shift configuration.', 'Save Error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
      <div
        className="w-full max-w-lg bg-white dark:bg-[#171717] rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden max-h-[90dvh] flex flex-col animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shift-form-headline"
      >
        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between bg-gray-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 id="shift-form-headline" className="text-base font-bold text-gray-900 dark:text-[#ececec]">
                {isEditMode ? 'Edit Shift' : 'Configure New Shift'}
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Timings, grace periods, and minimum hour thresholds
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

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 min-h-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Shift Name"
              placeholder="e.g. Morning General"
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              label="Shift Code"
              placeholder="e.g. GEN-A"
              error={errors.code?.message}
              {...register('code')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Start Time"
              type="time"
              error={errors.startTime?.message}
              {...register('startTime')}
            />
            <Input
              label="End Time"
              type="time"
              error={errors.endTime?.message}
              {...register('endTime')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Grace (mins)"
              type="number"
              min="0"
              max="120"
              error={errors.gracePeriodMinutes?.message}
              {...register('gracePeriodMinutes')}
            />
            <Input
              label="Half-Day Min (hrs)"
              type="number"
              step="0.5"
              min="0"
              max="12"
              error={errors.halfDayMinimumHours?.message}
              {...register('halfDayMinimumHours')}
            />
            <Input
              label="Full-Day Min (hrs)"
              type="number"
              step="0.5"
              min="0"
              max="16"
              error={errors.fullDayMinimumHours?.message}
              {...register('fullDayMinimumHours')}
            />
          </div>

          <label className="flex items-center gap-2.5 text-xs font-semibold text-gray-900 dark:text-[#ececec] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={watchNightShift}
              onChange={(e) => setValue('isNightShift', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            Night shift (crosses midnight)
          </label>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100 dark:border-zinc-800">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isBusy}
              disabled={isBusy}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {isEditMode ? 'Save Changes' : 'Create Shift'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShiftFormModal;
