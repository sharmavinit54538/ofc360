import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Clock,
  ScrollText,
  CalendarCheck,
  ArrowRight,
  TreePalm,
  Inbox,
  Palmtree,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { SkeletonListItem } from '@/shared/ui/Skeleton';
import { PunchInOutCard } from '../components/PunchInOutCard';
import { AttendanceKpiCards } from '../components/AttendanceKpiCards';
import { AttendanceFilterBar } from '../components/AttendanceFilterBar';
import { AttendanceRecordsTable } from '../components/AttendanceRecordsTable';
import { RegularizationModal } from '../components/RegularizationModal';
import { RegularizationReviewModal } from '../components/RegularizationReviewModal';
import { LeaveManagementHubPage } from '@/features/leave/pages/LeaveManagementHubPage';
import {
  useGetAttendanceStatsQuery,
  useGetAttendanceRecordsQuery,
  useGetRegularizationRequestsQuery,
  useGetShiftsQuery,
  useGetHolidaysQuery,
} from '../api/attendanceApi';
import type {
  AttendanceRecord,
  AttendanceScope,
  AttendanceStatus,
  RegularizationRequest,
} from '../types/attendance.types';

const toISODate = (d: Date): string => d.toISOString().slice(0, 10);

const getMonthStart = (): string => {
  const now = new Date();
  return toISODate(new Date(now.getFullYear(), now.getMonth(), 1));
};

const formatQueueDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const CORRECTION_LABELS: Record<string, string> = {
  MISSED_PUNCH_IN: 'Missed Punch In',
  MISSED_PUNCH_OUT: 'Missed Punch Out',
  BOTH: 'Both Punches',
  ON_DUTY: 'On-Duty Full Day',
};

interface ModuleLinkCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  actionText: string;
  metricLabel: string;
  metricValue: string;
  iconBg: string;
  iconColor: string;
}

