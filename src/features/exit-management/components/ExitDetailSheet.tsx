import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  Laptop,
  Building,
  CreditCard,
  FileCheck,
  Star,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { Input } from '@/shared/ui/Input';
import { useToast } from '@/shared/ui/Toast';
import {
  useSubmitClearanceSignoffMutation,
  useSubmitExitInterviewMutation,
  useUpdateFnFSettlementMutation,
} from '../api/exitsApi';
import type {
  ExitCase,
  ClearanceDepartment,
  ClearanceChecklistItem,
  ClearanceStatus,
} from '../types/exit.types';

interface ExitDetailSheetProps {
  exitCase: ExitCase | null;
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'overview' | 'clearance' | 'interview' | 'settlement';

export const ExitDetailSheet: React.FC<ExitDetailSheetProps> = ({
  exitCase,
  isOpen,
  onClose,
}) => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Mutations
  const [submitClearance, { isLoading: isSubmittingClearance }] = useSubmitClearanceSignoffMutation();
  const [submitInterview, { isLoading: isSubmittingInterview }] = useSubmitExitInterviewMutation();
  const [updateFnF, { isLoading: isSubmittingFnF }] = useUpdateFnFSettlementMutation();

  // Local state for Department Clearance action
  const [selectedDept, setSelectedDept] = useState<ClearanceDepartment | null>(null);
  const [deptRemarks, setDeptRemarks] = useState('');
  const [deptReason, setDeptReason] = useState('');
  const [activeChecklist, setActiveChecklist] = useState<Record<string, boolean>>({});

  // Local state for Exit Interview Form
  const [interviewReason, setInterviewReason] = useState('');
  const [overallRating, setOverallRating] = useState(4);
  const [managementRating, setManagementRating] = useState(4);
  const [cultureRating, setCultureRating] = useState(4);
  const [careerRating, setCareerRating] = useState(4);
  const [wouldRecommend, setWouldRecommend] = useState(true);
  const [interviewComments, setInterviewComments] = useState('');
  const [interviewSuggestions, setInterviewSuggestions] = useState('');

  // Local state for FnF Settlement Form
  const [fnfStatus, setFnfStatus] = useState(exitCase?.fnfStatus || 'DRAFT');
  const [holdReason, setHoldReason] = useState(exitCase?.settlement?.holdReason || '');
  const [transactionId, setTransactionId] = useState(exitCase?.settlement?.transactionId || '');
  const [fnfRemarks, setFnfRemarks] = useState(exitCase?.settlement?.remarks || '');

  if (!isOpen || !exitCase) return null;

  const clearances = exitCase.clearances || [];
  const clearedCount = clearances.filter((c) => c.status === 'CLEARED').length;
  const settlement = exitCase.settlement;
  const netPayable = settlement?.netPayable ?? 0;

  const handleOpenDeptSignoff = (dept: ClearanceDepartment) => {
    setSelectedDept(dept);
    const existing = clearances.find((c) => c.department === dept);
    setDeptRemarks(existing?.remarks || '');
    setDeptReason(existing?.reason || '');

    const initialChecklist: Record<string, boolean> = {};
    existing?.checklist.forEach((item, idx) => {
      initialChecklist[`${dept}_${idx}`] = item.completed;
    });
    setActiveChecklist(initialChecklist);
  };

  const handleSaveDepartmentClearance = async (status: ClearanceStatus) => {
    if (!selectedDept) return;
    if ((status === 'ON_HOLD' || status === 'REJECTED') && (!deptReason || deptReason.trim().length < 5)) {
      toast.warning('Please enter a reason (min 5 characters) when placing on hold or rejecting.', 'Validation');
      return;
    }

    try {
      await submitClearance({
        id: exitCase.id,
        department: selectedDept,
        status,
        remarks: deptRemarks.trim() || undefined,
        reason: deptReason.trim() || undefined,
      }).unwrap();

      toast.success(
        `${selectedDept} clearance sign-off has been marked as ${status.toLowerCase()}!`,
        'Sign-off Saved'
      );
      setSelectedDept(null);
    } catch (err: any) {
      toast.error(
        err?.data?.detail || err?.data?.message || 'Failed to submit department clearance sign-off',
        'Action Error'
      );
    }
  };

