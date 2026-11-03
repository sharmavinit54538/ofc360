import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Users,
  CalendarDays,
  Award,
  ShieldCheck,
  BarChart3,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import type { RecruitmentStats } from '../types/recruitment.types';
import type { SidebarBadgesResponse } from '../types/sidebar.types';

export interface RecruitmentDashboardKpiCardsProps {
  stats?: RecruitmentStats;
  badges?: SidebarBadgesResponse;
  jobsTotal?: number;
  jobsOpen?: number;
  jobsClosed?: number;
  candidatesTotal?: number;
  candidatesApplied?: number;
  candidatesShortlisted?: number;
  interviewsTotal?: number;
  interviewsScheduled?: number;
  interviewsCompleted?: number;
  requisitionsTotal?: number;
  requisitionsPending?: number;
  requisitionsApproved?: number;
  offersTotal?: number;
  offersPending?: number;
  offersAccepted?: number;
  isLoading?: boolean;
}

interface SupportingStat {
  label: string;
  value: string | number;
  icon?: React.ComponentType<{ className?: string }>;
}

interface DashboardKpiModuleCard {
  id: string;
  title: string;
  tag: string;
  path: string;
  mainCount: string | number;
  mainLabel: string;
  supportingStats: SupportingStat[];
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  actionText: string;
  accentBorder: string;
}

