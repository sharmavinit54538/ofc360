/**
 * @file PayrollApprovalStepper.tsx
 * @description Comprehensive multi-stage approval stepper and lifecycle runner for payroll runs.
 * Supports:
 *  1. Draft (Initiated)
 *  2. Pro-Rata & Statutory Calculation (PF, ESI, PT, LWF, TDS)
 *  3. Compliance & Bank Validation Pre-checks
 *  4. HR Review & Multi-stage Approval
 *  5. Finalize & Lock
 *  6. Bank Advice Disbursement
 */

import React, { useState } from 'react';
import {
  AlertTriangle,
  Calculator,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Coins,
  FileCheck2,
  Lock,
  RefreshCw,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { useToast } from '@/shared/ui/Toast';
import {
  useExecutePayrollRunCalculationMutation,
  useApprovePayrollRunMutation,
  useFinalizePayrollRunMutation,
  useRejectPayrollRunMutation,
  useSendBackPayrollRunMutation,
  useRevalidatePayrollRunMutation,
  useGetPayrollRunEmployeesQuery,
  useUpdatePayrollRunStatusMutation,
} from '../api/payrollApi';
import type { PayrollRunEmployeeItem, PayrollRunItem, PayrollRunStatus } from '../types/payroll.types';
import { formatCurrency, formatPayrollMonth } from '../payroll.utils';

interface PayrollApprovalStepperProps {
  run: PayrollRunItem;
  onRefresh?: () => void;
  onViewPayslips?: () => void;
}

interface StepDef {
  key: string;
  stageNumber: number;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STAGES: StepDef[] = [
  {
    key: 'DRAFT',
    stageNumber: 1,
    title: 'Draft & Attendance',
    subtitle: 'LOP & variables synced',
    icon: Clock,
  },
  {
    key: 'PROCESSING',
    stageNumber: 2,
    title: 'Statutory Engine',
    subtitle: 'PF, ESI, PT, LWF & TDS computed',
    icon: Calculator,
  },
  {
    key: 'VALIDATION',
    stageNumber: 3,
    title: 'Pre-check Validation',
    subtitle: 'PAN, Bank & KYC audit',
    icon: ShieldCheck,
  },
  {
    key: 'PROCESSED',
    stageNumber: 4,
    title: 'HR Review & Approval',
    subtitle: 'Variance & executive sign-off',
    icon: FileCheck2,
  },
  {
    key: 'FINALIZED',
    stageNumber: 5,
    title: 'Finalize & Lock',
    subtitle: 'Batches locked & frozen',
    icon: Lock,
  },
  {
    key: 'PAID',
    stageNumber: 6,
    title: 'Bank Advice & Disbursed',
    subtitle: 'Payment released to accounts',
    icon: Coins,
  },
];

function getStageIndex(status: PayrollRunStatus, isLocked?: boolean): number {
  switch (status) {
    case 'DRAFT':
      return 0;
    case 'PROCESSING':
      return 1;
    case 'PROCESSED':
      return 3;
    case 'APPROVED':
      return isLocked ? 4 : 3;
    case 'FINALIZED':
      return 4;
    case 'PAID':
      return 5;
    case 'REJECTED':
    case 'CANCELLED':
      return 0;
    default:
      return 0;
  }
}

export const PayrollApprovalStepper: React.FC<PayrollApprovalStepperProps> = ({
  run,
  onRefresh,
  onViewPayslips,
}) => {
  const { success, error: toastError } = useToast();
  const [showEmployees, setShowEmployees] = useState(false);
  const [actionReason, setActionReason] = useState('');
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectionMode, setRejectionMode] = useState<'sendBack' | 'reject'>('sendBack');

  // Mutations
  const [executeCalculation, { isLoading: isCalculating }] =
    useExecutePayrollRunCalculationMutation();
  const [approveRun, { isLoading: isApproving }] = useApprovePayrollRunMutation();
  const [finalizeRun, { isLoading: isFinalizing }] = useFinalizePayrollRunMutation();
  const [rejectRun, { isLoading: isRejecting }] = useRejectPayrollRunMutation();
  const [sendBackRun, { isLoading: isSendingBack }] = useSendBackPayrollRunMutation();
  const [revalidateRun, { isLoading: isValidating }] = useRevalidatePayrollRunMutation();
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdatePayrollRunStatusMutation();

  // Employee details query (when accordion open)
  const {
    data: runEmployeesData,
    isLoading: isLoadingEmployees,
    refetch: refetchEmployees,
  } = useGetPayrollRunEmployeesQuery(
    { runId: run.id },
    {
      skip: !showEmployees,
    }
  );

  const runEmployees: PayrollRunEmployeeItem[] = runEmployeesData?.items || [];

  const currentStageIndex = getStageIndex(run.status, run.is_locked);
  const grossAmount = run.grossAmount || (run.total_gross_paise ? run.total_gross_paise / 100 : run.total_gross || 0);
  const deductionsAmount = run.totalDeductions || (run.total_deductions_paise ? run.total_deductions_paise / 100 : run.total_deductions || 0);
  const netPayable = run.netPayable || (run.total_net_paise ? run.total_net_paise / 100 : run.total_net || 0);
  const employeeCount = run.totalEmployees || run.total_employees || 0;

  const handleExecuteCalculation = async () => {
    try {
      await executeCalculation(run.id).unwrap();
      success('Indian Statutory calculation finished successfully', 'Payroll Calculated');
      onRefresh?.();
    } catch (err: any) {
      toastError(err?.data?.message || err?.message || 'Failed to execute statutory calculation', 'Calculation Failed');
    }
  };

  const handleRevalidate = async () => {
    try {
      await revalidateRun(run.id).unwrap();
      success('Employee PAN and bank records re-verified', 'Audit Complete');
      onRefresh?.();
      if (showEmployees) refetchEmployees();
    } catch (err: any) {
      toastError(err?.data?.message || 'Validation failed', 'Audit Error');
    }
  };

  const handleApprove = async () => {
    try {
      await approveRun({ id: run.id, comments: 'Approved via Payroll Lifecycle Hub' }).unwrap();
      success('Payroll batch approved by HR Authority', 'Batch Approved');
      onRefresh?.();
    } catch (err: any) {
      toastError(err?.data?.message || 'Failed to approve payroll batch', 'Approval Error');
    }
  };

  const handleFinalize = async () => {
    try {
      await finalizeRun({ id: run.id, lock: true, notes: 'Locked and frozen for banking advice' }).unwrap();
      success('Payroll batch finalized and locked against mutations', 'Run Finalized');
      onRefresh?.();
    } catch (err: any) {
      toastError(err?.data?.message || 'Failed to finalize payroll run', 'Finalize Error');
    }
  };

  const handleDisburse = async () => {
    try {
      await updateStatus({
        id: run.id,
        data: {
          status: 'PAID',
          transactionReference: `SAL-DISB-${Date.now().toString(36).toUpperCase()}`,
          notes: 'Bank Advice disbursed via ACH/NEFT batch',
        },
      }).unwrap();
      success('Salary disbursement confirmed. Payslips published.', 'Salaries Disbursed');
      onRefresh?.();
    } catch (err: any) {
      toastError(err?.data?.message || 'Failed to disburse salaries', 'Disbursement Failed');
    }
  };

  const handleRejectOrSendBack = async () => {
    if (!actionReason.trim()) {
      toastError('Please provide a reason for sending back / rejection', 'Reason Required');
      return;
    }
    try {
      if (rejectionMode === 'sendBack') {
        await sendBackRun({ id: run.id, reason: actionReason }).unwrap();
        success('Run sent back to Draft for corrections', 'Run Sent Back');
      } else {
        await rejectRun({ id: run.id, reason: actionReason }).unwrap();
        success('Payroll run rejected and cancelled', 'Run Rejected');
      }
      setIsRejectOpen(false);
      setActionReason('');
      onRefresh?.();
    } catch (err: any) {
      toastError(err?.data?.message || 'Action failed', 'Failed');
    }
  };

  return (
    <div className="rounded-3xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#151515] p-5 sm:p-7 shadow-sm transition-all space-y-6">
      {/* Run Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-gray-100 dark:border-zinc-800/80">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200/60 dark:border-indigo-800/50">
              {run.run_number || `BATCH-${run.id.slice(0, 8).toUpperCase()}`}
            </span>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {formatPayrollMonth(run.month || run.period_month || 1, run.year || run.period_year || 2026)}
            </h3>
            <Badge
              variant={
                run.status === 'PAID'
                  ? 'success'
                  : run.status === 'FINALIZED'
                  ? 'indigo'
                  : run.status === 'APPROVED'
                  ? 'brand'
                  : run.status === 'PROCESSING'
                  ? 'warning'
                  : run.status === 'REJECTED'
                  ? 'destructive'
                  : 'default'
              }
              size="sm"
            >
              {run.status}
            </Badge>
            {run.is_locked && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-200/60 dark:border-amber-800/40">
                <Lock className="w-3 h-3" /> Locked
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1.5 flex items-center gap-2">
            <span>{employeeCount} Active Employees</span>
            <span>•</span>
            <span>Created {run.created_at ? new Date(run.created_at).toLocaleDateString() : 'Active Cycle'}</span>
            {run.approved_by && (
              <>
                <span>•</span>
                <span>Approved by {run.approved_by}</span>
              </>
            )}
          </p>
        </div>

        {/* Quick Financial Snapshot */}
        <div className="flex items-center gap-4 sm:gap-6 bg-gray-50/80 dark:bg-zinc-900/60 px-4 py-3 rounded-2xl border border-gray-100 dark:border-zinc-800 self-start lg:self-auto">
          <div>
            <p className="text-[10px] uppercase font-semibold text-gray-400 dark:text-zinc-500">Gross</p>
            <p className="text-sm font-bold text-gray-800 dark:text-zinc-200">
              {formatCurrency(grossAmount)}
            </p>
          </div>
          <div className="w-px h-8 bg-gray-200 dark:bg-zinc-800" />
          <div>
            <p className="text-[10px] uppercase font-semibold text-gray-400 dark:text-zinc-500">Deductions</p>
            <p className="text-sm font-bold text-rose-600 dark:text-rose-400">
              -{formatCurrency(deductionsAmount)}
            </p>
          </div>
          <div className="w-px h-8 bg-gray-200 dark:bg-zinc-800" />
          <div>
            <p className="text-[10px] uppercase font-semibold text-emerald-600 dark:text-emerald-500 font-bold">Net Pay</p>
            <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(netPayable)}
            </p>
          </div>
        </div>
      </div>

      {/* Visual Lifecycle Stepper */}
      <div className="relative">
        <div className="hidden sm:block absolute top-6 left-6 right-6 h-0.5 bg-gray-200 dark:bg-zinc-800 -z-0" />
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 sm:gap-2 relative z-10">
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isCompleted = idx < currentStageIndex || run.status === 'PAID';
            const isCurrent = idx === currentStageIndex && run.status !== 'PAID';
            const isPending = idx > currentStageIndex && run.status !== 'PAID';

            return (
              <div
                key={stage.key}
                className={cn(
                  'flex flex-col items-center text-center p-3 sm:p-2 rounded-2xl transition-all',
                  isCurrent && 'bg-indigo-50/70 dark:bg-indigo-950/30 sm:bg-transparent ring-1 ring-indigo-500/30 sm:ring-0',
                )}
              >
                <div
                  className={cn(
                    'w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm transition-all shadow-sm',
                    isCompleted &&
                      'bg-emerald-600 text-white shadow-emerald-600/20',
                    isCurrent &&
                      'bg-indigo-600 text-white shadow-indigo-600/25 ring-4 ring-indigo-100 dark:ring-indigo-950/60 animate-pulse',
                    isPending &&
                      'bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-400 dark:text-zinc-600'
                  )}
                >
                  {isCompleted ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Icon className="w-5 h-5" />}
                </div>
                <div className="mt-2.5">
                  <p
                    className={cn(
                      'text-xs font-semibold',
                      isCompleted && 'text-emerald-700 dark:text-emerald-400',
                      isCurrent && 'text-indigo-600 dark:text-indigo-400 font-bold',
                      isPending && 'text-gray-500 dark:text-zinc-400'
                    )}
                  >
                    {stage.title}
                  </p>
                  <p className="text-[10px] text-gray-400 dark:text-zinc-500 hidden md:block mt-0.5 leading-tight">
                    {stage.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Controls & Stepper Transitions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowEmployees(!showEmployees)}
            leftIcon={showEmployees ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          >
            {showEmployees ? 'Hide Employee Breakdowns' : 'Inspect Employee Breakdowns'}
          </Button>

          {onViewPayslips && (
            <Button variant="outline" size="sm" onClick={onViewPayslips}>
              View Published Payslips
            </Button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Step 1 & 2: Calculate */}
          {(run.status === 'DRAFT' || run.status === 'PROCESSING') && (
            <Button
              size="sm"
              onClick={handleExecuteCalculation}
              disabled={isCalculating}
              leftIcon={<Calculator className={cn('w-4 h-4', isCalculating && 'animate-spin')} />}
            >
              {isCalculating ? 'Computing PF, ESI, TDS...' : 'Run Statutory Engine'}
            </Button>
          )}

          {/* Validation & Audit Pre-check */}
          {(run.status === 'PROCESSING' || run.status === 'PROCESSED' || run.status === 'DRAFT') && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRevalidate}
              disabled={isValidating}
              leftIcon={<ShieldCheck className={cn('w-4 h-4 text-indigo-500', isValidating && 'animate-spin')} />}
            >
              {isValidating ? 'Auditing...' : 'Re-verify Bank & PAN'}
            </Button>
          )}

          {/* HR Approval */}
          {(run.status === 'PROCESSING' || run.status === 'PROCESSED') && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                onClick={() => {
                  setRejectionMode('sendBack');
                  setIsRejectOpen(true);
                }}
              >
                Send Back
              </Button>
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={handleApprove}
                disabled={isApproving}
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                {isApproving ? 'Approving...' : 'Approve Run'}
              </Button>
            </>
          )}

          {/* Finalize & Lock */}
          {run.status === 'APPROVED' && !run.is_locked && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="text-rose-600 dark:text-rose-400"
                onClick={() => {
                  setRejectionMode('reject');
                  setIsRejectOpen(true);
                }}
              >
                Reject
              </Button>
              <Button
                size="sm"
                onClick={handleFinalize}
                disabled={isFinalizing}
                leftIcon={<Lock className="w-4 h-4" />}
              >
                {isFinalizing ? 'Locking...' : 'Finalize & Freeze Batch'}
              </Button>
            </>
          )}

          {/* Disburse */}
          {run.status === 'FINALIZED' && (
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20"
              onClick={handleDisburse}
              disabled={isUpdatingStatus}
              leftIcon={<Coins className="w-4 h-4" />}
            >
              {isUpdatingStatus ? 'Disbursing...' : 'Disburse & Release Advice'}
            </Button>
          )}

          {run.status === 'PAID' && (
            <Badge variant="success" size="lg" className="px-3 py-1.5 gap-1.5">
              <Check className="w-4 h-4 stroke-[3]" /> Salaries Disbursed & Published
            </Badge>
          )}
        </div>
      </div>

      {/* Reject / Send-Back Modal Sheet */}
      {isRejectOpen && (
        <div className="p-4 rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/60 dark:bg-rose-950/20 space-y-3">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-semibold text-xs">
            <AlertTriangle className="w-4 h-4" />
            <span>
              {rejectionMode === 'sendBack'
                ? 'Send Batch Back to Draft for Variable/Attendance Adjustments'
                : 'Reject & Cancel Payroll Batch'}
            </span>
          </div>
          <textarea
            value={actionReason}
            onChange={(e) => setActionReason(e.target.value)}
            placeholder="Explain why this run is being sent back or rejected (e.g., LOP adjustments missing for Sales dept)..."
            className="w-full text-xs p-3 rounded-xl border border-rose-300 dark:border-rose-900 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            rows={2}
          />
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsRejectOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleRejectOrSendBack}
              disabled={isRejecting || isSendingBack}
            >
              {isRejecting || isSendingBack ? 'Processing...' : 'Confirm'}
            </Button>
          </div>
        </div>
      )}

      {/* Accordion: Employee Calculation Breakdown */}
      {showEmployees && (
        <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-500" />
              Employee Calculation Ledger ({runEmployees.length} records)
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetchEmployees()}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Refresh
            </Button>
          </div>

          {isLoadingEmployees ? (
            <div className="py-8 text-center text-xs text-gray-400 dark:text-zinc-500 animate-pulse">
              Loading employee salary breakups...
            </div>
          ) : runEmployees.length === 0 ? (
            <div className="p-6 text-center rounded-2xl border border-dashed border-gray-200 dark:border-zinc-800 text-xs text-gray-400">
              No employee breakups calculated yet. Click "Run Statutory Engine" above.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-zinc-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/80 dark:bg-zinc-900/80 border-b border-gray-200 dark:border-zinc-800 text-gray-500 dark:text-zinc-400 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Employee</th>
                    <th className="py-2.5 px-3">Days (Paid / LOP)</th>
                    <th className="py-2.5 px-3 text-right">Gross Earned</th>
                    <th className="py-2.5 px-3 text-right">PF (12%)</th>
                    <th className="py-2.5 px-3 text-right">ESI (0.75%)</th>
                    <th className="py-2.5 px-3 text-right">PT / LWF</th>
                    <th className="py-2.5 px-3 text-right">TDS (Tax)</th>
                    <th className="py-2.5 px-3 text-right font-bold text-gray-900 dark:text-white">Net Pay</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/70">
                  {runEmployees.map((emp) => {
                    const grossInr = emp.gross_earnings_paise / 100;
                    const pfInr = (emp.deductions_breakup?.pf || 0) / 100;
                    const esiInr = (emp.deductions_breakup?.esi || 0) / 100;
                    const ptLwfInr = ((emp.deductions_breakup?.pt || 0) + (emp.deductions_breakup?.lwf || 0)) / 100;
                    const tdsInr = (emp.deductions_breakup?.tds || 0) / 100;
                    const netInr = emp.net_pay_paise / 100;

                    return (
                      <tr key={emp.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-900/40">
                        <td className="py-2.5 px-3">
                          <p className="font-semibold text-gray-900 dark:text-white">{emp.employee_name || emp.employee_id}</p>
                          <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-mono">
                            {emp.employee_code || emp.department || 'Staff'}
                          </p>
                        </td>
                        <td className="py-2.5 px-3 font-mono">
                          <span className="text-emerald-600 font-medium">{emp.paid_days}</span>
                          <span className="text-gray-400"> / </span>
                          <span className={cn(emp.lop_days > 0 ? 'text-rose-500 font-bold' : 'text-gray-400')}>
                            {emp.lop_days}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-medium text-gray-900 dark:text-white">
                          {formatCurrency(grossInr)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-gray-600 dark:text-zinc-400">
                          {pfInr > 0 ? `₹${pfInr.toLocaleString('en-IN')}` : '—'}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-gray-600 dark:text-zinc-400">
                          {esiInr > 0 ? `₹${esiInr.toLocaleString('en-IN')}` : '—'}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-gray-600 dark:text-zinc-400">
                          {ptLwfInr > 0 ? `₹${ptLwfInr.toLocaleString('en-IN')}` : '—'}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-gray-600 dark:text-zinc-400">
                          {tdsInr > 0 ? `₹${tdsInr.toLocaleString('en-IN')}` : '—'}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(netInr)}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <Badge
                            size="sm"
                            variant={
                              emp.validation_status === 'VALID' || emp.status === 'COMPUTED'
                                ? 'success'
                                : emp.validation_status === 'WARNING'
                                ? 'warning'
                                : 'default'
                            }
                          >
                            {emp.status}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
