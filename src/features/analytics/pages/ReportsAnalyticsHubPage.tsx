/**
 * @file ReportsAnalyticsHubPage.tsx
 * @description Enterprise Reports & Analytics Hub orchestrating deep interactive analytics views
 * for all 8 core HRMS reporting modules with dynamic filtering, Recharts data visualizations,
 * executive KPI cards, AI analysis panels, and audit exports.
 */

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  BarChart2,
  Download,
  Search,
  Users,
  CreditCard,
  Clock,
  Gauge,
  Receipt,
  Box,
  ShieldCheck,
  Calendar,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { useToast } from '@/shared/ui/Toast';
import type {
  AnalyticsDateRange,
  AnalyticsFilterParams,
  ReportModuleId,
} from '../types';
import { AnalyticsFilterBar } from '../components/AnalyticsFilterBar';
import {
  PayrollVarianceReportView,
  LeaveLiabilityReportView,
  PerformanceTalentReportView,
  TravelExpenseReportView,
  AssetInventoryReportView,
  StatutoryComplianceReportView,
  RecruitmentFunnelReportView,
  AttendanceShiftReportView,
} from '../components/reports';

interface ReportCard {
  id: ReportModuleId;
  title: string;
  category: 'workforce' | 'attendance' | 'payroll' | 'compliance';
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tags: string[];
  gradient: string;
  iconBg: string;
  iconColor: string;
  exportFormat: string[];
  metric: { label: string; value: string };
  highlightBadge?: string;
}

const REPORT_MODULES: ReportCard[] = [
  {
    id: 'payroll-reports',
    title: 'Payroll Variance & Compensation',
    category: 'payroll',
    description: 'Monthly payroll cost trends, gross-to-net reconciliation, CTC inflation, and department spend breakdown.',
    icon: CreditCard,
    tags: ['MoM Variance', 'Gross-to-Net', 'CTC Analysis', 'Overtime Spend'],
    gradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
    iconBg: 'bg-amber-500/10 dark:bg-amber-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
    exportFormat: ['CSV', 'XLSX', 'PDF'],
    metric: { label: 'MoM Variance', value: '+3.2%' },
    highlightBadge: 'AI Audit Ready',
  },
  {
    id: 'leave-liability',
    title: 'Leave Balances & Absence Liability',
    category: 'attendance',
    description: 'Outstanding leave accruals, balance sheet encashment provisions, and seasonal peak absenteeism warnings.',
    icon: Calendar,
    tags: ['Encashment Liability', 'Accruals', 'Peak Absence', 'Lapse Risk'],
    gradient: 'from-cyan-500/10 via-sky-500/5 to-transparent',
    iconBg: 'bg-cyan-500/10 dark:bg-cyan-500/20',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    exportFormat: ['CSV', 'XLSX', 'PDF'],
    metric: { label: 'Encashment Liability', value: '₹68.4L' },
    highlightBadge: 'Dec 31 Cutoff',
  },
  {
    id: 'performance-matrix',
    title: 'Performance & 9-Box Talent Grid',
    category: 'workforce',
    description: 'Interactive 3x3 Performance vs. Potential talent matrix, appraisal bell curve distribution, and succession bench.',
    icon: Gauge,
    tags: ['9-Box Matrix', 'Bell Curve', 'Succession Depth', 'Flight Risk'],
    gradient: 'from-purple-500/10 via-fuchsia-500/5 to-transparent',
    iconBg: 'bg-purple-500/10 dark:bg-purple-500/20',
    iconColor: 'text-purple-600 dark:text-purple-400',
    exportFormat: ['CSV', 'PDF', 'XLSX'],
    metric: { label: 'High Performers', value: '24.2%' },
    highlightBadge: '3x3 Matrix Grid',
  },
  {
    id: 'expenses-travel',
    title: 'Travel & Expense Spending Audit',
    category: 'payroll',
    description: 'Corporate travel burn rates, flight & hotel category splits, out-of-policy reimbursement audits, and departmental budgets.',
    icon: Receipt,
    tags: ['Spend Breakdown', 'Flight Surges', 'Policy Breaches', 'T&E Budget'],
    gradient: 'from-rose-500/10 via-pink-500/5 to-transparent',
    iconBg: 'bg-rose-500/10 dark:bg-rose-500/20',
    iconColor: 'text-rose-600 dark:text-rose-400',
    exportFormat: ['CSV', 'XLSX', 'PDF'],
    metric: { label: 'Budget Variance', value: '-6.4%' },
    highlightBadge: 'Forensic Audit',
  },
  {
    id: 'asset-audit',
    title: 'Asset Inventory & Depreciation',
    category: 'compliance',
    description: 'Hardware lifecycle status, 5-year straight-line depreciation amortization, and upcoming warranty expiries.',
    icon: Box,
    tags: ['Hardware Life', 'SLM Depreciation', 'Warranty Expiry', 'Stock Buffer'],
    gradient: 'from-teal-500/10 via-emerald-500/5 to-transparent',
    iconBg: 'bg-teal-500/10 dark:bg-teal-500/20',
    iconColor: 'text-teal-600 dark:text-teal-400',
    exportFormat: ['CSV', 'XLSX', 'PDF'],
    metric: { label: 'Assigned Fleet', value: '91.4%' },
    highlightBadge: 'Depreciation Curve',
  },
  {
    id: 'statutory-compliance',
    title: 'Statutory Registers & Audit Exports',
    category: 'compliance',
    description: 'Government compliance registers, EPFO & EPF ECR electronic files, ESIC returns, Form 16 batches, and Wage Register Form B.',
    icon: ShieldCheck,
    tags: ['Form 16', 'EPF ECR', 'EPFO Portals', 'Muster Roll', 'Wage Register Form B'],
    gradient: 'from-indigo-600/10 via-blue-500/5 to-transparent',
    iconBg: 'bg-indigo-600/10 dark:bg-indigo-600/20',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    exportFormat: ['CSV', 'PDF', 'XLSX'],
    metric: { label: 'Compliance Audit', value: '100%' },
    highlightBadge: 'One-Click Exports',
  },
  {
    id: 'attendance-reports',
    title: 'Attendance & Shift Utilization',
    category: 'attendance',
    description: 'Shift roster capacity adherence, AI Face Attendance vs biometric device logs, and chronic late-arrival pattern detection.',
    icon: Clock,
    tags: ['Shift Roster', 'Face vs Biometric', 'Late Marks', 'Overtime'],
    gradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
    iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    exportFormat: ['CSV', 'XLSX', 'PDF'],
    metric: { label: 'Roster Adherence', value: '97.4%' },
    highlightBadge: 'Face Attendance',
  },
];

