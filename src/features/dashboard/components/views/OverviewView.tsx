import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  UserPlus,
  FileSpreadsheet,
  Megaphone,
  ArrowRight,
  TrendingUp,
  User,
  Shield,
  CreditCard,
  Activity,
  ChevronRight,
  Loader2,
  Award,
  Check,
  X,
  BarChart2,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { SkeletonStatCard, SkeletonTimelineItem, SkeletonListItem } from '@/shared/ui/Skeleton';
import { ErrorDisplay } from '@/shared/ui/ErrorDisplay';
import { useToast } from '@/shared/ui/Toast';
import {
  useGetDashboardSummaryQuery,
  useGetEmployeeSummaryQuery,
  useGetAttendanceSummaryQuery,
  useGetPendingApprovalsQuery,
  useGetPayrollDashboardQuery,
  useGetUpcomingEventsQuery,
  useGetTimelineFeedQuery,
  useCreateAnnouncementMutation,
  useApproveLeaveMutation,
  useRejectLeaveMutation,
} from '@/features/hr-dashboard/api/hrDashboardApi';
import type {
  UpcomingEvent,
  TimelineEvent,
  Announcement,
  LeaveRequestSummary,
} from '@/features/hr-dashboard/types/hrDashboard.types';

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays < 7) return `${diffDays} days`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatRelativeTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getEventIcon = (type: UpcomingEvent['type']) => {
  switch (type) {
    case 'BIRTHDAY':
      return { icon: <User className="w-4 h-4" />, color: 'text-pink-400', bgColor: 'bg-pink-500/10' };
    case 'WORK_ANNIVERSARY':
      return { icon: <Award className="w-4 h-4" />, color: 'text-amber-400', bgColor: 'bg-amber-500/10' };
    case 'CONTRACT_END':
      return { icon: <FileSpreadsheet className="w-4 h-4" />, color: 'text-rose-400', bgColor: 'bg-rose-500/10' };
    case 'PROBATION_END':
      return { icon: <Shield className="w-4 h-4" />, color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' };
    case 'PERFORMANCE_REVIEW':
      return { icon: <TrendingUp className="w-4 h-4" />, color: 'text-indigo-600 dark:text-indigo-400', bgColor: 'bg-indigo-50 dark:bg-indigo-950/30' };
    case 'LEAVE_START':
    case 'LEAVE_END':
      return { icon: <Calendar className="w-4 h-4" />, color: 'text-cyan-600 dark:text-cyan-400', bgColor: 'bg-cyan-50 dark:bg-cyan-950/30' };
    default:
      return { icon: <Activity className="w-4 h-4" />, color: 'text-gray-600 dark:text-zinc-400', bgColor: 'bg-gray-50 dark:bg-zinc-900/30' };
  }
};

const getTimelineIcon = (type: TimelineEvent['type']) => {
  switch (type) {
    case 'ANNOUNCEMENT':
      return { icon: <Megaphone className="w-4 h-4" />, color: 'text-brand-400', bgColor: 'bg-brand-500/10' };
    case 'AUDIT_LOG':
      return { icon: <Shield className="w-4 h-4" />, color: 'text-amber-400', bgColor: 'bg-amber-500/10' };
    case 'EVENT':
      return { icon: <Activity className="w-4 h-4" />, color: 'text-pink-400', bgColor: 'bg-pink-500/10' };
    case 'LEAVE_APPROVED':
      return { icon: <CheckCircle2 className="w-4 h-4" />, color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' };
    case 'LEAVE_REJECTED':
      return { icon: <AlertTriangle className="w-4 h-4" />, color: 'text-rose-400', bgColor: 'bg-rose-500/10' };
    case 'EMPLOYEE_JOINED':
      return { icon: <UserPlus className="w-4 h-4" />, color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-50 dark:bg-emerald-950/30' };
    case 'EMPLOYEE_LEFT':
      return { icon: <User className="w-4 h-4" />, color: 'text-gray-600 dark:text-zinc-400', bgColor: 'bg-gray-50 dark:bg-zinc-900/30' };
    case 'PAYROLL_RUN':
      return { icon: <CreditCard className="w-4 h-4" />, color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-50 dark:bg-emerald-950/30' };
    case 'DOCUMENT_VERIFIED':
      return { icon: <Shield className="w-4 h-4" />, color: 'text-cyan-600 dark:text-cyan-400', bgColor: 'bg-cyan-50 dark:bg-cyan-950/30' };
    default:
      return { icon: <Activity className="w-4 h-4" />, color: 'text-gray-600 dark:text-zinc-400', bgColor: 'bg-gray-50 dark:bg-zinc-900/30' };
  }
};

const KPICard: React.FC<{
  label: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
  iconColor: string;
  valueColor?: string;
  trend?: { value: string; isPositive: boolean };
  loading?: boolean;
  error?: any;
  onRetry?: () => void;
}> = ({
  label,
  value,
  subtext,
  icon,
  iconColor,
  valueColor = 'text-foreground',
  trend,
  loading = false,
  error,
  onRetry,
}) => {
  if (loading) return <SkeletonStatCard />;
  if (error) return <ErrorDisplay error={error} onRetry={onRetry} compact className="h-full" />;

  return (
    <div className="p-5 rounded-2xl bg-card border border-border/70 space-y-2 transition-all hover:border-border shadow-sm">
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-xs uppercase font-semibold tracking-wider">{label}</span>
        <div className={`shrink-0 ${iconColor}`}>{icon}</div>
      </div>
      <div className={`text-2xl font-bold ${valueColor}`}>{value}</div>
      <div className="flex items-center justify-between">
        {subtext && <div className="text-[11px] text-muted-foreground font-medium">{subtext}</div>}
        {trend && (
          <div className={`text-[11px] font-semibold flex items-center gap-1 ${trend.isPositive ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}`}>
            <TrendingUp className={`w-3 h-3 ${trend.isPositive ? 'rotate-0' : 'rotate-180'}`} />
            {trend.value}
          </div>
        )}
      </div>
    </div>
  );
};

const QuickActionButton: React.FC<{
  label: string;
  description: string;
  icon: React.ReactNode;
  iconColor: string;
  onClick: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
}> = ({ label, description, icon, iconColor, onClick, variant = 'primary', disabled = false, loading = false }) => (
  <Button
    variant={variant}
    size="md"
    onClick={onClick}
    disabled={disabled || loading}
    leftIcon={<span className={`p-2 rounded-xl ${iconColor} ${iconColor.replace('text-', 'bg-').replace('400', '10')} shrink-0`}>{icon}</span>}
    className="w-full justify-start gap-3 text-left px-4 py-3"
  >
    <div className="flex-1 text-left">
      <div className="font-medium text-sm text-foreground">{label}</div>
      <div className="text-[11px] text-muted-foreground">{description}</div>
    </div>
    {loading && <Loader2 className="w-4 h-4 animate-spin text-gray-500 dark:text-zinc-400" />}
    {!loading && <ArrowRight className="w-4 h-4 text-gray-500 dark:text-zinc-400" />}
  </Button>
);

const EmptyState: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div className="p-3 rounded-full bg-muted/50 text-muted-foreground mb-4">{icon}</div>
    <h4 className="font-medium text-foreground mb-1">{title}</h4>
    <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
    {action && (
      <Button size="sm" variant="outline" onClick={action.onClick} className="mt-4" leftIcon={<ArrowRight className="w-3.5 h-3.5" />}>
        {action.label}
      </Button>
    )}
  </div>
);

const AttendanceBreakdown: React.FC<{
  data: any;
  loading: boolean;
  error: any;
  onRetry: () => void;
}> = ({ data, loading, error, onRetry }) => {
  if (loading) return <SkeletonStatCard />;
  if (error) return <ErrorDisplay error={error} onRetry={onRetry} compact className="h-full" />;

  const present = data?.present ?? 0;
  const late = data?.late ?? 0;
  const onLeave = data?.onLeave ?? 0;
  const absent = data?.absent ?? 0;
  const total = data?.totalActiveEmployees ?? (present + late + onLeave + absent);
  const rate = total > 0 ? ((present + late) / total * 100).toFixed(1) : '0.0';

  const stats = [
    { label: 'On Time', value: present, color: 'text-emerald-500 dark:text-emerald-400', bgColor: 'bg-emerald-500/10', icon: <CheckCircle2 className="w-4 h-4" />, percentage: total > 0 ? ((present / total) * 100).toFixed(1) : '0' },
    { label: 'Late', value: late, color: 'text-amber-500 dark:text-amber-400', bgColor: 'bg-amber-500/10', icon: <Clock className="w-4 h-4" />, percentage: total > 0 ? ((late / total) * 100).toFixed(1) : '0' },
    { label: 'On Leave', value: onLeave, color: 'text-cyan-500 dark:text-cyan-400', bgColor: 'bg-cyan-500/10', icon: <Calendar className="w-4 h-4" />, percentage: total > 0 ? ((onLeave / total) * 100).toFixed(1) : '0' },
    { label: 'Absent', value: absent, color: 'text-rose-500 dark:text-rose-400', bgColor: 'bg-rose-500/10', icon: <AlertTriangle className="w-4 h-4" />, percentage: total > 0 ? ((absent / total) * 100).toFixed(1) : '0' },
  ];

  return (
    <div className="p-5 rounded-2xl bg-card border border-border/70 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
          Today's Attendance Breakdown
        </h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-foreground">{rate}%</div>
          <div className="text-[11px] text-muted-foreground">Attendance Rate</div>
        </div>
      </div>

      <div className="space-y-3">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${stat.bgColor} shrink-0`}>
              <span className={stat.color}>{stat.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{stat.label}</span>
                <span className="text-muted-foreground">{stat.value} ({stat.percentage}%)</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                <div
                  className="h-full rounded-full bg-brand-500 transition-all duration-300"
                  style={{ width: `${stat.percentage}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PendingApprovalsQueue: React.FC<{
  approvals: any;
  loading: boolean;
  error: any;
  onRetry: () => void;
  onApprove: (leaveId: string) => Promise<void>;
  onReject: (leaveId: string) => Promise<void>;
  approveLoading: string | null;
  rejectLoading: string | null;
  onNavigate: (path: string) => void;
}> = ({ approvals, loading, error, onRetry, onApprove, onReject, approveLoading, rejectLoading, onNavigate }) => {
  if (loading) return <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <SkeletonListItem key={i} />)}</div>;
  if (error) return <ErrorDisplay error={error} onRetry={onRetry} compact />;

  const leaves = approvals?.leaves?.items ?? [];
  const total = approvals?.leaves?.total ?? 0;

  if (total === 0) {
    return (
      <EmptyState
        icon={<CheckCircle2 className="w-6 h-6" />}
        title="All Caught Up!"
        description="No pending leave requests, expense claims, or document verifications."
      />
    );
  }

  return (
    <div className="space-y-3">
      {leaves.slice(0, 5).map((leave: LeaveRequestSummary) => (
        <div key={leave.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/60 hover:border-border transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-pink-500/20 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4 text-pink-500 dark:text-pink-400" />
            </div>
            <div className="min-w-0">
              <div className="font-medium text-sm text-foreground truncate">{leave.employeeName}</div>
              <div className="text-[11px] text-muted-foreground truncate">{leave.leaveType} · {leave.totalDays} day(s) · {leave.department}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="warning" size="sm">{leave.status}</Badge>
            <div className="text-[10px] text-muted-foreground hidden sm:block">Applied {formatRelativeTime(leave.appliedAt)}</div>
            <Button
              size="sm"
              variant="primary"
              onClick={() => onApprove(leave.id)}
              disabled={approveLoading === leave.id || rejectLoading === leave.id}
              className="h-8 px-3"
            >
              {approveLoading === leave.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => onReject(leave.id)}
              disabled={approveLoading === leave.id || rejectLoading === leave.id}
              className="h-8 px-3"
            >
              {rejectLoading === leave.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
            </Button>
          </div>
        </div>
      ))}
      {total > 5 && (
        <Button variant="ghost" size="sm" className="w-full" onClick={() => onNavigate('/dashboard/attendance?tab=leave&status=PENDING')}>
          View all {total} leave requests <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      )}
    </div>
  );
};

const UpcomingEventsSection: React.FC<{
  events: UpcomingEvent[];
  loading: boolean;
  error: any;
  onRetry: () => void;
}> = ({ events, loading, error, onRetry }) => {
  if (loading) return <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <SkeletonTimelineItem key={i} />)}</div>;
  if (error) return <ErrorDisplay error={error} onRetry={onRetry} compact className="py-4" />;

  const todayEvents = events.filter((e) => e.isToday);
  const thisWeekEvents = events.filter((e) => e.isThisWeek && !e.isToday);
  const upcomingEvents = events.filter((e) => !e.isThisWeek);

  const renderEventGroup = (title: string, items: UpcomingEvent[], _emptyMessage: string) => {
    if (items.length === 0) return null;
    return (
      <div className="space-y-3">
        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{title}</h5>
        <div className="space-y-2">
          {items.slice(0, 5).map((event) => {
            const { icon, color, bgColor } = getEventIcon(event.type);
            return (
              <div key={event.id} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/60 hover:border-border transition-colors">
                <div className={`p-2 rounded-lg ${bgColor} shrink-0`}>
                  <span className={color}>{icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-foreground truncate">{event.title}</span>
                    {event.isToday && <Badge variant="success" size="sm">Today</Badge>}
                  </div>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                    <span>{event.employeeName}</span>
                    <span className="text-muted-foreground/50">·</span>
                    <span>{event.employeeDepartment}</span>
                    <span className="text-muted-foreground/50">·</span>
                    <span className={event.isToday ? 'text-emerald-500 dark:text-emerald-400 font-medium' : 'text-muted-foreground'}>{formatDate(event.eventDate)}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (events.length === 0) {
    return (
      <EmptyState
        icon={<Calendar className="w-6 h-6" />}
        title="No Upcoming Events"
        description="No birthdays, anniversaries, or milestones in the next 30 days."
      />
    );
  }

  return (
    <div className="space-y-6">
      {renderEventGroup('Today', todayEvents, 'No events today')}
      {renderEventGroup('This Week', thisWeekEvents, 'No events this week')}
      {renderEventGroup('Upcoming', upcomingEvents, 'No upcoming events')}
    </div>
  );
};

const TimelineFeed: React.FC<{
  events: TimelineEvent[];
  loading: boolean;
  error: any;
  onRetry: () => void;
}> = ({ events, loading, error, onRetry }) => {
  if (loading) return <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <SkeletonTimelineItem key={i} />)}</div>;
  if (error) return <ErrorDisplay error={error} onRetry={onRetry} compact className="py-4" />;

  const grouped = events.reduce((acc, event) => {
    const date = event.groupDate;
    if (!acc[date]) acc[date] = [];
    acc[date].push(event);
    return acc;
  }, {} as Record<string, TimelineEvent[]>);

  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  if (events.length === 0) {
    return (
      <EmptyState
        icon={<Activity className="w-6 h-6" />}
        title="No Recent Activity"
        description="No announcements, approvals, or events in the last 14 days."
      />
    );
  }

  return (
    <div className="space-y-6">
      {sortedDates.map((date) => (
        <div key={date} className="space-y-3">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="w-6 h-6 rounded-full bg-muted/60 flex items-center justify-center font-medium text-[10px]">
              {new Date(date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
            </div>
            <div className="h-px flex-1 bg-border/50" />
          </div>
          <div className="space-y-3 ml-5 border-l border-border/50 pl-4">
            {grouped[date].map((event) => {
              const { icon, color, bgColor } = getTimelineIcon(event.type);
              return (
                <div key={event.id} className="relative">
                  <div className="absolute left-[-21px] top-3.5 w-2.5 h-2.5 rounded-full border-2 border-background" style={{ backgroundColor: color.replace('text-', 'bg-').replace('400', '500') }} />
                  <div className="p-3 rounded-xl bg-card border border-border/60 hover:border-border transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${bgColor} shrink-0`}>
                        <span className={color}>{icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h5 className="font-medium text-sm text-foreground">{event.title}</h5>
                          <span className="text-[10px] text-muted-foreground">{formatRelativeTime(event.timestamp)}</span>
                        </div>
                        {event.description && (
                          <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{event.description}</p>
                        )}
                        {event.actorName && (
                          <div className="flex items-center gap-1.5 mt-2 text-[10px] text-muted-foreground">
                            {event.actorAvatar && <img src={event.actorAvatar} alt="" className="w-3.5 h-3.5 rounded-full" />}
                            <span>{event.actorName}</span>
                            {event.actorRole && <span className="text-muted-foreground/50">· {event.actorRole}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

const AnnouncementDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Announcement>) => Promise<void>;
  loading: boolean;
}> = ({ isOpen, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState<Partial<Announcement>>({
    title: '',
    content: '',
    type: 'INFO',
    priority: 'MEDIUM',
    targetAudience: 'ALL',
    isPinned: false,
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    onClose();
    setFormData({ title: '', content: '', type: 'INFO', priority: 'MEDIUM', targetAudience: 'ALL', isPinned: false });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl bg-card rounded-2xl border border-border shadow-2xl overflow-hidden max-h-[90dvh] flex flex-col animate-in zoom-in-95">
        <div className="p-4 sm:p-6 border-b border-border flex items-center justify-between shrink-0">
          <h3 className="text-lg font-bold text-foreground">Post Announcement</h3>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 min-h-0">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Title *</label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
              placeholder="Announcement title"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Content *</label>
            <textarea
              value={formData.content || ''}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors resize-none"
              placeholder="Write your announcement..."
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Type</label>
              <select
                value={formData.type || 'INFO'}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Announcement['type'] })}
                className="w-full px-3 py-2 rounded-xl bg-input border border-border text-foreground focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
              >
                <option value="INFO">Information</option>
                <option value="WARNING">Warning</option>
                <option value="URGENT">Urgent</option>
                <option value="POLICY">Policy Update</option>
                <option value="EVENT">Event</option>
                <option value="CELEBRATION">Celebration</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Priority</label>
              <select
                value={formData.priority || 'MEDIUM'}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Announcement['priority'] })}
                className="w-full px-3 py-2 rounded-xl bg-input border border-border text-foreground focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Target Audience</label>
            <select
              value={formData.targetAudience || 'ALL'}
              onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value as Announcement['targetAudience'] })}
              className="w-full px-3 py-2 rounded-xl bg-input border border-border text-foreground focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors"
            >
              <option value="ALL">All Employees</option>
              <option value="DEPARTMENT">Specific Department</option>
              <option value="ROLE">Specific Role</option>
              <option value="SPECIFIC">Specific Employees</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="pinned"
              checked={formData.isPinned || false}
              onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
              className="w-4 h-4 rounded border-border text-brand-500 focus:ring-brand-500"
            />
            <label htmlFor="pinned" className="text-sm text-muted-foreground">Pin to top of feed</label>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={loading} disabled={!formData.title || !formData.content || loading}>
              Post Announcement
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export interface OverviewViewProps {
  onSelectTab?: (tabId: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onSelectTab }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [announcementDialogOpen, setAnnouncementDialogOpen] = useState(false);
  const [approveLoadingId, setApproveLoadingId] = useState<string | null>(null);
  const [rejectLoadingId, setRejectLoadingId] = useState<string | null>(null);

  // RTK Query hooks for data fetching
  const {
    data: _dashboardSummary,
    isLoading: _summaryLoading,
    isError: summaryError,
    error: summaryErrorData,
    refetch: refetchSummary,
  } = useGetDashboardSummaryQuery(undefined, { pollingInterval: 60000 });

  const {
    data: employeeSummary,
    isLoading: employeeLoading,
    isError: employeeError,
    error: employeeErrorData,
    refetch: refetchEmployees,
  } = useGetEmployeeSummaryQuery(undefined, { pollingInterval: 120000 });

  const {
    data: attendanceSummary,
    isLoading: attendanceLoading,
    isError: attendanceError,
    error: attendanceErrorData,
    refetch: refetchAttendance,
  } = useGetAttendanceSummaryQuery(undefined, { pollingInterval: 60000 });

  const {
    data: pendingApprovals,
    isLoading: approvalsLoading,
    isError: approvalsError,
    error: approvalsErrorData,
    refetch: refetchApprovals,
  } = useGetPendingApprovalsQuery(undefined, { pollingInterval: 60000 });

  const {
    data: payrollDashboard,
    isLoading: payrollLoading,
    isError: payrollError,
    error: payrollErrorData,
    refetch: refetchPayroll,
  } = useGetPayrollDashboardQuery(undefined, { pollingInterval: 120000 });

  const {
    data: upcomingEvents,
    isLoading: eventsLoading,
    isError: _eventsError,
    error: eventsErrorData,
    refetch: refetchEvents,
  } = useGetUpcomingEventsQuery({ daysAhead: 30 }, { pollingInterval: 300000 });

  const {
    data: timelineFeed,
    isLoading: timelineLoading,
    isError: _timelineError,
    error: timelineErrorData,
    refetch: refetchTimeline,
  } = useGetTimelineFeedQuery({ limit: 50, daysBack: 14 }, { pollingInterval: 120000 });

  // Mutations
  const [createAnnouncement] = useCreateAnnouncementMutation();
  const [approveLeave] = useApproveLeaveMutation();
  const [rejectLeave] = useRejectLeaveMutation();

  const handleCreateAnnouncement = async (data: Partial<Announcement>) => {
    try {
      await createAnnouncement(data).unwrap();
      toast.success('Announcement posted successfully', 'Posted');
      refetchSummary();
      refetchTimeline();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to post announcement', 'Error');
    }
  };

  const handleApproveLeave = async (leaveId: string) => {
    setApproveLoadingId(leaveId);
    try {
      await approveLeave({ leaveId, comment: '' }).unwrap();
      toast.success('Leave request approved', 'Approved');
      refetchApprovals();
      refetchSummary();
      refetchTimeline();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to approve leave', 'Error');
    } finally {
      setApproveLoadingId(null);
    }
  };

  const handleRejectLeave = async (leaveId: string) => {
    const comment = window.prompt('Enter rejection reason (required):');
    if (!comment) {
      toast.warning('Rejection reason is required', 'Cancelled');
      return;
    }
    setRejectLoadingId(leaveId);
    try {
      await rejectLeave({ leaveId, comment }).unwrap();
      toast.success('Leave request rejected', 'Rejected');
      refetchApprovals();
      refetchSummary();
      refetchTimeline();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to reject leave', 'Error');
    } finally {
      setRejectLoadingId(null);
    }
  };

  const handleNavigate = (path: string) => {
    if (path.includes('payroll') && onSelectTab) {
      onSelectTab('payroll');
      return;
    }
    if (path.includes('leaves') && onSelectTab) {
      onSelectTab('leaves');
      return;
    }
    if (path.includes('employees') && onSelectTab) {
      onSelectTab('employees');
      return;
    }
    navigate(path);
  };

  const refreshAll = () => {
    refetchSummary();
    refetchEmployees();
    refetchAttendance();
    refetchApprovals();
    refetchPayroll();
    refetchEvents();
    refetchTimeline();
    toast.info('Refreshing dashboard data...', 'Refreshing');
  };

  const anyError = summaryError || employeeError || attendanceError || approvalsError || payrollError;

  const totalPendingApprovals = pendingApprovals?.grandTotal ?? 0;
  const activeHeadcount = employeeSummary?.totalActive ?? 0;
  const onProbation = employeeSummary?.onProbation ?? 0;
  const onNotice = employeeSummary?.onNoticePeriod ?? 0;
  const attendanceRate = attendanceSummary?.attendanceRate ?? 0;
  const presentToday = attendanceSummary?.present ?? 0;
  const lateToday = attendanceSummary?.late ?? 0;
  const onLeaveToday = attendanceSummary?.onLeave ?? 0;
  const absentToday = attendanceSummary?.absent ?? 0;

  const activePayroll = payrollDashboard?.activeRun;
  const lastPayroll = payrollDashboard?.lastCompletedRun;
  const upcomingPayroll = payrollDashboard?.upcomingRun;
  const payrollStatus = activePayroll?.status || upcomingPayroll?.status || 'NO_ACTIVE_RUN';

  const getPayrollStatusConfig = (status: string) => {
    switch (status) {
      case 'DRAFT': return { label: 'Draft', color: 'text-gray-600 dark:text-zinc-400', bgColor: 'bg-gray-100 dark:bg-zinc-800', icon: <FileSpreadsheet className="w-3.5 h-3.5" /> };
      case 'PENDING_APPROVAL': return { label: 'Pending Approval', color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-50 dark:bg-amber-950/30', icon: <AlertTriangle className="w-3.5 h-3.5" /> };
      case 'APPROVED': return { label: 'Approved', color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-50 dark:bg-emerald-950/30', icon: <CheckCircle2 className="w-3.5 h-3.5" /> };
      case 'PROCESSING': return { label: 'Processing', color: 'text-indigo-600 dark:text-indigo-400', bgColor: 'bg-indigo-50 dark:bg-indigo-950/30', icon: <Loader2 className="w-3.5 h-3.5 animate-spin" /> };
      case 'PROCESSED': return { label: 'Processed', color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-50 dark:bg-emerald-950/30', icon: <CheckCircle2 className="w-3.5 h-3.5" /> };
      case 'PAID': return { label: 'Paid', color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-50 dark:bg-emerald-950/30', icon: <CreditCard className="w-3.5 h-3.5" /> };
      case 'FAILED': return { label: 'Failed', color: 'text-rose-600 dark:text-rose-400', bgColor: 'bg-rose-50 dark:bg-rose-950/30', icon: <AlertTriangle className="w-3.5 h-3.5" /> };
      default: return { label: 'No Active Run', color: 'text-gray-600 dark:text-zinc-400', bgColor: 'bg-gray-100 dark:bg-zinc-800', icon: <Clock className="w-3.5 h-3.5" /> };
    }
  };

  const payrollConfig = getPayrollStatusConfig(payrollStatus);
  const nextPayDate = activePayroll?.payDate || upcomingPayroll?.payDate;

  return (
    <div className="space-y-6">
      {/* Global Error Banner */}
      {anyError && (
        <ErrorDisplay
          error={summaryErrorData || employeeErrorData || attendanceErrorData || approvalsErrorData || payrollErrorData}
          onRetry={refreshAll}
          title="Failed to Load Dashboard Data"
          className="mb-4"
        />
      )}

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Active Headcount"
          value={activeHeadcount > 0 ? formatNumber(activeHeadcount) : '—'}
          subtext={activeHeadcount > 0 ? `${onProbation} on probation · ${onNotice} on notice` : 'No employee data'}
          icon={<Users className="w-4 h-4" />}
          iconColor="text-pink-500 dark:text-pink-400"
          valueColor="text-foreground"
          trend={employeeSummary?.onboardedThisWeek ? { value: `+${employeeSummary.onboardedThisWeek} this week`, isPositive: true } : undefined}
          loading={employeeLoading}
          error={employeeErrorData}
          onRetry={refetchEmployees}
        />

        <KPICard
          label="Daily Attendance Rate"
          value={attendanceSummary ? `${attendanceRate.toFixed(1)}%` : '—'}
          subtext={attendanceSummary
            ? `Present: ${presentToday} · Late: ${lateToday} · On Leave: ${onLeaveToday} · Absent: ${absentToday}`
            : 'No attendance data'}
          icon={<Calendar className="w-4 h-4" />}
          iconColor={attendanceRate >= 95 ? 'text-emerald-500 dark:text-emerald-400' : attendanceRate >= 85 ? 'text-amber-500 dark:text-amber-400' : 'text-rose-500 dark:text-rose-400'}
          valueColor={attendanceRate >= 95 ? 'text-emerald-500 dark:text-emerald-400' : attendanceRate >= 85 ? 'text-amber-500 dark:text-amber-400' : 'text-rose-500 dark:text-rose-400'}
          loading={attendanceLoading}
          error={attendanceErrorData}
          onRetry={refetchAttendance}
        />

        <KPICard
          label="Pending Approvals"
          value={totalPendingApprovals > 0 ? totalPendingApprovals : '—'}
          subtext={
            pendingApprovals
              ? `Leaves: ${pendingApprovals.leaves.total} · Expenses: ${pendingApprovals.expenses.total} · Docs: ${pendingApprovals.documents.total}`
              : 'No pending items'
          }
          icon={<AlertTriangle className="w-4 h-4" />}
          iconColor="text-amber-500 dark:text-amber-400"
          valueColor={totalPendingApprovals > 0 ? 'text-amber-500 dark:text-amber-400' : 'text-foreground'}
          trend={totalPendingApprovals > 0 ? { value: 'Requires action', isPositive: false } : undefined}
          loading={approvalsLoading}
          error={approvalsErrorData}
          onRetry={refetchApprovals}
        />

        <KPICard
          label="Payroll Cycle Status"
          value={payrollConfig.label}
          subtext={
            nextPayDate
              ? `Next disbursement: ${new Date(nextPayDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
              : lastPayroll
              ? `Last run: ${formatCurrency(lastPayroll.totalNetAmount, lastPayroll.currency)} on ${new Date(lastPayroll.paidAt || lastPayroll.processedAt || lastPayroll.createdAt).toLocaleDateString()}`
              : 'No payroll runs configured'
          }
          icon={payrollConfig.icon}
          iconColor={payrollConfig.color}
          valueColor={payrollConfig.color}
          loading={payrollLoading}
          error={payrollErrorData}
          onRetry={refetchPayroll}
        />
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickActionButton
          label="Add Employee"
          description="Start new hire onboarding workflow"
          icon={<UserPlus className="w-4 h-4" />}
          iconColor="text-emerald-500 dark:text-emerald-400"
          onClick={() => handleNavigate('/dashboard/employees/new')}
        />
        <QuickActionButton
          label="Approve Leaves"
          description={`${pendingApprovals?.leaves.total || 0} pending leave requests`}
          icon={<Calendar className="w-4 h-4" />}
          iconColor="text-amber-500 dark:text-amber-400"
          onClick={() => handleNavigate('/dashboard/attendance?tab=leave&status=PENDING')}
          variant="outline"
        />
        <QuickActionButton
          label="Post Announcement"
          description="Broadcast to all employees"
          icon={<Megaphone className="w-4 h-4" />}
          iconColor="text-brand-500 dark:text-brand-400"
          onClick={() => setAnnouncementDialogOpen(true)}
          variant="outline"
        />
        <QuickActionButton
          label={activePayroll ? 'Manage Payroll' : 'Trigger Payroll Run'}
          description={activePayroll
            ? `${payrollConfig.label} · ${activePayroll.totalEmployees} employees`
            : 'Create new payroll period'}
          icon={<CreditCard className="w-4 h-4" />}
          iconColor="text-emerald-500 dark:text-emerald-400"
          onClick={() => handleNavigate('/dashboard/payroll')}
          variant="primary"
        />
      </div>

      {/* Middle Section: Attendance & Approvals Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Live Pending Approvals Queue */}
        <div className="p-5 rounded-2xl bg-card border border-border/70 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              Pending Approvals Queue
            </h3>
            <Button variant="ghost" size="sm" onClick={() => handleNavigate('/dashboard/attendance?tab=leave&status=PENDING')}>
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>

          <PendingApprovalsQueue
            approvals={pendingApprovals}
            loading={approvalsLoading}
            error={approvalsErrorData}
            onRetry={refetchApprovals}
            onApprove={handleApproveLeave}
            onReject={handleRejectLeave}
            approveLoading={approveLoadingId}
            rejectLoading={rejectLoadingId}
            onNavigate={handleNavigate}
          />
        </div>

        {/* Right: Today's Attendance Breakdown */}
        <div>
          <AttendanceBreakdown
            data={attendanceSummary}
            loading={attendanceLoading}
            error={attendanceErrorData}
            onRetry={refetchAttendance}
          />
        </div>
      </div>

      {/* Bottom Section: HR Command Center + Payroll + Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: HR Command Center - Timeline Feed */}
        <div className="lg:col-span-2">
          <div className="p-5 rounded-2xl bg-card border border-border/70 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Activity className="w-4 h-4 text-brand-500 dark:text-brand-400" />
                HR Command Center
              </h3>
              <Button variant="ghost" size="sm" onClick={() => handleNavigate('/dashboard/activity')}>
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
            <TimelineFeed
              events={timelineFeed || []}
              loading={timelineLoading}
              error={timelineErrorData}
              onRetry={refetchTimeline}
            />
          </div>
        </div>

        {/* Right Column: Payroll Status + Upcoming Events */}
        <div className="space-y-6">
          {/* Payroll Status Card */}
          <div className="p-5 rounded-2xl bg-card border border-border/70 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                Payroll Status
              </h3>
              <Button variant="ghost" size="sm" onClick={() => handleNavigate('/dashboard/payroll')}>
                Manage <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>

            {payrollLoading ? (
              <SkeletonStatCard />
            ) : payrollError ? (
              <ErrorDisplay error={payrollErrorData} onRetry={refetchPayroll} compact />
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${payrollConfig.bgColor} shrink-0`}>
                      {payrollConfig.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground">{activePayroll ? 'Active Payroll Run' : upcomingPayroll ? 'Upcoming Payroll Run' : 'No Active Payroll Run'}</div>
                      <Badge variant={payrollConfig.label === 'Draft' ? 'slate' : payrollConfig.label === 'Pending Approval' ? 'warning' : 'success'} size="sm">
                        {payrollConfig.label}
                      </Badge>
                    </div>
                  </div>

                  {activePayroll && (
                    <div className="mt-4 grid grid-cols-2 gap-3 text-[11px]">
                      <div>
                        <div className="text-muted-foreground">Period</div>
                        <div className="font-medium text-foreground">
                          {new Date(activePayroll.periodStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} –{' '}
                          {new Date(activePayroll.periodEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Pay Date</div>
                        <div className="font-medium text-foreground">{new Date(activePayroll.payDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Employees</div>
                        <div className="font-medium text-foreground">{activePayroll.totalEmployees}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Net Amount</div>
                        <div className="font-medium text-emerald-500 dark:text-emerald-400">{formatCurrency(activePayroll.totalNetAmount, activePayroll.currency)}</div>
                      </div>
                    </div>
                  )}

                  {upcomingPayroll && !activePayroll && (
                    <div className="mt-4 grid grid-cols-2 gap-3 text-[11px]">
                      <div>
                        <div className="text-muted-foreground">Upcoming Period</div>
                        <div className="font-medium text-foreground">
                          {new Date(upcomingPayroll.periodStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} –{' '}
                          {new Date(upcomingPayroll.periodEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Scheduled Pay Date</div>
                        <div className="font-medium text-foreground">{new Date(upcomingPayroll.payDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                      </div>
                    </div>
                  )}

                  {!activePayroll && !upcomingPayroll && (
                    <div className="mt-4 text-center text-muted-foreground">
                      <p className="text-sm">No payroll runs scheduled</p>
                      <Button variant="outline" size="sm" className="mt-2" onClick={() => handleNavigate('/dashboard/payroll')}>
                        Create First Payroll Run
                      </Button>
                    </div>
                  )}
                </div>

                {lastPayroll && (
                  <div className="p-3 rounded-xl bg-muted/40 border border-border/50">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">Last Completed Run</span>
                      <Badge variant="success" size="sm">Paid</Badge>
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="font-bold text-emerald-500 dark:text-emerald-400">{formatCurrency(lastPayroll.totalNetAmount, lastPayroll.currency)}</div>
                        <div className="text-[10px] text-muted-foreground">Net Paid</div>
                      </div>
                      <div>
                        <div className="font-bold text-foreground">{lastPayroll.totalEmployees}</div>
                        <div className="text-[10px] text-muted-foreground">Employees</div>
                      </div>
                      <div>
                        <div className="font-bold text-foreground">{new Date(lastPayroll.paidAt || lastPayroll.processedAt || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                        <div className="text-[10px] text-muted-foreground">Disbursed</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Upcoming Events */}
          <div className="p-5 rounded-2xl bg-card border border-border/70 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                Upcoming Milestones
              </h3>
              <Button variant="ghost" size="sm" onClick={() => handleNavigate('/dashboard/events')}>
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
            <UpcomingEventsSection
              events={upcomingEvents || []}
              loading={eventsLoading}
              error={eventsErrorData}
              onRetry={refetchEvents}
            />
          </div>
        </div>
      </div>

      {/* Announcement Dialog */}
      <AnnouncementDialog
        isOpen={announcementDialogOpen}
        onClose={() => setAnnouncementDialogOpen(false)}
        onSubmit={handleCreateAnnouncement}
        loading={false}
      />
    </div>
  );
};

export default OverviewView;