export const AttendanceHubPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Active tab within the unified Attendance Hub (Daily Attendance vs Leave Management)
  const currentTab = useMemo<'attendance' | 'leave'>(() => {
    const tabParam = searchParams.get('tab')?.toLowerCase();
    if (tabParam === 'leave' || tabParam === 'leaves') return 'leave';
    return 'attendance';
  }, [searchParams]);

  const handleTabChange = (tab: 'attendance' | 'leave') => {
    const nextParams = new URLSearchParams(searchParams);
    if (tab === 'attendance') {
      nextParams.delete('tab');
    } else {
      nextParams.set('tab', 'leave');
    }
    setSearchParams(nextParams, { replace: true });
  };

  // ── Live data ───────────────────────────────────────────────────────────
  const { data: stats, isLoading: isStatsLoading } = useGetAttendanceStatsQuery();
  const { data: shifts } = useGetShiftsQuery();
  const { data: holidays } = useGetHolidaysQuery({ year: new Date().getFullYear() });

  // ── Record filters ──────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus | 'ALL'>('ALL');
  const [scopeFilter, setScopeFilter] = useState<AttendanceScope>('MY');
  const [startDate, setStartDate] = useState(getMonthStart());
  const [endDate, setEndDate] = useState(toISODate(new Date()));
  const [departmentFilter, setDepartmentFilter] = useState('ALL');

  const {
    data: recordsData,
    isLoading: isRecordsLoading,
    isFetching: isRecordsFetching,
    refetch: refetchRecords,
  } = useGetAttendanceRecordsQuery({
    search: searchQuery || undefined,
    status: statusFilter,
    scope: scopeFilter,
    startDate,
    endDate,
    departmentId: departmentFilter !== 'ALL' ? departmentFilter : undefined,
    limit: 100,
  });

  const records = recordsData?.items || [];

  // Department choices are always derived from the live record payload
  const departments = useMemo(() => {
    const set = new Set<string>();
    for (const record of records) {
      const dept = record?.employee?.department || record?.department;
      if (dept) set.add(dept);
    }
    return Array.from(set).sort();
  }, [records]);

  // Pending regularization queue is only relevant for approver scopes
  const { data: regularizationQueue, isLoading: isQueueLoading } =
    useGetRegularizationRequestsQuery(
      { status: 'PENDING' },
      { skip: scopeFilter === 'MY' }
    );

  // ── Modal state ─────────────────────────────────────────────────────────
  const [regularizeTarget, setRegularizeTarget] = useState<AttendanceRecord | null>(null);
  const [reviewTarget, setReviewTarget] = useState<RegularizationRequest | null>(null);

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setScopeFilter('MY');
    setStartDate(getMonthStart());
    setEndDate(toISODate(new Date()));
    setDepartmentFilter('ALL');
  };

  // ── Derived module metrics ──────────────────────────────────────────────
  const activeShiftCount = (shifts || []).filter((s) => s.isActive).length;
  const remainingHolidayCount = (holidays || []).filter(
    (h) => new Date(h.date) >= new Date(toISODate(new Date()))
  ).length;

  const moduleCards: ModuleLinkCard[] = [
    {
      id: 'shifts',
      title: 'Work Shifts & Timing Policies',
      description: 'Operational shift hours, grace periods, night differentials, and minimum hour thresholds.',
      icon: Clock,
      path: '/dashboard/attendance/shifts',
      actionText: 'Manage Shifts',
      metricLabel: 'Active Shifts',
      metricValue: String(activeShiftCount),
      iconBg: 'bg-blue-500/10 dark:bg-blue-500/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      id: 'rosters',
      title: 'Team Rosters & Rotation',
      description: 'Monthly department rotation schedules and published duty coverage views.',
      icon: ScrollText,
      path: '/dashboard/attendance/rosters',
      actionText: 'View Rosters',
      metricLabel: 'Rotation',
      metricValue: 'Monthly',
      iconBg: 'bg-violet-500/10 dark:bg-violet-500/20',
      iconColor: 'text-violet-600 dark:text-violet-400',
    },
    {
      id: 'holidays',
      title: 'Company Holiday Calendar',
      description: 'Annual gazetted holidays, optional floating days, and festive shutdowns.',
      icon: TreePalm,
      path: '/dashboard/attendance/holidays',
      actionText: 'View Calendar',
      metricLabel: 'Remaining',
      metricValue: `${remainingHolidayCount} Holidays`,
      iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      id: 'leave',
      title: 'Leave & Time Off Requests',
      description: 'Annual paid leave, casual balances, comp-off credits, and team time off approvals.',
      icon: Palmtree,
      path: '/dashboard/attendance?tab=leave',
      actionText: 'Manage Leave',
      metricLabel: 'Time Off',
      metricValue: 'Leave Hub',
      iconBg: 'bg-amber-500/10 dark:bg-amber-500/20',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
  ];

  const queueItems = regularizationQueue?.items || [];

  return (
    <div className="space-y-6">
      {/* Attendance & Leave Header & Primary 2-Tab Switcher */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 md:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-gradient-to-tr from-blue-500/20 via-indigo-500/20 to-violet-500/20 border border-blue-500/30 rounded-xl text-blue-600 dark:text-blue-400">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Attendance & Time Off Hub
              </h1>
            </div>
            <p className="mt-1 text-xs md:text-sm text-slate-500 dark:text-zinc-400">
              Manage daily biometric punch logs, attendance regularization, shift policies, and leave requests.
            </p>
          </div>

          {/* Primary 2-Tab Segmented Switcher */}
          <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700/60 self-start md:self-center">
            <button
              type="button"
              onClick={() => handleTabChange('attendance')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all duration-150',
                currentTab === 'attendance'
                  ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              )}
            >
              <Clock className="w-4 h-4" />
              <span>Daily Attendance</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('leave')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all duration-150',
                currentTab === 'leave'
                  ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              )}
            >
              <Palmtree className="w-4 h-4" />
              <span>Leave Management</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Panels */}
      {currentTab === 'leave' ? (
        <div key="attendance-leave-section" className="transition-opacity duration-200">
          <LeaveManagementHubPage />
        </div>
      ) : (
        <div key="attendance-daily-section" className="space-y-6 transition-opacity duration-200">
          {/* Live Punch Console */}
          <PunchInOutCard />

          {/* Attendance KPI Overview */}
          <AttendanceKpiCards stats={stats} isLoading={isStatsLoading} />

          {/* Module navigation cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {moduleCards.map((mod) => {
              const Icon = mod.icon;
              return (
                <Link
                  key={mod.id}
                  to={mod.path}
                  className="group flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className={cn(
                        'w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-200 shadow-sm',
                        mod.iconBg
                      )}
                    >
                      <Icon className={cn('w-5 h-5', mod.iconColor)} />
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
                        {mod.metricLabel}
                      </span>
                      <span className="text-xs font-bold text-slate-700 dark:text-zinc-200">
                        {mod.metricValue}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3.5">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {mod.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                      {mod.description}
                    </p>
                  </div>
                  <div className="pt-3.5 mt-3.5 border-t border-slate-100 dark:border-zinc-800/80">
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      {mod.actionText}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Attendance records explorer */}
          <div className="space-y-4">
            <AttendanceFilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              scopeFilter={scopeFilter}
              onScopeChange={setScopeFilter}
              startDate={startDate}
              onStartDateChange={setStartDate}
              endDate={endDate}
              onEndDateChange={setEndDate}
              departmentFilter={departmentFilter}
              onDepartmentChange={setDepartmentFilter}
              departments={departments}
              onResetFilters={handleResetFilters}
              onRefresh={() => refetchRecords()}
              isRefreshing={isRecordsFetching && !isRecordsLoading}
            />

            <AttendanceRecordsTable
              records={records}
              isLoading={isRecordsLoading}
              onRegularize={(record) => setRegularizeTarget(record)}
              showEmployeeColumn={scopeFilter !== 'MY'}
            />
          </div>

          {/* Pending regularization queue (approver scopes only) */}
          {scopeFilter !== 'MY' && (
            <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] overflow-hidden shadow-sm">
              <div className="p-4 md:p-6 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-[#ececec] flex items-center gap-2">
                    <Inbox className="w-5 h-5 text-indigo-600" />
                    Pending Regularization Requests
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                    Missed-punch and on-duty corrections awaiting your review
                  </p>
                </div>
                <Badge variant="warning" size="sm" className="font-semibold text-[11px]">
                  {queueItems.length} Pending
                </Badge>
              </div>

              {isQueueLoading ? (
                <div className="p-4 space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <SkeletonListItem key={i} />
                  ))}
                </div>
              ) : queueItems.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                    <CalendarCheck className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-[#ececec]">
                    All caught up
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400 max-w-sm mx-auto">
                    There are no pending regularization requests in this scope right now.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-zinc-800/80">
                  {queueItems.map((req) => (
                    <div
                      key={req.id}
                      className="px-4 md:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-gray-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-gray-900 dark:text-[#ececec]">
                            {req.employee?.name || 'Employee'}
                          </span>
                          <Badge variant="warning" size="sm" className="text-[10px] font-semibold">
                            {CORRECTION_LABELS[req.correctionType] || req.correctionType}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5 truncate">
                          {formatQueueDate(req.date)} • {req.reason}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setReviewTarget(req)}
                        className="text-xs shrink-0"
                      >
                        Review
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Modals */}
          <RegularizationModal
            record={regularizeTarget}
            isOpen={Boolean(regularizeTarget)}
            onClose={() => setRegularizeTarget(null)}
          />
          <RegularizationReviewModal
            request={reviewTarget}
            isOpen={Boolean(reviewTarget)}
            onClose={() => setReviewTarget(null)}
          />
        </div>
      )}
    </div>
  );
};

export default AttendanceHubPage;