  const handleSaveInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewReason.trim()) {
      toast.warning('Please enter the primary reason for leaving.', 'Validation Error');
      return;
    }
    if (!interviewSuggestions.trim() || interviewSuggestions.trim().length < 5) {
      toast.warning('Suggestions for improvement must be at least 5 characters.', 'Validation Error');
      return;
    }

    try {
      await submitInterview({
        id: exitCase.id,
        reasonForLeaving: interviewReason.trim(),
        workEnvironmentRating: cultureRating,
        managerBehaviourRating: managementRating,
        salaryBenefitsRating: overallRating,
        careerGrowthRating: careerRating,
        whatShouldImprove: interviewSuggestions.trim(),
        wouldRejoin: wouldRecommend,
        additionalComments: interviewComments.trim() || undefined,
      }).unwrap();

      toast.success('Exit interview submitted successfully!', 'Interview Recorded');
    } catch (err: any) {
      toast.error(
        err?.data?.detail || err?.data?.message || 'Failed to submit exit interview',
        'Submission Error'
      );
    }
  };

  const handleSaveFnF = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateFnF({
        id: exitCase.id,
        status: fnfStatus as any,
        holdReason: fnfStatus === 'ON_HOLD' ? holdReason.trim() : undefined,
        transactionId: transactionId.trim() || undefined,
        remarks: fnfRemarks.trim() || undefined,
      }).unwrap();

      toast.success(
        `FnF Settlement updated successfully (Status: ${fnfStatus})!`,
        'Settlement Updated'
      );
    } catch (err: any) {
      toast.error(
        err?.data?.detail || err?.data?.message || 'Failed to update FnF settlement',
        'Settlement Error'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in-50">
      <div
        className="w-full max-w-2xl sm:max-w-3xl bg-white dark:bg-[#171717] h-full shadow-2xl flex flex-col border-l border-gray-200 dark:border-zinc-800 animate-in slide-in-from-right duration-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-gray-200 dark:border-zinc-800 bg-gray-50/75 dark:bg-[#1f1f1f]/50 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-indigo-500 p-0.5 shadow-sm">
              <div className="w-full h-full bg-white dark:bg-[#171717] rounded-[14px] flex items-center justify-center font-bold text-base text-rose-600 dark:text-rose-400">
                {exitCase.employeeName ? exitCase.employeeName[0] : 'E'}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900 dark:text-[#ececec]">
                  {exitCase.employeeName}
                </h2>
                <Badge variant="brand" size="sm">
                  {exitCase.stage}
                </Badge>
              </div>
              <p className="text-xs text-gray-500 dark:text-zinc-400 font-mono">
                {exitCase.caseNumber} &bull; {exitCase.department} &bull; LWD:{' '}
                {exitCase.expectedLastWorkingDay
                  ? new Date(exitCase.expectedLastWorkingDay).toLocaleDateString()
                  : 'TBD'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-zinc-800 px-6 bg-white dark:bg-[#171717] flex-shrink-0">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'clearance', label: `Clearances (${clearedCount}/5)` },
            { id: 'interview', label: 'Exit Interview' },
            { id: 'settlement', label: 'Full & Final' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 space-y-3">
                <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                  Employee & Resignation Profile
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-gray-400 block">Designation</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {exitCase.designation}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Reporting Manager</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {exitCase.managerName}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Notice Period</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {exitCase.noticeDays} days
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Resignation Date</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {new Date(exitCase.resignationDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Primary Reason</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {exitCase.reason}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Exit Status</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {exitCase.exitStatus}
                    </span>
                  </div>
                </div>

                {exitCase.comments && (
                  <div className="pt-2 border-t border-gray-200 dark:border-zinc-800 text-xs">
                    <span className="text-gray-400 block mb-1">Employee Comments:</span>
                    <p className="text-gray-700 dark:text-zinc-300 italic">
                      &ldquo;{exitCase.comments}&rdquo;
                    </p>
                  </div>
                )}
              </div>

              {/* Approval History */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#212121] border border-gray-200 dark:border-zinc-800 space-y-3">
                <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                  Approval History
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-gray-50 dark:bg-zinc-800">
                    <div>
                      <span className="font-semibold text-gray-800 dark:text-gray-200 block">
                        Manager Approval: {exitCase.managerName}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        {exitCase.managerApproval.comments || 'No comments'}
                      </span>
                    </div>
                    <Badge
                      variant={exitCase.managerApproval.status === 'APPROVED' ? 'success' : exitCase.managerApproval.status === 'REJECTED' ? 'error' : 'neutral'}
                      size="sm"
                    >
                      {exitCase.managerApproval.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-gray-50 dark:bg-zinc-800">
                    <div>
                      <span className="font-semibold text-gray-800 dark:text-gray-200 block">
                        HR Approval
                      </span>
                      <span className="text-[11px] text-gray-400">
                        {exitCase.hrApproval.comments || 'No comments'}
                      </span>
                    </div>
                    <Badge
                      variant={exitCase.hrApproval.status === 'APPROVED' ? 'success' : exitCase.hrApproval.status === 'REJECTED' ? 'error' : 'neutral'}
                      size="sm"
                    >
                      {exitCase.hrApproval.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'clearance' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                5-Department Clearance Sign-offs
              </h4>
              <div className="space-y-3">
                {clearances.map((c) => (
                  <div
                    key={c.department}
                    className="p-4 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-gray-900 dark:text-gray-100">
                          {c.department}
                        </span>
                        <Badge
                          variant={c.status === 'CLEARED' ? 'success' : c.status === 'ON_HOLD' ? 'warning' : c.status === 'REJECTED' ? 'error' : 'neutral'}
                          size="sm"
                        >
                          {c.status}
                        </Badge>
                      </div>
                      {c.remarks && (
                        <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-1">
                          Remarks: {c.remarks}
                        </p>
                      )}
                      {c.reason && (
                        <p className="text-[11px] text-rose-500 font-medium mt-0.5">
                          Reason: {c.reason}
                        </p>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDeptSignoff(c.department)}
                      className="text-xs h-7"
                    >
                      Update
                    </Button>
                  </div>
                ))}
              </div>

              {selectedDept && (
                <div className="p-4 rounded-xl border border-brand-200 dark:border-brand-900/50 bg-brand-50/40 dark:bg-brand-950/20 space-y-3">
                  <h5 className="text-xs font-bold text-gray-900 dark:text-gray-100">
                    Sign off for {selectedDept} Department
                  </h5>
                  <Input
                    placeholder="Remarks / notes..."
                    value={deptRemarks}
                    onChange={(e) => setDeptRemarks(e.target.value)}
                    className="text-xs"
                  />
                  <Input
                    placeholder="Hold / Rejection Reason (mandatory if hold/reject)..."
                    value={deptReason}
                    onChange={(e) => setDeptReason(e.target.value)}
                    className="text-xs"
                  />
                  <div className="flex items-center gap-2 justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedDept(null)}
                      className="text-xs h-7"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isSubmittingClearance}
                      onClick={() => handleSaveDepartmentClearance('ON_HOLD')}
                      className="text-xs h-7 text-amber-600 border-amber-300"
                    >
                      Hold
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isSubmittingClearance}
                      onClick={() => handleSaveDepartmentClearance('REJECTED')}
                      className="text-xs h-7 text-rose-600 border-rose-300"
                    >
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      disabled={isSubmittingClearance}
                      onClick={() => handleSaveDepartmentClearance('CLEARED')}
                      className="text-xs h-7 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'interview' && (
            <form onSubmit={handleSaveInterview} className="space-y-4">
              <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                Exit Interview Record
              </h4>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                  Primary Reason for Leaving *
                </label>
                <Input
                  value={interviewReason}
                  onChange={(e) => setInterviewReason(e.target.value)}
                  placeholder="e.g. Higher compensation, relocate abroad..."
                  className="text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                    Work Culture Rating (1-5)
                  </label>
                  <select
                    value={cultureRating}
                    onChange={(e) => setCultureRating(Number(e.target.value))}
                    className="w-full text-xs p-2 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n} - {n === 5 ? 'Excellent' : n === 1 ? 'Poor' : 'Average'}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                    Manager Behaviour Rating (1-5)
                  </label>
                  <select
                    value={managementRating}
                    onChange={(e) => setManagementRating(Number(e.target.value))}
                    className="w-full text-xs p-2 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n} - {n === 5 ? 'Excellent' : n === 1 ? 'Poor' : 'Average'}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                  What could the organization improve? * (min 5 chars)
                </label>
                <textarea
                  rows={3}
                  value={interviewSuggestions}
                  onChange={(e) => setInterviewSuggestions(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 resize-none"
                  placeholder="Suggestions on process, leadership, compensation, culture..."
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={wouldRecommend}
                    onChange={(e) => setWouldRecommend(e.target.checked)}
                    className="rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span>Would recommend OFC360 as a great workplace</span>
                </label>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isSubmittingInterview}
                  className="text-xs"
                >
                  {isSubmittingInterview ? 'Saving...' : 'Submit Interview'}
                </Button>
              </div>
            </form>
          )}

          {activeTab === 'settlement' && (
            <form onSubmit={handleSaveFnF} className="space-y-4">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                    Settlement Summary
                  </h4>
                  <Badge variant="brand" size="sm">
                    Status: {exitCase.fnfStatus}
                  </Badge>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-gray-600 dark:text-zinc-400">
                    <span>Gross Earnings:</span>
                    <span className="font-semibold text-emerald-600">
                      ₹{(settlement?.grossEarnings ?? 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-zinc-400">
                    <span>Total Deductions:</span>
                    <span className="font-semibold text-rose-600">
                      -₹{(settlement?.totalDeductions ?? 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-gray-900 dark:text-gray-100 pt-2 border-t border-gray-200 dark:border-zinc-800">
                    <span>Net Payable:</span>
                    <span>₹{netPayable.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                  Update F&F Payment Status
                </label>
                <select
                  value={fnfStatus}
                  onChange={(e) => setFnfStatus(e.target.value as any)}
                  className="w-full text-xs p-2 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                >
                  <option value="DRAFT">DRAFT</option>
                  <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                  <option value="PENDING_APPROVAL">PENDING_APPROVAL</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="PAYMENT_PROCESSING">PAYMENT_PROCESSING</option>
                  <option value="PAID">PAID</option>
                  <option value="ON_HOLD">ON_HOLD</option>
                </select>
              </div>

              {fnfStatus === 'ON_HOLD' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                    Hold Reason *
                  </label>
                  <Input
                    value={holdReason}
                    onChange={(e) => setHoldReason(e.target.value)}
                    placeholder="State reason for withholding settlement..."
                    className="text-xs"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                  Transaction / Payment Reference
                </label>
                <Input
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="e.g. UTR-20261101-987654"
                  className="text-xs"
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isSubmittingFnF}
                  className="text-xs"
                >
                  {isSubmittingFnF ? 'Updating...' : 'Update F&F Status'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
