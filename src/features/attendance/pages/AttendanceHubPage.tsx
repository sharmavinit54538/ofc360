import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  Clock,
  ScrollText,
  CalendarCheck,
  ArrowRight,
  TreePalm,
  Inbox,
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
      if (record.employee.department) set.add(record.employee.department);
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
  ];

  const queueItems = regularizationQueue?.items || [];

  return (
    <div className="space-y-6">
      {/* Hero Banner with live KPIs */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 text-white p-6 md:p-8 border border-blue-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Attendance Management Hub</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Workforce Attendance Control Center
            </h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Unified command center for shift scheduling, real-time punch tracking,
              regularization workflows, and attendance compliance.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/5 backdrop-blur-md p-3.5 rounded-xl border border-white/10 shrink-0">
            <div className="text-center px-3 py-1.5 border-r border-white/10">
              <p className="text-xs text-slate-400 font-medium">Present Today</p>
              <p className="text-xl font-bold text-emerald-400">
                {isStatsLoading ? '—' : stats?.presentToday ?? 0}
              </p>
            </div>
            <div className="text-center px-3 py-1.5 border-r border-white/10">
              <p className="text-xs text-slate-400 font-medium">On Leave</p>
              <p className="text-xl font-bold text-amber-400">
                {isStatsLoading ? '—' : stats?.onLeaveToday ?? 0}
              </p>
            </div>
            <div className="text-center px-3 py-1.5 border-r border-white/10">
              <p className="text-xs text-slate-400 font-medium">Late Arrivals</p>
              <p className="text-xl font-bold text-rose-400">
                {isStatsLoading ? '—' : stats?.lateArrivals ?? 0}
              </p>
            </div>
            <div className="text-center px-3 py-1.5">
              <p className="text-xs text-slate-400 font-medium">Avg Hours</p>
              <p className="text-xl font-bold text-blue-400">
                {isStatsLoading ? '—' : `${(stats?.avgWorkHours ?? 0).toFixed(1)}h`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Punch clock + KPI strip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5 items-start">
        <PunchInOutCard />
        <div className="lg:col-span-2">
          <AttendanceKpiCards stats={stats} isLoading={isStatsLoading} />
        </div>
      </div>

      {/* Module navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
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
  );
};

export default AttendanceHubPage;