export const ReportsAnalyticsHubPage: React.FC = () => {
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active Report Module state
  const reportParam = searchParams.get('report') as ReportModuleId | null;
  const [activeReportId, setActiveReportId] = useState<ReportModuleId | null>(reportParam);

  // Global Analytical Filters State
  const [dateRange, setDateRange] = useState<AnalyticsDateRange>('QUARTER');
  const [departmentId, setDepartmentId] = useState<string>('ALL');
  const [location, setLocation] = useState<string>('ALL');
  const [employmentType, setEmploymentType] = useState<string>('ALL');

  // Hub Category filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Synchronize URL with active report
  const handleSelectReport = (id: ReportModuleId | null) => {
    setActiveReportId(id);
    if (id) {
      setSearchParams({ report: id });
    } else {
      setSearchParams({});
    }
  };

  // Filtered reports for the Hub Grid
  const filteredReports = useMemo(() => {
    return REPORT_MODULES.filter((report) => {
      const matchesCategory =
        selectedCategory === 'ALL' || report.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        report.title.toLowerCase().includes(q) ||
        report.description.toLowerCase().includes(q) ||
        report.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Combined filters object passed down to all report views
  const currentFilters: AnalyticsFilterParams = useMemo(
    () => ({
      dateRange,
      departmentId: departmentId !== 'ALL' ? departmentId : undefined,
      location: location !== 'ALL' ? location : undefined,
      employmentType: employmentType !== 'ALL' ? employmentType : undefined,
    }),
    [dateRange, departmentId, location, employmentType]
  );

  const categories = [
    { id: 'ALL', label: 'All Modules' },
    { id: 'payroll', label: 'Compensation & Payroll' },
    { id: 'attendance', label: 'Attendance & Leaves' },
    { id: 'workforce', label: 'Performance & Talent' },
    { id: 'compliance', label: 'Compliance & Assets' },
  ];

  /* =========================================================================
   * DETAILED REPORT VIEW ROUTING
   * ========================================================================= */
  if (activeReportId) {
    return (
      <div className="space-y-6 pb-12 animate-in fade-in-50 duration-200">
        {/* Global Filter Bar sticky at top of report view */}
        <AnalyticsFilterBar
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          departmentId={departmentId}
          onDepartmentChange={setDepartmentId}
          location={location}
          onLocationChange={setLocation}
          employmentType={employmentType}
          onEmploymentTypeChange={setEmploymentType}
          onExport={(fmt) =>
            toast.info(`Generating executive ${fmt} export for ${activeReportId}...`, 'Export Enqueued')
          }
          onRefresh={() =>
            toast.info('Synchronizing data with OFC360 backend services...', 'Refreshed')
          }
        />

        {/* Dynamic Detailed View Router */}
        {activeReportId === 'payroll-reports' && (
          <PayrollVarianceReportView
            filters={currentFilters}
            onBack={() => handleSelectReport(null)}
            onSelectModule={handleSelectReport}
          />
        )}

        {activeReportId === 'leave-liability' && (
          <LeaveLiabilityReportView
            filters={currentFilters}
            onBack={() => handleSelectReport(null)}
            onSelectModule={handleSelectReport}
          />
        )}

        {activeReportId === 'performance-matrix' && (
          <PerformanceTalentReportView
            filters={currentFilters}
            onBack={() => handleSelectReport(null)}
            onSelectModule={handleSelectReport}
          />
        )}

        {activeReportId === 'expenses-travel' && (
          <TravelExpenseReportView
            filters={currentFilters}
            onBack={() => handleSelectReport(null)}
            onSelectModule={handleSelectReport}
          />
        )}

        {activeReportId === 'asset-audit' && (
          <AssetInventoryReportView
            filters={currentFilters}
            onBack={() => handleSelectReport(null)}
            onSelectModule={handleSelectReport}
          />
        )}

        {activeReportId === 'statutory-compliance' && (
          <StatutoryComplianceReportView
            filters={currentFilters}
            onBack={() => handleSelectReport(null)}
            onSelectModule={handleSelectReport}
          />
        )}

        {activeReportId === 'attendance-reports' && (
          <AttendanceShiftReportView
            filters={currentFilters}
            onBack={() => handleSelectReport(null)}
            onSelectModule={handleSelectReport}
          />
        )}
      </div>
    );
  }

  /* =========================================================================
   * MAIN HUB GRID VIEW
   * ========================================================================= */
  return (
    <div className="space-y-6 pb-12">
      {/* Semantic Landmark Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Reports &amp; Analytics Hub
            </h1>
            <Badge variant="outline" size="sm" className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200">
              <Sparkles className="w-3 h-3 mr-1 text-indigo-500 animate-pulse" />
              8 Core Modules Active
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Executive workforce intelligence, compensation variance, 9-box talent matrix, statutory registers, and shift capacity analytics.
          </p>
        </div>
      </div>

      {/* Global Filter Bar */}
      <AnalyticsFilterBar
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        departmentId={departmentId}
        onDepartmentChange={setDepartmentId}
        location={location}
        onLocationChange={setLocation}
        employmentType={employmentType}
        onEmploymentTypeChange={setEmploymentType}
        onExport={(fmt) => toast.info(`Bulk download enqueued in ${fmt} format`, 'Bulk Export')}
        onRefresh={() => toast.info('All 8 reporting modules refreshed.', 'Refreshed')}
      />

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-zinc-800/80 border border-slate-200/60 dark:border-zinc-700/60">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                selectedCategory === cat.id
                  ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reports or metrics..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-2xs"
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredReports.map((report) => {
          const Icon = report.icon;

          return (
            <div
              key={report.id}
              onClick={() => handleSelectReport(report.id)}
              className={cn(
                'group relative flex flex-col justify-between rounded-2xl p-6 cursor-pointer',
                'bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-zinc-800',
                'hover:border-indigo-400 dark:hover:border-indigo-500/60 hover:shadow-xl hover:-translate-y-1',
                'transition-all duration-200 overflow-hidden min-h-[290px]'
              )}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelectReport(report.id);
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
                {/* Header Row: Icon + Highlight Badge */}
                <div className="flex items-start justify-between">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-200 shadow-xs',
                      report.iconBg
                    )}
                  >
                    <Icon className={cn('w-6 h-6', report.iconColor)} />
                  </div>
                  {report.highlightBadge && (
                    <Badge variant="outline" size="sm" className="text-[10px] font-semibold bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xs">
                      {report.highlightBadge}
                    </Badge>
                  )}
                </div>

                {/* Module Title & Description */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                    {report.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1.5 leading-relaxed line-clamp-3">
                    {report.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {report.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Row: Key Metric & Open Action */}
              <div className="relative z-10 pt-4 mt-4 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                    {report.metric.label}
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {report.metric.value}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform">
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
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
            Try adjusting your search query or switching categories.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
            }}
            className="mt-4 px-4 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-medium hover:bg-indigo-100 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ReportsAnalyticsHubPage;
