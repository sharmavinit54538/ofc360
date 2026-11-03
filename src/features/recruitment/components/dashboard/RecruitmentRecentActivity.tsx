import React from 'react';
import {
  Activity,
  UserPlus,
  CalendarDays,
  Award,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export interface ActivityItem {
  id: string;
  type: 'APPLICATION' | 'INTERVIEW' | 'OFFER' | 'HIRED';
  title: string;
  description: string;
  candidateName?: string;
  role?: string;
  timestamp: string;
}

interface RecruitmentRecentActivityProps {
  activities?: ActivityItem[];
  isLoading?: boolean;
}

const DEFAULT_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'HIRED',
    title: 'Candidate Hired',
    description: 'Accepted offer letter and verified background credentials.',
    candidateName: 'Priya Sharma',
    role: 'Senior Full Stack Engineer',
    timestamp: '15m ago',
  },
  {
    id: 'act-2',
    type: 'OFFER',
    title: 'Offer Letter Generated',
    description: 'Executive CTC approved by Finance head and sent to candidate.',
    candidateName: 'Rahul Verma',
    role: 'Product Designer',
    timestamp: '1h ago',
  },
  {
    id: 'act-3',
    type: 'INTERVIEW',
    title: 'Technical Round 2 Scheduled',
    description: 'Panel assigned with Lead Architect for System Design evaluation.',
    candidateName: 'Ananya Roy',
    role: 'DevOps & Cloud Engineer',
    timestamp: '3h ago',
  },
  {
    id: 'act-4',
    type: 'APPLICATION',
    title: 'New Application Received',
    description: 'Parsed via LinkedIn ATS with 92% JD match scorecard.',
    candidateName: 'Vikram Joshi',
    role: 'Data Scientist',
    timestamp: '5h ago',
  },
];

const TYPE_CONFIG = {
  APPLICATION: {
    icon: UserPlus,
    bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    color: 'text-indigo-600 dark:text-indigo-400',
    ring: 'ring-indigo-100 dark:ring-indigo-900/50',
  },
  INTERVIEW: {
    icon: CalendarDays,
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    color: 'text-amber-600 dark:text-amber-400',
    ring: 'ring-amber-100 dark:ring-amber-900/50',
  },
  OFFER: {
    icon: Award,
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    color: 'text-emerald-600 dark:text-emerald-400',
    ring: 'ring-emerald-100 dark:ring-emerald-900/50',
  },
  HIRED: {
    icon: CheckCircle2,
    bg: 'bg-teal-50 dark:bg-teal-950/40',
    color: 'text-teal-600 dark:text-teal-400',
    ring: 'ring-teal-100 dark:ring-teal-900/50',
  },
};

export const RecruitmentRecentActivity: React.FC<RecruitmentRecentActivityProps> = ({
  activities,
}) => {
  const list = activities && activities.length > 0 ? activities : DEFAULT_ACTIVITIES;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Recent Recruitment Activity</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Real-time hiring timeline & candidate movements
          </p>
        </div>
        <Link
          to="/recruitment/candidates"
          className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 inline-flex items-center gap-1 transition-colors"
        >
          <span>View All</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-zinc-800/80 my-auto py-1">
        {list.slice(0, 4).map((item) => {
          const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.APPLICATION;
          const Icon = cfg.icon;

          return (
            <div key={item.id} className="py-2.5 flex items-start gap-3 group">
              <div
                className={`w-8 h-8 rounded-full ${cfg.bg} ${cfg.color} ring-4 ${cfg.ring} flex items-center justify-center shrink-0 mt-0.5`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {item.title}
                  </p>
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500 shrink-0 font-medium">
                    {item.timestamp}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-zinc-300 font-medium truncate mt-0.5">
                  <span className="text-slate-900 dark:text-white font-semibold">
                    {item.candidateName}
                  </span>{' '}
                  {item.role && <span className="text-slate-400">· {item.role}</span>}
                </p>

                <p className="text-[10px] text-slate-400 dark:text-zinc-500 truncate mt-0.5 leading-snug">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live feed connected</span>
        </span>
        <span className="font-medium text-slate-400">Updated just now</span>
      </div>
    </div>
  );
};
