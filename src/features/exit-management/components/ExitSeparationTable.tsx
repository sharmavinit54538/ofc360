/**
 * @file ExitSeparationTable.tsx
 * @description Enterprise-grade Employee Separation Management Table with column sorting,
 * multi-attribute search, stage filtering, pagination, and Excel/CSV export.
 */

import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  Eye,
  Filter,
  ChevronLeft,
  ChevronRight,
  User,
  Calendar,
  Building,
  Briefcase,
  FileSpreadsheet,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  ShieldAlert,
  Laptop,
  CreditCard,
  FileCheck,
  UserX,
} from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import type { ExitCase, ExitStage } from '../types/exit.types';
import { STAGE_CONFIGS } from '../config/stageConfig';
import { calculateNoticeDays } from '../mappers/exitMappers';

export interface ExitSeparationTableProps {
  cases: ExitCase[];
  isLoading: boolean;
  onViewDetails: (exitCase: ExitCase) => void;
  onEditCase?: (exitCase: ExitCase) => void;
  onExportCsv?: () => void;
  onExportExcel?: () => void;
  selectedStageFilter?: ExitStage | 'ALL';
  onStageFilterChange?: (stage: ExitStage | 'ALL') => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

type SortField = 'employeeId' | 'employeeName' | 'department' | 'designation' | 'resignationDate' | 'expectedLastWorkingDay' | 'stage';
type SortOrder = 'asc' | 'desc';

export const ExitSeparationTable: React.FC<ExitSeparationTableProps> = ({
  cases,
  isLoading,
  onViewDetails,
  onEditCase,
  onExportCsv,
  onExportExcel,
  selectedStageFilter = 'ALL',
  onStageFilterChange,
  searchQuery = '',
  onSearchChange,
}) => {
  // Sorting State
  const [sortField, setSortField] = useState<SortField>('resignationDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Table local stage filter (if not managed globally)
  const [localStageFilter, setLocalStageFilter] = useState<ExitStage | 'ALL'>(selectedStageFilter);

  const activeStage = onStageFilterChange ? selectedStageFilter : localStageFilter;
  const handleStageChange = (st: ExitStage | 'ALL') => {
    if (onStageFilterChange) {
      onStageFilterChange(st);
    } else {
      setLocalStageFilter(st);
    }
    setCurrentPage(1);
  };

  // Toggle column sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  // Filter and Sort Data
  const processedData = useMemo(() => {
    let result = [...cases];

    // Filter by stage
    if (activeStage !== 'ALL') {
      result = result.filter((c) => c.stage === activeStage);
    }

    // Filter by search query (Employee Name, Employee ID, Department, Designation)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.employeeName.toLowerCase().includes(q) ||
          c.employeeId.toLowerCase().includes(q) ||
          c.department.toLowerCase().includes(q) ||
          c.designation.toLowerCase().includes(q) ||
          (c.managerName && c.managerName.toLowerCase().includes(q)) ||
          (c.caseNumber && c.caseNumber.toLowerCase().includes(q))
      );
    }

    // Sort
    result.sort((a, b) => {
      let valA: string | number = '';
      let valB: string | number = '';

      switch (sortField) {
        case 'employeeId':
          valA = a.employeeId || '';
          valB = b.employeeId || '';
          break;
        case 'employeeName':
          valA = a.employeeName || '';
          valB = b.employeeName || '';
          break;
        case 'department':
          valA = a.department || '';
          valB = b.department || '';
          break;
        case 'designation':
          valA = a.designation || '';
          valB = b.designation || '';
          break;
        case 'resignationDate':
          valA = a.resignationDate ? new Date(a.resignationDate).getTime() : 0;
          valB = b.resignationDate ? new Date(b.resignationDate).getTime() : 0;
          break;
        case 'expectedLastWorkingDay':
          valA = a.expectedLastWorkingDay ? new Date(a.expectedLastWorkingDay).getTime() : 0;
          valB = b.expectedLastWorkingDay ? new Date(b.expectedLastWorkingDay).getTime() : 0;
          break;
        case 'stage':
          valA = a.stage || '';
          valB = b.stage || '';
          break;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [cases, activeStage, searchQuery, sortField, sortOrder]);

  // Pagination slice
  const totalItems = processedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, currentPage, pageSize]);

  // Export handlers
  const handleExportCsvInternal = () => {
    if (onExportCsv) {
      onExportCsv();
      return;
    }

    // Default built-in CSV export
    const headers = [
      'Employee ID',
      'Employee Name',
      'Email',
      'Department',
      'Designation',
      'Reporting Manager',
      'Resignation Date',
      'Last Working Day',
      'Notice Days',
      'Exit Reason',
      'Current Stage',
      'Status',
    ];

    const rows = processedData.map((c) => [
      `"${c.employeeId}"`,
      `"${c.employeeName}"`,
      `"${c.employeeEmail || ''}"`,
      `"${c.department}"`,
      `"${c.designation}"`,
      `"${c.managerName || ''}"`,
      `"${c.resignationDate || ''}"`,
      `"${c.expectedLastWorkingDay || ''}"`,
      `"${c.noticeDays || ''}"`,
      `"${typeof c.reason === 'string' ? c.reason : ''}"`,
      `"${c.stage}"`,
      `"${c.exitStatus}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Exit_Separation_Records_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportExcelInternal = () => {
    if (onExportExcel) {
      onExportExcel();
      return;
    }
    // Excel XML / CSV tab format
    handleExportCsvInternal();
  };

  // Helper: Format reason
  const formatReason = (reason?: string) => {
    if (!reason) return 'Not Specified';
    return reason.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // Helper: Stage badge
  const renderStageBadge = (stage: ExitStage) => {
    const config = STAGE_CONFIGS.find((s) => s.stage === stage);
    const label = config?.title || stage;
    const variant = config?.badgeVariant || 'brand';

    return (
      <Badge variant={variant} size="sm" className="whitespace-nowrap font-medium">
        {label}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      {/* Table Controls & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-white dark:bg-[#171717] rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-zinc-500" />
          <input
            type="text"
            placeholder="Search by name, ID, department, manager..."
            value={searchQuery}
            onChange={(e) => {
              onSearchChange?.(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50/80 dark:bg-zinc-900/60 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
        </div>

        {/* Stage Filter Dropdown & Export Buttons */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <select
            value={activeStage}
            onChange={(e) => handleStageChange(e.target.value as ExitStage | 'ALL')}
            className="px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          >
            {STAGE_CONFIGS.map((s) => (
              <option key={s.stage} value={s.stage}>
                {s.title}
              </option>
            ))}
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsvInternal}
            className="gap-1.5 text-xs"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Export CSV</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportExcelInternal}
            className="gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
            title="Export Excel"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Export Excel</span>
          </Button>
        </div>
      </div>

      {/* Main Employee Separation Table */}
      <div className="overflow-hidden rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-zinc-800 bg-gray-50/80 dark:bg-zinc-900/60 text-gray-600 dark:text-zinc-400 font-semibold uppercase tracking-wider select-none">
                <th
                  onClick={() => handleSort('employeeId')}
                  className="py-3.5 px-4 cursor-pointer hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Employee ID</span>
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('employeeName')}
                  className="py-3.5 px-4 cursor-pointer hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Employee</span>
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('department')}
                  className="py-3.5 px-4 cursor-pointer hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Department</span>
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('designation')}
                  className="py-3.5 px-4 cursor-pointer hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Designation</span>
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Reporting Manager</th>
                <th
                  onClick={() => handleSort('resignationDate')}
                  className="py-3.5 px-4 cursor-pointer hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Resignation Date</span>
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('expectedLastWorkingDay')}
                  className="py-3.5 px-4 cursor-pointer hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Last Working Day</span>
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Notice Period</th>
                <th className="py-3.5 px-4">Exit Reason</th>
                <th
                  onClick={() => handleSort('stage')}
                  className="py-3.5 px-4 cursor-pointer hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Current Stage</span>
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/60">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="py-4 px-4"><div className="h-4 w-16 bg-gray-200 dark:bg-zinc-800 rounded" /></td>
                    <td className="py-4 px-4"><div className="h-4 w-32 bg-gray-200 dark:bg-zinc-800 rounded" /></td>
                    <td className="py-4 px-4"><div className="h-4 w-24 bg-gray-200 dark:bg-zinc-800 rounded" /></td>
                    <td className="py-4 px-4"><div className="h-4 w-28 bg-gray-200 dark:bg-zinc-800 rounded" /></td>
                    <td className="py-4 px-4"><div className="h-4 w-24 bg-gray-200 dark:bg-zinc-800 rounded" /></td>
                    <td className="py-4 px-4"><div className="h-4 w-20 bg-gray-200 dark:bg-zinc-800 rounded" /></td>
                    <td className="py-4 px-4"><div className="h-4 w-20 bg-gray-200 dark:bg-zinc-800 rounded" /></td>
                    <td className="py-4 px-4"><div className="h-4 w-16 bg-gray-200 dark:bg-zinc-800 rounded" /></td>
                    <td className="py-4 px-4"><div className="h-4 w-28 bg-gray-200 dark:bg-zinc-800 rounded" /></td>
                    <td className="py-4 px-4"><div className="h-6 w-28 bg-gray-200 dark:bg-zinc-800 rounded-full" /></td>
                    <td className="py-4 px-4 text-right"><div className="h-7 w-16 bg-gray-200 dark:bg-zinc-800 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-gray-500 dark:text-zinc-400">
                    <User className="w-10 h-10 mx-auto text-gray-300 dark:text-zinc-600 mb-2" />
                    <p className="font-semibold text-sm text-gray-700 dark:text-zinc-300">
                      No separation records found
                    </p>
                    <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">
                      No employees match the active filters or search query.
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => {
                  const { remainingDays } = calculateNoticeDays(
                    item.resignationDate,
                    item.expectedLastWorkingDay,
                    item.noticeDays
                  );
                  const isUrgentNotice =
                    item.stage !== 'COMPLETED' &&
                    item.stage !== 'REJECTED' &&
                    item.stage !== 'WITHDRAWN' &&
                    remainingDays <= 7 &&
                    remainingDays >= 0;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50/70 dark:hover:bg-zinc-900/40 transition-colors"
                    >
                      {/* Employee ID */}
                      <td className="py-3.5 px-4 font-mono font-semibold text-gray-700 dark:text-zinc-300">
                        {item.employeeId}
                      </td>

                      {/* Employee Name & Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-bold flex items-center justify-center text-xs flex-shrink-0 border border-brand-200 dark:border-brand-800/40">
                            {item.employeeAvatarUrl ? (
                              <img
                                src={item.employeeAvatarUrl}
                                alt={item.employeeName}
                                className="w-7 h-7 rounded-full object-cover"
                              />
                            ) : (
                              item.employeeName.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {item.employeeName}
                            </div>
                            <div className="text-[10px] text-gray-400 dark:text-zinc-500 truncate max-w-[150px]">
                              {item.employeeEmail || item.caseNumber}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4 text-gray-700 dark:text-zinc-300">
                        {item.department}
                      </td>

                      {/* Designation */}
                      <td className="py-3.5 px-4 text-gray-600 dark:text-zinc-400">
                        {item.designation}
                      </td>

                      {/* Manager */}
                      <td className="py-3.5 px-4 text-gray-700 dark:text-zinc-300">
                        {item.managerName || '—'}
                      </td>

                      {/* Resignation Date */}
                      <td className="py-3.5 px-4 text-gray-600 dark:text-zinc-400 whitespace-nowrap">
                        {item.resignationDate
                          ? new Date(item.resignationDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : '—'}
                      </td>

                      {/* Last Working Day */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="text-gray-900 dark:text-zinc-200 font-medium">
                          {item.expectedLastWorkingDay
                            ? new Date(item.expectedLastWorkingDay).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            : '—'}
                        </div>
                        {isUrgentNotice && (
                          <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-0.5 mt-0.5">
                            <Clock className="w-2.5 h-2.5" />
                            <span>{remainingDays}d left</span>
                          </div>
                        )}
                      </td>

                      {/* Notice Period */}
                      <td className="py-3.5 px-4 text-gray-700 dark:text-zinc-300 whitespace-nowrap">
                        {item.noticeDays} days
                      </td>

                      {/* Exit Reason */}
                      <td className="py-3.5 px-4 text-gray-600 dark:text-zinc-400 max-w-[140px] truncate" title={formatReason(String(item.reason))}>
                        {formatReason(String(item.reason))}
                      </td>

                      {/* Current Stage */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {renderStageBadge(item.stage)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onViewDetails(item)}
                            className="h-7 px-2 text-xs gap-1 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/30"
                            title="View Exit Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </Button>

                          {onEditCase && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onEditCase(item)}
                              className="h-7 px-2 text-xs"
                              title="Edit / Action"
                            >
                              Action
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/30">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-zinc-400">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-gray-700 dark:text-zinc-300"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>per page · Showing {totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, totalItems)} of {totalItems} records</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-7 px-2 text-xs"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Prev</span>
            </Button>

            <span className="text-xs px-2 text-gray-700 dark:text-zinc-300 font-medium">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-7 px-2 text-xs"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExitSeparationTable;

