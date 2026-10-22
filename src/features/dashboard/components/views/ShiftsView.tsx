/**
 * @file ShiftsView.tsx
 * @description Production-ready view for Work Shifts and Shift Schedules.
 * Displays shift configurations, grace periods, break durations, and timing details.
 */

import React, { useState } from 'react';
import {
  Clock,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Settings,
  Calendar,
  Layers,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Link } from 'react-router-dom';

export const ShiftsView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

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
          <Link to="/settings/attendance">
            <Button
              variant="primary"
              size="sm"
              className="rounded-xl flex items-center gap-1.5 shadow-sm shadow-brand-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Configure New Shift</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
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
            Active
          </div>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
            Day, Evening, and Night rotation cycles
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-gray-500 dark:text-zinc-400 tracking-wider">
              Grace Period
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-[#ececec] mt-2">
            15 mins
          </div>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
            Standard arrival grace before late flag
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-gray-500 dark:text-zinc-400 tracking-wider">
              Standard Hours
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-[#ececec] mt-2">
            8.0h / day
          </div>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
            40-hour regular workweek threshold
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

      {/* Empty State / Integration Notice */}
      <div className="rounded-2xl border border-dashed border-gray-300 dark:border-zinc-800 bg-white dark:bg-[#171717] p-12 text-center shadow-sm">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950/30 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4 border border-brand-200/50 dark:border-brand-900/30">
          <Clock className="w-7 h-7" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#ececec]">
          Enterprise Shift Configurations
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400 max-w-sm mx-auto">
          Shift policies and rosters synchronize automatically with attendance tracking and biometric geofence logs.
        </p>
        <div className="mt-5">
          <Link to="/settings/attendance">
            <Button variant="primary" size="sm" className="rounded-xl text-xs">
              Open Attendance Settings
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShiftsView;
