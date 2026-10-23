import React from 'react';
import { BadgeCheck, Building2, CalendarDays, Landmark, ReceiptText } from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { ErrorDisplay } from '@/shared/ui/ErrorDisplay';
import { Skeleton, SkeletonListItem } from '@/shared/ui/Skeleton';
import { useGetPayslipByIdQuery } from '../api/payrollApi';
import { formatCurrency, formatPayrollDate, formatPayrollMonth } from '../payroll.utils';
import { PayrollModalShell } from './PayrollModalShell';

interface PayslipDetailModalProps {
  payslipId: string | null;
  onClose: () => void;
}

const AmountRow: React.FC<{ label: string; value: number; currency: string; emphasize?: boolean }> = ({
  label,
  value,
  currency,
  emphasize = false,
}) => (
  <div className={`flex items-center justify-between gap-4 py-2.5 text-sm ${emphasize ? 'border-t border-gray-200 dark:border-zinc-700 font-bold' : ''}`}>
    <span className="text-gray-600 dark:text-zinc-400">{label}</span>
    <span className="text-gray-900 dark:text-zinc-100 whitespace-nowrap">{formatCurrency(value, currency)}</span>
  </div>
);

export const PayslipDetailModal: React.FC<PayslipDetailModalProps> = ({ payslipId, onClose }) => {
  const {
    data: payslip,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetPayslipByIdQuery(payslipId || '', { skip: !payslipId });

  return (
    <PayrollModalShell
      isOpen={Boolean(payslipId)}
      onClose={onClose}
      title={payslip ? `${payslip.employee.name} · Payslip` : 'Payslip Breakdown'}
      description={payslip ? formatPayrollMonth(payslip.month, payslip.year) : 'Fetching the latest itemised payslip'}
      icon={<ReceiptText className="w-5 h-5" />}
      maxWidthClassName="max-w-4xl"
    >
      <div className="overflow-y-auto p-5 sm:p-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <div className="grid md:grid-cols-2 gap-4">
              <SkeletonListItem />
              <SkeletonListItem />
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        ) : error ? (
          <ErrorDisplay title="Unable to load payslip breakdown" error={error} onRetry={() => refetch()} />
        ) : !payslip ? (
          <p className="py-12 text-center text-sm text-gray-500 dark:text-zinc-400">Payslip details are unavailable.</p>
        ) : (
          <div className="space-y-5">
            <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-gray-50/70 dark:bg-zinc-900/50 p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{payslip.employee.name}</h3>
                    <Badge variant={payslip.status === 'PAID' ? 'success' : payslip.status === 'ON_HOLD' ? 'warning' : 'brand'} size="sm">
                      {payslip.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                    {payslip.employee.employeeCode} · {payslip.employee.designation}
                  </p>
                </div>
                <div className="sm:text-right">
                  <p className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-zinc-400">Net Pay</p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(payslip.netPay, payslip.currency)}</p>
                  {payslip.paidAt && <p className="text-[11px] text-gray-500 mt-0.5">Paid {formatPayrollDate(payslip.paidAt)}</p>}
                </div>
              </div>
              {isFetching && <p className="text-[11px] text-indigo-500 mt-3">Refreshing payslip…</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: 'Working Days', value: payslip.attendanceSummary.totalWorkingDays },
                { label: 'Paid Days', value: payslip.attendanceSummary.paidDays },
                { label: 'LOP Days', value: payslip.attendanceSummary.lopDays },
              ].map((item) => (
                <div key={item.label} className="p-3.5 rounded-xl border border-gray-200 dark:border-zinc-800 flex items-center gap-3">
                  <CalendarDays className="w-4 h-4 text-indigo-500 shrink-0" />
                  <div>
                    <p className="text-[11px] text-gray-500 dark:text-zinc-400">{item.label}</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <section className="rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
                <h3 className="px-4 py-3 bg-emerald-500/5 dark:bg-emerald-500/10 text-sm font-bold text-emerald-700 dark:text-emerald-400 border-b border-gray-200 dark:border-zinc-800">
                  Earnings
                </h3>
                <div className="px-4 py-2 divide-y divide-gray-100 dark:divide-zinc-800/70">
                  <AmountRow label="Basic" value={payslip.earnings.basic} currency={payslip.currency} />
                  <AmountRow label="House Rent Allowance" value={payslip.earnings.hra} currency={payslip.currency} />
                  <AmountRow label="Special Allowance" value={payslip.earnings.specialAllowance} currency={payslip.currency} />
                  <AmountRow label="Bonus" value={payslip.earnings.bonus} currency={payslip.currency} />
                  <AmountRow label="Reimbursements" value={payslip.earnings.reimbursements} currency={payslip.currency} />
                  <AmountRow label="Gross Earnings" value={payslip.earnings.grossEarnings} currency={payslip.currency} emphasize />
                </div>
              </section>

              <section className="rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
                <h3 className="px-4 py-3 bg-rose-500/5 dark:bg-rose-500/10 text-sm font-bold text-rose-700 dark:text-rose-400 border-b border-gray-200 dark:border-zinc-800">
                  Deductions
                </h3>
                <div className="px-4 py-2 divide-y divide-gray-100 dark:divide-zinc-800/70">
                  <AmountRow label="Employee PF" value={payslip.deductions.pfEmployee} currency={payslip.currency} />
                  <AmountRow label="ESI" value={payslip.deductions.esi} currency={payslip.currency} />
                  <AmountRow label="Professional Tax" value={payslip.deductions.professionalTax} currency={payslip.currency} />
                  <AmountRow label="TDS" value={payslip.deductions.tds} currency={payslip.currency} />
                  <AmountRow label="LOP Deduction" value={payslip.deductions.lopDeduction} currency={payslip.currency} />
                  <AmountRow label="Total Deductions" value={payslip.deductions.totalDeductions} currency={payslip.currency} emphasize />
                </div>
              </section>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-900/60 flex items-start gap-3">
                <BadgeCheck className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">PAN</p>
                  <p className="font-mono font-semibold text-gray-900 dark:text-zinc-100 mt-0.5">{payslip.employee.panNumber || 'Not provided'}</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-900/60 flex items-start gap-3">
                <Landmark className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">Bank Account</p>
                  <p className="font-mono font-semibold text-gray-900 dark:text-zinc-100 mt-0.5">{payslip.employee.bankAccountMasked || 'Not provided'}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-zinc-400">
              <Building2 className="w-3.5 h-3.5" />
              {payslip.employee.department} · {payslip.employee.designation}
            </div>
          </div>
        )}
      </div>
    </PayrollModalShell>
  );
};

export default PayslipDetailModal;
