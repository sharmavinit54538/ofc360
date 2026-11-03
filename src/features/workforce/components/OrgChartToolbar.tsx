/**
 * @file OrgChartToolbar.tsx
 * @description Enterprise Toolbar for Organizational Hierarchy Chart.
 * Contains:
 * 1. Title, subtitle, and live summary KPI pills (Total Employees, Departments, Managers)
 * 2. Real-time employee search input with match counter
 * 3. Department and Location filter dropdowns
 * 4. Zoom controls (Zoom In, Zoom Out, Zoom reset, Fit-to-screen)
 * 5. Expand All / Collapse All actions
 * 6. Fullscreen canvas mode toggle
 * 7. Export menu (Export as PNG, Export as PDF)
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Network,
  Users,
  Building2,
  Briefcase,
  Search,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Focus,
  Maximize,
  Minimize,
  Download,
  FileImage,
  FileText,
  Filter,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export interface OrgChartToolbarProps {
  totalEmployees: number;
  totalDepartments: number;
  totalManagers: number;
  departments: string[];
  locations: string[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedDepartment: string;
  onDepartmentChange: (department: string) => void;
  selectedLocation: string;
  onLocationChange: (location: string) => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onFitToScreen: () => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onExportPng: () => void;
  onExportPdf: () => void;
  matchCount?: number;
}

export const OrgChartToolbar: React.FC<OrgChartToolbarProps> = ({
  totalEmployees,
  totalDepartments,
  totalManagers,
  departments,
  locations,
  searchQuery,
  onSearchChange,
  selectedDepartment,
  onDepartmentChange,
  selectedLocation,
  onLocationChange,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onFitToScreen,
  onExpandAll,
  onCollapseAll,
  isFullscreen,
  onToggleFullscreen,
  onExportPng,
  onExportPdf,
  matchCount = 0,
}) => {
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // Close export dropdown on outside click
  useEffect(() => {
    if (!isExportMenuOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        exportMenuRef.current &&
        !exportMenuRef.current.contains(e.target as Node)
      ) {
        setIsExportMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isExportMenuOpen]);

  const zoomPercent = Math.round(zoom * 100);

  return (
    <div className="w-full bg-white dark:bg-[#1a1a1a] border-b border-slate-200 dark:border-zinc-800 p-4 lg:p-5 space-y-4 rounded-t-2xl">
      {/* Top Header: Title + Live Summary KPI Pills */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 shadow-2xs">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Organization Hierarchy
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Interactive top-down reporting tree, roles, and departmental structure
            </p>
          </div>
        </div>

        {/* Metric KPI Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Total Employees */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold">
            <Users className="w-3.5 h-3.5" />
            <span>{totalEmployees} Employees</span>
          </div>

          {/* Departments */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5" />
            <span>{totalDepartments} Departments</span>
          </div>

          {/* Managers */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-semibold">
            <Briefcase className="w-3.5 h-3.5" />
            <span>{totalManagers} Managers</span>
          </div>
        </div>
      </div>

      {/* Controls Bar: Search + Filters + Viewport / Export Actions */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-1 border-t border-slate-100 dark:border-zinc-800/80">
        {/* Left: Search & Filter Inputs */}
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
          {/* Search Employee Input */}
          <div className="relative min-w-[220px] sm:min-w-[260px] flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name or employee ID..."
              className={cn(
                'w-full pl-9 pr-8 py-1.5 text-xs rounded-xl border transition-colors',
                'bg-slate-50 dark:bg-zinc-800/80 text-slate-900 dark:text-white',
                'border-slate-200 dark:border-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-teal-500'
              )}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 p-0.5"
                title="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Search Match Pill (if searching) */}
          {searchQuery.trim() && (
            <span className="text-[11px] font-semibold px-2 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 whitespace-nowrap">
              {matchCount} {matchCount === 1 ? 'match' : 'matches'}
            </span>
          )}

          {/* Department Filter */}
          <div className="relative">
            <select
              value={selectedDepartment}
              onChange={(e) => onDepartmentChange(e.target.value)}
              className={cn(
                'py-1.5 pl-3 pr-7 text-xs rounded-xl border cursor-pointer appearance-none',
                'bg-slate-50 dark:bg-zinc-800/80 text-slate-700 dark:text-zinc-200',
                'border-slate-200 dark:border-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-teal-500'
              )}
              title="Filter by Department"
            >
              <option value="ALL">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
          </div>

          {/* Location Filter (if available) */}
          {locations.length > 0 && (
            <div className="relative hidden sm:block">
              <select
                value={selectedLocation}
                onChange={(e) => onLocationChange(e.target.value)}
                className={cn(
                  'py-1.5 pl-3 pr-7 text-xs rounded-xl border cursor-pointer appearance-none',
                  'bg-slate-50 dark:bg-zinc-800/80 text-slate-700 dark:text-zinc-200',
                  'border-slate-200 dark:border-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-teal-500'
                )}
                title="Filter by Location"
              >
                <option value="ALL">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
            </div>
          )}
        </div>

        {/* Right: Zoom, Branch Toggles, Fullscreen, Export Actions */}
        <div className="flex flex-wrap items-center gap-1.5 shrink-0 self-end lg:self-center">
          {/* Zoom Controls Pill Group */}
          <div className="flex items-center rounded-xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 p-0.5">
            <button
              type="button"
              onClick={onZoomOut}
              className="p-1.5 text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-white dark:hover:bg-zinc-700 transition-colors"
              title="Zoom Out (-)"
              aria-label="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={onZoomReset}
              className="px-2 py-1 text-[11px] font-mono font-bold text-slate-700 dark:text-zinc-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              title="Reset Zoom to 100%"
            >
              {zoomPercent}%
            </button>

            <button
              type="button"
              onClick={onZoomIn}
              className="p-1.5 text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-white dark:hover:bg-zinc-700 transition-colors"
              title="Zoom In (+)"
              aria-label="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>

            <div className="h-4 w-px bg-slate-200 dark:bg-zinc-700 mx-0.5" />

            <button
              type="button"
              onClick={onFitToScreen}
              className="p-1.5 text-slate-600 dark:text-zinc-300 hover:text-teal-600 dark:hover:text-teal-400 rounded-lg hover:bg-white dark:hover:bg-zinc-700 transition-colors"
              title="Fit to Screen"
              aria-label="Fit to Screen"
            >
              <Focus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Expand All / Collapse All Buttons */}
          <div className="flex items-center rounded-xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 p-0.5">
            <button
              type="button"
              onClick={onExpandAll}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:text-teal-600 dark:hover:text-teal-400 rounded-lg hover:bg-white dark:hover:bg-zinc-700 transition-colors"
              title="Expand all branches"
            >
              <Maximize2 className="w-3 h-3" />
              <span className="hidden sm:inline">Expand All</span>
            </button>

            <button
              type="button"
              onClick={onCollapseAll}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:text-teal-600 dark:hover:text-teal-400 rounded-lg hover:bg-white dark:hover:bg-zinc-700 transition-colors"
              title="Collapse reporting branches"
            >
              <Minimize2 className="w-3 h-3" />
              <span className="hidden sm:inline">Collapse</span>
            </button>
          </div>

          {/* Fullscreen Toggle Button */}
          <button
            type="button"
            onClick={onToggleFullscreen}
            className="p-2 text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white rounded-xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 hover:bg-white dark:hover:bg-zinc-700 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Chart Mode'}
            aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Chart Mode'}
          >
            {isFullscreen ? (
              <Minimize className="w-4 h-4 text-teal-600" />
            ) : (
              <Maximize className="w-4 h-4" />
            )}
          </button>

          {/* Export Dropdown Button */}
          <div className="relative" ref={exportMenuRef}>
            <button
              type="button"
              onClick={() => setIsExportMenuOpen((prev) => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-all shadow-xs cursor-pointer"
              title="Export Chart"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            {/* Dropdown Menu */}
            {isExportMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-48 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsExportMenuOpen(false);
                    onExportPng();
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors text-left"
                >
                  <FileImage className="w-4 h-4 text-teal-600" />
                  <div>
                    <div>Export as PNG</div>
                    <div className="text-[10px] text-slate-400 font-normal">
                      High resolution image
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsExportMenuOpen(false);
                    onExportPdf();
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-700 transition-colors text-left border-t border-slate-100 dark:border-zinc-700/60"
                >
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <div>
                    <div>Export as PDF</div>
                    <div className="text-[10px] text-slate-400 font-normal">
                      Printable vector document
                    </div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default OrgChartToolbar;

