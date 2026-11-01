/**
 * @file ExitDashboardHeader.tsx
 * @description Enterprise Exit Management Dashboard Header with premium Refresh & Export actions,
 * view switcher (Overview, Analytics, Table), global search, filter toggle, and data refresh controls.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  LayoutDashboard,
  BarChart3,
  Table,
  Filter,
  Search,
  Download,
  ChevronDown,
  Plus,
  RefreshCw,
  FileSpreadsheet,
  FileText,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { cn } from '@/shared/lib/utils';

export type ExitDashboardView = 'overview' | 'analytics' | 'table';

export interface ExitDashboardHeaderProps {
  currentView: ExitDashboardView;
  onViewChange: (view: ExitDashboardView) => void;
  onRefresh?: () => void;
  onExport: (format: 'excel' | 'csv') => void;
  onFilterToggle: () => void;
  isFiltersOpen: boolean;
  isLoading?: boolean;
  isExporting?: boolean;
  totalRecords: number;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onCreateResignation?: () => void;
  activeFilterCount?: number;
}

const VIEW_CONFIG: Record<
  ExitDashboardView,
  { label: string; icon: React.ComponentType<{ className?: string }>; description: string }
> = {
  overview: {
    label: 'Overview',
    icon: LayoutDashboard,
    description: 'KPI cards and exit workflow status',
  },
  analytics: {
    label: 'Analytics',
    icon: BarChart3,
    description: 'Interactive graphs and workforce exit insights',
  },
  table: {
    label: 'Table',
    icon: Table,
    description: 'Detailed employee separation records',
  },
};

const EXPORT_OPTIONS = [
  {
    format: 'excel' as const,
    label: 'Export Excel (.xlsx)',
    description: 'Microsoft Excel spreadsheet',
    icon: FileSpreadsheet,
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    format: 'csv' as const,
    label: 'Export CSV (.csv)',
    description: 'Comma-separated values',
    icon: FileText,
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
] as const;

export const ExitDashboardHeader: React.FC<ExitDashboardHeaderProps> = ({
  currentView,
  onViewChange,
  onRefresh,
  onExport,
  onFilterToggle,
  isFiltersOpen,
  isLoading = false,
  isExporting = false,
  totalRecords = 0,
  searchQuery = '',
  onSearchChange,
  onCreateResignation,
  activeFilterCount = 0,
}) => {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);
  const exportButtonRef = useRef<HTMLButtonElement>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    if (!onRefresh || isRefreshing) return;
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  }, [onRefresh, isRefreshing]);

  const handleExport = useCallback(
    (format: 'excel' | 'csv') => {
      if (isExporting) return;
      setIsExportOpen(false);
      onExport(format);
    },
    [onExport, isExporting]
  );

  const closeExportDropdown = useCallback(() => {
    setIsExportOpen(false);
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeExportDropdown();
      }
    },
    [closeExportDropdown]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setIsExportOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDownGlobal = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isExportOpen) {
        setIsExportOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDownGlobal);
    return () => document.removeEventListener('keydown', handleKeyDownGlobal);
  }, [isExportOpen]);

  return (
    <div className="space-y-4">
      {/* Top Toolbar: View Switcher Tabs on Left, Global Search & Action Buttons on Right */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* View Switcher Tabs / Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-gray-100/90 dark:bg-zinc-800/90 rounded-2xl border border-gray-200/80 dark:border-zinc-700/60 self-start">
          {(['overview', 'analytics', 'table'] as ExitDashboardView[]).map((view) => {
            const config = VIEW_CONFIG[view];
            const Icon = config.icon;
            const isActive = currentView === view;
            return (
              <button
                key={view}
                type="button"
                onClick={() => onViewChange(view)}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer',
                  isActive
                    ? 'bg-white dark:bg-zinc-900 text-brand-600 dark:text-brand-400 shadow-xs'
                    : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
                )}
                title={config.description}
              >
                <Icon className="w-4 h-4" />
                <span>{config.label}</span>
              </button>
            );
          })}
        </div>

        {/* Global Search and Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 max-w-2xl justify-end">
          {/* Global Search */}
          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-zinc-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search by Employee Name, ID, Department, Designation..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-[#ececec] placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
            {/* Export Dropdown - Premium Navy/Blue Gradient */}
            <div className="relative" ref={exportRef}>
              <Button
                ref={exportButtonRef}
                variant="primary"
                size="md"
                onClick={() => setIsExportOpen((prev) => !prev)}
                isLoading={isExporting}
                leftIcon={<Download className="w-4 h-4 shrink-0" />}
                rightIcon={
                  <ChevronDown
                    className={cn(
                      'w-3.5 h-3.5 shrink-0 transition-transform duration-200',
                      isExportOpen && 'rotate-180'
                    )}
                  />
                }
                className={cn(
                  'h-11 rounded-xl',
                  'bg-gradient-to-r from-slate-800 via-slate-900 to-blue-900',
                  'hover:from-slate-900 hover:via-slate-900 hover:to-blue-900',
                  'text-white border-transparent',
                  'shadow-lg shadow-slate-900/30',
                  'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950',
                  'active:scale-[0.98]',
                  'font-medium px-4 gap-2'
                )}
                disabled={isExporting}
                aria-label="Export separation records"
                aria-expanded={isExportOpen}
                aria-haspopup="menu"
                title="Export Data"
              >
                Export
              </Button>

              {isExportOpen && (
                <div
                  className="absolute right-0 top-full mt-2 z-50 min-w-[220px] rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95"
                  role="menu"
                  onKeyDown={handleKeyDown}
                >
                  {/* Dropdown Header */}
                  <div className="px-3.5 py-2.5 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                      EXPORT DATA
                    </span>
                  </div>

                  {/* Export Options */}
                  <div className="py-1">
                    {EXPORT_OPTIONS.map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.format}
                          type="button"
                          role="menuitem"
                          onClick={() => handleExport(option.format)}
                          className={cn(
                            'w-full px-3.5 py-2.5 text-left flex items-center gap-3',
                            'text-sm font-medium text-gray-700 dark:text-zinc-300',
                            'hover:bg-gray-50 dark:hover:bg-zinc-800/80',
                            'transition-colors duration-150',
                            'focus:outline-none focus:bg-gray-50 dark:focus:bg-zinc-800/80',
                            'cursor-pointer'
                          )}
                        >
                          <Icon className={cn('w-4.5 h-4.5 shrink-0', option.iconColor)} />
                          <div className="flex flex-col min-w-0">
                            <span className="truncate">{option.label}</span>
                            <span className="text-[11px] text-gray-400 dark:text-zinc-500 truncate">
                              {option.description}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Filter Toggle */}
            <Button
              variant={isFiltersOpen || activeFilterCount > 0 ? 'primary' : 'outline'}
              size="md"
              onClick={onFilterToggle}
              className={cn(
                'h-11 rounded-xl px-4 gap-2 font-medium',
                isFiltersOpen || activeFilterCount > 0
                  ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-lg shadow-brand-500/25'
                  : 'bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-900/80'
              )}
              aria-label={isFiltersOpen ? 'Close filters' : 'Open filters'}
            >
              <Filter className="w-4 h-4 shrink-0" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-white text-brand-600 font-bold dark:bg-zinc-900 dark:text-brand-400">
                  {activeFilterCount}
                </span>
              )}
            </Button>

            {/* Create Resignation Modal Trigger */}
            {onCreateResignation && (
              <Button
                variant="primary"
                size="md"
                onClick={onCreateResignation}
                className={cn(
                  'h-11 rounded-xl px-4 gap-2 font-medium',
                  'bg-gradient-to-r from-emerald-600 to-emerald-500',
                  'hover:from-emerald-500 hover:to-emerald-400',
                  'text-white shadow-lg shadow-emerald-500/25',
                  'focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950'
                )}
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span>Submit Resignation</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Record Counter Summary */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-zinc-400 pt-1">
        <span>
          {totalRecords > 0
            ? `Showing ${totalRecords} employee separation record${totalRecords !== 1 ? 's' : ''}`
            : 'No separation records found'}
        </span>
      </div>
    </div>
  );
};

export default ExitDashboardHeader;