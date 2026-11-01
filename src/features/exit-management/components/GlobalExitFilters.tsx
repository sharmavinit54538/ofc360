import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar,
  Filter,
  X,
  ChevronDown,
  Building,
  MapPin,
  Briefcase,
  Users,
  Clock,
  Search,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { Select } from '@/shared/ui/Select';
import { Input } from '@/shared/ui/Input';
import { cn } from '@/shared/lib/utils';

export interface GlobalFiltersState {
  dateRange: {
    preset: 'today' | 'thisWeek' | 'thisMonth' | 'last3Months' | 'last6Months' | 'thisYear' | 'custom';
    startDate?: string;
    endDate?: string;
  };
  department: string;
  location: string;
  employmentType: string;
  stage: string;
  exitStatus: string;
  fnfStatus: string;
}

export interface GlobalExitFiltersProps {
  filters: GlobalFiltersState;
  onFiltersChange: (filters: GlobalFiltersState) => void;
  onReset: () => void;
  isOpen: boolean;
  onClose: () => void;
  departments?: string[];
  locations?: string[];
  employmentTypes?: string[];
  stages?: string[];
  exitStatuses?: string[];
  fnfStatuses?: string[];
}

const DATE_PRESETS = [
  { value: 'today', label: 'Today' },
  { value: 'thisWeek', label: 'This Week' },
  { value: 'thisMonth', label: 'This Month' },
  { value: 'last3Months', label: 'Last 3 Months' },
  { value: 'last6Months', label: 'Last 6 Months' },
  { value: 'thisYear', label: 'This Year' },
  { value: 'custom', label: 'Custom Range' },
];

const DEFAULT_LOCATIONS = ['All Locations', 'Mumbai', 'Bangalore', 'Delhi NCR', 'Hyderabad', 'Pune', 'Chennai', 'Remote'];
const DEFAULT_EMPLOYMENT_TYPES = ['All Types', 'Full-Time', 'Contract', 'Part-Time', 'Intern'];

export const GlobalExitFilters: React.FC<GlobalExitFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
  isOpen,
  onClose,
  departments = [],
  locations = DEFAULT_LOCATIONS,
  employmentTypes = DEFAULT_EMPLOYMENT_TYPES,
  stages = [],
  exitStatuses = [],
  fnfStatuses = [],
}) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsDatePickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasActiveFilters = React.useMemo(() => {
    return (
      filters.dateRange.preset !== 'thisMonth' ||
      filters.department !== 'ALL' ||
      filters.location !== 'ALL' ||
      filters.employmentType !== 'ALL' ||
      filters.stage !== 'ALL' ||
      filters.exitStatus !== 'ALL' ||
      filters.fnfStatus !== 'ALL'
    );
  }, [filters]);

  const activeFilterCount = React.useMemo(() => {
    let count = 0;
    if (filters.dateRange.preset !== 'thisMonth') count++;
    if (filters.department !== 'ALL') count++;
    if (filters.location !== 'ALL') count++;
    if (filters.employmentType !== 'ALL') count++;
    if (filters.stage !== 'ALL') count++;
    if (filters.exitStatus !== 'ALL') count++;
    if (filters.fnfStatus !== 'ALL') count++;
    return count;
  }, [filters]);

  const updateFilter = (key: keyof GlobalFiltersState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 animate-in fade-in-200"
      onClick={onClose}
    >
      <div
        className="absolute right-4 top-20 w-full max-w-4xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden animate-in slide-in-from-top-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Filters</h3>
            {hasActiveFilters && (
              <Badge variant="brand" size="sm">{activeFilterCount} active</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onReset(); }}>
                <X className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onClose(); }} className="p-2">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Filter Content */}
        <div className="p-4 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Date Range */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
              Date Range
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {DATE_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => {
                    updateFilter('dateRange', { preset: preset.value as any, startDate: undefined, endDate: undefined });
                    setIsDatePickerOpen(false);
                  }}
                  className={cn(
                    'px-3 py-2 rounded-xl text-sm font-medium transition-all border',
                    filters.dateRange.preset === preset.value
                      ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                      : 'bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border-gray-200 dark:border-zinc-700 hover:border-brand-300 dark:hover:border-brand-700'
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {filters.dateRange.preset === 'custom' && (
              <div className="mt-3 grid grid-cols-2 gap-3" ref={datePickerRef}>
                <div className="relative">
                  <label className="block text-xs text-gray-500 dark:text-zinc-400 mb-1">Start Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={filters.dateRange.startDate || ''}
                      onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, startDate: e.target.value })}
                      className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-[#212121] text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-xs text-gray-500 dark:text-zinc-400 mb-1">End Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={filters.dateRange.endDate || ''}
                      onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, endDate: e.target.value })}
                      className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-[#212121] text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Building className="w-4 h-4" />
              Department
            </label>
            <Select
              value={filters.department}
              onChange={(value) => updateFilter('department', value)}
              options={[{ value: 'ALL', label: 'All Departments' }, ...departments.map((d) => ({ value: d, label: d }))]}
              className="w-full"
              placeholder="All Departments"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              Location
            </label>
            <Select
              value={filters.location}
              onChange={(value) => updateFilter('location', value)}
              options={locations.map((l) => ({ value: l, label: l }))}
              className="w-full"
              placeholder="All Locations"
            />
          </div>

          {/* Employment Type */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4" />
              Employment Type
            </label>
            <Select
              value={filters.employmentType}
              onChange={(value) => updateFilter('employmentType', value)}
              options={employmentTypes.map((e) => ({ value: e, label: e }))}
              className="w-full"
              placeholder="All Types"
            />
          </div>

          {/* Stage */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              Stage
            </label>
            <Select
              value={filters.stage}
              onChange={(value) => updateFilter('stage', value)}
              options={[{ value: 'ALL', label: 'All Stages' }, ...stages.map((s) => ({ value: s, label: s.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) }))]}
              className="w-full"
              placeholder="All Stages"
            />
          </div>

          {/* Exit Status */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              Exit Status
            </label>
            <Select
              value={filters.exitStatus}
              onChange={(value) => updateFilter('exitStatus', value)}
              options={[{ value: 'ALL', label: 'All Statuses' }, ...exitStatuses.map((s) => ({ value: s, label: s.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) }))]}
              className="w-full"
              placeholder="All Statuses"
            />
          </div>

          {/* FnF Status */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Search className="w-4 h-4" />
              FnF Status
            </label>
            <Select
              value={filters.fnfStatus}
              onChange={(value) => updateFilter('fnfStatus', value)}
              options={[{ value: 'ALL', label: 'All FnF Statuses' }, ...fnfStatuses.map((s) => ({ value: s, label: s.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) }))]}
              className="w-full"
              placeholder="All FnF Statuses"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-end gap-3">
          <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onReset(); }}>
            <X className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </Button>
          <Button variant="primary" size="sm" onClick={(e) => { e.stopPropagation(); onClose(); }}>
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GlobalExitFilters;