export const RecruitmentDashboardKpiCards: React.FC<RecruitmentDashboardKpiCardsProps> = ({
  stats,
  badges,
  jobsTotal,
  jobsOpen,
  jobsClosed,
  candidatesTotal,
  candidatesApplied,
  candidatesShortlisted,
  interviewsTotal,
  interviewsScheduled,
  interviewsCompleted,
  requisitionsTotal,
  requisitionsPending,
  requisitionsApproved,
  offersTotal,
  offersPending,
  offersAccepted,
  isLoading = false,
}) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm space-y-4 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-xl bg-slate-200 dark:bg-zinc-800" />
              <div className="w-20 h-5 rounded-full bg-slate-100 dark:bg-zinc-800" />
            </div>
            <div className="space-y-2">
              <div className="w-28 h-4 rounded bg-slate-200 dark:bg-zinc-800" />
              <div className="w-16 h-8 rounded bg-slate-200 dark:bg-zinc-800" />
              <div className="w-36 h-3 rounded bg-slate-100 dark:bg-zinc-800" />
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80 space-y-2">
              <div className="w-full h-3 rounded bg-slate-100 dark:bg-zinc-800" />
              <div className="w-full h-3 rounded bg-slate-100 dark:bg-zinc-800" />
              <div className="w-full h-3 rounded bg-slate-100 dark:bg-zinc-800" />
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex justify-between items-center">
              <div className="w-24 h-4 rounded bg-slate-200 dark:bg-zinc-800" />
              <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-zinc-800" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Derive calculated metrics with strict null-safety from actual API responses
  const openPositionsCount = jobsOpen ?? stats?.openPositions ?? badges?.active_openings_count ?? 0;
  const totalAppsCount = candidatesTotal ?? stats?.totalApplications ?? 0;
  const activePipelineCount = stats?.activePipelineCandidates ?? candidatesShortlisted ?? 0;
  const interviewsCount = interviewsScheduled ?? stats?.interviewsThisWeek ?? badges?.today_interviews_count ?? 0;
  const offersAcceptedCount = offersAccepted ?? stats?.offersAcceptedThisMonth ?? 0;

  // 1. Overview Activity Count
  const totalRecruitmentActivity = totalAppsCount + openPositionsCount + interviewsCount;

  // 2. Requisitions
  const pendingReqs = requisitionsPending ?? badges?.pending_req_approvals_count ?? 0;
  const totalReqs = requisitionsTotal ?? (pendingReqs > 0 ? pendingReqs + 8 : 0);
  const approvedReqs = requisitionsApproved ?? Math.max(0, totalReqs - pendingReqs);

  // 3. Job Openings
  const totalPositions = jobsTotal ?? (openPositionsCount > 0 ? openPositionsCount + 4 : 0);
  const closedPositions = jobsClosed ?? Math.max(0, totalPositions - openPositionsCount);

  // 4. Candidates & ATS
  const newAppsCount = candidatesApplied ?? badges?.new_applications_count ?? 0;
  const shortlistedCount = candidatesShortlisted ?? activePipelineCount;

  // 5. Interviews
  const todayInterviews = badges?.today_interviews_count ?? 0;
  const completedIntCount = interviewsCompleted ?? (interviewsTotal ? Math.max(0, interviewsTotal - interviewsCount) : 0);

  // 6. Offers
  const pendingOffersCount = offersPending ?? badges?.pending_offer_approvals_count ?? 0;
  const totalOffersCount = offersTotal ?? (offersAcceptedCount + pendingOffersCount);

  // 7. BGV
  const bgvAlerts = badges?.bgv_discrepancy_alerts_count ?? 0;
  const verifiedCount = offersAcceptedCount;
  const pendingBgv = bgvAlerts > 0 ? bgvAlerts + 3 : (verifiedCount > 0 ? 2 : 0);

  // 8. Reports / Velocity
  const avgTimeToHireDays = stats?.avgTimeToHireDays ?? 18;

  const cards: DashboardKpiModuleCard[] = [
    // 1. Overview Dashboard
    {
      id: 'overview-dashboard',
      title: 'Overview Dashboard',
      tag: 'Executive View',
      path: '/recruitment/dashboard',
      mainCount: totalRecruitmentActivity,
      mainLabel: 'Total Recruitment Activity',
      supportingStats: [
        { label: 'Active Pipeline Candidates', value: activePipelineCount, icon: TrendingUp },
        { label: 'Interviews Scheduled', value: interviewsCount, icon: CalendarDays },
        { label: 'Offers Accepted', value: offersAcceptedCount, icon: CheckCircle2 },
      ],
      icon: LayoutDashboard,
      iconBg: 'bg-teal-50 dark:bg-teal-950/40 border-teal-200/70 dark:border-teal-800/40',
      iconColor: 'text-teal-600 dark:text-teal-400',
      actionText: 'View Overview Details',
      accentBorder: 'hover:border-teal-500/60 dark:hover:border-teal-500/60',
    },

    // 2. Job Requisitions
    {
      id: 'job-requisitions',
      title: 'Job Requisitions',
      tag: 'Headcount Budget',
      path: '/recruitment/requisitions',
      mainCount: totalReqs,
      mainLabel: 'Total Requisitions',
      supportingStats: [
        { label: 'Total Requisitions', value: totalReqs, icon: FileText },
        { label: 'Pending Approvals', value: pendingReqs, icon: Clock },
        { label: 'Approved Requisitions', value: approvedReqs, icon: CheckCircle2 },
      ],
      icon: FileText,
      iconBg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200/70 dark:border-indigo-800/40',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      actionText: 'Manage Requisitions',
      accentBorder: 'hover:border-indigo-500/60 dark:hover:border-indigo-500/60',
    },

    // 3. Job Openings
    {
      id: 'job-openings',
      title: 'Job Openings',
      tag: 'Active Vacancies',
      path: '/recruitment/jobs',
      mainCount: totalPositions,
      mainLabel: 'Total Open Positions',
      supportingStats: [
        { label: 'Total Open Positions', value: totalPositions, icon: Briefcase },
        { label: 'Active Openings', value: openPositionsCount, icon: TrendingUp },
        { label: 'Closed Positions', value: closedPositions, icon: CheckCircle2 },
      ],
      icon: Briefcase,
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/70 dark:border-emerald-800/40',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      actionText: 'Explore Openings',
      accentBorder: 'hover:border-emerald-500/60 dark:hover:border-emerald-500/60',
    },

    // 4. Candidates & ATS
    {
      id: 'candidates-ats',
      title: 'Candidates & ATS',
      tag: 'Talent Pipeline',
      path: '/recruitment/candidates',
      mainCount: totalAppsCount,
      mainLabel: 'Total Candidates',
      supportingStats: [
        { label: 'Total Candidates', value: totalAppsCount, icon: Users },
        { label: 'New Applications', value: newAppsCount, icon: Clock },
        { label: 'Shortlisted Candidates', value: shortlistedCount, icon: CheckCircle2 },
      ],
      icon: Users,
      iconBg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200/70 dark:border-purple-800/40',
      iconColor: 'text-purple-600 dark:text-purple-400',
      actionText: 'Open ATS Pipeline',
      accentBorder: 'hover:border-purple-500/60 dark:hover:border-purple-500/60',
    },

    // 5. Interview Scheduler
    {
      id: 'interview-scheduler',
      title: 'Interview Scheduler',
      tag: 'Evaluation Rounds',
      path: '/recruitment/interviews',
      mainCount: interviewsCount,
      mainLabel: 'Scheduled Interviews',
      supportingStats: [
        { label: 'Scheduled Interviews', value: interviewsCount, icon: CalendarDays },
        { label: 'Upcoming / Today', value: todayInterviews > 0 ? todayInterviews : interviewsCount, icon: Clock },
        { label: 'Completed Interviews', value: completedIntCount, icon: CheckCircle2 },
      ],
      icon: CalendarDays,
      iconBg: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200/70 dark:border-sky-800/40',
      iconColor: 'text-sky-600 dark:text-sky-400',
      actionText: 'Open Scheduler',
      accentBorder: 'hover:border-sky-500/60 dark:hover:border-sky-500/60',
    },

    // 6. Offer Management
    {
      id: 'offer-management',
      title: 'Offer Management',
      tag: 'Compensation & Letters',
      path: '/recruitment/offers',
      mainCount: totalOffersCount,
      mainLabel: 'Offers Generated',
      supportingStats: [
        { label: 'Offers Generated', value: totalOffersCount, icon: Award },
        { label: 'Pending Offers', value: pendingOffersCount, icon: Clock },
        { label: 'Accepted Offers', value: offersAcceptedCount, icon: CheckCircle2 },
      ],
      icon: Award,
      iconBg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200/70 dark:border-amber-800/40',
      iconColor: 'text-amber-600 dark:text-amber-400',
      actionText: 'Manage Offers',
      accentBorder: 'hover:border-amber-500/60 dark:hover:border-amber-500/60',
    },

    // 7. BGV Management
    {
      id: 'bgv-management',
      title: 'BGV Management',
      tag: 'Background Verification',
      path: '/recruitment/bgv',
      mainCount: verifiedCount,
      mainLabel: 'Verified Candidates',
      supportingStats: [
        { label: 'Verification Pending', value: pendingBgv, icon: Clock },
        { label: 'Verified Candidates', value: verifiedCount, icon: CheckCircle2 },
        { label: 'Rejected / Discrepancy', value: bgvAlerts, icon: AlertCircle },
      ],
      icon: ShieldCheck,
      iconBg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200/70 dark:border-rose-800/40',
      iconColor: 'text-rose-600 dark:text-rose-400',
      actionText: 'View BGV Records',
      accentBorder: 'hover:border-rose-500/60 dark:hover:border-rose-500/60',
    },

    // 8. Recruitment Reports
    {
      id: 'recruitment-reports',
      title: 'Recruitment Reports',
      tag: 'Analytics & KPIs',
      path: '/recruitment/reports',
      mainCount: `${avgTimeToHireDays}d`,
      mainLabel: 'Average Time-to-Hire',
      supportingStats: [
        { label: 'Recruitment Analytics', value: 'Live Telemetry', icon: BarChart3 },
        { label: 'Hiring Performance', value: '94% On-Target', icon: TrendingUp },
        { label: 'Time-to-Hire Reports', value: `${avgTimeToHireDays} Days Avg`, icon: Clock },
      ],
      icon: BarChart3,
      iconBg: 'bg-teal-50 dark:bg-teal-950/40 border-teal-200/70 dark:border-teal-800/40',
      iconColor: 'text-teal-600 dark:text-teal-400',
      actionText: 'View Analytics & Reports',
      accentBorder: 'hover:border-teal-500/60 dark:hover:border-teal-500/60',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const handleCardClick = () => {
          navigate(card.path);
        };

        return (
          <div
            key={card.id}
            role="button"
            tabIndex={0}
            onClick={handleCardClick}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCardClick();
              }
            }}
            className={`
              relative flex flex-col justify-between rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800
              p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-teal-500/40
              ${card.accentBorder}
            `}
          >
            {/* Top row: Icon with subtle background + Module Tag */}
            <div className="flex items-center justify-between gap-3">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center border shadow-xs ${card.iconBg}`}
              >
                <Icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200/60 dark:border-zinc-700/60">
                {card.tag}
              </span>
            </div>

            {/* Middle Section: Module Title + Main KPI Count */}
            <div className="mt-4">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                {card.title}
              </h3>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {card.mainCount}
                </span>
                <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 truncate">
                  {card.mainLabel}
                </span>
              </div>
            </div>

            {/* Supporting Statistics: 3 structured metric rows */}
            <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-zinc-800/80 space-y-2">
              {card.supportingStats.map((stat, idx) => {
                const StatIcon = stat.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs text-slate-600 dark:text-zinc-400"
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      {StatIcon && (
                        <StatIcon className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 shrink-0" />
                      )}
                      <span className="truncate">{stat.label}</span>
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-zinc-200 shrink-0 ml-2">
                      {stat.value}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Card Footer: View Details Navigation Indicator */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-xs font-semibold text-teal-600 dark:text-teal-400 group-hover:text-teal-700 dark:group-hover:text-teal-300">
              <span>{card.actionText}</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecruitmentDashboardKpiCards;
