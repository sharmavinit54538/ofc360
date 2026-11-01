import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Users,
  Calendar,
  Clock,
  CreditCard,
  FileCheck,
  UserX,
  CheckCircle2,
  XCircle,
  RotateCcw,
  TrendingUp,
  Building,
  ShieldAlert,
  MessageSquare,
  PieChart as PieChartIcon,
  Download,
  RefreshCw,
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
  LineChart,
  Line,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  StackedBarChart,
  ComposedChart,
} from 'recharts';
import { cn } from '@/shared/lib/utils';
import type { ExitCase, ExitStage, ExitReason } from '../types/exit.types';
import { STAGE_CONFIGS } from '../config/stageConfig';

interface ExitAnalyticsChartsProps {
  cases: ExitCase[];
  isLoading: boolean;
  filters?: Record<string, any>;
  onDrillDown?: (stage: ExitStage, employees: ExitCase[]) => void;
  className?: string;
}

const CHART_COLORS = [
  '#6366f1', '#f59e0b', '#a855f7', '#14b8a6', '#3b82f6',
  '#ef4444', '#ec4899', '#8b5cf6', '#06b6d4', '#84cc16',
  '#f97316', '#22c55e', '#64748b', '#f43f5e',
];

const STAGE_COLOR_MAP: Record<string, string> = STAGE_CONFIGS.reduce((acc, config) => {
  if (config.stage !== 'ALL') {
    acc[config.stage] = config.color.replace('text-', '').replace(' dark:text-', '').replace('-600', '').replace('-400', '');
  }
  return acc;
}, {} as Record<string, string>);

const getStageColor = (stage: string) => {
  const config = STAGE_CONFIGS.find((c) => c.stage === stage);
  if (!config) return CHART_COLORS[0];
  const colorStr = config.color.replace('text-', '').replace(' dark:text-', '').replace('-600', '').replace('-400', '');
  const colorMap: Record<string, string> = {
    'indigo': '#6366f1',
    'blue': '#3b82f6',
    'amber': '#f59e0b',
    'purple': '#a855f7',
    'sky': '#0ea5e9',
    'teal': '#14b8a6',
    'cyan': '#06b6d4',
    'emerald': '#10b981',
    'violet': '#8b5cf6',
    'orange': '#f97316',
    'rose': '#f43f5e',
    'green': '#22c55e',
    'red': '#ef4444',
    'slate': '#64748b',
  };
  for (const [key, value] of Object.entries(colorMap)) {
    if (colorStr.includes(key)) return value;
  }
  return CHART_COLORS[0];
};

const formatNumber = (num: number) => new Intl.NumberFormat().format(num);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/95 dark:bg-zinc-800/95 text-white p-3 rounded-xl shadow-xl backdrop-blur-md border border-gray-700/50">
        <p className="font-bold text-sm mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="flex items-center gap-2 text-xs" style={{ color: entry.color }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
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

