/**
 * @file ExitAnalyticsCharts.tsx
 * @description Interactive Graphical Analytics for Exit Management featuring 9 complete charts:
 * 1. Exit Status Distribution (Interactive Donut Chart)
 * 2. Monthly Exit Trends (Line/Composed Chart)
 * 3. Department-wise Exits (Horizontal Bar Chart)
 * 4. Exit Reasons (Pie/Donut Chart)
 * 5. Notice Period Analysis (Bar Chart)
 * 6. FnF Settlement Analytics (Bar Chart & Amount)
 * 7. Knowledge Transfer Progress (Progress/Bar Chart)
 * 8. Department Clearance Analysis (Stacked Bar Chart: IT, Finance, HR, Admin, Assets)
 * 9. Exit Completion Rate (Circular Radial Gauge)
 */

import React, { useMemo } from 'react';
import {
  Calendar,
  Clock,
  CreditCard,
  FileCheck,
  CheckCircle2,
  TrendingUp,
  Building,
  ShieldAlert,
  MessageSquare,
  PieChart as PieChartIcon,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
  Area,
  RadialBarChart,
  RadialBar,
  ComposedChart,
} from 'recharts';
import { cn } from '@/shared/lib/utils';
import type { ExitCase, ExitStage } from '../types/exit.types';
import { STAGE_CONFIGS } from '../config/stageConfig';

export interface ExitAnalyticsChartsProps {
  cases: ExitCase[];
  isLoading: boolean;
  onDrillDown?: (stage: ExitStage) => void;
  className?: string;
}

const PALETTE = [
  '#6366f1', '#f59e0b', '#a855f7', '#14b8a6', '#3b82f6',
  '#ef4444', '#ec4899', '#8b5cf6', '#06b6d4', '#84cc16',
  '#f97316', '#22c55e', '#64748b', '#f43f5e',
];

const getStageColor = (stage: string) => {
  const config = STAGE_CONFIGS.find((c) => c.stage === stage);
  if (!config) return PALETTE[0];
  const colorStr = config.color.replace('text-', '').replace(' dark:text-', '').replace('-600', '').replace('-400', '');
  const colorMap: Record<string, string> = {
    indigo: '#6366f1',
    blue: '#3b82f6',
    amber: '#f59e0b',
    purple: '#a855f7',
    sky: '#0ea5e9',
    teal: '#14b8a6',
    cyan: '#06b6d4',
    emerald: '#10b981',
    violet: '#8b5cf6',
    orange: '#f97316',
    rose: '#f43f5e',
    green: '#22c55e',
    red: '#ef4444',
    slate: '#64748b',
  };
  for (const [key, value] of Object.entries(colorMap)) {
    if (colorStr.includes(key)) return value;
  }
  return PALETTE[0];
};

