import React from 'react';
import { Zap, Target, AlertTriangle, Sparkles } from 'lucide-react';

interface RecruitmentInsightsPanelProps {
  topSourceName?: string;
  avgVelocityDays?: number;
  bottleneckStage?: string;
}

export const RecruitmentInsightsPanel: React.FC<RecruitmentInsightsPanelProps> = ({
  topSourceName = 'Employee Referrals',
  avgVelocityDays = 18.4,
  bottleneckStage = 'Technical Interview Round',
}) => {
  const insights = [
    {
      id: 'velocity',
      title: 'Hiring Velocity',
      metric: `Accelerating (${Math.round(avgVelocityDays)}d avg)`,
      subtext: '14% faster than standard enterprise benchmarks across engineering and product.',
      icon: Zap,
      iconBg: 'bg-teal-50 dark:bg-teal-950/40',
      iconColor: 'text-teal-600 dark:text-teal-400',
      badge: 'High Velocity',
      badgeClass: 'bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300',
    },
    {
      id: 'source',
      title: 'Top Source',
      metric: topSourceName,
      subtext: '42.8% offer acceptance rate with 22% lower cost per hire than external job boards.',
      icon: Target,
      iconBg: 'bg-purple-50 dark:bg-purple-950/40',
      iconColor: 'text-purple-600 dark:text-purple-400',
      badge: 'Best Quality',
      badgeClass: 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300',
    },
    {
      id: 'bottleneck',
      title: 'Pipeline Bottleneck',
      metric: bottleneckStage,
      subtext: 'Candidates wait an average of 6.2 days for interviewer scorecard submissions.',
      icon: AlertTriangle,
      iconBg: 'bg-amber-50 dark:bg-amber-950/40',
      iconColor: 'text-amber-600 dark:text-amber-400',
      badge: 'Attention Needed',
      badgeClass: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300',
    },
    {
      id: 'recommendation',
      title: 'AI Recommendation',
      metric: 'Automate Slot Booking',
      subtext: 'Enabling self-service interview booking reduces scheduling friction by 2.4 days.',
      icon: Sparkles,
      iconBg: 'bg-indigo-50 dark:bg-indigo-950/40',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      badge: 'Actionable',
      badgeClass: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300',
    },
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-xl p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-slate-100 dark:border-zinc-800">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Recruitment Insights</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
            Automated pipeline diagnostics and continuous improvement heuristics
          </p>
        </div>
        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
          AI Diagnostics Live
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {insights.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="p-3.5 rounded-xl border border-slate-200/70 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/40 hover:border-teal-500/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wide">
                    {item.title}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.badgeClass}`}>
                    {item.badge}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 mb-2">
                  <div
                    className={`w-7 h-7 rounded-lg ${item.iconBg} ${item.iconColor} flex items-center justify-center shrink-0`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {item.metric}
                  </h4>
                </div>

                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                  {item.subtext}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
