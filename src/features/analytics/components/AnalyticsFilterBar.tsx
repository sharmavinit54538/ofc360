/**
 * @file AnalyticsFilterBar.tsx
 * @description Period selector (Monthly, Quarterly, Annually), department, location,
 * and employment type filter dropdowns, and executive report export action bar for the Analytics Center.
 */

import React, { useState } from 'react';
import {
  Filter,
  Download,
  RefreshCw,
  FileSpreadsheet,
  FileText,
  ChevronDown,
  MapPin,
  Briefcase,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import type { AnalyticsDateRange } from '../types';

export interface AnalyticsFilterBarProps {
  dateRange: AnalyticsDateRange;
  onDateRangeChange: (val: AnalyticsDateRange) => void;
  departmentId?: string;
  onDepartmentChange: (val: string) => void;
  location?: string;
  onLocationChange?: (val: string) => void;
  employmentType?: string;
  onEmploymentTypeChange?: (val: string) => void;
  departments?: Array<{ id: string; name: string }>;
  onExport: (format: 'PDF' | 'CSV' | 'XLSX') => void;
  isExporting?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  compact?: boolean;
}

export const AnalyticsFilterBar: React.FC<AnalyticsFilterBarProps> = ({
  dateRange,
  onDateRangeChange,
  departmentId = 'ALL',
  onDepartmentChange,
  location = 'ALL',
  onLocationChange,
  employmentType = 'ALL',
  onEmploymentTypeChange,
  departments = [],
  onExport,
  isExporting = false,
  onRefresh,
  isRefreshing = false,
  compact = false,
}) => {
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  const rangeOptions: { label: string; value: AnalyticsDateRange }[] = [
    { label: 'Monthly', value: 'MONTH' },
    { label: 'Quarterly', value: 'QUARTER' },
    { label: 'Annually', value: 'YEAR' },
  ];

  const defaultDepartments = departments.length > 0 ? departments : [
    { id: 'dept-eng', name: 'Engineering' },
    { id: 'dept-sales', name: 'Sales & BD' },
    { id: 'dept-prod', name: 'Product & UX' },
    { id: 'dept-ops', name: 'Operations' },
    { id: 'dept-mktg', name: 'Marketing' },
    { id: 'dept-hr', name: 'HR & People' },
    { id: 'dept-fin', name: 'Finance & Legal' },
  ];

  const locations = [
    { id: 'ALL', name: 'All Locations' },
    { id: 'mumbai', name: 'Mumbai HQ' },
    { id: 'bengaluru', name: 'Bengaluru R&D' },
    { id: 'gurugram', name: 'Delhi NCR' },
    { id: 'pune', name: 'Pune Delivery Ctr' },
    { id: 'remote', name: 'Remote / Work from Anywhere' },
  ];

  const employmentTypes = [
    { id: 'ALL', name: 'All Employment' },
    { id: 'full-time', name: 'Full-Time Regular' },
    { id: 'contract', name: 'Fixed-Term Contract' },
    { id: 'probation', name: 'On Probation' },
    { id: 'intern', name: 'Internship' },
  ];

  return (
    <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
      {/* Left: Period Segmented Selector & Filters */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Period Selector Tabs */}
        <div className="inline-flex p-1 rounded-xl bg-gray-100 dark:bg-zinc-800/80 border border-gray-200/60 dark:border-zinc-700/60">
          {rangeOptions.map((opt) => {
            const isActive = dateRange === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onDateRangeChange(opt.value)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
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
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs">
          <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <select
            value={departmentId}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className="bg-transparent text-gray-900 dark:text-[#ececec] focus:outline-none cursor-pointer"
            aria-label="Filter by department"
          >
            <option value="ALL">All Departments</option>
            {defaultDepartments.map((d) => (
              <option key={d.id} value={d.id} className="dark:bg-zinc-900">
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        {onLocationChange && !compact && (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs">
            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <select
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
              className="bg-transparent text-gray-900 dark:text-[#ececec] focus:outline-none cursor-pointer"
              aria-label="Filter by location"
            >
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id} className="dark:bg-zinc-900">
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Employment Type Filter */}
        {onEmploymentTypeChange && !compact && (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs">
            <Briefcase className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <select
              value={employmentType}
              onChange={(e) => onEmploymentTypeChange(e.target.value)}
              className="bg-transparent text-gray-900 dark:text-[#ececec] focus:outline-none cursor-pointer"
              aria-label="Filter by employment type"
            >
              {employmentTypes.map((t) => (
                <option key={t.id} value={t.id} className="dark:bg-zinc-900">
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right: Refresh & Export Actions */}
      <div className="flex items-center gap-2 justify-end">
        {onRefresh && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="rounded-xl flex items-center gap-1.5 text-xs"
            title="Refresh metrics from server"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
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
            className="rounded-xl flex items-center gap-1.5 shadow-sm shadow-indigo-500/20 text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Generating...' : 'Export Report'}</span>
            <ChevronDown className="w-3 h-3 ml-0.5" />
          </Button>

          {isExportMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-xl py-1 z-40 text-xs animate-in zoom-in-95">
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
