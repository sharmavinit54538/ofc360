import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, CheckCircle2, XCircle, Palmtree, Calendar, User } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Textarea } from '@/shared/ui/Textarea';
import { useToast } from '@/shared/ui/Toast';
import { useUpdateLeaveStatusMutation } from '../api/leaveApi';
import { leaveApprovalSchema, type LeaveApprovalFormData } from '../schemas/leave.schemas';
import type { LeaveRequest } from '../types/leave.types';

interface LeaveApprovalModalProps {
  request: LeaveRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export const LeaveApprovalModal: React.FC<LeaveApprovalModalProps> = ({ request, isOpen, onClose }) => {
  const toast = useToast();
  const [updateLeaveStatus, { isLoading }] = useUpdateLeaveStatusMutation();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<LeaveApprovalFormData>({
    resolver: zodResolver(leaveApprovalSchema),
    defaultValues: {
      id: '',
      status: 'APPROVED',
      comments: '',
    },
  });

  useEffect(() => {
    if (request) {
      reset({ id: request.id, status: 'APPROVED', comments: '' });
    }
  }, [request, reset]);

  const watchStatus = watch('status');

  if (!isOpen || !request) return null;

  const onSubmit = async (data: LeaveApprovalFormData) => {
    try {
      await updateLeaveStatus({
        id: data.id,
        status: data.status,
        comments: data.comments || undefined,
      }).unwrap();
      toast.success(
        data.status === 'APPROVED'
          ? `Leave request approved for ${request.employee?.name}.`
          : `Leave request rejected for ${request.employee?.name}.`,
        data.status === 'APPROVED' ? 'Request Approved' : 'Request Rejected'
      );
      onClose();
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.data?.detail || 'Failed to update leave request status.',
        'Action Error'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
      <div
        className="w-full max-w-lg bg-white dark:bg-[#171717] rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-labelledby="leave-approval-headline"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between bg-gray-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Palmtree className="w-5 h-5" />
            </div>
            <div>
              <h2 id="leave-approval-headline" className="text-base font-bold text-gray-900 dark:text-[#ececec]">
                Review Leave Request
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                {request.requestNumber || request.id}
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

        {/* Request summary */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-900/60 border border-gray-100 dark:border-zinc-800">
              <span className="text-gray-400 dark:text-zinc-500 block mb-1 flex items-center gap-1">
                <User className="w-3 h-3" /> Employee
              </span>
              <span className="font-semibold text-gray-900 dark:text-[#ececec]">
                {request.employee?.name}
              </span>
              <span className="block text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5">
                {request.employee?.department || request.employee?.email}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-900/60 border border-gray-100 dark:border-zinc-800">
              <span className="text-gray-400 dark:text-zinc-500 block mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Duration
              </span>
              <span className="font-semibold text-gray-900 dark:text-[#ececec]">
                {formatDate(request.startDate)} – {formatDate(request.endDate)}
              </span>
              <span className="block text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5">
                {request.totalDays} {request.totalDays === 1 ? 'day' : 'days'} • {request.leaveType?.name}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-900/60 border border-gray-100 dark:border-zinc-800">
            <span className="text-[11px] text-gray-400 dark:text-zinc-500 uppercase tracking-wider font-semibold">
              Reason shared by employee
            </span>
            <p className="text-xs text-gray-700 dark:text-zinc-300 mt-1 leading-relaxed">
              {request.reason}
            </p>
          </div>

          {request.status !== 'PENDING' && (
            <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300">
              This request has already been {request.status.toLowerCase()}
              {request.approver?.name ? ` by ${request.approver.name}` : ''}.
              {request.approverComments ? ` Comment: ${request.approverComments}` : ''}
            </div>
          )}

          {/* Decision form — only for pending requests */}
          {request.status === 'PENDING' && (
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
                <label htmlFor="comments" className="block text-xs font-semibold text-gray-900 dark:text-[#ececec]">
                  {watchStatus === 'REJECTED' ? 'Rejection Reason (required)' : 'Comments (optional)'}
                </label>
                <Textarea
                  id="comments"
                  rows={3}
                  placeholder={
                    watchStatus === 'REJECTED'
                      ? 'Explain why this leave request cannot be approved...'
                      : 'Add a note for the employee...'
                  }
                  {...register('comments')}
                />
                {errors.comments && (
                  <p className="text-xs text-rose-600 dark:text-rose-400">{errors.comments.message}</p>
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
          )}

          {request.status !== 'PENDING' && (
            <div className="flex items-center justify-end pt-3 border-t border-gray-100 dark:border-zinc-800">
              <Button type="button" variant="ghost" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveApprovalModal;
