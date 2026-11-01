/**
 * @file ExitDashboardHeader.tsx
 * @description Enterprise Exit Management Dashboard Header with view switcher (Overview,
 * Analytics, Table), global search, export, filter toggle, and data refresh controls.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  BarChart3,
  Table,
  Filter,
  Search,
  Download,
  ChevronDown,
  Plus,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';

export type ExitDashboardView = 'overview' | 'analytics' | 'table';

export interface ExitDashboardHeaderProps {
  currentView: ExitDashboardView;
  onViewChange: (view: ExitDashboardView) => void;
  onRefresh?: () => void;
  onExport: (format: 'excel' | 'csv') => void;
  onFilterToggle: () => void;
  isFiltersOpen: boolean;
  isLoading?: boolean;
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

export const ExitDashboardHeader: React.FC<ExitDashboardHeaderProps> = ({
  currentView,
  onViewChange,
  onRefresh,
  onExport,
  onFilterToggle,
  isFiltersOpen,
  isLoading = false,
  totalRecords = 0,
  searchQuery = '',
  onSearchChange,
  onCreateResignation,
  activeFilterCount = 0,
}) => {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setIsExportOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-zinc-900 text-brand-600 dark:text-brand-400 shadow-xs'
                    : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
                }`}
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
            {/* Export Dropdown */}
            <div className="relative" ref={exportRef}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExportOpen((prev) => !prev)}
                className="gap-1.5 text-xs"
                title="Export Separation Records"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </Button>

              {isExportOpen && (
                <div className="absolute right-0 top-full mt-1.5 z-50 w-44 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] shadow-xl overflow-hidden py-1 animate-in fade-in-50 zoom-in-95">
                  <button
                    type="button"
                    onClick={() => {
                      setIsExportOpen(false);
                      onExport('excel');
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800/80 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Export Excel (.xlsx)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsExportOpen(false);
                      onExport('csv');
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800/80 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                    <span>Export CSV (.csv)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Filter Toggle */}
            <Button
              variant={isFiltersOpen || activeFilterCount > 0 ? 'primary' : 'outline'}
              size="sm"
              onClick={onFilterToggle}
              className="gap-1.5 text-xs"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white text-brand-600 font-bold dark:bg-zinc-900 dark:text-brand-400">
                  {activeFilterCount}
                </span>
              )}
            </Button>

            {/* Create Resignation Modal Trigger */}
            {onCreateResignation && (
              <Button
                variant="primary"
                size="sm"
                onClick={onCreateResignation}
                className="gap-1.5 text-xs shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
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
