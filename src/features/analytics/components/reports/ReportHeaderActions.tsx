/**
 * @file ReportHeaderActions.tsx
 * @description Standard header navigation, action bar, and module switcher for all 8 detailed reports.
 */

import React from 'react';
import {
  ArrowLeft,
  Download,
  FileSpreadsheet,
  FileText,
  RefreshCw,
  LayoutGrid,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import type { ReportModuleId } from '../../types';

interface ReportHeaderActionsProps {
  moduleId: ReportModuleId;
  title: string;
  category: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  onBack: () => void;
  onSelectModule?: (moduleId: ReportModuleId) => void;
  onExportCsv: () => void;
  onExportPdf: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

const ALL_MODULES: Array<{ id: ReportModuleId; label: string }> = [
  { id: 'payroll-reports', label: 'Payroll Variance & Compensation' },
  { id: 'leave-liability', label: 'Leave Balances & Absence Liability' },
  { id: 'performance-matrix', label: 'Performance & 9-Box Talent Grid' },
  { id: 'expenses-travel', label: 'Travel & Expense Spending Audit' },
  { id: 'asset-audit', label: 'Asset Inventory & Depreciation' },
  { id: 'statutory-compliance', label: 'Statutory Registers & Audit Exports' },
  { id: 'recruitment-reports', label: 'Recruitment Funnel & Sourcing' },
  { id: 'attendance-reports', label: 'Attendance & Shift Utilization' },
];

export const ReportHeaderActions: React.FC<ReportHeaderActionsProps> = ({
  moduleId,
  title,
  category,
  description,
  icon: Icon,
  iconBg,
  iconColor,
  onBack,
  onSelectModule,
  onExportCsv,
  onExportPdf,
  onRefresh,
  isRefreshing = false,
}) => {
  return (
    <div className="space-y-4">
      {/* Top Navigation Row: Back Button & Quick Module Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to All Reports Hub</span>
        </button>

        {/* Quick Module Switcher Dropdown */}
        {onSelectModule && (
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={moduleId}
              onChange={(e) => onSelectModule(e.target.value as ReportModuleId)}
              className="text-xs font-medium px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-2xs"
              aria-label="Switch analytical report module"
            >
              {ALL_MODULES.map((m) => (
                <option key={m.id} value={m.id} className="dark:bg-zinc-900">
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-zinc-800 shadow-sm">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${iconBg}`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                {title}
              </h1>
              <Badge variant="outline" size="sm" className="uppercase text-[10px] font-semibold tracking-wider">
                {category}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="text-xs flex items-center gap-1.5 border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onExportCsv}
            className="text-xs flex items-center gap-1.5 border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 shadow-2xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Export CSV</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onExportPdf}
            className="text-xs flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Download PDF Report</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportHeaderActions;

