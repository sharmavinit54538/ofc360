import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  LayoutDashboard,
  Box,
  Users,
  Receipt,
  Plane,
  UserCheck,
  LogOut,
  ArrowRight,
  Search,
  SlidersHorizontal,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useGetHrOpsMetricsQuery } from '../api/hrOpsApi';
import { HrOpsPage } from './HrOpsPage';

interface HrOpsModuleCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  tags: string[];
  gradient: string;
  iconBg: string;
  iconColor: string;
  badge?: string;
}

const HROPS_MODULES: HrOpsModuleCard[] = [
  {
    id: 'hrops-command',
    title: 'Command Center & Queue',
    description: 'Operational dispatch queue, SLA tracking, priority task triggers, and action workflows.',
    icon: LayoutDashboard,
    path: '#queue',
    tags: ['Task Queue', 'SLA Alerts', 'Quick Triggers'],
    gradient: 'from-blue-500/10 via-indigo-500/5 to-transparent',
    iconBg: 'bg-blue-500/10 dark:bg-blue-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    id: 'employee-timeline',
    title: 'Employee Timeline',
    description: 'Complete employee lifecycle events, career milestones, promotions, and status history.',
    icon: Activity,
    path: '/dashboard/employee-timeline',
    tags: ['Career Lifecycle', 'Milestones', 'History'],
    gradient: 'from-violet-500/10 via-purple-500/5 to-transparent',
    iconBg: 'bg-violet-500/10 dark:bg-violet-500/20',
    iconColor: 'text-violet-600 dark:text-violet-400',
  },
  {
    id: 'asset-management',
    title: 'Asset Management',
    description: 'Company hardware, laptops, peripherals, inventory allocation, and equipment return logistics.',
    icon: Box,
    path: '/dashboard/asset-management',
    tags: ['Equipment', 'Hardware', 'Allocation'],
    gradient: 'from-cyan-500/10 via-sky-500/5 to-transparent',
    iconBg: 'bg-cyan-500/10 dark:bg-cyan-500/20',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
  },
  {
    id: 'visitor-management',
    title: 'Visitor Management',
    description: 'Facility check-ins, security badges, pre-registered guest passes, and employee host alerts.',
    icon: Users,
    path: '/dashboard/visitors',
    tags: ['Check-in', 'Security Badges', 'Guest Access'],
    gradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
    iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    id: 'expense-claims',
    title: 'Expense Claims',
    description: 'Employee reimbursement submissions, receipt validation, multi-tier approvals, and settlement tracking.',
    icon: Receipt,
    path: '/dashboard/expenses',
    tags: ['Reimbursements', 'Receipts', 'Approvals'],
    gradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
    iconBg: 'bg-amber-500/10 dark:bg-amber-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    id: 'travel-requests',
    title: 'Travel Requests',
    description: 'Corporate travel booking workflows, itineraries, hotel/flight requests, and budget approvals.',
    icon: Plane,
    path: '/dashboard/travel',
    tags: ['Business Travel', 'Bookings', 'Itineraries'],
    gradient: 'from-blue-600/10 via-cyan-500/5 to-transparent',
    iconBg: 'bg-blue-600/10 dark:bg-blue-600/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    id: 'onboarding-checklist',
    title: 'Onboarding Checklist',
    description: 'Automated new-hire orientation, document collection, training completion, and IT provisioning.',
    icon: UserCheck,
    path: '/dashboard/onboarding-checklist',
    tags: ['New Hires', 'Document Upload', 'Provisioning'],
    gradient: 'from-green-500/10 via-emerald-500/5 to-transparent',
    iconBg: 'bg-green-500/10 dark:bg-green-500/20',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  {
    id: 'exit-management',
    title: 'Exit Management',
    description: 'Offboarding clearances, asset recovery handovers, exit interviews, and documentation sign-offs.',
    icon: LogOut,
    path: '/dashboard/exit-management',
    tags: ['Offboarding', 'Asset Recovery', 'Clearances'],
    gradient: 'from-rose-500/10 via-pink-500/5 to-transparent',
    iconBg: 'bg-rose-500/10 dark:bg-rose-500/20',
    iconColor: 'text-rose-600 dark:text-rose-400',
  },
];

export const HrOpsHubPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'command'>('cards');

  // Metrics query for top counters
  const { data: metrics } = useGetHrOpsMetricsQuery();

  const filteredModules = useMemo(() => {
    if (!searchQuery.trim()) return HROPS_MODULES;
    const q = searchQuery.toLowerCase();
    return HROPS_MODULES.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const handleCardClick = (module: HrOpsModuleCard) => {
    if (module.path === '#queue') {
      setViewMode('command');
    } else {
      navigate(module.path);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-6 md:p-8 shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.2),transparent_50%)]" />
        <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* View Mode Toggle & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full">
            {/* View Switcher Tabs */}
            <div className="inline-flex items-center p-1 rounded-xl bg-white/10 border border-white/15 backdrop-blur">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={cn(
                  'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150',
                  viewMode === 'cards'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                )}
              >
                Modules (Cards)
              </button>
              <button
                type="button"
                onClick={() => setViewMode('command')}
                className={cn(
                  'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150',
                  viewMode === 'command'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                )}
              >
                Action Queue
              </button>
            </div>

            {viewMode === 'cards' && (
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter HR Ops modules..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/10 border border-white/15 text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/15 transition-all"
                />
              </div>
            )}
          </div>
        </div>

        {/* Quick KPI Counters Strip */}
        {metrics && (
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 text-xs">
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <span className="text-slate-400 block text-[11px]">Pending Actions</span>
              <span className="text-xl font-bold text-white mt-0.5 block">{metrics.pendingItems ?? 0}</span>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <span className="text-slate-400 block text-[11px]">SLA At Risk</span>
              <span className="text-xl font-bold text-amber-400 mt-0.5 block">{metrics.slaAtRiskItems ?? 0}</span>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <span className="text-slate-400 block text-[11px]">Avg Resolution</span>
              <span className="text-xl font-bold text-emerald-400 mt-0.5 block">{metrics.avgResolutionHours ?? 0}h</span>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <span className="text-slate-400 block text-[11px]">Total Completed</span>
              <span className="text-xl font-bold text-indigo-300 mt-0.5 block">{metrics.completedItems ?? 0}</span>
            </div>
          </div>
        )}
      </div>

      {/* View Content */}
      {viewMode === 'command' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5"
            >
              &larr; Back to Modules Cards
            </button>
          </div>
          <HrOpsPage />
        </div>
      ) : (
        <>
          {/* Grid of Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredModules.map((module) => {
              const Icon = module.icon;

              return (
                <div
                  key={module.id}
                  onClick={() => handleCardClick(module)}
                  className={cn(
                    'group relative flex flex-col justify-between rounded-2xl p-6 cursor-pointer',
                    'bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-zinc-800',
                    'hover:border-indigo-400 dark:hover:border-indigo-500/60 hover:shadow-xl hover:-translate-y-0.5',
                    'transition-all duration-200 overflow-hidden'
                  )}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCardClick(module);
                    }
                  }}
                >
                  {/* Subtle top corner gradient */}
                  <div
                    className={cn(
                      'absolute top-0 right-0 w-36 h-36 bg-gradient-to-br opacity-80 pointer-events-none rounded-bl-full transition-opacity group-hover:opacity-100',
                      module.gradient
                    )}
                  />

                  <div className="relative z-10 space-y-4">
                    {/* Icon & Arrow */}
                    <div className="flex items-center justify-between">
                      <div
                        className={cn(
                          'w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 duration-200',
                          module.iconBg
                        )}
                      >
                        <Icon className={cn('w-6 h-6', module.iconColor)} />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-400 dark:text-zinc-500 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-200">
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 duration-200" />
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {module.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed">
                        {module.description}
                      </p>
                    </div>

                    {/* Feature Tags */}
                    {module.tags && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {module.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-block px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-zinc-800/80 text-slate-600 dark:text-zinc-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Footer */}
                  <div className="relative z-10 pt-4 mt-4 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    <span>Open Module</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredModules.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-slate-200 dark:border-zinc-800">
              <Search className="w-10 h-10 text-slate-400 dark:text-zinc-600 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                No modules match &ldquo;{searchQuery}&rdquo;
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                Try searching for another keyword like &quot;travel&quot;, &quot;assets&quot;, &quot;visitor&quot;, or &quot;exit&quot;.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-4 px-4 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-medium hover:bg-indigo-100 transition-colors"
              >
                Clear Search Filter
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HrOpsHubPage;
