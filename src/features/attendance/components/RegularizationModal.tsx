import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, FileEdit, Calendar, Clock } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Textarea } from '@/shared/ui/Textarea';
import { useToast } from '@/shared/ui/Toast';
import { useApplyRegularizationMutation } from '../api/attendanceApi';
import {
  applyRegularizationSchema,
  type ApplyRegularizationFormData,
} from '../schemas/attendance.schemas';
import type { AttendanceRecord, RegularizationCorrectionType } from '../types/attendance.types';

interface RegularizationModalProps {
  record: AttendanceRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

const CORRECTION_TYPES: { value: RegularizationCorrectionType; label: string }[] = [
  { value: 'MISSED_PUNCH_IN', label: 'Missed Punch In' },
  { value: 'MISSED_PUNCH_OUT', label: 'Missed Punch Out' },
  { value: 'BOTH', label: 'Both Punches Missing' },
  { value: 'ON_DUTY', label: 'On-Duty / Outdoor (Full Day)' },
];

export const RegularizationModal: React.FC<RegularizationModalProps> = ({ record, isOpen, onClose }) => {
  const toast = useToast();
  const [applyRegularization, { isLoading }] = useApplyRegularizationMutation();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ApplyRegularizationFormData>({
    resolver: zodResolver(applyRegularizationSchema),
    defaultValues: {
      attendanceRecordId: '',
      date: new Date().toISOString().split('T')[0],
      correctionType: 'BOTH',
      requestedCheckIn: '',
      requestedCheckOut: '',
      reason: '',
    },
  });

  useEffect(() => {
    if (record) {
      reset({
        attendanceRecordId: record.id,
        date: record.date,
        correctionType: !record.punchIn && !record.punchOut ? 'BOTH' : !record.punchIn ? 'MISSED_PUNCH_IN' : 'MISSED_PUNCH_OUT',
        requestedCheckIn: '',
        requestedCheckOut: '',
        reason: '',
      });
    }
  }, [record, reset]);

  const watchCorrectionType = watch('correctionType');
  const showCheckIn = watchCorrectionType === 'MISSED_PUNCH_IN' || watchCorrectionType === 'BOTH';
  const showCheckOut = watchCorrectionType === 'MISSED_PUNCH_OUT' || watchCorrectionType === 'BOTH';

  if (!isOpen || !record) return null;

  const onSubmit = async (data: ApplyRegularizationFormData) => {
    try {
      await applyRegularization({
        ...data,
        requestedCheckIn: data.requestedCheckIn || undefined,
        requestedCheckOut: data.requestedCheckOut || undefined,
      }).unwrap();
      toast.success('Regularization request submitted for manager approval.', 'Request Created');
      reset();
      onClose();
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.data?.detail || 'Failed to submit regularization request.',
        'Submission Error'
      );
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
      <div
        className="w-full max-w-lg bg-white dark:bg-[#171717] rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-labelledby="regularize-headline"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between bg-gray-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <FileEdit className="w-5 h-5" />
            </div>
            <div>
              <h2 id="regularize-headline" className="text-base font-bold text-gray-900 dark:text-[#ececec]">
                Attendance Regularization
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Correct missed punches with manager approval
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

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Attendance Date"
              type="date"
              leftIcon={<Calendar className="w-4 h-4" />}
              error={errors.date?.message}
              {...register('date')}
            />

            <div className="w-full space-y-1.5">
              <label htmlFor="correctionType" className="block text-xs font-semibold text-gray-900 dark:text-[#ececec]">
                Correction Type
              </label>
              <select
                id="correctionType"
                {...register('correctionType')}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                {CORRECTION_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.correctionType && (
                <p className="text-xs text-rose-600 dark:text-rose-400">{errors.correctionType.message}</p>
              )}
            </div>
          </div>

          {(showCheckIn || showCheckOut) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {showCheckIn && (
                <Input
                  label="Requested Check-In"
                  type="time"
                  leftIcon={<Clock className="w-4 h-4" />}
                  error={errors.requestedCheckIn?.message}
                  {...register('requestedCheckIn')}
                />
              )}
              {showCheckOut && (
                <Input
                  label="Requested Check-Out"
                  type="time"
                  leftIcon={<Clock className="w-4 h-4" />}
                  error={errors.requestedCheckOut?.message}
                  {...register('requestedCheckOut')}
                />
              )}
            </div>
          )}

          <div className="w-full space-y-1.5">
            <label htmlFor="reason" className="block text-xs font-semibold text-gray-900 dark:text-[#ececec]">
              Reason for Correction
            </label>
            <Textarea
              id="reason"
              rows={3}
              placeholder="Explain why the punch was missed (e.g. biometric failure, client visit, network outage)..."
              {...register('reason')}
            />
            {errors.reason && (
              <p className="text-xs text-rose-600 dark:text-rose-400">{errors.reason.message}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100 dark:border-zinc-800">
            <Button type="button" variant="ghost" size="sm" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isLoading}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Submit Request
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegularizationModal;
