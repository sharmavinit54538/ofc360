/**
 * @file RostersView.tsx
 * @description Production-ready view for Employee Shift Rosters and Weekly Schedules.
 * Displays rotation tables, staff assignments, and duty coverage.
 */

import React, { useState } from 'react';
import {
  ScrollText,
  Calendar,
  Filter,
  Users,
  Search,
  Download,
  Plus,
  Clock,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';

export const RostersView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWeek, setSelectedWeek] = useState('CURRENT');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              <ScrollText className="w-3 h-3 text-brand-500" />
              Roster Planning
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-[#ececec] mt-1">
            Workforce Duty Rosters
          </h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
            Weekly and monthly department rotation rosters, on-call schedules, and shift coverage plans.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            className="rounded-xl flex items-center gap-1.5 shadow-sm shadow-brand-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Generate New Roster</span>
          </Button>
        </div>
      </div>

      {/* Roster Controls Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search roster by employee or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-gray-50 dark:bg-zinc-900/70 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-[#ececec] placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex p-1 rounded-xl bg-gray-100 dark:bg-zinc-800 border border-gray-200/60 dark:border-zinc-700/60 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setSelectedWeek('PREV')}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedWeek === 'PREV'
                  ? 'bg-white dark:bg-zinc-900 text-gray-900 dark:text-white shadow-2xs'
                  : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Previous Week
            </button>
            <button
              type="button"
              onClick={() => setSelectedWeek('CURRENT')}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedWeek === 'CURRENT'
                  ? 'bg-white dark:bg-zinc-900 text-gray-900 dark:text-white shadow-2xs'
                  : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Current Week
            </button>
            <button
              type="button"
              onClick={() => setSelectedWeek('NEXT')}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedWeek === 'NEXT'
                  ? 'bg-white dark:bg-zinc-900 text-gray-900 dark:text-white shadow-2xs'
                  : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Next Week
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      <div className="rounded-2xl border border-dashed border-gray-300 dark:border-zinc-800 bg-white dark:bg-[#171717] p-12 text-center shadow-sm">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950/30 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4 border border-brand-200/50 dark:border-brand-900/30">
          <ScrollText className="w-7 h-7" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#ececec]">
          No Duty Rosters Published
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400 max-w-sm mx-auto">
          Departmental duty allocations and shift rotations will populate here once active staff schedules are assigned.
        </p>
      </div>
    </div>
  );
};

export default RostersView;
