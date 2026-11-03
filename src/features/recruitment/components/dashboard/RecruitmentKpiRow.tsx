import React from 'react';
import {
  FileText,
  Briefcase,
  Users,
  CalendarDays,
  Award,
  UserCheck,
  TrendingUp,
} from 'lucide-react';

interface RecruitmentKpiRowProps {
  requisitionsTotal?: number;
  jobsOpen?: number;
  candidatesTotal?: number;
  interviewsScheduled?: number;
  offersGenerated?: number;
  hiredTotal?: number;
  isLoading?: boolean;
}

interface KpiCardItem {
  id: string;
  title: string;
  value: number;
  growth: string;
  subtext: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
}

export const RecruitmentKpiRow: React.FC<RecruitmentKpiRowProps> = ({
  requisitionsTotal = 0,
  jobsOpen = 0,
  candidatesTotal = 0,
  interviewsScheduled = 0,
  offersGenerated = 0,
  hiredTotal = 0,
  isLoading = false,
}) => {
  const cards: KpiCardItem[] = [
    {
      id: 'requisitions',
      title: 'Total Requisitions',
      value: requisitionsTotal,
      growth: '+12.5%',
      subtext: 'vs previous 30 days',
      icon: FileText,
      iconBg: 'bg-indigo-50 dark:bg-indigo-950/40',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      id: 'open_positions',
      title: 'Open Positions',
      value: jobsOpen,
      growth: '+8.3%',
      subtext: 'active hiring roles',
      icon: Briefcase,
      iconBg: 'bg-teal-50 dark:bg-teal-950/40',
      iconColor: 'text-teal-600 dark:text-teal-400',
    },
    {
      id: 'candidates',
      title: 'Total Candidates',
      value: candidatesTotal,
      growth: '+24.1%',
      subtext: 'in active pipeline',
      icon: Users,
      iconBg: 'bg-purple-50 dark:bg-purple-950/40',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      id: 'interviews',
      title: 'Interviews Scheduled',
      value: interviewsScheduled,
      growth: '+15.0%',
      subtext: 'this month',
      icon: CalendarDays,
      iconBg: 'bg-amber-50 dark:bg-amber-950/40',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      id: 'offers',
      title: 'Offers Generated',
      value: offersGenerated,
      growth: '+18.2%',
      subtext: 'issued this quarter',
      icon: Award,
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/40',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      id: 'hired',
      title: 'Hired',
      value: hiredTotal,
      growth: '+9.5%',
      subtext: 'successfully joined',
      icon: UserCheck,
      iconBg: 'bg-cyan-50 dark:bg-cyan-950/40',
      iconColor: 'text-cyan-600 dark:text-cyan-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-xl p-3.5 shadow-xs hover:border-teal-500/40 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wide truncate">
                {card.title}
              </span>
              <div
                className={`w-7 h-7 rounded-lg ${card.iconBg} ${card.iconColor} flex items-center justify-center shrink-0`}
              >
                <IconComponent className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {isLoading ? (
                  <span className="inline-block w-12 h-6 bg-slate-200 dark:bg-zinc-800 animate-pulse rounded" />
                ) : (
                  card.value.toLocaleString()
                )}
              </div>

              <div className="flex items-center gap-1.5 text-[11px] flex-wrap">
                <span className="inline-flex items-center gap-0.5 font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1 py-0.5 rounded">
                  <TrendingUp className="w-2.5 h-2.5" />
                  {card.growth}
                </span>
                <span className="text-slate-400 dark:text-zinc-500 text-[10px] truncate">
                  {card.subtext}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
