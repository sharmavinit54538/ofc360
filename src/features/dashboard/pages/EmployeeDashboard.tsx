import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardShell } from '@/shared/layout/DashboardShell';
import {
  Clock,
  Calendar,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Megaphone,
  Pin,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { useToast } from '@/shared/ui/Toast';
import { StatCard } from '@/features/dashboard/components/StatCard';
import { SkeletonCard } from '@/shared/ui/Skeleton';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ErrorDisplay } from '@/shared/ui/ErrorDisplay';
import { useGetInternalDashboardFeedQuery } from '@/features/announcements';

export const EmployeeDashboard: React.FC = () => {
  const [clockedIn, setClockedIn] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  // Internal Dashboard Feed for Announcements
  const {
    data: internalFeed,
    isLoading: isFeedLoading,
    isFetching: isFeedFetching,
    error: feedError,
    refetch: refetchFeed,
  } = useGetInternalDashboardFeedQuery();

  const handleToggleClock = () => {
    if (clockedIn) {
      setClockedIn(false);
      toast.info('Clocked out at ' + new Date().toLocaleTimeString(), 'Shift Ended');
    } else {
      setClockedIn(true);
      toast.success('Clocked in at ' + new Date().toLocaleTimeString(), 'Shift Active');
    }
  };

  const pinned = internalFeed?.pinned_announcements || [];
  const recent = internalFeed?.recent_announcements || [];
  const allAnnouncements = [...pinned, ...recent.filter((r) => !pinned.some((p) => p.id === r.id))];

  return (
    <DashboardShell
      title="Employee Self-Service Portal"
      subtitle="Track your daily work hours, apply for leaves, download payslips, and view company announcements."
    >
      <div className="space-y-6">
        {/* Attendance Punch In/Out Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 border border-indigo-500 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${clockedIn ? 'bg-emerald-300 animate-pulse' : 'bg-gray-300'}`} />
              <h3 className="text-base font-bold text-white">
                Status: {clockedIn ? 'Currently Clocked In' : 'Currently Off Duty'}
              </h3>
            </div>
            <p className="text-xs text-indigo-100">
              Shift: 09:00 AM – 06:00 PM EST &bull; Total recorded today: 6 hrs 24 mins
            </p>
          </div>

          <Button
            variant={clockedIn ? 'danger' : 'primary'}
            size="md"
            onClick={handleToggleClock}
            leftIcon={<Clock className="w-4 h-4" />}
          >
            {clockedIn ? 'Clock Out for Today' : 'Clock In Now'}
          </Button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Available PTO"
            value="14 Days"
            subtext="Accrues 1.5 days/month"
            icon={<Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
            valueColor="text-emerald-600 dark:text-emerald-400"
          />
          <StatCard
            label="Medical Leaves"
            value="8 Days"
            subtext="Valid through year end"
            icon={<CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
            valueColor="text-indigo-600 dark:text-indigo-400"
          />
          <StatCard
            label="Latest Payslip"
            value="Oct 2026"
            subtext="Ready for download"
            icon={<FileText className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />}
            valueColor="text-cyan-600 dark:text-cyan-400"
          />
          <StatCard
            label="Allocated Devices"
            value="2 Assets"
            subtext="MacBook Pro M3, YubiKey 5"
            icon={<AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
            valueColor="text-amber-600 dark:text-amber-400"
          />
        </div>

        {/* Self Service Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            onClick={() => navigate('/dashboard/attendance?tab=leave')}
            className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 transition-colors space-y-2 cursor-pointer group"
          >
            <div className="text-xs font-semibold text-gray-900 dark:text-[#ececec] flex items-center justify-between">
              <span>Apply for Time Off</span>
              <ArrowRight className="w-4 h-4 text-gray-500 dark:text-zinc-500 group-hover:text-indigo-400 transition-colors" />
            </div>
            <p className="text-xs text-gray-600 dark:text-zinc-400">Request vacation, medical leave, or remote work days.</p>
          </div>

          <div
            onClick={() => navigate('/dashboard/payroll')}
            className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 transition-colors space-y-2 cursor-pointer group"
          >
            <div className="text-xs font-semibold text-gray-900 dark:text-[#ececec] flex items-center justify-between">
              <span>Salary & Tax Documents</span>
              <ArrowRight className="w-4 h-4 text-gray-500 dark:text-zinc-500 group-hover:text-indigo-400 transition-colors" />
            </div>
            <p className="text-xs text-gray-600 dark:text-zinc-400">Access annual tax forms, W2/1099, and monthly payslips.</p>
          </div>

          <div
            onClick={() => navigate('/dashboard/connect?tool=helpdesk')}
            className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 transition-colors space-y-2 cursor-pointer group"
          >
            <div className="text-xs font-semibold text-gray-900 dark:text-[#ececec] flex items-center justify-between">
              <span>IT Helpdesk Ticket</span>
              <ArrowRight className="w-4 h-4 text-gray-500 dark:text-zinc-500 group-hover:text-indigo-400 transition-colors" />
            </div>
            <p className="text-xs text-gray-600 dark:text-zinc-400">Submit requests for software licenses or hardware repairs.</p>
          </div>
        </div>

        {/* Company Announcements Feed Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
                <Megaphone className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Company Announcements & Circulars
                </h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400">
                  Official news, policy updates, and executive messages
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchFeed()}
                disabled={isFeedFetching}
                className="text-xs rounded-xl"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isFeedFetching ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard/connect?tool=announcement')}
                className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1"
              >
                <span>View All Broadcasts</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Loading Skeleton */}
          {isFeedLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* Error Display */}
          {!isFeedLoading && feedError && (
            <ErrorDisplay error={feedError} onRetry={refetchFeed} compact className="py-4" />
          )}

          {/* Empty State */}
          {!isFeedLoading && !feedError && allAnnouncements.length === 0 && (
            <EmptyState
              icon={<Megaphone className="w-6 h-6 text-rose-500" />}
              title="No Active Announcements"
              description="Official company announcements and policy updates will appear here."
            />
          )}

          {/* Live Announcements List */}
          {!isFeedLoading && !feedError && allAnnouncements.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {allAnnouncements.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all ${
                    item.is_pinned
                      ? 'border-rose-200 dark:border-rose-900/60 bg-rose-50/25 dark:bg-rose-950/20'
                      : 'border-gray-200 dark:border-zinc-800 bg-gray-50/40 dark:bg-zinc-900/40'
                  } space-y-2`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200">
                        {item.priority || 'MEDIUM'}
                      </span>
                      {item.is_pinned && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 flex items-center gap-0.5">
                          <Pin className="w-2.5 h-2.5 rotate-45" />
                          <span>Pinned</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400">
                      {item.publish_date ? new Date(item.publish_date).toLocaleDateString() : 'Recently'}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-zinc-300 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
};

export default EmployeeDashboard;
