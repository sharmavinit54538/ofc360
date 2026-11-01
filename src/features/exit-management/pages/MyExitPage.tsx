import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  UserMinus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  FileText,
  User,
  Building,
  Briefcase,
  XCircle,
  HelpCircle,
  ShieldCheck,
  CreditCard,
  Trash2,
} from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Badge } from '@/shared/ui/Badge';
import { ErrorDisplay } from '@/shared/ui/ErrorDisplay';
import { useToast } from '@/shared/ui/Toast';
import {
  useGetMyExitRequestQuery,
  useSubmitResignationMutation,
  useWithdrawMyRequestMutation,
} from '../api/exitsApi';
import {
  resignationFormSchema,
  type ResignationFormValues,
  EXIT_REASONS,
} from '../schemas/exit.schemas';
import type { ExitStage } from '../types/exit.types';

export const MyExitPage: React.FC = () => {
  const toast = useToast();
  const { user } = useAuth();

  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);

  // Queries & Mutations
  const {
    data: myRequest,
    isLoading: isQueryLoading,
    error: queryError,
    refetch,
  } = useGetMyExitRequestQuery();

  const [submitResignation, { isLoading: isSubmitting }] = useSubmitResignationMutation();
  const [withdrawRequest, { isLoading: isWithdrawing }] = useWithdrawMyRequestMutation();

  const todayStr = new Date().toISOString().split('T')[0];
  const defaultLWDStr = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ResignationFormValues>({
    resolver: zodResolver(resignationFormSchema),
    defaultValues: {
      reason: EXIT_REASONS[0],
      comments: '',
      resignationDate: todayStr,
      noticePeriodDays: 30,
      proposedLastWorkingDay: defaultLWDStr,
    },
  });

  const watchNoticeDays = watch('noticePeriodDays', 30);
  const watchResignationDate = watch('resignationDate', todayStr);

  // Auto-calculate proposed LWD when notice period or resignation date changes
  useEffect(() => {
    if (watchResignationDate && watchNoticeDays >= 0) {
      const baseMs = new Date(watchResignationDate).getTime();
      if (!isNaN(baseMs)) {
        const calculatedLwdMs = baseMs + watchNoticeDays * 24 * 60 * 60 * 1000;
        const calculatedStr = new Date(calculatedLwdMs).toISOString().split('T')[0];
        setValue('proposedLastWorkingDay', calculatedStr);
      }
    }
  }, [watchNoticeDays, watchResignationDate, setValue]);

  const hasActiveRequest =
    Boolean(myRequest) &&
    myRequest?.exitStatus !== 'WITHDRAWN' &&
    myRequest?.exitStatus !== 'REJECTED' &&
    myRequest?.stage !== 'WITHDRAWN' &&
    myRequest?.stage !== 'REJECTED';

  const onSubmit = async (values: ResignationFormValues) => {
    try {
      await submitResignation(values).unwrap();
      toast.success(
        'Your resignation request has been formally submitted and routed to your manager for review.',
        'Resignation Submitted'
      );
      reset();
    } catch (err: any) {
      toast.error(
        err?.data?.detail || err?.data?.message || 'Failed to submit resignation request. Please check inputs and try again.',
        'Submission Error'
      );
    }
  };

  const handleWithdrawConfirm = async () => {
    try {
      await withdrawRequest().unwrap();
      toast.success('Your resignation request has been successfully withdrawn.', 'Request Withdrawn');
      setIsWithdrawDialogOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(
        err?.data?.detail || err?.data?.message || 'Failed to withdraw resignation request.',
        'Action Error'
      );
    }
  };

  if (isQueryLoading) {
    return (
      <div className="space-y-6 animate-pulse p-4">
        <div className="h-20 bg-gray-200 dark:bg-zinc-800 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-100 dark:bg-zinc-900 rounded-2xl" />
          <div className="h-64 bg-gray-100 dark:bg-zinc-900 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (queryError) {
    return (
      <ErrorDisplay
        title="Unable to load exit status"
        error={queryError}
        onRetry={refetch}
      />
    );
  }

  // STAGE PROGRESS LADDER
  const progressStages: { key: ExitStage; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'RESIGNATION_SUBMITTED', label: 'Submitted', icon: FileText },
    { key: 'MANAGER_REVIEW', label: 'Manager Review', icon: Clock },
    { key: 'HR_REVIEW', label: 'HR Review', icon: CheckCircle2 },
    { key: 'NOTICE_PERIOD', label: 'Notice Period', icon: Calendar },
    { key: 'CLEARANCE_PENDING', label: 'Clearances', icon: ShieldCheck },
    { key: 'FNF_SETTLEMENT', label: 'F&F Settlement', icon: CreditCard },
    { key: 'COMPLETED', label: 'Exit Completed', icon: CheckCircle2 },
  ];

  const currentStageIndex = myRequest
    ? progressStages.findIndex((s) => s.key === myRequest.stage)
    : -1;

  return (
    <div className="space-y-6">
      {/* Informational Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-brand-500/5 to-transparent border border-blue-200/60 dark:border-blue-900/40 flex items-start gap-3">
        <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mt-0.5">
          <UserMinus className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">
            Employee Self-Service (ESS) — Exit &amp; Resignation Center
          </h2>
          <p className="text-xs text-gray-600 dark:text-zinc-300 mt-0.5">
            Submit your voluntary resignation, track real-time manager &amp; HR approval milestones, monitor your notice period, and inspect departmental clearances.
          </p>
        </div>
      </div>

      {/* Active Request Guard / Summary */}
      {hasActiveRequest && myRequest ? (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-zinc-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 font-bold border border-brand-200 dark:border-brand-900/40">
                    {myRequest.caseNumber}
                  </span>
                  <Badge variant="brand" size="sm">
                    {myRequest.stage.replace(/_/g, ' ')}
                  </Badge>
                  <Badge
                    variant={myRequest.exitStatus === 'COMPLETED' ? 'success' : 'warning'}
                    size="sm"
                  >
                    Status: {myRequest.exitStatus}
                  </Badge>
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mt-2">
                  Active Resignation Case In Progress
                </h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400">
                  Submitted on {new Date(myRequest.resignationDate).toLocaleDateString()} &bull; Expected Last Working Day:{' '}
                  {new Date(myRequest.expectedLastWorkingDay).toLocaleDateString()}
                </p>
              </div>

              {myRequest.stage === 'RESIGNATION_SUBMITTED' || myRequest.stage === 'MANAGER_REVIEW' ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsWithdrawDialogOpen(true)}
                  className="text-xs gap-1.5 text-rose-600 border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Withdraw Resignation</span>
                </Button>
              ) : null}
            </div>

            {/* Workflow Progress Steps */}
            <div>
              <h4 className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-4">
                Offboarding Milestone Ladder
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {progressStages.map((step, idx) => {
                  const StepIcon = step.icon;
                  const isDone = currentStageIndex > idx;
                  const isCurrent = currentStageIndex === idx;

                  let stepColor = 'bg-gray-50 dark:bg-zinc-900 text-gray-400 border-gray-200 dark:border-zinc-800';
                  if (isDone) {
                    stepColor = 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
                  } else if (isCurrent) {
                    stepColor = 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/40 font-bold';
                  }

                  return (
                    <div
                      key={step.key}
                      className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 ${stepColor}`}
                    >
                      <StepIcon className="w-4 h-4" />
                      <span className="text-[11px] leading-tight">{step.label}</span>
                      {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Request Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100 dark:border-zinc-800 text-xs">
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-900">
                <span className="text-gray-400 block mb-0.5">Primary Reason</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{myRequest.reason}</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-900">
                <span className="text-gray-400 block mb-0.5">Manager Approval</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {myRequest.managerApproval.status}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-900">
                <span className="text-gray-400 block mb-0.5">HR Approval</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {myRequest.hrApproval.status}
                </span>
              </div>
            </div>

            {myRequest.comments && (
              <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-zinc-900 text-xs">
                <span className="text-gray-400 block mb-1">Your Submission Comments:</span>
                <p className="text-gray-700 dark:text-zinc-300 italic">&ldquo;{myRequest.comments}&rdquo;</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* New Resignation Form */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Read-Only Employee Profile Details */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <User className="w-4 h-4 text-brand-500" />
              <span>Employee Information</span>
            </h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400">
              These details are verified from your active employment record.
            </p>

            <div className="space-y-3 text-xs divide-y divide-gray-100 dark:divide-zinc-800">
              <div className="pt-2">
                <span className="text-gray-400 block">Full Name</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {user?.fullName || (user ? `${user.firstName} ${user.lastName}` : 'Current Employee')}
                </span>
              </div>
              <div className="pt-2">
                <span className="text-gray-400 block">Employee ID</span>
                <span className="font-mono font-semibold text-gray-800 dark:text-gray-200">
                  {user?.id || 'EMP-ACTIVE'}
                </span>
              </div>
              <div className="pt-2">
                <span className="text-gray-400 block">Department</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {user?.department || 'Engineering'}
                </span>
              </div>
              <div className="pt-2">
                <span className="text-gray-400 block">Designation</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {user?.jobTitle || 'Software Engineer'}
                </span>
              </div>
              <div className="pt-2">
                <span className="text-gray-400 block">Reporting Manager</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  Direct Manager
                </span>
              </div>
            </div>
          </div>

          {/* Editable Resignation Form */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm space-y-5">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                Submit Resignation Notice
              </h3>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Complete the fields below to initiate your formal separation process.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Reason */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                  Primary Reason for Leaving *
                </label>
                <select
                  {...register('reason')}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-[#ececec] focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors cursor-pointer"
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

              {/* Dates Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                    Resignation Date *
                  </label>
                  <Input
                    type="date"
                    {...register('resignationDate')}
                    className="text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                    Notice Period (Days) *
                  </label>
                  <Input
                    type="number"
                    min={0}
                    {...register('noticePeriodDays', { valueAsNumber: true })}
                    className="text-xs"
                  />
                  {errors.noticePeriodDays && (
                    <p className="mt-1 text-xs text-rose-500 font-medium">
                      {errors.noticePeriodDays.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                    Proposed Last Working Day *
                  </label>
                  <Input
                    type="date"
                    {...register('proposedLastWorkingDay')}
                    className="text-xs"
                  />
                  {errors.proposedLastWorkingDay && (
                    <p className="mt-1 text-xs text-rose-500 font-medium">
                      {errors.proposedLastWorkingDay.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Comments */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                  Detailed Comments &amp; Handover Intent * (min 10 characters)
                </label>
                <textarea
                  rows={4}
                  {...register('comments')}
                  placeholder="Explain your decision, transition readiness, or handover notes..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-[#ececec] placeholder-gray-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors resize-none"
                />
                {errors.comments && (
                  <p className="mt-1 text-xs text-rose-500 font-medium">{errors.comments.message}</p>
                )}
              </div>

              {/* Supporting Document Info (Honest API Gap) */}
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-gray-500 dark:text-zinc-400">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span>Supporting Documents (e.g. Higher studies offer, medical certificate)</span>
                </div>
                <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200/60 dark:border-amber-900/40" title="Backend multipart attachment endpoint pending">
                  Backend Pending
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSubmitting}
                  className="text-xs bg-rose-600 hover:bg-rose-700 text-white"
                >
                  {isSubmitting ? 'Submitting Resignation...' : 'Formally Submit Resignation'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Resignation Withdrawal */}
      {isWithdrawDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
          <div
            className="w-full max-w-md bg-white dark:bg-[#171717] rounded-3xl border border-gray-200 dark:border-zinc-800 p-6 shadow-2xl space-y-4"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-900 dark:text-[#ececec]">
                  Withdraw Resignation Request?
                </h4>
                <p className="text-xs text-gray-500 dark:text-zinc-400">
                  Case Number: {myRequest?.caseNumber}
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-600 dark:text-zinc-300">
              Are you sure you want to withdraw your resignation? This will cancel the separation workflow and reinstate your active employment status.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsWithdrawDialogOpen(false)}
                disabled={isWithdrawing}
                className="text-xs"
              >
                Keep Active
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleWithdrawConfirm}
                disabled={isWithdrawing}
                className="text-xs bg-rose-600 hover:bg-rose-700 text-white"
              >
                {isWithdrawing ? 'Withdrawing...' : 'Yes, Withdraw Resignation'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyExitPage;
