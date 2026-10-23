import React from 'react';
import {
  BadgeIndianRupee,
  Banknote,
  Landmark,
  Users,
  Workflow,
} from 'lucide-react';
import { SkeletonStatCard } from '@/shared/ui/Skeleton';
import { Badge } from '@/shared/ui/Badge';
import type { PayrollStats } from '../types/payroll.types';
import { formatCurrency, formatPayrollDate, formatPayrollMonth } from '../payroll.utils';

interface PayrollKpiCardsProps {
  stats?: PayrollStats;
  isLoading: boolean;
}

interface KpiCardProps {
  title: string;
  value: React.ReactNode;
  description: React.ReactNode;
  icon: React.ReactNode;
  iconClassName: string;
}

const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  description,
  icon,
  iconClassName,
}) => (
  <div className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400">{title}</p>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconClassName}`}>
        {icon}
      </div>
    </div>
    <div className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-[#ececec] break-words">
      {value}
    </div>
    <div className="mt-1.5 text-[11px] leading-relaxed text-gray-500 dark:text-zinc-400">
      {description}
    </div>
  </div>
);

export const PayrollKpiCards: React.FC<PayrollKpiCardsProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <SkeletonStatCard key={index} />
        ))}
      </div>
    );
  }

  const statutory = stats?.statutoryBreakdown;
  const statutoryTotal = statutory
    ? statutory.pfTotal + statutory.esiTotal + statutory.ptTotal + statutory.tdsTotal
    : undefined;

  return (
    <section aria-label="Payroll summary" className="space-y-3">
      {stats && (
        <p className="text-xs font-medium text-gray-500 dark:text-zinc-400">
          Live summary for {formatPayrollMonth(stats.month, stats.year)}
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <KpiCard
          title="Total Gross Payroll"
          value={stats ? formatCurrency(stats.totalGrossPayroll) : '—'}
          description="Gross earnings for the selected payroll period"
          icon={<BadgeIndianRupee className="w-4 h-4" />}
          iconClassName="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
        />
        <KpiCard
          title="Net Payable"
          value={stats ? formatCurrency(stats.totalNetPayable) : '—'}
          description="Employee disbursement after all deductions"
          icon={<Banknote className="w-4 h-4" />}
          iconClassName="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        />
        <KpiCard
          title="Statutory Deductions"
          value={statutoryTotal !== undefined ? formatCurrency(statutoryTotal) : '—'}
          description={
            statutory
              ? `PF ${formatCurrency(statutory.pfTotal)} · TDS ${formatCurrency(statutory.tdsTotal)} · ESI ${formatCurrency(statutory.esiTotal)}`
              : 'PF, TDS, ESI, and professional tax totals'
          }
          icon={<Landmark className="w-4 h-4" />}
          iconClassName="bg-amber-500/10 text-amber-600 dark:text-amber-400"
        />
        <KpiCard
          title="Employees Processed"
          value={stats?.employeesProcessed ?? '—'}
          description={stats ? `${stats.onHoldCount} payslip${stats.onHoldCount === 1 ? '' : 's'} on hold` : 'Processed and on-hold payslips'}
          icon={<Users className="w-4 h-4" />}
          iconClassName="bg-blue-500/10 text-blue-600 dark:text-blue-400"
        />
        <KpiCard
          title="Current Run Status"
          value={
            stats ? (
              <Badge
                variant={stats.currentRunStatus === 'PAID' ? 'success' : stats.currentRunStatus === 'NOT_STARTED' ? 'slate' : 'brand'}
                size="sm"
                className="normal-case tracking-normal text-xs"
              >
                {stats.currentRunStatus.replace(/_/g, ' ')}
              </Badge>
            ) : '—'
          }
          description={stats?.payDate ? `Pay date: ${formatPayrollDate(stats.payDate)}` : 'Pay date is not available'}
          icon={<Workflow className="w-4 h-4" />}
          iconClassName="bg-violet-500/10 text-violet-600 dark:text-violet-400"
        />
      </div>
    </section>
  );
};

export default PayrollKpiCards;
