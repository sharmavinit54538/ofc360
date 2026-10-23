/**
 * @file ShiftsView.tsx
 * @description Live view for Work Shifts and Shift Schedules.
 * Lists configured shifts from the attendance engine with create/edit workflows.
 */

import React, { useMemo, useState } from 'react';
import {
  Clock,
  Plus,
  Search,
  CheckCircle2,
  Settings,
  Layers,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Link } from 'react-router-dom';
import { useGetShiftsQuery } from '@/features/attendance/api/attendanceApi';
import { ShiftsTable } from '@/features/attendance/components/ShiftsTable';
import { ShiftFormModal } from '@/features/attendance/components/ShiftFormModal';
import type { ShiftItem } from '@/features/attendance/types/attendance.types';

export const ShiftsView: React.FC = () => {
  const { data: shifts, isLoading } = useGetShiftsQuery();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<ShiftItem | null>(null);

  const filteredShifts = useMemo(() => {
    const items = shifts || [];
    const query = searchTerm.trim().toLowerCase();
    if (!query) return items;
    return items.filter(
      (shift) =>
        shift.name.toLowerCase().includes(query) ||
        shift.code.toLowerCase().includes(query) ||
        shift.startTime.includes(query) ||
        shift.endTime.includes(query)
    );
  }, [shifts, searchTerm]);

  const metrics = useMemo(() => {
    const items = shifts || [];
    const active = items.filter((s) => s.isActive).length;
    const avgGrace = items.length
      ? Math.round(items.reduce((sum, s) => sum + s.gracePeriodMinutes, 0) / items.length)
      : 0;
    const avgFullDay = items.length
      ? (items.reduce((sum, s) => sum + s.fullDayMinimumHours, 0) / items.length).toFixed(1)
      : '0.0';
    return { total: items.length, active, avgGrace, avgFullDay };
  }, [shifts]);

  const handleCreate = () => {
    setEditingShift(null);
    setIsModalOpen(true);
  };

  const handleEdit = (shift: ShiftItem) => {
    setEditingShift(shift);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              <Clock className="w-3 h-3 text-brand-500" />
              Workforce Scheduling
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-[#ececec] mt-1">
            Work Shifts & Timing Policies
          </h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
            Manage operational shift hours, break allowances, grace periods, and night shift differentials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/settings/attendance">
            <Button
              variant="secondary"
              size="sm"
              className="rounded-xl flex items-center gap-1.5"
            >
              <Settings className="w-4 h-4" />
              <span>Shift Settings</span>
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={handleCreate}
            className="rounded-xl flex items-center gap-1.5 shadow-sm shadow-brand-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Configure New Shift</span>
          </Button>
        </div>
      </div>

      {/* Metric Cards — derived from live shift definitions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-gray-500 dark:text-zinc-400 tracking-wider">
              Configured Shifts
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-[#ececec] mt-2">
            {isLoading ? '—' : `${metrics.active} / ${metrics.total}`}
          </div>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
            Active shifts out of total definitions
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-gray-500 dark:text-zinc-400 tracking-wider">
              Avg Grace Period
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-[#ececec] mt-2">
            {isLoading ? '—' : `${metrics.avgGrace} mins`}
          </div>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
            Mean arrival grace across configured shifts
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-gray-500 dark:text-zinc-400 tracking-wider">
              Avg Full-Day Hours
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-[#ececec] mt-2">
            {isLoading ? '—' : `${metrics.avgFullDay}h / day`}
          </div>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
            Mean full-day minimum work threshold
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search shift schedules by name or timing..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-gray-50 dark:bg-zinc-900/70 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-[#ececec] placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Live shifts table */}
      <ShiftsTable
        shifts={filteredShifts}
        isLoading={isLoading}
        onCreateShift={handleCreate}
        onEditShift={handleEdit}
      />

      <ShiftFormModal
        shift={editingShift}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ShiftsView;
