import React, { useState } from 'react';
import {
  CreditCard,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  FileText,
  Building,
  User,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { Input } from '@/shared/ui/Input';
import { ErrorDisplay } from '@/shared/ui/ErrorDisplay';
import { useToast } from '@/shared/ui/Toast';
import {
  useGetExitCasesQuery,
  useGetFnFPreviewQuery,
  useUpdateFnFSettlementMutation,
} from '../api/exitsApi';
import type { ExitCase, FnFStatus, FnFSettlement } from '../types/exit.types';

export const ExitFnFPage: React.FC = () => {
  const toast = useToast();

  const {
    data: casesResponse,
    isLoading: isCasesLoading,
    error: casesError,
    refetch,
  } = useGetExitCasesQuery();

  const allCases = casesResponse?.items || [];
  const activeCases = allCases.filter(
    (c) => c.stage !== 'REJECTED' && c.stage !== 'WITHDRAWN'
  );

  const [selectedCaseId, setSelectedCaseId] = useState<string>('');

  // Automatically select first case if none selected
  const activeCase =
    activeCases.find((c) => c.id === selectedCaseId) || activeCases[0] || null;

  // FnF preview query for active case
  const {
    data: fnfPreviewData,
    isLoading: isFnfLoading,
    error: fnfError,
    refetch: refetchFnF,
  } = useGetFnFPreviewQuery(activeCase?.id || '', {
    skip: !activeCase?.id,
  });

  const [updateFnF, { isLoading: isUpdating }] = useUpdateFnFSettlementMutation();

  // Form states for status update
  const [targetStatus, setTargetStatus] = useState<FnFStatus>('PENDING_APPROVAL');
  const [holdReason, setHoldReason] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [updateRemarks, setUpdateRemarks] = useState('');

  const settlement: FnFSettlement | undefined = fnfPreviewData || activeCase?.settlement;

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCase) return;

    if (targetStatus === 'ON_HOLD' && (!holdReason || holdReason.trim().length < 5)) {
      toast.warning('Hold reason (min 5 characters) is required when putting settlement on hold.', 'Validation');
      return;
    }

    try {
      await updateFnF({
        id: activeCase.id,
        status: targetStatus,
        holdReason: targetStatus === 'ON_HOLD' ? holdReason.trim() : undefined,
        transactionId: transactionId.trim() || undefined,
        remarks: updateRemarks.trim() || undefined,
      }).unwrap();

      toast.success(
        `F&F Settlement status updated to ${targetStatus} for ${activeCase.employeeName}!`,
        'Settlement Updated'
      );
      refetchFnF();
    } catch (err: any) {
      toast.error(
        err?.data?.detail || err?.data?.message || 'Failed to update settlement status',
        'Action Error'
      );
    }
  };

  const handleDownloadStatement = () => {
    if (!activeCase) return;
    toast.info('Downloading Full & Final Statement PDF from server...', 'Statement Download');
    // Simulate blob download from server or window open if URL is available
    if (settlement?.statementUrl) {
      window.open(settlement.statementUrl, '_blank');
    } else {
      toast.warning('PDF Statement generation in progress on payroll server.', 'File Processing');
    }
  };

  const workflowSteps: { id: FnFStatus; label: string }[] = [
    { id: 'DRAFT', label: 'Draft' },
    { id: 'UNDER_REVIEW', label: 'Under Review' },
    { id: 'PENDING_APPROVAL', label: 'Pending Approval' },
    { id: 'APPROVED', label: 'Approved' },
    { id: 'PAYMENT_PROCESSING', label: 'Payment Processing' },
    { id: 'PAID', label: 'Paid / Settled' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-brand-500" />
            <span>Full &amp; Final (F&amp;F) Financial Settlement</span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-zinc-400">
            Earnings and deductions audit, net payable breakdown, settlement lifecycle, and statements.
          </p>
        </div>

        {activeCase && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadStatement}
            className="text-xs gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Statement PDF</span>
          </Button>
        )}
      </div>

      {/* API Notice */}
      <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40 flex items-start gap-3">
        <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-indigo-800 dark:text-indigo-300">
          <span className="font-semibold">Calculation Integrity Rule:</span> All settlement earnings, deductions, and net payable amounts are sourced strictly from server values. No simulated client calculations are computed.
        </div>
      </div>

      {/* Main 4 States */}
      {isCasesLoading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-44 bg-gray-100 dark:bg-zinc-900 rounded-2xl" />
          <div className="h-64 bg-gray-100 dark:bg-zinc-900 rounded-2xl" />
        </div>
      ) : casesError ? (
        <ErrorDisplay title="Unable to load exit cases for F&F" error={casesError} onRetry={refetch} />
      ) : activeCases.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717]">
          <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
            No Active Settlements
          </h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
            There are currently no exit cases requiring Full &amp; Final settlement processing.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Case Selector */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
              Select Exit Case ({activeCases.length})
            </h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto no-scrollbar">
              {activeCases.map((c) => {
                const isSelected = activeCase?.id === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCaseId(c.id)}
                    className={`w-full p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-brand-500 bg-brand-50/20 dark:bg-brand-950/20 shadow-xs'
                        : 'border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-gray-900 dark:text-gray-100">
                        {c.employeeName}
                      </span>
                      <Badge
                        variant={c.fnfStatus === 'PAID' ? 'success' : c.fnfStatus === 'ON_HOLD' ? 'warning' : 'neutral'}
                        size="sm"
                      >
                        {c.fnfStatus}
                      </Badge>
                    </div>
                    <div className="text-[11px] text-gray-500 dark:text-zinc-400 mt-1 flex items-center justify-between">
                      <span>{c.caseNumber}</span>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        ₹{(c.settlement?.netPayable ?? 0).toLocaleString()}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Settlement Details & Status Engine */}
          <div className="lg:col-span-2 space-y-6">
            {activeCase && (
              <>
                {/* Employee Info Header */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      {activeCase.employeeName}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-zinc-400">
                      {activeCase.caseNumber} &bull; {activeCase.designation} &bull; LWD:{' '}
                      {activeCase.expectedLastWorkingDay
                        ? new Date(activeCase.expectedLastWorkingDay).toLocaleDateString()
                        : 'TBD'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-gray-400 block">Calculated Net Payable</span>
                    <span className="text-xl font-bold text-brand-600 dark:text-brand-400">
                      ₹{(settlement?.netPayable ?? 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Earnings & Deductions Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Earnings */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-emerald-100 dark:border-emerald-900/30 shadow-sm space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-zinc-800">
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                        Gross Earnings (+)
                      </span>
                      <span className="font-bold text-xs text-emerald-600">
                        ₹{(settlement?.grossEarnings ?? 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="space-y-2 text-xs">
                      {(settlement?.earnings || []).length === 0 ? (
                        <p className="text-gray-400 text-xs italic">No earnings records found</p>
                      ) : (
                        (settlement?.earnings || []).map((e) => (
                          <div key={e.id} className="flex items-center justify-between text-gray-700 dark:text-zinc-300">
                            <span>{e.label}</span>
                            <span className="font-semibold">₹{e.amount.toLocaleString()}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Deductions */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-rose-100 dark:border-rose-900/30 shadow-sm space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-zinc-800">
                      <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                        Total Deductions (-)
                      </span>
                      <span className="font-bold text-xs text-rose-600">
                        -₹{(settlement?.totalDeductions ?? 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="space-y-2 text-xs">
                      {(settlement?.deductions || []).length === 0 ? (
                        <p className="text-gray-400 text-xs italic">No deduction records found</p>
                      ) : (
                        (settlement?.deductions || []).map((d) => (
                          <div key={d.id} className="flex items-center justify-between text-gray-700 dark:text-zinc-300">
                            <span>{d.label}</span>
                            <span className="font-semibold text-rose-600">-₹{d.amount.toLocaleString()}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Workflow Status Chain */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
                  <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                    Settlement Workflow Progression
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                    {workflowSteps.map((step) => {
                      const isCurrent = (settlement?.status || activeCase.fnfStatus) === step.id;
                      return (
                        <div
                          key={step.id}
                          className={`p-2.5 rounded-xl border text-center text-xs font-medium ${
                            isCurrent
                              ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/40 font-bold'
                              : 'bg-gray-50 dark:bg-zinc-900 text-gray-400 border-gray-200 dark:border-zinc-800'
                          }`}
                        >
                          <span className="text-[11px] block">{step.label}</span>
                          {isCurrent && <CheckCircle2 className="w-3 h-3 text-brand-500 mx-auto mt-1" />}
                        </div>
                      );
                    })}
                  </div>

                  {settlement?.status === 'ON_HOLD' && (
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300">
                      <span className="font-bold">Settlement On Hold:</span> {settlement.holdReason || 'Withheld pending clearance verification.'}
                    </div>
                  )}

                  {settlement?.transactionId && (
                    <div className="text-xs text-gray-500 dark:text-zinc-400">
                      <span className="font-semibold">Transaction Reference:</span> {settlement.transactionId}
                    </div>
                  )}

                  {/* Update Status Form */}
                  <form onSubmit={handleUpdateStatus} className="pt-3 border-t border-gray-100 dark:border-zinc-800 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                          Update Workflow Status
                        </label>
                        <select
                          value={targetStatus}
                          onChange={(e) => setTargetStatus(e.target.value as any)}
                          className="w-full p-2 text-xs rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
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

                      <div>
                        <label className="block font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                          Transaction / UTR Reference
                        </label>
                        <Input
                          placeholder="e.g. UTR-20261101-778899"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          className="text-xs"
                        />
                      </div>
                    </div>

                    {targetStatus === 'ON_HOLD' && (
                      <div>
                        <label className="block text-xs font-semibold text-rose-600 dark:text-rose-400 mb-1">
                          Hold Reason * (minimum 5 characters)
                        </label>
                        <Input
                          placeholder="State reason for withholding F&F payment..."
                          value={holdReason}
                          onChange={(e) => setHoldReason(e.target.value)}
                          className="text-xs"
                          required
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                        Remarks / Auditing Note
                      </label>
                      <Input
                        placeholder="Internal payroll & audit notes..."
                        value={updateRemarks}
                        onChange={(e) => setUpdateRemarks(e.target.value)}
                        className="text-xs"
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                        disabled={isUpdating || (targetStatus === 'ON_HOLD' && holdReason.trim().length < 5)}
                        className="text-xs bg-brand-600 hover:bg-brand-700 text-white"
                      >
                        {isUpdating ? 'Saving...' : 'Update Settlement Status'}
                      </Button>
                    </div>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExitFnFPage;
