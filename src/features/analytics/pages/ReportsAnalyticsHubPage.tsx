import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart,
  BarChart2,
  PieChart,
  FileSpreadsheet,
  Download,
  Search,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Users,
  CreditCard,
  Clock,
  Gauge,
  Receipt,
  FileText,
  Box,
  ShieldCheck,
  Calendar,
  Filter,
  CheckCircle2,
  Printer,
  Share2,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { useToast } from '@/shared/ui/Toast';

interface ReportCard {
  id: string;
  title: string;
  category: 'workforce' | 'recruitment' | 'attendance' | 'payroll' | 'compliance';
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  path?: string;
  tags: string[];
  gradient: string;
  iconBg: string;
  iconColor: string;
  exportFormat: string[];
  metric?: { label: string; value: string };
}

const REPORT_MODULES: ReportCard[] = [
  {
    id: 'workforce-analytics',
    title: 'Workforce & Headcount Analytics',
    category: 'workforce',
    description: 'Real-time employee headcount growth, turnover rates, demographic distribution, and tenure cohorts.',
    icon: Users,
    path: '/dashboard/analytics',
    tags: ['Headcount', 'Turnover', 'Demographics'],
    gradient: 'from-blue-500/10 via-indigo-500/5 to-transparent',
    iconBg: 'bg-blue-500/10 dark:bg-blue-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    exportFormat: ['CSV', 'XLSX', 'PDF'],
    metric: { label: 'Retention Rate', value: '94.2%' },
  },
  {
    id: 'recruitment-reports',
    title: 'Recruitment Funnel & Sourcing',
    category: 'recruitment',
    description: 'Time-to-hire velocity, applicant source attribution, offer drop-off analysis, and recruiter KPIs.',
    icon: BarChart2,
    tags: ['Time to Hire', 'Pipeline Funnel', 'Source ROI'],
    gradient: 'from-violet-500/10 via-purple-500/5 to-transparent',
    iconBg: 'bg-violet-500/10 dark:bg-violet-500/20',
    iconColor: 'text-violet-600 dark:text-violet-400',
    exportFormat: ['CSV', 'XLSX', 'PDF'],
    metric: { label: 'Avg Time to Hire', value: '18 Days' },
  },
  {
    id: 'attendance-reports',
    title: 'Attendance & Shift Utilization',
    category: 'attendance',
    description: 'Shift adherence records, late-arrival patterns, overtime hours distribution, and geofence logs.',
    icon: Clock,
    tags: ['Shift Adherence', 'Overtime Hours', 'Lateness'],
    gradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
    iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    exportFormat: ['CSV', 'XLSX'],
    metric: { label: 'Adherence', value: '98.1%' },
  },
  {
    id: 'payroll-reports',
    title: 'Payroll Variance & Compensation',
    category: 'payroll',
    description: 'Monthly payroll cost trends, gross-to-net reconciliation, salary tax deductions, and department spend.',
    icon: CreditCard,
    tags: ['Payroll Cost', 'Gross-to-Net', 'Tax Variance'],
    gradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
    iconBg: 'bg-amber-500/10 dark:bg-amber-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
    exportFormat: ['CSV', 'XLSX', 'PDF'],
    metric: { label: 'Variance', value: '±0.4%' },
  },
  {
    id: 'leave-liability',
    title: 'Leave Balances & Absence Liability',
    category: 'attendance',
    description: 'Outstanding leave accruals, liability forecasting, peak holiday absence trends, and department leaves.',
    icon: Calendar,
    tags: ['Leave Liability', 'Accruals', 'Peak Absence'],
    gradient: 'from-cyan-500/10 via-sky-500/5 to-transparent',
    iconBg: 'bg-cyan-500/10 dark:bg-cyan-500/20',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    exportFormat: ['CSV', 'XLSX'],
    metric: { label: 'Avg Leaves Taken', value: '1.2 / mo' },
  },
  {
    id: 'performance-matrix',
    title: 'Performance & 9-Box Talent Grid',
    category: 'workforce',
    description: 'Performance appraisal score distributions, goal completion ratios, and top-tier talent retention metrics.',
    icon: Gauge,
    tags: ['9-Box Grid', 'Goal Completion', 'Top Talent'],
    gradient: 'from-purple-500/10 via-fuchsia-500/5 to-transparent',
    iconBg: 'bg-purple-500/10 dark:bg-purple-500/20',
    iconColor: 'text-purple-600 dark:text-purple-400',
    exportFormat: ['PDF', 'XLSX'],
    metric: { label: 'High Performers', value: '28%' },
  },
  {
    id: 'expenses-travel',
    title: 'Travel & Expense Spending Audit',
    category: 'payroll',
    description: 'Corporate spending breakdown by category, department travel budgets, and reimbursement turnaround times.',
    icon: Receipt,
    tags: ['Spend Breakdown', 'Travel Budgets', 'Receipt Audit'],
    gradient: 'from-rose-500/10 via-pink-500/5 to-transparent',
    iconBg: 'bg-rose-500/10 dark:bg-rose-500/20',
    iconColor: 'text-rose-600 dark:text-rose-400',
    exportFormat: ['CSV', 'XLSX', 'PDF'],
    metric: { label: 'Budget On-Track', value: '92%' },
  },
  {
    id: 'asset-audit',
    title: 'Asset Inventory & Depreciation',
    category: 'compliance',
    description: 'Hardware lifecycle status, depreciation schedules, warranty expiration tracking, and recovery audits.',
    icon: Box,
    tags: ['Hardware Life', 'Depreciation', 'Warranty'],
    gradient: 'from-teal-500/10 via-emerald-500/5 to-transparent',
    iconBg: 'bg-teal-500/10 dark:bg-teal-500/20',
    iconColor: 'text-teal-600 dark:text-teal-400',
    exportFormat: ['CSV', 'XLSX'],
    metric: { label: 'Assigned Assets', value: '98.5%' },
  },
  {
    id: 'statutory-compliance',
    title: 'Statutory Registers & Audit Exports',
    category: 'compliance',
    description: 'Government compliance registers, labor law adherence summaries, safety incident logs, and tax filings.',
    icon: ShieldCheck,
    tags: ['Statutory Registers', 'Labor Law', 'Audit Logs'],
    gradient: 'from-indigo-600/10 via-blue-500/5 to-transparent',
    iconBg: 'bg-indigo-600/10 dark:bg-indigo-600/20',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    exportFormat: ['CSV', 'PDF'],
    metric: { label: 'Compliance Audit', value: '100%' },
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Reports' },
  { id: 'workforce', label: 'Workforce & Headcount' },
  { id: 'recruitment', label: 'Recruitment & Sourcing' },
  { id: 'attendance', label: 'Attendance & Leave' },
  { id: 'payroll', label: 'Payroll & Expenses' },
  { id: 'compliance', label: 'Compliance & Audits' },
];

export const ReportsAnalyticsHubPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<ReportCard | null>(null);

  const filteredReports = useMemo(() => {
    return REPORT_MODULES.filter((r) => {
      if (selectedCategory !== 'all' && r.category !== selectedCategory) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [selectedCategory, searchQuery]);

  const handleOpenReport = (report: ReportCard) => {
    if (report.path) {
      navigate(report.path);
    } else {
      setSelectedReport(report);
    }
  };

  const handleExport = (format: string) => {
    toast.success(
      `${selectedReport?.title || 'Report'} export generated in ${format} format.`,
      'Export Download Ready'
    );
    setSelectedReport(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-6 md:p-8 shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.2),transparent_50%)]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/10 text-xs font-medium text-indigo-200">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Enterprise Business Intelligence & Reporting</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <span>Reports Hub</span>
            </h1>
            <p className="text-sm md:text-base text-slate-300">
              Interactive analytics dashboards, workforce variance insights, scheduled PDF/Excel reports, and statutory audit registers.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/dashboard/analytics')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30 flex items-center gap-2"
            >
              <LineChart className="w-4 h-4" />
              <span>Interactive Analytics</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info('Export queue scheduler active', 'Scheduler')}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Bulk Export</span>
            </Button>
          </div>
        </div>

        {/* Live Counters */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 text-xs">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-slate-400 block text-[11px]">Ready Reports</span>
            <span className="text-xl font-bold text-white mt-0.5 block">9 Datasets</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-slate-400 block text-[11px]">Data Synchronization</span>
            <span className="text-xl font-bold text-emerald-400 mt-0.5 block flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Real-time
            </span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-slate-400 block text-[11px]">Scheduled Exports</span>
            <span className="text-xl font-bold text-indigo-300 mt-0.5 block">12 Active</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-slate-400 block text-[11px]">Audit Readiness</span>
            <span className="text-xl font-bold text-cyan-300 mt-0.5 block">100% Validated</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                'px-3.5 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all duration-150',
                selectedCategory === cat.id
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm font-semibold'
                  : 'bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-zinc-700 hover:text-slate-900 dark:hover:text-white'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-72 shrink-0">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reports by keyword..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Grid of Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredReports.map((report) => {
          const Icon = report.icon;

          return (
            <div
              key={report.id}
              onClick={() => handleOpenReport(report)}
              className={cn(
                'group relative flex flex-col justify-between rounded-2xl p-6 cursor-pointer',
                'bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-zinc-800',
                'hover:border-indigo-400 dark:hover:border-indigo-500/60 hover:shadow-xl hover:-translate-y-0.5',
                'transition-all duration-200 overflow-hidden'
              )}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleOpenReport(report);
                }
              }}
            >
              {/* Subtle top corner gradient */}
              <div
                className={cn(
                  'absolute top-0 right-0 w-36 h-36 bg-gradient-to-br opacity-80 pointer-events-none rounded-bl-full transition-opacity group-hover:opacity-100',
                  report.gradient
                )}
              />

              <div className="relative z-10 space-y-4">
                {/* Icon & Metric badge */}
                <div className="flex items-center justify-between">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 duration-200',
                      report.iconBg
                    )}
                  >
                    <Icon className={cn('w-6 h-6', report.iconColor)} />
                  </div>
                  {report.metric && (
                    <div className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800/80 border border-slate-200/60 dark:border-zinc-700/60 text-right">
                      <span className="text-[10px] text-slate-500 dark:text-zinc-400 block leading-none">
                        {report.metric.label}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 block leading-none">
                        {report.metric.value}
                      </span>
                    </div>
                  )}
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {report.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {report.description}
                  </p>
                </div>

                {/* Feature Tags & Formats */}
                <div className="space-y-2 pt-1">
                  <div className="flex flex-wrap gap-1.5">
                    {report.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-zinc-800/80 text-slate-600 dark:text-zinc-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-zinc-500">
                    <span>Formats:</span>
                    {report.exportFormat.map((fmt) => (
                      <span
                        key={fmt}
                        className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-zinc-800 text-[10px] font-semibold text-slate-700 dark:text-zinc-300"
                      >
                        {fmt}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Footer */}
              <div className="relative z-10 pt-4 mt-4 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>Generate & View Report</span>
                <span className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-200">
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-slate-200 dark:border-zinc-800">
          <Search className="w-10 h-10 text-slate-400 dark:text-zinc-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            No reports match &ldquo;{searchQuery}&rdquo;
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Try searching for another keyword or select &quot;All Reports&quot;.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="mt-4 px-4 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-medium hover:bg-indigo-100 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Report Export & Preview Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-slate-200 dark:border-zinc-800 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', selectedReport.iconBg)}>
                  <selectedReport.icon className={cn('w-6 h-6', selectedReport.iconColor)} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedReport.title}</h3>
                  <Badge variant="outline" size="sm" className="mt-1">
                    {selectedReport.category.toUpperCase()}
                  </Badge>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
              {selectedReport.description}
            </p>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block">
                Export Options & Formats:
              </span>
              <div className="flex items-center gap-2">
                {selectedReport.exportFormat.map((fmt) => (
                  <Button
                    key={fmt}
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport(fmt)}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download {fmt}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-zinc-800">
              <Button variant="ghost" size="sm" onClick={() => setSelectedReport(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  toast.success(`${selectedReport.title} live table generated`, 'Preview Ready');
                  setSelectedReport(null);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Generate Online Preview
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsAnalyticsHubPage;
