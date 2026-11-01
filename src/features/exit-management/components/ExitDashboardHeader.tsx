import React from 'react';
import {
  LayoutDashboard,
  BarChart3,
  Table,
  Filter,
  Search,
  Download,
  RefreshCw,
  Calendar,
  ChevronDown,
  X,
  Settings,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';

export type ExitDashboardView = 'overview' | 'analytics' | 'table';

export interface ExitDashboardHeaderProps {
  currentView: ExitDashboardView;
  onViewChange: (view: ExitDashboardView) => void;
  onRefresh: () => void;
  onExport: (format: 'excel' | 'csv') => void;
  onFilterToggle: () => void;
  isFiltersOpen: boolean;
  isLoading?: boolean;
  totalRecords: number;
}

const VIEW_CONFIG: Record<ExitDashboardView, { label: string; icon: React.ComponentType<{ className?: string }>; description: string }> = {
  overview: { label: 'Overview', icon: LayoutDashboard, description: 'KPI cards and exit workflow status' },
  analytics: { label: 'Analytics', icon: BarChart3, description: 'Interactive graphs and workforce exit insights' },
  table: { label: 'Table', icon: Table, description: 'Detailed employee separation records' },
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
}) => {
  return (
    <div className="space-y-4">
      {/* Title & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            Exit Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
            Manage employee separations, track exit workflows and analyze workforce attrition.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-zinc-800/80 rounded-xl">
          {(['overview', 'analytics', 'table'] as ExitDashboardView[]).map((view) => {
            const config = VIEW_CONFIG[view];
            const Icon = config.icon;
            const isActive = currentView === view;
            return (
              <button
                key={view}
                type="button"
                onClick={() => onViewChange(view)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white dark:bg-zinc-900 text-brand-600 dark:text-brand-400 shadow-xs'
                    : 'text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
                }`}
                title={config.description}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{config.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-0 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search by Employee, Case ID, Department..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-[#212121] text-gray-900 dark:text-[#ececec] placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="gap-1.5"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-brand-500' : ''}`} />
            <span>Refresh</span>
          </Button>

          <div className="relative">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="w-4 h-4" />
              <span>Export</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </Button>
            <div className="absolute right-0 top-full mt-1 z-50 w-40 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] shadow-lg overflow-hidden animate-in fade-in-50 zoom-in-95">
              <button
                type="button"
                onClick={() => onExport('excel')}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Export Excel (.xlsx)</span>
              </button>
              <button
                type="button"
                onClick={() => onExport('csv')}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          <Button
            variant={isFiltersOpen ? 'primary' : 'outline'}
            size="sm"
            onClick={onFilterToggle}
            className="gap-1.5"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {isFiltersOpen && <Badge variant="brand" size="xs">Active</Badge>}
          </Button>

          <Button variant="outline" size="sm" className="p-2">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Record Count */}
      <div className="text-xs text-gray-500 dark:text-zinc-400">
        {totalRecords > 0 ? `Showing ${totalRecords} employee separation record${totalRecords !== 1 ? 's' : ''}` : 'No records found'}
      </div>
    </div>
  );
};

export default ExitDashboardHeader;