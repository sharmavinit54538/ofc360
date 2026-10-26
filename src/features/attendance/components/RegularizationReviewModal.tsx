import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, CheckCircle2, XCircle, FileEdit, Calendar, User } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Textarea } from '@/shared/ui/Textarea';
import { useToast } from '@/shared/ui/Toast';
import { useReviewRegularizationMutation } from '../api/attendanceApi';
import {
  reviewRegularizationSchema,
  type ReviewRegularizationFormData,
} from '../schemas/attendance.schemas';
import type { RegularizationRequest } from '../types/attendance.types';

interface RegularizationReviewModalProps {
  request: RegularizationRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

const CORRECTION_LABELS: Record<string, string> = {
  MISSED_PUNCH_IN: 'Missed Punch In',
  MISSED_PUNCH_OUT: 'Missed Punch Out',
  BOTH: 'Both Punches',
  ON_DUTY: 'On-Duty Full Day',
};

export const RegularizationReviewModal: React.FC<RegularizationReviewModalProps> = ({
  request,
  isOpen,
  onClose,
}) => {
  const toast = useToast();
  const [reviewRegularization, { isLoading }] = useReviewRegularizationMutation();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ReviewRegularizationFormData>({
    resolver: zodResolver(reviewRegularizationSchema),
    defaultValues: {
      id: '',
      status: 'APPROVED',
      approverComment: '',
    },
  });

  useEffect(() => {
    if (request) {
      reset({ id: request.id, status: 'APPROVED', approverComment: '' });
    }
  }, [request, reset]);

  const watchStatus = watch('status');

  if (!isOpen || !request) return null;

  const onSubmit = async (data: ReviewRegularizationFormData) => {
    try {
      await reviewRegularization({
        id: data.id,
        status: data.status,
        approverComment: data.approverComment || undefined,
      }).unwrap();
      toast.success(
        data.status === 'APPROVED'
          ? 'Regularization approved — attendance record corrected.'
          : 'Regularization request rejected.',
        data.status === 'APPROVED' ? 'Request Approved' : 'Request Rejected'
      );
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to review regularization request.', 'Action Error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
      <div
        className="w-full max-w-lg bg-white dark:bg-[#171717] rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden max-h-[90dvh] flex flex-col animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-labelledby="regularize-review-headline"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between bg-gray-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <FileEdit className="w-5 h-5" />
            </div>
            <div>
              <h2 id="regularize-review-headline" className="text-base font-bold text-gray-900 dark:text-[#ececec]">
                Review Regularization
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Request ID {request.id}
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

        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 min-h-0">
          {/* Summary */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-900/60 border border-gray-100 dark:border-zinc-800">
              <span className="text-gray-400 dark:text-zinc-500 mb-1 flex items-center gap-1">
                <User className="w-3 h-3" /> Employee
              </span>
              <span className="font-semibold text-gray-900 dark:text-[#ececec]">
                {request.employee?.name || 'Employee'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-900/60 border border-gray-100 dark:border-zinc-800">
              <span className="text-gray-400 dark:text-zinc-500 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Date & Correction
              </span>
              <span className="font-semibold text-gray-900 dark:text-[#ececec]">
                {new Date(request.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </span>
              <span className="block text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5">
                {CORRECTION_LABELS[request.correctionType] || request.correctionType}
                {request.requestedCheckIn ? ` • In ${request.requestedCheckIn}` : ''}
                {request.requestedCheckOut ? ` • Out ${request.requestedCheckOut}` : ''}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-900/60 border border-gray-100 dark:border-zinc-800">
            <span className="text-[11px] text-gray-400 dark:text-zinc-500 uppercase tracking-wider font-semibold">
              Employee's reason
            </span>
            <p className="text-xs text-gray-700 dark:text-zinc-300 mt-1 leading-relaxed">
              {request.reason}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Decision toggle */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setValue('status', 'APPROVED', { shouldValidate: true })}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                  watchStatus === 'APPROVED'
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                    : 'border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-400 hover:border-emerald-500/50'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                Approve
              </button>
              <button
                type="button"
                onClick={() => setValue('status', 'REJECTED', { shouldValidate: true })}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                  watchStatus === 'REJECTED'
                    ? 'bg-rose-600 border-rose-600 text-white shadow-sm'
                    : 'border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-400 hover:border-rose-500/50'
                }`}
              >
                <XCircle className="w-4 h-4" />
                Reject
              </button>
            </div>

            <div className="w-full space-y-1.5">
              <label htmlFor="approverComment" className="block text-xs font-semibold text-gray-900 dark:text-[#ececec]">
                {watchStatus === 'REJECTED' ? 'Rejection Comment (required)' : 'Comment (optional)'}
              </label>
              <Textarea
                id="approverComment"
                rows={3}
                placeholder={
                  watchStatus === 'REJECTED'
                    ? 'Explain why this correction cannot be approved...'
                    : 'Add a note for the employee...'
                }
                {...register('approverComment')}
              />
              {errors.approverComment && (
                <p className="text-xs text-rose-600 dark:text-rose-400">{errors.approverComment.message}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100 dark:border-zinc-800">
              <Button type="button" variant="ghost" size="sm" onClick={onClose}>
                Close
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isLoading}
                disabled={isLoading}
                className={
                  watchStatus === 'REJECTED'
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }
              >
                {watchStatus === 'REJECTED' ? 'Confirm Rejection' : 'Confirm Approval'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegularizationReviewModal;
