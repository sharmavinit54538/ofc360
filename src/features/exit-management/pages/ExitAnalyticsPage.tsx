import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  Building,
  TrendingDown,
  PieChart,
  Users,
  CheckCircle2,
  Clock,
  ShieldCheck,
  CreditCard,
  Info,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { ErrorDisplay } from '@/shared/ui/ErrorDisplay';
import { useToast } from '@/shared/ui/Toast';
import {
  useGetExitCasesQuery,
  useGetExitStatsQuery,
} from '../api/exitsApi';
import type { ExitCase } from '../types/exit.types';

export const ExitAnalyticsPage: React.FC = () => {
  const toast = useToast();

  const {
    data: statsData,
    isLoading: isStatsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useGetExitStatsQuery();

  const {
    data: casesResponse,
    isLoading: isCasesLoading,
    error: casesError,
    refetch: refetchCases,
  } = useGetExitCasesQuery({ limit: 100 });

  const cases = casesResponse?.items || [];
  const recordCount = cases.length;

  // Department-wise distribution
  const deptDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of cases) {
      const d = c.department || 'General';
      counts[d] = (counts[d] || 0) + 1;
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [cases]);

  // Reason breakdown
  const reasonDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of cases) {
      const r = c.reason || 'Other';
      counts[r] = (counts[r] || 0) + 1;
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [cases]);

  // Monthly exit counts (past 6 months)
  const monthlyData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const result: { label: string; count: number }[] = [];

    for (let i = 5; i >= 0; i--) {
      const monthIdx = (currentMonth - i + 12) % 12;
      result.push({
        label: months[monthIdx],
        count: 0,
      });
    }

    for (const c of cases) {
      const date = new Date(c.resignationDate);
      if (!isNaN(date.getTime())) {
        const mLabel = months[date.getMonth()];
        const match = result.find((r) => r.label === mLabel);
        if (match) match.count++;
      }
    }

    return result;
  }, [cases]);

  const maxMonthCount = Math.max(...monthlyData.map((m) => m.count), 1);
  const maxDeptCount = Math.max(...deptDistribution.map((d) => d[1]), 1);

  // CSV Export
  const handleExportCsv = () => {
    if (cases.length === 0) {
      toast.warning('No records available to export.', 'Export Empty');
      return;
    }

    const headers = [
      'Case Number',
      'Employee Name',
      'Department',
      'Designation',
      'Resignation Date',
      'Last Working Day',
      'Stage',
      'Exit Status',
      'FnF Status',
      'Net Payable (INR)',
      'Reason',
    ];

    const rows = cases.map((c) => [
      `"${c.caseNumber}"`,
      `"${c.employeeName}"`,
      `"${c.department}"`,
      `"${c.designation}"`,
      `"${c.resignationDate ? new Date(c.resignationDate).toLocaleDateString() : ''}"`,
      `"${c.expectedLastWorkingDay ? new Date(c.expectedLastWorkingDay).toLocaleDateString() : ''}"`,
      `"${c.stage}"`,
      `"${c.exitStatus}"`,
      `"${c.fnfStatus}"`,
      `"${c.settlement?.netPayable ?? 0}"`,
      `"${c.reason}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `exit_analytics_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Exported ${cases.length} records to CSV!`, 'Export Successful');
  };

  const isLoading = isStatsLoading || isCasesLoading;
  const isError = Boolean(statsError || casesError);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse p-4">
        <div className="h-28 bg-gray-200 dark:bg-zinc-800 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-100 dark:bg-zinc-900 rounded-2xl" />
          <div className="h-64 bg-gray-100 dark:bg-zinc-900 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorDisplay
        title="Unable to load exit analytics data"
        error={statsError || casesError}
        onRetry={() => {
          refetchStats();
          refetchCases();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-brand-500" />
              <span>Exit &amp; Attrition Analytics</span>
            </h2>
            <Badge variant="neutral" size="sm" className="font-mono text-[10px]">
              Calculated from {recordCount} records
            </Badge>
          </div>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
            Real-time attrition trends, department patterns, reasons distribution, and settlement status.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleExportCsv}
          className="text-xs gap-1.5 shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Analytics CSV</span>
        </Button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800">
          <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider block">
            Total Exits
          </span>
          <span className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-1 block">
            {statsData?.totalExits || recordCount}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800">
          <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider block">
            In-Flight Active
          </span>
          <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1 block">
            {statsData?.activeExits ?? 0}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800">
          <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider block">
            Manager Queue
          </span>
          <span className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1 block">
            {statsData?.pendingManagerReviews ?? 0}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800">
          <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider block">
            Pending Clearances
          </span>
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1 block">
            {statsData?.pendingClearances ?? 0}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800">
          <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider block">
            Pending F&amp;F
          </span>
          <span className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-1 block">
            {statsData?.pendingFnF ?? 0}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800">
          <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider block">
            Avg Notice Days
          </span>
          <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
            {statsData?.averageNoticeDays ?? 30}d
          </span>
        </div>
      </div>

      {/* Charts Grid (Accessible CSS/SVG bars) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend SVG Bar Chart */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
            Monthly Exit Frequency (Past 6 Months)
          </h3>
          <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-gray-100 dark:border-zinc-800">
            {monthlyData.map((m) => {
              const heightPct = Math.max(12, Math.round((m.count / maxMonthCount) * 100));
              return (
                <div key={m.label} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">
                    {m.count}
                  </span>
                  <div
                    className="w-full max-w-[40px] bg-brand-500 rounded-t-lg transition-all duration-300 hover:bg-brand-600"
                    style={{ height: `${heightPct}%` }}
                    title={`${m.label}: ${m.count} exits`}
                  />
                  <span className="text-xs text-gray-500 dark:text-zinc-400 font-medium">
                    {m.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Department-Wise Distribution Bars */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
            Department-Wise Attrition Distribution
          </h3>
          <div className="space-y-3 max-h-48 overflow-y-auto no-scrollbar pr-1">
            {deptDistribution.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No department data recorded</p>
            ) : (
              deptDistribution.map(([dept, count]) => {
                const pct = Math.round((count / maxDeptCount) * 100);
                return (
                  <div key={dept} className="space-y-1 text-xs">
                    <div className="flex justify-between text-gray-700 dark:text-zinc-300 font-medium">
                      <span>{dept}</span>
                      <span>{count} exits</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Reason Breakdown & Rehire Notice */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
            Exit Reason Breakdown
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {reasonDistribution.map(([reason, count]) => (
              <div
                key={reason}
                className="p-3 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50/70 dark:bg-zinc-900/60 flex items-center justify-between"
              >
                <span className="font-medium text-gray-800 dark:text-gray-200">{reason}</span>
                <Badge variant="brand" size="sm">
                  {count} {count === 1 ? 'exit' : 'exits'}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Rehire Eligibility Banner */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
            Rehire Eligibility &amp; Talent Pipeline
          </h3>
          <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
              <Info className="w-4 h-4 text-amber-600" />
              <span>Rehire Assessment Pending</span>
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-400">
              Formal rehire eligibility categorization (Recommended / Conditional / Not Eligible) requires backend scoring endpoints before analytics aggregates can be populated.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExitAnalyticsPage;
