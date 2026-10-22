/**
 * @file AnalyticsFilterBar.tsx
 * @description Period selector (Monthly, Quarterly, Annually), department filter dropdown,
 * and executive report export action bar for the Analytics Center.
 */

import React, { useState } from 'react';
import {
  Calendar,
  Filter,
  Download,
  RefreshCw,
  FileSpreadsheet,
  FileText,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import type { AnalyticsDateRange } from '../types';

interface AnalyticsFilterBarProps {
  dateRange: AnalyticsDateRange;
  onDateRangeChange: (val: AnalyticsDateRange) => void;
  departmentId?: string;
  onDepartmentChange: (val: string) => void;
  departments?: Array<{ id: string; name: string }>;
  onExport: (format: 'PDF' | 'CSV' | 'XLSX') => void;
  isExporting?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const AnalyticsFilterBar: React.FC<AnalyticsFilterBarProps> = ({
  dateRange,
  onDateRangeChange,
  departmentId = 'ALL',
  onDepartmentChange,
  departments = [],
  onExport,
  isExporting = false,
  onRefresh,
  isRefreshing = false,
}) => {
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  const rangeOptions: { label: string; value: AnalyticsDateRange }[] = [
    { label: 'Monthly', value: 'MONTH' },
    { label: 'Quarterly', value: 'QUARTER' },
    { label: 'Annually', value: 'YEAR' },
  ];

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Left: Period Segmented Selector & Department Filter */}
      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
        {/* Period Selector Tabs */}
        <div className="inline-flex p-1 rounded-xl bg-gray-100 dark:bg-zinc-800/80 border border-gray-200/60 dark:border-zinc-700/60">
          {rangeOptions.map((opt) => {
            const isActive = dateRange === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onDateRangeChange(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-white dark:bg-zinc-900 text-gray-900 dark:text-white shadow-2xs'
                    : 'text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Department Filter */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <select
            value={departmentId}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          >
            <option value="ALL">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right: Refresh & Export Actions */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        {onRefresh && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="rounded-xl flex items-center gap-1.5"
            title="Refresh metrics from server"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        )}

        {/* Export Dropdown */}
        <div className="relative">
          <Button
            variant="primary"
            size="sm"
            disabled={isExporting}
            onClick={() => setIsExportMenuOpen((prev) => !prev)}
            className="rounded-xl flex items-center gap-1.5 shadow-sm shadow-brand-500/20"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Generating...' : 'Export Report'}</span>
            <ChevronDown className="w-3 h-3 ml-0.5" />
          </Button>

          {isExportMenuOpen && (
            <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-xl py-1 z-40 text-xs animate-in zoom-in-95">
              <button
                type="button"
                onClick={() => {
                  setIsExportMenuOpen(false);
                  onExport('PDF');
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-zinc-800 flex items-center gap-2 text-gray-700 dark:text-zinc-300"
              >
                <FileText className="w-4 h-4 text-rose-500" />
                <span>Executive Summary (PDF)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsExportMenuOpen(false);
                  onExport('CSV');
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-zinc-800 flex items-center gap-2 text-gray-700 dark:text-zinc-300"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                <span>Raw Data (CSV)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsExportMenuOpen(false);
                  onExport('XLSX');
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-zinc-800 flex items-center gap-2 text-gray-700 dark:text-zinc-300"
              >
                <FileSpreadsheet className="w-4 h-4 text-blue-500" />
                <span>Workbook (Excel)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsFilterBar;
