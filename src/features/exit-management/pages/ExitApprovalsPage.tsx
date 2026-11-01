import React, { useState } from 'react';
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  User,
  Calendar,
  Building,
  Briefcase,
  MessageSquare,
  FileCheck,
  ShieldCheck,
  ArrowRight,
  Info,
} from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { Input } from '@/shared/ui/Input';
import { ErrorDisplay } from '@/shared/ui/ErrorDisplay';
import { useToast } from '@/shared/ui/Toast';
import {
  useGetExitCasesQuery,
  useManagerApproveMutation,
  useManagerRejectMutation,
  useHrApproveMutation,
  useHrRejectMutation,
} from '../api/exitsApi';
import type { ExitCase } from '../types/exit.types';

export const ExitApprovalsPage: React.FC = () => {
  const toast = useToast();
  const { user } = useAuth();
  const userRole = user?.role || 'EMPLOYEE';

  const [activeQueue, setActiveQueue] = useState<'MANAGER' | 'HR'>(
    userRole === 'MANAGER' ? 'MANAGER' : 'HR'
  );

  // Rejection modal state
  const [rejectingCase, setRejectingCase] = useState<ExitCase | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectTargetQueue, setRejectTargetQueue] = useState<'MANAGER' | 'HR'>('MANAGER');

  // Approval comments state
  const [approvalComments, setApprovalComments] = useState<Record<string, string>>({});
  const [revisedLwd, setRevisedLwd] = useState<Record<string, string>>({});

  // RTK Query hooks
  const {
    data: casesResponse,
    isLoading,
    error,
    refetch,
  } = useGetExitCasesQuery();

  const [managerApprove, { isLoading: isMgrApproving }] = useManagerApproveMutation();
  const [managerReject, { isLoading: isMgrRejecting }] = useManagerRejectMutation();
  const [hrApprove, { isLoading: isHrApproving }] = useHrApproveMutation();
  const [hrReject, { isLoading: isHrRejecting }] = useHrRejectMutation();

  const allCases = casesResponse?.items || [];

  // Filter cases for each queue
  const managerQueueCases = allCases.filter(
    (c) =>
      c.stage === 'RESIGNATION_SUBMITTED' ||
      (c.stage === 'MANAGER_REVIEW' && c.managerApproval.status === 'PENDING')
  );

  const hrQueueCases = allCases.filter(
    (c) =>
      c.stage === 'HR_REVIEW' ||
      (c.managerApproval.status === 'APPROVED' && c.hrApproval.status === 'PENDING' && c.stage !== 'COMPLETED' && c.stage !== 'REJECTED')
  );

  const currentCases = activeQueue === 'MANAGER' ? managerQueueCases : hrQueueCases;

  const handleManagerApprove = async (exitCase: ExitCase) => {
    try {
      await managerApprove({
        id: exitCase.id,
        comments: approvalComments[exitCase.id]?.trim() || undefined,
      }).unwrap();

      toast.success(
        `Resignation for ${exitCase.employeeName} approved by Manager and forwarded to HR!`,
        'Manager Approval Recorded'
      );
    } catch (err: any) {
      toast.error(
        err?.data?.detail || err?.data?.message || 'Failed to record manager approval',
        'Action Error'
      );
    }
  };

  const handleHrApprove = async (exitCase: ExitCase) => {
    try {
      await hrApprove({
        id: exitCase.id,
        comments: approvalComments[exitCase.id]?.trim() || undefined,
        lastWorkingDay: revisedLwd[exitCase.id] || undefined,
      }).unwrap();

      toast.success(
        `Exit case for ${exitCase.employeeName} formally approved by HR!`,
        'HR Approval Recorded'
      );
    } catch (err: any) {
      toast.error(
        err?.data?.detail || err?.data?.message || 'Failed to record HR approval',
        'Action Error'
      );
    }
  };

  const handleOpenReject = (exitCase: ExitCase, queue: 'MANAGER' | 'HR') => {
    setRejectingCase(exitCase);
    setRejectTargetQueue(queue);
    setRejectReason('');
  };

  const handleConfirmReject = async () => {
    if (!rejectingCase) return;
    if (!rejectReason.trim() || rejectReason.trim().length < 10) {
      toast.warning('Rejection reason must be at least 10 characters long.', 'Validation');
      return;
    }

    try {
      if (rejectTargetQueue === 'HR') {
        await hrReject({
          id: rejectingCase.id,
          rejectionReason: rejectReason.trim(),
        }).unwrap();
      } else {
        await managerReject({
          id: rejectingCase.id,
          rejectionReason: rejectReason.trim(),
        }).unwrap();
      }

      toast.info(
        `Exit case for ${rejectingCase.employeeName} has been rejected.`,
        'Case Rejected'
      );
      setRejectingCase(null);
    } catch (err: any) {
      toast.error(
        err?.data?.detail || err?.data?.message || 'Failed to reject exit case',
        'Action Error'
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Queue Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-brand-500" />
            <span>Exit Approvals Workflow</span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-zinc-400">
            Manager initial review &amp; HR formal verification queues.
          </p>
        </div>

        {/* Queue Switcher */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => setActiveQueue('MANAGER')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeQueue === 'MANAGER'
                ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 shadow-xs'
                : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Manager Queue</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-white font-bold">
              {managerQueueCases.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveQueue('HR')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeQueue === 'HR'
                ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 shadow-xs'
                : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>HR Review Queue</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-500 text-white font-bold">
              {hrQueueCases.length}
            </span>
          </button>
        </div>
      </div>

      {/* API Gap Banner for Missing Approval Routes */}
      <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-800 dark:text-amber-300">
          <span className="font-semibold">Workflow Notice:</span> &ldquo;Request Discussion&rdquo;, &ldquo;Forward to HR&rdquo;, and the multi-tier Department Head / Management approval chain have no active backend routes and are disabled. Approvals directly advance the exit case.
        </div>
      </div>

      {/* Main Content States */}
      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-44 bg-gray-100 dark:bg-zinc-900 rounded-2xl" />
          <div className="h-44 bg-gray-100 dark:bg-zinc-900 rounded-2xl" />
        </div>
      ) : error ? (
        <ErrorDisplay title="Unable to load approvals queue" error={error} onRetry={refetch} />
      ) : currentCases.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717]">
          <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
            {activeQueue === 'MANAGER' ? 'Manager Queue Clear' : 'HR Queue Clear'}
          </h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
            There are no pending resignation requests awaiting your review at this time.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {currentCases.map((exitCase) => (
            <div
              key={exitCase.id}
              className="p-6 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm space-y-5"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-indigo-500 p-0.5 shadow-sm">
                    <div className="w-full h-full bg-white dark:bg-[#171717] rounded-[10px] flex items-center justify-center font-bold text-sm text-brand-600 dark:text-brand-400">
                      {exitCase.employeeName[0]}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      {exitCase.employeeName}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-zinc-400 font-mono">
                      {exitCase.caseNumber} &bull; {exitCase.designation} &bull; {exitCase.department}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="brand" size="sm">
                    {exitCase.stage.replace(/_/g, ' ')}
                  </Badge>
                  <span className="text-xs text-gray-400">
                    Resigned: {new Date(exitCase.resignationDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Profile & Notice Context */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-900">
                  <span className="text-gray-400 block mb-0.5">Primary Reason</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {exitCase.reason}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-900">
                  <span className="text-gray-400 block mb-0.5">Notice Period</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {exitCase.noticeDays} Days
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-900">
                  <span className="text-gray-400 block mb-0.5">Proposed LWD</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {exitCase.expectedLastWorkingDay
                      ? new Date(exitCase.expectedLastWorkingDay).toLocaleDateString()
                      : 'TBD'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-900">
                  <span className="text-gray-400 block mb-0.5">Reporting Manager</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {exitCase.managerName}
                  </span>
                </div>
              </div>

              {exitCase.comments && (
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-900 text-xs">
                  <span className="text-gray-400 block mb-1">Employee Resignation Note:</span>
                  <p className="text-gray-700 dark:text-zinc-300 italic">&ldquo;{exitCase.comments}&rdquo;</p>
                </div>
              )}

              {/* HR Queue Verification Checklist Guidance */}
              {activeQueue === 'HR' && (
                <div className="p-4 rounded-xl border border-indigo-200/60 dark:border-indigo-900/40 bg-indigo-50/30 dark:bg-indigo-950/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider">
                      HR Verification Checklist (Policy Guidance)
                    </span>
                    <Badge variant="neutral" size="sm" className="text-[10px]">
                      Guidance Only
                    </Badge>
                  </div>
                  <ul className="text-xs text-gray-600 dark:text-zinc-300 space-y-1 list-disc pl-4">
                    <li>Verify employment contract terms and minimum notice period obligations.</li>
                    <li>Confirm absence of ongoing internal disciplinary actions or compliance audits.</li>
                    <li>Cross-verify proposed Last Working Day ({new Date(exitCase.expectedLastWorkingDay).toLocaleDateString()}) with team deliverables.</li>
                  </ul>
                </div>
              )}

              {/* Action Inputs & Buttons */}
              <div className="pt-2 border-t border-gray-100 dark:border-zinc-800 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    placeholder="Approval comments or handover conditions..."
                    value={approvalComments[exitCase.id] || ''}
                    onChange={(e) =>
                      setApprovalComments((prev) => ({ ...prev, [exitCase.id]: e.target.value }))
                    }
                    className="text-xs"
                  />
                  {activeQueue === 'HR' && (
                    <Input
                      type="date"
                      value={revisedLwd[exitCase.id] || ''}
                      onChange={(e) =>
                        setRevisedLwd((prev) => ({ ...prev, [exitCase.id]: e.target.value }))
                      }
                      placeholder="Confirm / Revise LWD..."
                      className="text-xs"
                    />
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  {/* Disabled Missing Routes */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                      title="Route /exits/{id}/request-discussion pending backend implementation"
                      className="text-xs opacity-60 cursor-not-allowed"
                    >
                      <MessageSquare className="w-3.5 h-3.5 mr-1" />
                      Request Discussion (Pending)
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                      title="Route /exits/{id}/forward pending backend implementation"
                      className="text-xs opacity-60 cursor-not-allowed"
                    >
                      Forward to HR (Pending)
                    </Button>
                  </div>

                  {/* Real Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenReject(exitCase, activeQueue)}
                      className="text-xs text-rose-600 border-rose-200 dark:border-rose-900/50 hover:bg-rose-50"
                    >
                      Reject
                    </Button>

                    {activeQueue === 'MANAGER' ? (
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={isMgrApproving}
                        onClick={() => handleManagerApprove(exitCase)}
                        className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        {isMgrApproving ? 'Approving...' : 'Manager Approve & Forward'}
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={isHrApproving}
                        onClick={() => handleHrApprove(exitCase)}
                        className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        {isHrApproving ? 'Approving...' : 'HR Approve Exit'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rejection Modal */}
      {rejectingCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
          <div
            className="w-full max-w-md bg-white dark:bg-[#171717] rounded-3xl border border-gray-200 dark:border-zinc-800 p-6 shadow-2xl space-y-4"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-900 dark:text-[#ececec]">
                  Reject Exit Case
                </h4>
                <p className="text-xs text-gray-500 dark:text-zinc-400">
                  {rejectingCase.employeeName} ({rejectingCase.caseNumber})
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                Rejection Reason * (minimum 10 characters required)
              </label>
              <textarea
                rows={4}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="State specific business, contractual, or project reasons for rejection..."
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-[#212121] text-xs text-gray-900 dark:text-[#ececec] focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRejectingCase(null)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={isMgrRejecting || isHrRejecting || rejectReason.trim().length < 10}
                onClick={handleConfirmReject}
                className="text-xs bg-rose-600 hover:bg-rose-700 text-white"
              >
                {isMgrRejecting || isHrRejecting ? 'Rejecting...' : 'Confirm Rejection'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExitApprovalsPage;
