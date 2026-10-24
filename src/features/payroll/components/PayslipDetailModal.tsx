/**
 * @file PayslipDetailModal.tsx
 * @description Comprehensive Indian statutory payslip modal detailing employee earnings,
 * statutory deductions (PF, ESI, PT, LWF, TDS), employer contributions (EPF, EPS, EDLI, ESI, Gratuity),
 * attendance summaries, and KYC/bank records.
 */

import React from 'react';
import {
  BadgeCheck,
  Building2,
  CalendarDays,
  CreditCard,
  Download,
  Landmark,
  Printer,
  ReceiptText,
  Shield,
  Wallet,
} from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { ErrorDisplay } from '@/shared/ui/ErrorDisplay';
import { Skeleton, SkeletonListItem } from '@/shared/ui/Skeleton';
import { useGetPayslipByIdQuery } from '../api/payrollApi';
import { formatCurrency, formatPayrollDate, formatPayrollMonth } from '../payroll.utils';
import { PayrollModalShell } from './PayrollModalShell';

interface PayslipDetailModalProps {
  payslipId: string | null;
  onClose: () => void;
}

const AmountRow: React.FC<{
  label: string;
  value: number;
  currency: string;
  subtitle?: string;
  emphasize?: boolean;
  highlightColor?: 'default' | 'rose' | 'emerald';
}> = ({
  label,
  value,
  currency,
  subtitle,
  emphasize = false,
  highlightColor = 'default',
}) => (
  <div
    className={`flex items-center justify-between gap-4 py-2.5 text-sm ${
      emphasize
        ? 'border-t border-gray-200 dark:border-zinc-800 font-bold bg-gray-50/50 dark:bg-zinc-900/40 px-2 -mx-2 rounded-lg'
        : ''
    }`}
  >
    <div>
      <span className="text-gray-700 dark:text-zinc-300">{label}</span>
      {subtitle && <p className="text-[10px] text-gray-400 dark:text-zinc-500">{subtitle}</p>}
    </div>
    <span
      className={`font-mono whitespace-nowrap ${
        highlightColor === 'emerald'
          ? 'text-emerald-600 dark:text-emerald-400 font-bold'
          : highlightColor === 'rose'
          ? 'text-rose-600 dark:text-rose-400 font-semibold'
          : 'text-gray-900 dark:text-zinc-100'
      }`}
    >
      {formatCurrency(value, currency)}
    </span>
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

  const handlePrint = () => {
    window.print();
  };

  const employerContributions = payslip?.employerContributions;
  const totalEmployerContribution = employerContributions
    ? (employerContributions.pfEmployer || 0) +
      (employerContributions.esiEmployer || 0) +
      (employerContributions.lwfEmployer || 0) +
      (employerContributions.gratuity || 0)
    : 0;

  const monthlyCtc = payslip
    ? payslip.earnings.grossEarnings + totalEmployerContribution
    : 0;

  return (
    <PayrollModalShell
      isOpen={Boolean(payslipId)}
      onClose={onClose}
      title={payslip ? `${payslip.employee.name} · Payslip` : 'Payslip Breakdown'}
      description={
        payslip
          ? `${formatPayrollMonth(payslip.month, payslip.year)} · Slip #${payslip.payslipNumber || payslip.id.slice(0, 8).toUpperCase()}`
          : 'Fetching the latest itemised payslip'
      }
      icon={<ReceiptText className="w-5 h-5 text-indigo-600" />}
      maxWidthClassName="max-w-4xl"
    >
      <div className="overflow-y-auto p-5 sm:p-7 max-h-[80vh]">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full rounded-2xl" />
            <div className="grid md:grid-cols-3 gap-4">
              <SkeletonListItem />
              <SkeletonListItem />
              <SkeletonListItem />
            </div>
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        ) : error ? (
          <ErrorDisplay
            title="Unable to load payslip breakdown"
            error={error}
            onRetry={() => refetch()}
          />
        ) : !payslip ? (
          <p className="py-12 text-center text-sm text-gray-500 dark:text-zinc-400">
            Payslip details are unavailable.
          </p>
        ) : (
          <div className="space-y-6">
            {/* Header Hero */}
            <div className="rounded-3xl border border-gray-200 dark:border-zinc-800 bg-gradient-to-br from-gray-50 to-white dark:from-zinc-900/80 dark:to-[#171717] p-5 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {payslip.employee.name}
                    </h3>
                    <Badge
                      variant={
                        payslip.status === 'PAID'
                          ? 'success'
                          : payslip.status === 'ON_HOLD'
                          ? 'warning'
                          : 'brand'
                      }
                      size="sm"
                    >
                      {payslip.status.replace(/_/g, ' ')}
                    </Badge>
                    {payslip.taxRegime && (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40">
                        {payslip.taxRegime.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1.5">
                    Emp ID: <span className="font-mono font-semibold text-gray-800 dark:text-zinc-200">{payslip.employee.employeeCode}</span> · {payslip.employee.designation} · {payslip.employee.department}
                  </p>
                </div>

                <div className="sm:text-right">
                  <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-500 dark:text-zinc-400">
                    Net Take-Home Pay
                  </p>
                  <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tracking-tight">
                    {formatCurrency(payslip.netPay, payslip.currency)}
                  </p>
                  {payslip.paidAt && (
                    <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-1">
                      Disbursed {formatPayrollDate(payslip.paidAt)}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center justify-between gap-3 pt-4 mt-4 border-t border-gray-200/80 dark:border-zinc-800">
                <span className="text-xs text-gray-400 dark:text-zinc-500">
                  {isFetching ? 'Refreshing real-time payslip data…' : 'Statutory & Tax Compliant'}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrint}
                    leftIcon={<Printer className="w-3.5 h-3.5" />}
                  >
                    Print Payslip
                  </Button>
                </div>
              </div>
            </div>

            {/* Attendance & Pro-Rata Days */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 shrink-0">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 dark:text-zinc-400">Total Working Days</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white font-mono">
                    {payslip.attendanceSummary.totalWorkingDays}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-emerald-100 dark:border-emerald-950/60 bg-emerald-50/40 dark:bg-emerald-950/20 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100/80 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 shrink-0">
                  <BadgeCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">Paid Days</p>
                  <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300 font-mono">
                    {payslip.attendanceSummary.paidDays}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-rose-100 dark:border-rose-950/60 bg-rose-50/40 dark:bg-rose-950/20 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-rose-100/80 dark:bg-rose-900/50 flex items-center justify-center text-rose-600 shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] text-rose-700 dark:text-rose-400 font-medium">Loss of Pay (LOP)</p>
                  <p className="text-lg font-bold text-rose-700 dark:text-rose-300 font-mono">
                    {payslip.attendanceSummary.lopDays} Days
                  </p>
                </div>
              </div>
            </div>

            {/* Earnings & Deductions Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Earnings Column */}
              <section className="rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900">
                <div className="px-5 py-3.5 bg-emerald-500/10 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
                  <span>Gross Earnings</span>
                  <span className="font-mono">{formatCurrency(payslip.earnings.grossEarnings, payslip.currency)}</span>
                </div>
                <div className="px-5 py-3 divide-y divide-gray-100 dark:divide-zinc-800/80">
                  <AmountRow label="Basic Salary" value={payslip.earnings.basic} currency={payslip.currency} subtitle="Fixed & pro-rated" />
                  <AmountRow label="House Rent Allowance (HRA)" value={payslip.earnings.hra} currency={payslip.currency} subtitle="40% / 50% basic allowance" />
                  <AmountRow label="Special Allowance" value={payslip.earnings.specialAllowance} currency={payslip.currency} subtitle="Balancing component" />
                  {payslip.earnings.bonus > 0 && (
                    <AmountRow label="Statutory / Performance Bonus" value={payslip.earnings.bonus} currency={payslip.currency} />
                  )}
                  {payslip.earnings.reimbursements > 0 && (
                    <AmountRow label="Non-taxable Reimbursements" value={payslip.earnings.reimbursements} currency={payslip.currency} />
                  )}
                  <AmountRow
                    label="Total Earned Gross"
                    value={payslip.earnings.grossEarnings}
                    currency={payslip.currency}
                    emphasize
                    highlightColor="emerald"
                  />
                </div>
              </section>

              {/* Deductions Column */}
              <section className="rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900">
                <div className="px-5 py-3.5 bg-rose-500/10 text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
                  <span>Deductions</span>
                  <span className="font-mono">-{formatCurrency(payslip.deductions.totalDeductions, payslip.currency)}</span>
                </div>
                <div className="px-5 py-3 divide-y divide-gray-100 dark:divide-zinc-800/80">
                  <AmountRow
                    label="Provident Fund (Employee EPF)"
                    value={payslip.deductions.pfEmployee}
                    currency={payslip.currency}
                    subtitle="12% of Basic (+ DA)"
                  />
                  <AmountRow
                    label="Employee State Insurance (ESI)"
                    value={payslip.deductions.esi}
                    currency={payslip.currency}
                    subtitle="0.75% of Gross (if ≤ ₹21,000)"
                  />
                  <AmountRow
                    label="Professional Tax (PT)"
                    value={payslip.deductions.professionalTax}
                    currency={payslip.currency}
                    subtitle="State statutory slab"
                  />
                  {payslip.deductions.lwf !== undefined && payslip.deductions.lwf > 0 && (
                    <AmountRow
                      label="Labour Welfare Fund (LWF)"
                      value={payslip.deductions.lwf}
                      currency={payslip.currency}
                      subtitle="State employee contribution"
                    />
                  )}
                  <AmountRow
                    label="Tax Deducted at Source (TDS)"
                    value={payslip.deductions.tds}
                    currency={payslip.currency}
                    subtitle="Income tax monthly projection"
                  />
                  {payslip.deductions.lopDeduction > 0 && (
                    <AmountRow
                      label="Loss of Pay (LOP) Deduction"
                      value={payslip.deductions.lopDeduction}
                      currency={payslip.currency}
                      subtitle={`${payslip.attendanceSummary.lopDays} unpaid days deducted`}
                    />
                  )}
                  <AmountRow
                    label="Total Deductions"
                    value={payslip.deductions.totalDeductions}
                    currency={payslip.currency}
                    emphasize
                    highlightColor="rose"
                  />
                </div>
              </section>
            </div>

            {/* Employer Statutory Contributions & CTC Provision */}
            {employerContributions && (
              <section className="rounded-2xl border border-indigo-100 dark:border-indigo-950/60 bg-indigo-50/30 dark:bg-indigo-950/20 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
                    Employer Statutory Contributions (Included in CTC)
                  </h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <p className="text-gray-500 dark:text-zinc-400">Employer PF (EPF + EPS + EDLI)</p>
                    <p className="font-mono font-bold text-gray-900 dark:text-white mt-0.5">
                      {formatCurrency(employerContributions.pfEmployer, payslip.currency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-zinc-400">Employer ESI (3.25%)</p>
                    <p className="font-mono font-bold text-gray-900 dark:text-white mt-0.5">
                      {formatCurrency(employerContributions.esiEmployer, payslip.currency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-zinc-400">Gratuity Provision (4.81%)</p>
                    <p className="font-mono font-bold text-gray-900 dark:text-white mt-0.5">
                      {formatCurrency(employerContributions.gratuity, payslip.currency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-zinc-400">Total Monthly CTC</p>
                    <p className="font-mono font-bold text-indigo-700 dark:text-indigo-300 mt-0.5">
                      {formatCurrency(monthlyCtc, payslip.currency)}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* KYC & Banking Reference */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-zinc-900/60 border border-gray-100 dark:border-zinc-800 flex items-start gap-3">
                <BadgeCheck className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-gray-500 dark:text-zinc-400">PAN Number</p>
                  <p className="font-mono font-bold text-gray-900 dark:text-zinc-100 mt-0.5">
                    {payslip.employee.panNumber || 'Not provided'}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-zinc-900/60 border border-gray-100 dark:border-zinc-800 flex items-start gap-3">
                <Landmark className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-gray-500 dark:text-zinc-400">Bank Account</p>
                  <p className="font-mono font-bold text-gray-900 dark:text-zinc-100 mt-0.5">
                    {payslip.employee.bankAccountMasked || 'Not provided'}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-zinc-900/60 border border-gray-100 dark:border-zinc-800 flex items-start gap-3">
                <Shield className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-gray-500 dark:text-zinc-400">UAN / PF Number</p>
                  <p className="font-mono font-bold text-gray-900 dark:text-zinc-100 mt-0.5">
                    {payslip.employee.uan || payslip.employee.pfNumber || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PayrollModalShell>
  );
};

export default PayslipDetailModal;
