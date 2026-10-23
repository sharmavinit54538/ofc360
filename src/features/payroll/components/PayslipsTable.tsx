import React from 'react';
import { Eye, FileSpreadsheet } from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { SkeletonTableRow } from '@/shared/ui/Skeleton';
import type { PayslipItem } from '../types/payroll.types';
import { formatCurrency } from '../payroll.utils';

interface PayslipsTableProps {
  payslips: PayslipItem[];
  isLoading: boolean;
  onView: (payslip: PayslipItem) => void;
}

type BadgeVariant = 'brand' | 'success' | 'warning' | 'danger' | 'slate';

const statusConfig: Record<PayslipItem['status'], { label: string; variant: BadgeVariant }> = {
  DRAFT: { label: 'Draft', variant: 'slate' },
  GENERATED: { label: 'Generated', variant: 'brand' },
  PAID: { label: 'Paid', variant: 'success' },
  ON_HOLD: { label: 'On Hold', variant: 'warning' },
};

export const PayslipsTable: React.FC<PayslipsTableProps> = ({ payslips, isLoading, onView }) => (
  <section className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] overflow-hidden shadow-sm">
    <div className="p-4 md:px-6 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between gap-3">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-[#ececec]">Employee Payslips</h2>
        <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">Live attendance, earnings, deductions, and net-pay reconciliation</p>
      </div>
      <Badge variant="slate" size="sm">{payslips.length} on this page</Badge>
    </div>

    {payslips.length === 0 && !isLoading ? (
      <div className="p-12 text-center">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
          <FileSpreadsheet className="w-7 h-7" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#ececec]">No payslips match this view</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400 max-w-md mx-auto">
          Change the payroll period or filters, or initiate the period from Payroll Runs.
        </p>
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px] text-left text-xs md:text-sm">
          <thead className="bg-gray-50 dark:bg-zinc-800/60 text-gray-600 dark:text-zinc-400 text-xs uppercase tracking-wider font-semibold border-b border-gray-200 dark:border-zinc-800">
            <tr>
              <th className="px-5 py-3">Employee</th>
              <th className="px-4 py-3">Paid / LOP Days</th>
              <th className="px-4 py-3">Gross Earnings</th>
              <th className="px-4 py-3">Total Deductions</th>
              <th className="px-4 py-3">Net Pay</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-5 py-3 text-right">Breakdown</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/80">
            {isLoading
              ? Array.from({ length: 7 }).map((_, index) => <SkeletonTableRow key={index} columns={7} />)
              : payslips.map((payslip) => {
                  const status = statusConfig[payslip.status];
                  return (
                <tr key={payslip.id} className="hover:bg-gray-50/80 dark:hover:bg-zinc-800/40 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-gray-900 dark:text-[#ececec]">{payslip.employee.name}</div>
                    <div className="text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5">
                      {payslip.employee.employeeCode} · {payslip.employee.department} · {payslip.employee.designation}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="font-semibold text-gray-800 dark:text-zinc-200">{payslip.attendanceSummary.paidDays}</span>
                    <span className="text-gray-400"> / </span>
                    <span className={payslip.attendanceSummary.lopDays > 0 ? 'text-rose-600 dark:text-rose-400 font-semibold' : 'text-gray-600 dark:text-zinc-400'}>
                      {payslip.attendanceSummary.lopDays}
                    </span>
                    <div className="text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5">of {payslip.attendanceSummary.totalWorkingDays} working days</div>
                  </td>
                  <td className="px-4 py-4 text-gray-800 dark:text-zinc-200 whitespace-nowrap">{formatCurrency(payslip.earnings.grossEarnings, payslip.currency)}</td>
                  <td className="px-4 py-4 text-rose-600 dark:text-rose-400 whitespace-nowrap">{formatCurrency(payslip.deductions.totalDeductions, payslip.currency)}</td>
                  <td className="px-4 py-4 font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">{formatCurrency(payslip.netPay, payslip.currency)}</td>
                  <td className="px-4 py-4"><Badge variant={status.variant} size="sm">{status.label}</Badge></td>
                  <td className="px-5 py-4 text-right">
                    <Button size="sm" variant="outline" onClick={() => onView(payslip)} leftIcon={<Eye className="w-3.5 h-3.5" />}>
                      View Breakdown
                    </Button>
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

export default PayslipsTable;