const formatNumber = (num: number) => new Intl.NumberFormat().format(num);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/95 dark:bg-zinc-800/95 text-white p-3 rounded-xl shadow-xl backdrop-blur-md border border-gray-700/50 text-xs">
        {label && <p className="font-bold mb-1.5">{label}</p>}
        {payload.map((entry: any, index: number) => (
          <p key={index} className="flex items-center gap-2" style={{ color: entry.color || entry.fill }}>
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color || entry.fill }} />
            <span>{entry.name}: <strong>{formatNumber(entry.value)}</strong></span>
            {entry.payload?.percentage !== undefined && (
              <span className="text-gray-400">({entry.payload.percentage}%)</span>
            )}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ChartCard: React.FC<{
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}> = ({ title, description, icon: Icon, children, action, className = '' }) => (
  <div className={cn('p-5 sm:p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] shadow-sm flex flex-col', className)}>
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-gray-100 dark:border-zinc-800/80">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400">
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">{title}</h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400">{description}</p>
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
    <div className="flex-1 min-h-[300px] pt-4">{children}</div>
  </div>
);

export const ExitAnalyticsCharts: React.FC<ExitAnalyticsChartsProps> = ({
  cases,
  isLoading,
  onDrillDown,
  className = '',
}) => {
  // Compute chart datasets from cases
  const chartData = useMemo(() => {
    if (!cases || cases.length === 0) return null;

    // 1. Exit Status Distribution (14 Stages)
    const stageCounts: Record<string, number> = {};
    STAGE_CONFIGS.forEach((c) => {
      if (c.stage !== 'ALL') stageCounts[c.stage] = 0;
    });
    cases.forEach((c) => {
      stageCounts[c.stage] = (stageCounts[c.stage] || 0) + 1;
    });
    const statusDistribution = Object.entries(stageCounts)
      .map(([stage, count]) => ({
        stage,
        label: STAGE_CONFIGS.find((s) => s.stage === stage)?.title || stage,
        count,
        percentage: cases.length > 0 ? ((count / cases.length) * 100).toFixed(1) : '0',
        color: getStageColor(stage),
      }))
      .filter((s) => s.count > 0 || cases.length === 0);

    // 2. Monthly Exit Trends (Submissions vs Completed)
    const monthlyData: Record<string, { submissions: number; completions: number }> = {};
    cases.forEach((c) => {
      const resMonth = c.resignationDate ? c.resignationDate.slice(0, 7) : null;
      const compMonth = c.completedAt ? c.completedAt.slice(0, 7) : (c.stage === 'COMPLETED' && c.expectedLastWorkingDay ? c.expectedLastWorkingDay.slice(0, 7) : null);
      if (resMonth) {
        monthlyData[resMonth] = monthlyData[resMonth] || { submissions: 0, completions: 0 };
        monthlyData[resMonth].submissions++;
      }
      if (compMonth) {
        monthlyData[compMonth] = monthlyData[compMonth] || { submissions: 0, completions: 0 };
        monthlyData[compMonth].completions++;
      }
    });

    const monthlyTrends = Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12)
      .map(([month, data]) => {
        let shortMonth = month;
        try {
          shortMonth = new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        } catch {}
        return {
          month,
          shortMonth,
          submissions: data.submissions,
          completions: data.completions,
        };
      });

    // 3. Department-wise Exits
    const deptCounts: Record<string, number> = {};
    cases.forEach((c) => {
      const dept = c.department || 'Other';
      deptCounts[dept] = (deptCounts[dept] || 0) + 1;
    });
    const departmentExits = Object.entries(deptCounts)
      .map(([department, count]) => ({ department, count }))
      .sort((a, b) => b.count - a.count);

    // 4. Exit Reasons (Standardized)
    const reasonCounts: Record<string, number> = {
      'Better Opportunity': 0,
      'Personal Reasons': 0,
      'Salary & Benefits': 0,
      'Higher Studies': 0,
      'Relocation': 0,
      'Career Growth': 0,
      'Other': 0,
    };
    cases.forEach((c) => {
      const raw = String(c.reason || '').toUpperCase();
      if (raw.includes('BETTER') || raw.includes('OPPORTUNITY')) {
        reasonCounts['Better Opportunity']++;
      } else if (raw.includes('SALARY') || raw.includes('BENEFIT') || raw.includes('COMPENSATION')) {
        reasonCounts['Salary & Benefits']++;
      } else if (raw.includes('HIGHER') || raw.includes('STUDIES') || raw.includes('EDUCATION')) {
        reasonCounts['Higher Studies']++;
      } else if (raw.includes('RELOCATION') || raw.includes('LOCATION')) {
        reasonCounts['Relocation']++;
      } else if (raw.includes('GROWTH') || raw.includes('CAREER')) {
        reasonCounts['Career Growth']++;
      } else if (raw.includes('PERSONAL') || raw.includes('HEALTH') || raw.includes('FAMILY')) {
        reasonCounts['Personal Reasons']++;
      } else {
        reasonCounts['Other']++;
      }
    });

    const exitReasons = Object.entries(reasonCounts)
      .filter(([_, count]) => count > 0)
      .map(([reason, count]) => ({
        reason,
        count,
        percentage: cases.length > 0 ? ((count / cases.length) * 100).toFixed(1) : '0',
      }))
      .sort((a, b) => b.count - a.count);

    // 5. Notice Period Analysis
    const noticeCategories = {
      'Serving Notice': 0,
      'Completed Notice': 0,
      'Early Release': 0,
      'Notice Waived': 0,
    };
    cases.forEach((c) => {
      if (c.stage === 'NOTICE_PERIOD') {
        noticeCategories['Serving Notice']++;
      } else if (c.stage === 'COMPLETED') {
        noticeCategories['Completed Notice']++;
      } else if (String(c.comments || '').toLowerCase().includes('waiv')) {
        noticeCategories['Notice Waived']++;
      } else if (String(c.comments || '').toLowerCase().includes('early') || String(c.comments || '').toLowerCase().includes('buyout')) {
        noticeCategories['Early Release']++;
      } else {
        noticeCategories['Serving Notice']++;
      }
    });
    const noticePeriodAnalysis = Object.entries(noticeCategories)
      .map(([category, count]) => ({ category, count }));

    // 6. FnF Settlement Analytics
    const fnfCategories = {
      'Pending Settlements': 0,
      'Processing Settlements': 0,
      'Completed Settlements': 0,
    };
    let totalSettlementAmount = 0;
    cases.forEach((c) => {
      if (c.fnfStatus === 'PAID') {
        fnfCategories['Completed Settlements']++;
      } else if (c.fnfStatus === 'APPROVED' || c.fnfStatus === 'PAYMENT_PROCESSING') {
        fnfCategories['Processing Settlements']++;
      } else {
        fnfCategories['Pending Settlements']++;
      }
      totalSettlementAmount += c.settlement?.netPayable || 0;
    });
    const fnfSettlementAnalytics = Object.entries(fnfCategories).map(([category, count]) => ({
      category,
      count,
    }));

    // 7. Knowledge Transfer Progress
    const ktCategories = {
      'Not Started': 0,
      'In Progress': 0,
      'Completed': 0,
      'Overdue': 0,
    };
    cases.forEach((c) => {
      if (c.ktStatus === true) {
        ktCategories['Completed']++;
      } else if (c.stage === 'KNOWLEDGE_TRANSFER') {
        const total = c.ktTasks?.length || 0;
        const done = c.ktTasks?.filter((t) => t.status === 'COMPLETED' || t.status === 'VERIFIED').length || 0;
        if (total > 0 && done === total) {
          ktCategories['Completed']++;
        } else if (total > 0 && done > 0) {
          ktCategories['In Progress']++;
        } else {
          ktCategories['In Progress']++;
        }
      } else {
        ktCategories['Not Started']++;
      }
    });
    const ktProgress = Object.entries(ktCategories).map(([category, count]) => ({ category, count }));

    // 8. Department Clearance Analysis (IT, Finance, HR, Admin, Assets)
    const clearanceDepts = ['IT', 'Finance', 'HR', 'Admin', 'Assets'] as const;
    const clearanceAnalysis = clearanceDepts.map((dept) => {
      let pending = 0;
      let completed = 0;
      cases.forEach((c) => {
        const dKey = dept.toUpperCase() === 'ASSETS' ? 'IT' : dept.toUpperCase();
        const clearance = c.clearances?.find((cl) => cl.department === dKey);
        if (clearance?.status === 'CLEARED' || c.stage === 'COMPLETED') {
          completed++;
        } else {
          pending++;
        }
      });
      return { department: dept, pending, completed };
    });

    // 9. Exit Completion Rate
    const totalResignations = cases.filter((c) => c.stage !== 'REJECTED' && c.stage !== 'WITHDRAWN').length;
    const completedExits = cases.filter((c) => c.stage === 'COMPLETED').length;
    const pendingExits = Math.max(0, totalResignations - completedExits);
    const completionRate = totalResignations > 0 ? ((completedExits / totalResignations) * 100).toFixed(1) : '0';

    return {
      statusDistribution,
      monthlyTrends,
      departmentExits,
      exitReasons,
      noticePeriodAnalysis,
      fnfSettlementAnalytics,
      ktProgress,
      clearanceAnalysis,
      completionRate,
      completedExits,
      pendingExits,
      totalResignations,
      totalSettlementAmount,
    };
  }, [cases]);

  if (isLoading) {
    return (
      <div className={cn('grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6', className)}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="p-6 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm animate-pulse space-y-4">
            <div className="h-4 w-48 bg-gray-200 dark:bg-zinc-800 rounded" />
            <div className="h-60 bg-gray-100 dark:bg-zinc-900 rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="text-center py-16 bg-white dark:bg-[#171717] rounded-2xl border border-gray-200 dark:border-zinc-800">
        <PieChartIcon className="w-12 h-12 text-gray-300 dark:text-zinc-600 mx-auto mb-3" />
        <p className="font-semibold text-gray-700 dark:text-zinc-300">No exit separation records to analyze</p>
        <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">Adjust filters or submit a new resignation case to see analytics.</p>
      </div>
    );
  }

  const {
    statusDistribution,
    monthlyTrends,
    departmentExits,
    exitReasons,
    noticePeriodAnalysis,
    fnfSettlementAnalytics,
    ktProgress,
    clearanceAnalysis,
    completionRate,
    completedExits,
    pendingExits,
    totalResignations,
    totalSettlementAmount,
  } = chartData;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Row 1: Exit Status Distribution + Monthly Exit Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* A. Exit Status Distribution */}
        <ChartCard
          title="A. Exit Status Distribution"
          description="Separations across all 14 stages with counts and percentages"
          icon={PieChartIcon}
          action={
            <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">
              {statusDistribution.length} active stages
            </span>
          }
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={105}
                paddingAngle={2}
                dataKey="count"
                nameKey="label"
                onClick={(entry) => onDrillDown?.(entry.stage as ExitStage)}
                className="cursor-pointer"
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                layout="horizontal"
                align="center"
                verticalAlign="bottom"
                iconSize={8}
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* B. Monthly Exit Trends */}
        <ChartCard
          title="B. Monthly Exit Trends"
          description="Monthly resignation submissions vs successfully completed exits"
          icon={TrendingUp}
        >
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={monthlyTrends} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-zinc-800" />
              <XAxis dataKey="shortMonth" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend layout="horizontal" align="center" verticalAlign="bottom" wrapperStyle={{ fontSize: '11px' }} />
              <Area
                type="monotone"
                dataKey="submissions"
                name="Resignations Submitted"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.12}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="completions"
                name="Exits Completed"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 2: Department-wise Exits + Exit Reasons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* C. Department-wise Exits */}
        <ChartCard
          title="C. Department-wise Exits"
          description="Total employee separations broken down by department"
          icon={Building}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentExits} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-zinc-800" />
              <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="department"
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={120}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Separations" fill="#6366f1" radius={[0, 4, 4, 0]} maxBarSize={28}>
                {departmentExits.map((_, index) => (
                  <Cell key={index} fill={PALETTE[index % PALETTE.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* D. Exit Reasons */}
        <ChartCard
          title="D. Exit Reasons"
          description="Primary reasons recorded for employee resignations"
          icon={MessageSquare}
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={exitReasons}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="count"
                nameKey="reason"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {exitReasons.map((_, index) => (
                  <Cell key={index} fill={PALETTE[index % PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend layout="horizontal" align="center" verticalAlign="bottom" wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 3: Notice Period Analysis + FnF Settlement Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* E. Notice Period Analysis */}
        <ChartCard
          title="E. Notice Period Analysis"
          description="Status of employees currently or previously serving notice"
          icon={Calendar}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={noticePeriodAnalysis} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-zinc-800" />
              <XAxis dataKey="category" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Employees" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={40}>
                {noticePeriodAnalysis.map((_, index) => (
                  <Cell key={index} fill={['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][index % 4]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* F. FnF Settlement Analytics */}
        <ChartCard
          title="F. FnF Settlement Analytics"
          description="Payroll dues, pending settlements, and total compensation payable"
          icon={CreditCard}
          action={
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-xl border border-emerald-200/60 dark:border-emerald-900/40">
              <CreditCard className="w-3.5 h-3.5" />
              <span>₹{formatNumber(totalSettlementAmount)}</span>
            </div>
          }
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={fnfSettlementAnalytics} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-zinc-800" />
              <XAxis dataKey="category" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Cases" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40}>
                {fnfSettlementAnalytics.map((_, index) => (
                  <Cell key={index} fill={['#f59e0b', '#3b82f6', '#10b981'][index % 3]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 4: Knowledge Transfer Progress + Department Clearance Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* G. Knowledge Transfer Progress */}
        <ChartCard
          title="G. Knowledge Transfer Progress"
          description="Handover task and documentation status across exiting employees"
          icon={FileCheck}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ktProgress} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-zinc-800" />
              <XAxis dataKey="category" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Employees" fill="#a855f7" radius={[4, 4, 0, 0]} maxBarSize={40}>
                {ktProgress.map((_, index) => (
                  <Cell key={index} fill={['#64748b', '#3b82f6', '#10b981', '#ef4444'][index % 4]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* H. Department Clearance Analysis (Stacked Bar Chart: IT, Finance, HR, Admin, Assets) */}
        <ChartCard
          title="H. Department Clearance Analysis"
          description="Pending vs completed clearances across IT, Finance, HR, Admin, Assets"
          icon={ShieldAlert}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={clearanceAnalysis} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-zinc-800" />
              <XAxis dataKey="department" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend layout="horizontal" align="center" verticalAlign="bottom" wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="pending" name="Clearance Pending" fill="#f59e0b" stackId="a" maxBarSize={36} />
              <Bar dataKey="completed" name="Clearance Cleared" fill="#10b981" stackId="a" radius={[4, 4, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 5: Exit Completion Rate */}
      <ChartCard
        title="I. Exit Completion Rate"
        description="Comprehensive workforce exit velocity and separation completion status"
        icon={CheckCircle2}
      >
        <div className="flex flex-col lg:flex-row items-center justify-around gap-8 py-4">
          {/* Radial Circular Progress Gauge */}
          <div className="relative w-48 h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="70%"
                outerRadius="100%"
                barSize={14}
                data={[{ name: 'Completion', value: parseFloat(completionRate) || 0, fill: '#6366f1' }]}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar background={{ fill: '#e2e8f0' }} dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
            {/* Centered Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                {completionRate}%
              </span>
              <span className="text-[11px] text-gray-500 dark:text-zinc-400 font-medium mt-0.5">
                Completed
              </span>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-xl">
            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-900/40 text-center">
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {totalResignations}
              </div>
              <div className="text-xs text-indigo-900/70 dark:text-indigo-300/70 font-medium mt-1">
                Total Resignations
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 text-center">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {completedExits}
              </div>
              <div className="text-xs text-emerald-900/70 dark:text-emerald-300/70 font-medium mt-1">
                Completed Exits
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-center">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {pendingExits}
              </div>
              <div className="text-xs text-amber-900/70 dark:text-amber-300/70 font-medium mt-1">
                Pending Exits
              </div>
            </div>
          </div>
        </div>
      </ChartCard>
    </div>
  );
};

export default ExitAnalyticsCharts;
