import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  Info,
  DollarSign,
  UserCheck,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { Input } from '@/shared/ui/Input';
import { ErrorDisplay } from '@/shared/ui/ErrorDisplay';
import { useToast } from '@/shared/ui/Toast';
import {
  useGetExitCasesQuery,
  useStartNoticePeriodMutation,
} from '../api/exitsApi';
import { calculateNoticeDays } from '../mappers/exitMappers';
import type { ExitCase } from '../types/exit.types';

export const ExitNoticePeriodPage: React.FC = () => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'EARLY_RELEASE' | 'BUYOUT'>('ACTIVE');
  const [startCaseId, setStartCaseId] = useState<string | null>(null);
  const [confirmedLwd, setConfirmedLwd] = useState('');
  const [startRemarks, setStartRemarks] = useState('');

  const {
    data: casesResponse,
    isLoading,
    error,
    refetch,
  } = useGetExitCasesQuery();

  const [startNoticePeriod, { isLoading: isStarting }] = useStartNoticePeriodMutation();

  const allCases = casesResponse?.items || [];
  const activeCases = allCases.filter(
    (c) => c.stage !== 'COMPLETED' && c.stage !== 'REJECTED' && c.stage !== 'WITHDRAWN'
  );

  const handleStartNoticePeriod = async (exitCase: ExitCase) => {
    try {
      await startNoticePeriod({
        id: exitCase.id,
        lastWorkingDay: confirmedLwd || exitCase.expectedLastWorkingDay,
        remarks: startRemarks.trim() || undefined,
      }).unwrap();

      toast.success(
        `Notice period formally initiated for ${exitCase.employeeName}!`,
        'Notice Period Started'
      );
      setStartCaseId(null);
      setStartRemarks('');
      setConfirmedLwd('');
    } catch (err: any) {
      toast.error(
        err?.data?.detail || err?.data?.message || 'Failed to start notice period',
        'Action Error'
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand-500" />
            <span>Notice Period Management</span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-zinc-400">
            Track notice duration, days served vs remaining, and notice period initiation.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
          {[
            { id: 'ACTIVE', label: 'Active Tracking' },
            { id: 'EARLY_RELEASE', label: 'Early Release / Waiver' },
            { id: 'BUYOUT', label: 'Notice Buyout' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 shadow-xs'
                  : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs 2 & 3: API Gap Banners */}
      {activeTab === 'EARLY_RELEASE' && (
        <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 flex items-start gap-3">
          <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800 dark:text-amber-300">
            <span className="font-semibold">Notice Waiver &amp; Early Release Pending:</span> Backend routes for early release sign-off, notice period waiver, and date adjustments (&apos;PATCH /exits/:id/notice-adjustment&apos;) are pending implementation. Displayed records are read-only.
          </div>
        </div>
      )}

      {activeTab === 'BUYOUT' && (
        <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 flex items-start gap-3">
          <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800 dark:text-amber-300">
            <span className="font-semibold">Notice Buyout Configuration Pending:</span> Notice buyout computations, recovery adjustments, and waiver credit routes require backend endpoint support. Buyout adjustments cannot be finalized here.
          </div>
        </div>
      )}

      {/* 4 States */}
      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-28 bg-gray-100 dark:bg-zinc-900 rounded-2xl" />
          <div className="h-28 bg-gray-100 dark:bg-zinc-900 rounded-2xl" />
        </div>
      ) : error ? (
        <ErrorDisplay title="Unable to load notice period data" error={error} onRetry={refetch} />
      ) : activeCases.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717]">
          <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
            No Active Notice Periods
          </h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
            All active employees are in regular service or notice periods have concluded.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeCases.map((exitCase) => {
            const { servedDays, remainingDays } = calculateNoticeDays(
              exitCase.resignationDate,
              exitCase.expectedLastWorkingDay,
              exitCase.noticeDays
            );

            const isNoticeStarted =
              exitCase.stage === 'NOTICE_PERIOD' ||
              exitCase.stage === 'KNOWLEDGE_TRANSFER' ||
              exitCase.stage === 'CLEARANCE_PENDING' ||
              exitCase.stage === 'FNF_SETTLEMENT' ||
              exitCase.stage === 'COMPLETED';

            const progressPct = exitCase.noticeDays > 0
              ? Math.min(100, Math.round((servedDays / exitCase.noticeDays) * 100))
              : 100;

            return (
              <div
                key={exitCase.id}
                className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                        {exitCase.employeeName}
                      </span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400">
                        {exitCase.caseNumber}
                      </span>
                      <Badge variant={isNoticeStarted ? 'brand' : 'neutral'} size="sm">
                        {isNoticeStarted ? 'Notice In Progress' : 'Pending Notice Start'}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                      {exitCase.designation} &bull; {exitCase.department} &bull; Mgr: {exitCase.managerName}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isNoticeStarted && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setStartCaseId(exitCase.id);
                          setConfirmedLwd(
                            exitCase.expectedLastWorkingDay
                              ? exitCase.expectedLastWorkingDay.split('T')[0]
                              : ''
                          );
                        }}
                        className="text-xs gap-1.5 bg-brand-600 hover:bg-brand-700 text-white"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Start Notice Period</span>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Calculated Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-900">
                    <span className="text-gray-400 block mb-0.5">Resignation Date</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {new Date(exitCase.resignationDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-900">
                    <span className="text-gray-400 block mb-0.5">Mandatory Notice</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {exitCase.noticeDays} Days
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-900">
                    <span className="text-gray-400 block mb-0.5">Last Working Day</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {exitCase.expectedLastWorkingDay
                        ? new Date(exitCase.expectedLastWorkingDay).toLocaleDateString()
                        : 'TBD'}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-emerald-700 dark:text-emerald-300 font-medium">Served Days</span>
                      <span className="text-[10px] text-gray-400 italic">calculated</span>
                    </div>
                    <span className="text-base font-bold text-emerald-700 dark:text-emerald-300">
                      {servedDays}d
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-blue-700 dark:text-blue-300 font-medium">Remaining</span>
                      <span className="text-[10px] text-gray-400 italic">calculated</span>
                    </div>
                    <span className="text-base font-bold text-blue-700 dark:text-blue-300">
                      {remainingDays}d
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-gray-500 dark:text-zinc-400">
                    <span>Notice Progress: {progressPct}%</span>
                    <span>{remainingDays} days to separation</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full transition-all duration-300"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                {/* Modal for Start Notice Period */}
                {startCaseId === exitCase.id && (
                  <div className="p-4 rounded-xl border border-brand-200 dark:border-brand-900/50 bg-brand-50/30 dark:bg-brand-950/20 space-y-3 animate-in fade-in-50">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100">
                        Initiate Formal Notice Period for {exitCase.employeeName}
                      </h4>
                      <button
                        type="button"
                        onClick={() => setStartCaseId(null)}
                        className="text-gray-400 hover:text-gray-600 text-xs"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-zinc-300 mb-1">
                          Confirm / Adjust Last Working Day
                        </label>
                        <Input
                          type="date"
                          value={confirmedLwd}
                          onChange={(e) => setConfirmedLwd(e.target.value)}
                          className="text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-zinc-300 mb-1">
                          Remarks / Handover Instructions
                        </label>
                        <Input
                          placeholder="e.g. Approved with standard 30-day notice..."
                          value={startRemarks}
                          onChange={(e) => setStartRemarks(e.target.value)}
                          className="text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setStartCaseId(null)}
                        className="text-xs"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        variant="primary"
                        disabled={isStarting}
                        onClick={() => handleStartNoticePeriod(exitCase)}
                        className="text-xs bg-brand-600 hover:bg-brand-700 text-white"
                      >
                        {isStarting ? 'Starting...' : 'Confirm & Start Notice'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExitNoticePeriodPage;