const ChartCard = ({ title, description, icon: Icon, children, action, className = '' }: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) => (
  <div className={cn('p-5 sm:p-6 rounded-2xl border border-slate-100 dark:border-zinc-800 bg-white dark:bg-[#171717] shadow-sm flex flex-col', className)}>
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-gray-100 dark:border-zinc-800/80">
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">{title}</h3>
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
  const [hoveredPieIndex, setHoveredPieIndex] = useState<number | null>(null);
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  // Compute all chart data from cases
  const chartData = useMemo(() => {
    if (!cases || cases.length === 0) return null;

    // 1. Exit Status Distribution (14 stages)
    const stageCounts: Record<string, number> = {};
    cases.forEach((c) => {
      stageCounts[c.stage] = (stageCounts[c.stage] || 0) + 1;
    });
    const statusDistribution = Object.entries(stageCounts)
      .map(([stage, count]) => ({
        stage,
        label: STAGE_CONFIGS.find((s) => s.stage === stage)?.title || stage,
        count,
        percentage: ((count / cases.length) * 100).toFixed(1),
        color: getStageColor(stage),
      }))
      .sort((a, b) => b.count - a.count);

    // 2. Monthly Exit Trends
    const monthlyData: Record<string, { submissions: number; completions: number }> = {};
    cases.forEach((c) => {
      const resMonth = c.resignationDate?.slice(0, 7);
      const compMonth = c.completedAt?.slice(0, 7);
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
      .map(([month, data]) => ({
        month,
        shortMonth: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        submissions: data.submissions,
        completions: data.completions,
      }));

    // 3. Department-wise Exits
    const deptCounts: Record<string, number> = {};
    cases.forEach((c) => {
      deptCounts[c.department] = (deptCounts[c.department] || 0) + 1;
    });
    const departmentExits = Object.entries(deptCounts)
      .map(([department, count]) => ({ department, count }))
      .sort((a, b) => b.count - a.count);

    // 4. Exit Reasons
    const reasonCounts: Record<string, number> = {};
    cases.forEach((c) => {
      const reason = c.reason || 'OTHER';
      reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
    });
    const exitReasons = Object.entries(reasonCounts)
      .map(([reason, count]) => ({
        reason: reason.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
        count,
        percentage: ((count / cases.length) * 100).toFixed(1),
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
      if (c.stage === 'NOTICE_PERIOD') noticeCategories['Serving Notice']++;
      else if (c.stage === 'COMPLETED') noticeCategories['Completed Notice']++;
      else if (c.noticePeriodDetails?.status === 'WAIVED') noticeCategories['Notice Waived']++;
      else if (c.noticePeriodDetails?.status === 'BUYOUT') noticeCategories['Early Release']++;
    });
    const noticePeriodAnalysis = Object.entries(noticeCategories)
      .map(([category, count]) => ({ category, count }))
      .filter((c) => c.count > 0);

    // 6. FnF Settlement Analytics
    const fnfCategories = {
      'Pending Settlements': 0,
      'Processing Settlements': 0,
      'Completed Settlements': 0,
    };
    let totalSettlementAmount = 0;
    cases.forEach((c) => {
      if (c.fnfStatus === 'DRAFT' || c.fnfStatus === 'UNDER_REVIEW' || c.fnfStatus === 'PENDING_APPROVAL') {
        fnfCategories['Pending Settlements']++;
      } else if (c.fnfStatus === 'APPROVED' || c.fnfStatus === 'PAYMENT_PROCESSING') {
        fnfCategories['Processing Settlements']++;
      } else if (c.fnfStatus === 'PAID') {
        fnfCategories['Completed Settlements']++;
      }
      totalSettlementAmount += c.settlement?.netPayable || 0;
    });
    const fnfSettlementAnalytics = Object.entries(fnfCategories)
      .map(([category, count]) => ({ category, count }))
      .filter((c) => c.count > 0);

    // 7. Knowledge Transfer Progress
    const ktCategories = {
      'Not Started': 0,
      'In Progress': 0,
      'Completed': 0,
      'Overdue': 0,
    };
    cases.forEach((c) => {
      if (c.stage === 'KNOWLEDGE_TRANSFER') {
        const completedTasks = c.ktTasks?.filter((t) => t.status === 'COMPLETED' || t.status === 'VERIFIED').length || 0;
        const totalTasks = c.ktTasks?.length || 0;
        if (totalTasks === 0) ktCategories['Not Started']++;
        else if (completedTasks === totalTasks) ktCategories['Completed']++;
        else ktCategories['In Progress']++;
      } else if (c.ktStatus === true) {
        ktCategories['Completed']++;
      }
    });
    const ktProgress = Object.entries(ktCategories)
      .map(([category, count]) => ({ category, count }))
      .filter((c) => c.count > 0);

    // 8. Department Clearance Analysis
    const clearanceDepts = ['MANAGER', 'IT', 'FINANCE', 'ADMIN', 'HR'] as const;
    const clearanceAnalysis = clearanceDepts.map((dept) => {
      let pending = 0;
      let completed = 0;
      cases.forEach((c) => {
        const clearance = c.clearances?.find((cl) => cl.department === dept);
        if (clearance) {
          if (clearance.status === 'CLEARED') completed++;
          else pending++;
        } else {
          pending++;
        }
      });
      return { department: dept, pending, completed };
    });

    // 9. Exit Completion Rate
    const totalResignations = cases.filter((c) => c.stage !== 'REJECTED' && c.stage !== 'WITHDRAWN').length;
    const completedExits = cases.filter((c) => c.stage === 'COMPLETED').length;
    const pendingExits = totalResignations - completedExits;
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
      <div className="text-center py-12">
        <BarChart3 className="w-12 h-12 text-gray-300 dark:text-zinc-600 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-zinc-400">No exit data available for analytics</p>
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
    totalSettlementAmount,
  } = chartData;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Row 1: Status Distribution + Monthly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Exit Status Distribution"
          description="All 14 stages with employee counts and percentages"
          icon={PieChartIcon}
          action={
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-zinc-400">
              {statusDistribution.length} stages active
            </div>
          }
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="count"
                nameKey="label"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
                onMouseEnter={(_, index) => setHoveredPieIndex(index)}
                onMouseLeave={() => setHoveredPieIndex(null)}
              >
                {statusDistribution.map((_, index) => (
                  <Cell key={index} fill={getStageColor(statusDistribution[index].stage)} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                iconSize={10}
                itemDirection="left-to-right"
                formatter={(value) => {
                  const item = statusDistribution.find((s) => s.label === value);
                  return item ? `${item.label} (${item.count})` : value;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Monthly Exit Trends"
          description="Resignation submissions vs completed exits over time"
          icon={TrendingUp}
        >
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart
              data={monthlyTrends}
              margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="text-gray-200 dark:text-zinc-800" />
              <XAxis
                dataKey="shortMonth"
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend layout="horizontal" align="center" verticalAlign="bottom" />
              <Area
                type="monotone"
                dataKey="submissions"
                name="Resignations Submitted"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.15}
                strokeWidth={2}
                onMouseEnter={(_, index) => setHoveredBarIndex(index)}
                onMouseLeave={() => setHoveredBarIndex(null)}
              />
              <Line
                type="monotone"
                dataKey="completions"
                name="Exits Completed"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 3 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 2: Department-wise + Exit Reasons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Department-wise Exits"
          description="Employee separations by department"
          icon={Building}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={departmentExits}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="text-gray-200 dark:text-zinc-800" />
              <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="department"
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={140}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="count"
                name="Exits"
                fill="#6366f1"
                radius={[0, 4, 4, 0]}
                maxBarSize={40}
                onMouseEnter={(_, index) => setHoveredBarIndex(index)}
                onMouseLeave={() => setHoveredBarIndex(null)}
              >
                {departmentExits.map((_, index) => (
                  <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Exit Reasons"
          description="Reasons for employee departure"
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
                  <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                iconSize={10}
                itemDirection="left-to-right"
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 3: Notice Period + FnF Settlement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Notice Period Analysis"
          description="Notice period status across active exits"
          icon={Calendar}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={noticePeriodAnalysis}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="text-gray-200 dark:text-zinc-800" />
              <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="category"
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={140}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="count"
                name="Employees"
                fill="#f59e0b"
                radius={[0, 4, 4, 0]}
                maxBarSize={40}
              >
                {noticePeriodAnalysis.map((_, index) => (
                  <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="FnF Settlement Analytics"
          description="Full & Final settlement status and amounts"
          icon={CreditCard}
          action={
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <CreditCard className="w-3.5 h-3.5" />
              ₹{formatNumber(totalSettlementAmount)}
            </div>
          }
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={fnfSettlementAnalytics}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="count"
                nameKey="category"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {fnfSettlementAnalytics.map((_, index) => (
                  <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                iconSize={10}
                itemDirection="left-to-right"
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 4: Knowledge Transfer + Clearance Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Knowledge Transfer Progress"
          description="KT task completion status across exits"
          icon={FileCheck}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={ktProgress}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="text-gray-200 dark:text-zinc-800" />
              <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="category"
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={140}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="count"
                name="Cases"
                fill="#a855f7"
                radius={[0, 4, 4, 0]}
                maxBarSize={40}
              >
                {ktProgress.map((_, index) => (
                  <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Department Clearance Analysis"
          description="Pending vs completed clearances by department"
          icon={ShieldAlert}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={clearanceAnalysis}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="text-gray-200 dark:text-zinc-800" />
              <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="department"
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={100}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend layout="horizontal" align="center" verticalAlign="bottom" />
              <Bar
                dataKey="pending"
                name="Pending"
                fill="#f59e0b"
                radius={[0, 4, 4, 0]}
                maxBarSize={20}
              />
              <Bar
                dataKey="completed"
                name="Cleared"
                fill="#10b981"
                radius={[0, 4, 4, 0]}
                maxBarSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 5: Exit Completion Rate */}
      <ChartCard
        title="Exit Completion Rate"
        description="Overall exit workflow completion percentage"
        icon={CheckCircle2}
        className="lg:max-w-md"
      >
        <div className="flex flex-col items-center justify-center py-8">
          <div className="relative w-48 h-48">
            <RadialBarChart width={192} height={192} data={[{ completion: parseFloat(completionRate) }]}>
              <RadialBar
                cx="50%"
                cy="50%"
                innerRadius="50%"
                outerRadius="100%"
                dataKey="completion"
                stroke="#6366f1"
                strokeWidth={16}
                fill="url(#completionGradient)"
                minAngle={0}
                background={{ fill: '#e0e7ff', fillOpacity: 0.3 }}
              >
                <div className="flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">{completionRate}%</span>
                  <span className="text-xs text-gray-500 dark:text-zinc-400">Completion Rate</span>
                </div>
              </RadialBar>
              <defs>
                <linearGradient id="completionGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </RadialBarChart>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4 text-center w-full">
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/30">
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{completedExits}</p>
              <p className="text-xs text-gray-500 dark:text-zinc-400">Completed</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30">
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{pendingExits}</p>
              <p className="text-xs text-gray-500 dark:text-zinc-400">Pending</p>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-800">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalResignations}</p>
              <p className="text-xs text-gray-500 dark:text-zinc-400">Total Resignations</p>
            </div>
          </div>
        </div>
      </ChartCard>
    </div>
  );
};

export default ExitAnalyticsCharts;