import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Palmtree, Calendar } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Textarea } from '@/shared/ui/Textarea';
import { useToast } from '@/shared/ui/Toast';
import { useApplyLeaveMutation } from '../api/leaveApi';
import { applyLeaveSchema, type ApplyLeaveFormData } from '../schemas/leave.schemas';
import type { LeaveBalance, LeaveDuration } from '../types/leave.types';

interface ApplyLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  balances?: LeaveBalance[];
}

const DURATION_OPTIONS: { value: LeaveDuration; label: string }[] = [
  { value: 'FULL_DAY', label: 'Full Day' },
  { value: 'HALF_DAY_FIRST_HALF', label: 'Half Day (First Half)' },
  { value: 'HALF_DAY_SECOND_HALF', label: 'Half Day (Second Half)' },
];

export const ApplyLeaveModal: React.FC<ApplyLeaveModalProps> = ({ isOpen, onClose, balances }) => {
  const toast = useToast();
  const [applyLeave, { isLoading }] = useApplyLeaveMutation();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ApplyLeaveFormData>({
    resolver: zodResolver(applyLeaveSchema),
    defaultValues: {
      leaveTypeId: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      duration: 'FULL_DAY',
      reason: '',
      contactDuringLeave: '',
      attachmentUrls: [],
    },
  });

  const watchStartDate = watch('startDate');
  const watchEndDate = watch('endDate');
  const watchDuration = watch('duration');

  const estimatedDays = useMemo(() => {
    if (!watchStartDate || !watchEndDate) return 0;
    const start = new Date(watchStartDate);
    const end = new Date(watchEndDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) return 0;
    const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return watchDuration === 'FULL_DAY' ? diff : diff * 0.5;
  }, [watchStartDate, watchEndDate, watchDuration]);

  if (!isOpen) return null;

  const onSubmit = async (data: ApplyLeaveFormData) => {
    try {
      await applyLeave({
        ...data,
        contactDuringLeave: data.contactDuringLeave || undefined,
      }).unwrap();
      toast.success('Leave application submitted for approval!', 'Request Created');
      reset();
      onClose();
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.data?.detail || 'Failed to submit leave application. Please check inputs and try again.',
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
        className="w-full max-w-2xl bg-white dark:bg-[#171717] rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-labelledby="apply-leave-headline"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between shrink-0 bg-gray-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-sm shadow-emerald-500/20">
              <div className="w-full h-full bg-white dark:bg-[#171717] rounded-[10px] flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Palmtree className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 id="apply-leave-headline" className="text-base sm:text-lg font-bold text-gray-900 dark:text-[#ececec]">
                Apply for Leave
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Submit a time-off request routed to your reporting manager
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

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Leave Type + Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="w-full space-y-1.5">
              <label htmlFor="leaveTypeId" className="block text-xs font-semibold text-gray-900 dark:text-[#ececec]">
                Leave Type
              </label>
              <select
                id="leaveTypeId"
                {...register('leaveTypeId')}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              >
                <option value="">Select leave type...</option>
                {(balances || []).map((balance) => (
                  <option key={balance.leaveTypeId} value={balance.leaveTypeId}>
                    {balance.leaveTypeName} ({balance.availableDays} days left)
                  </option>
                ))}
              </select>
              {errors.leaveTypeId && (
                <p className="text-xs text-rose-600 dark:text-rose-400">{errors.leaveTypeId.message}</p>
              )}
            </div>

            <div className="w-full space-y-1.5">
              <label htmlFor="duration" className="block text-xs font-semibold text-gray-900 dark:text-[#ececec]">
                Duration
              </label>
              <select
                id="duration"
                {...register('duration')}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              >
                {DURATION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.duration && (
                <p className="text-xs text-rose-600 dark:text-rose-400">{errors.duration.message}</p>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Start Date"
              type="date"
              leftIcon={<Calendar className="w-4 h-4" />}
              error={errors.startDate?.message}
              {...register('startDate')}
            />
            <Input
              label="End Date"
              type="date"
              leftIcon={<Calendar className="w-4 h-4" />}
              error={errors.endDate?.message}
              {...register('endDate')}
            />
          </div>

          {/* Live day estimate */}
          <div className="p-3.5 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300 flex items-center justify-between">
            <span>Estimated deduction</span>
            <span className="font-bold text-sm">
              {estimatedDays} {estimatedDays === 1 ? 'day' : 'days'}
            </span>
          </div>

          {/* Reason */}
          <div className="w-full space-y-1.5">
            <label htmlFor="reason" className="block text-xs font-semibold text-gray-900 dark:text-[#ececec]">
              Reason for Leave
            </label>
            <Textarea
              id="reason"
              rows={3}
              placeholder="Describe the purpose of this leave for your approver..."
              {...register('reason')}
            />
            {errors.reason && (
              <p className="text-xs text-rose-600 dark:text-rose-400">{errors.reason.message}</p>
            )}
          </div>

          {/* Emergency Contact */}
          <Input
            label="Emergency Contact During Leave (optional)"
            placeholder="Phone number or email reachable while away"
            error={errors.contactDuringLeave?.message}
            {...register('contactDuringLeave')}
          />

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-100 dark:border-zinc-800">
            <Button type="button" variant="ghost" size="sm" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isLoading}
              disabled={isLoading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Submit Leave Request
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeaveModal;
