import React from 'react';
import { Check, CircleDollarSign, Play, RotateCcw, X } from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { SkeletonTableRow } from '@/shared/ui/Skeleton';
import type { PayrollRunItem, UpdatePayrollRunStatusPayload } from '../types/payroll.types';
import { formatCurrency, formatPayrollDate, formatPayrollMonth } from '../payroll.utils';

interface PayrollRunsTableProps {
  runs: PayrollRunItem[];
  isLoading: boolean;
  onInitiate: () => void;
  onStatusChange: (run: PayrollRunItem, status: UpdatePayrollRunStatusPayload['status']) => void;
}

type BadgeVariant = 'brand' | 'success' | 'warning' | 'danger' | 'slate';

const statusConfig: Record<PayrollRunItem['status'], { label: string; variant: BadgeVariant }> = {
  DRAFT: { label: 'Draft', variant: 'slate' },
  PROCESSING: { label: 'Processing', variant: 'warning' },
  APPROVED: { label: 'Approved', variant: 'brand' },
  PAID: { label: 'Paid', variant: 'success' },
  REJECTED: { label: 'Rejected', variant: 'danger' },
};

export const PayrollRunsTable: React.FC<PayrollRunsTableProps> = ({
  runs,
  isLoading,
  onInitiate,
  onStatusChange,
}) => (
  <section className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] overflow-hidden shadow-sm">
    <div className="p-4 md:px-6 border-b border-gray-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-[#ececec]">Monthly Payroll Cycles</h2>
        <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
          Review live batch totals and move each run through its approval lifecycle
        </p>
      </div>
      <Button size="sm" onClick={onInitiate} leftIcon={<Play className="w-3.5 h-3.5" />}>
        Initiate Run
      </Button>
    </div>

    {runs.length === 0 && !isLoading ? (
      <div className="p-12 text-center">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
          <CircleDollarSign className="w-7 h-7" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#ececec]">No payroll runs for this year</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">Initiate a payroll period to create the first batch.</p>
        <Button size="sm" className="mt-5" onClick={onInitiate} leftIcon={<Play className="w-3.5 h-3.5" />}>
          Initiate Payroll
        </Button>
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-xs md:text-sm">
          <thead className="bg-gray-50 dark:bg-zinc-800/60 text-gray-600 dark:text-zinc-400 text-xs uppercase tracking-wider font-semibold border-b border-gray-200 dark:border-zinc-800">
            <tr>
              <th className="px-5 py-3">Payroll Period</th>
              <th className="px-4 py-3">Employees</th>
              <th className="px-4 py-3">Gross</th>
              <th className="px-4 py-3">Deductions</th>
              <th className="px-4 py-3">Net Payable</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Disbursement</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/80">
            {isLoading
              ? Array.from({ length: 5 }).map((_, index) => <SkeletonTableRow key={index} columns={8} />)
              : runs.map((run) => {
                  const status = statusConfig[run.status];
                  return (
                <tr key={run.id} className="hover:bg-gray-50/80 dark:hover:bg-zinc-800/40 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-gray-900 dark:text-[#ececec] whitespace-nowrap">
                      {formatPayrollMonth(run.month, run.year)}
                    </div>
                    <div className="text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5">Initiated by {run.initiatedBy}</div>
                  </td>
                  <td className="px-4 py-4 text-gray-700 dark:text-zinc-300">{run.totalEmployees}</td>
                  <td className="px-4 py-4 text-gray-700 dark:text-zinc-300 whitespace-nowrap">{formatCurrency(run.grossAmount)}</td>
                  <td className="px-4 py-4 text-rose-600 dark:text-rose-400 whitespace-nowrap">{formatCurrency(run.totalDeductions)}</td>
                  <td className="px-4 py-4 font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">{formatCurrency(run.netPayable)}</td>
                  <td className="px-4 py-4"><Badge variant={status.variant} size="sm">{status.label}</Badge></td>
                  <td className="px-4 py-4 text-xs text-gray-600 dark:text-zinc-400">
                    <div>{formatPayrollDate(run.disbursedAt)}</div>
                    {run.transactionReference && <div className="font-mono mt-1">UTR: {run.transactionReference}</div>}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1.5">
                      {(run.status === 'DRAFT' || run.status === 'PROCESSING') && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => onStatusChange(run, 'APPROVED')} leftIcon={<Check className="w-3.5 h-3.5" />}>
                            Approve
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => onStatusChange(run, 'REJECTED')} aria-label={`Reject ${formatPayrollMonth(run.month, run.year)} payroll`}>
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        </>
                      )}
                      {run.status === 'APPROVED' && (
                        <Button size="sm" onClick={() => onStatusChange(run, 'PAID')} leftIcon={<CircleDollarSign className="w-3.5 h-3.5" />}>
                          Mark Disbursed
                        </Button>
                      )}
                      {(run.status === 'PAID' || run.status === 'REJECTED') && (
                        <span className="inline-flex items-center gap-1 text-xs text-gray-400 dark:text-zinc-500 px-2">
                          <RotateCcw className="w-3.5 h-3.5" /> Closed
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    )}
  </section>
);

export default PayrollRunsTable;
