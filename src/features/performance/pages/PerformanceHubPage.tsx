import React, { useState, useMemo } from 'react';
import {
  Gauge,
  Target,
  Trophy,
  Users2,
  TrendingUp,
  MessagesSquare,
  ClipboardList,
  AlertOctagon,
  Search,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { useToast } from '@/shared/ui/Toast';

interface PerformanceModuleCard {
  id: string;
  title: string;
  category: 'reviews' | 'goals' | 'feedback' | 'growth';
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tags: string[];
  gradient: string;
  iconBg: string;
  iconColor: string;
  metric?: { label: string; value: string };
  actionText?: string;
  badge?: string;
}

const PERFORMANCE_MODULES: PerformanceModuleCard[] = [
  {
    id: 'performance-reviews',
    title: 'Appraisals & Review Cycles',
    category: 'reviews',
    description: 'Quarterly and annual review cycles, self-evaluations, manager assessments, and calibration sessions.',
    icon: ClipboardList,
    tags: ['Quarterly Cycle', 'Self-Appraisal', 'Manager Signoff'],
    gradient: 'from-blue-500/10 via-indigo-500/5 to-transparent',
    iconBg: 'bg-blue-500/10 dark:bg-blue-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    metric: { label: 'Cycle Status', value: 'Q3 Active' },
    actionText: 'Open Appraisals',
    badge: 'Active Cycle',
  },
  {
    id: 'okrs-goals',
    title: 'OKRs & SMART Goal Tracking',
    category: 'goals',
    description: 'Align corporate, team, and individual key results with automatic progress tracking and target milestones.',
    icon: Target,
    tags: ['SMART Goals', 'Key Results', 'Company Alignment'],
    gradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
    iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    metric: { label: 'Avg Progress', value: '78.4%' },
    actionText: 'View OKRs',
  },
  {
    id: '360-feedback',
    title: '360-Degree Peer Feedback',
    category: 'feedback',
    description: 'Anonymous multi-rater feedback from peers, cross-functional partners, and direct reports.',
    icon: Users2,
    tags: ['Peer Reviews', 'Upward Feedback', 'Cross-Functional'],
    gradient: 'from-violet-500/10 via-purple-500/5 to-transparent',
    iconBg: 'bg-violet-500/10 dark:bg-violet-500/20',
    iconColor: 'text-violet-600 dark:text-violet-400',
    metric: { label: 'Submissions', value: '142' },
    actionText: 'Request Feedback',
  },
  {
    id: 'one-on-ones',
    title: 'Continuous 1-on-1 Syncs',
    category: 'feedback',
    description: 'Structured talking points, recurring check-in notes, action item tracking, and private manager logs.',
    icon: MessagesSquare,
    tags: ['Talking Points', 'Action Items', 'Weekly Sync'],
    gradient: 'from-cyan-500/10 via-sky-500/5 to-transparent',
    iconBg: 'bg-cyan-500/10 dark:bg-cyan-500/20',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    metric: { label: 'Scheduled', value: '12 This Week' },
    actionText: 'Check-In Notes',
  },
  {
    id: 'competency-matrix',
    title: 'Competency & Skill Matrix',
    category: 'growth',
    description: 'Role-based capability mapping, technical proficiency levels, leadership assessments, and gap analysis.',
    icon: TrendingUp,
    tags: ['Skill Mapping', 'Proficiency Score', 'Gap Analysis'],
    gradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
    iconBg: 'bg-amber-500/10 dark:bg-amber-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
    metric: { label: 'Benchmarked', value: '38 Roles' },
    actionText: 'Explore Matrix',
  },
  {
    id: 'pip-improvement',
    title: 'Improvement Plans (PIP)',
    category: 'reviews',
    description: 'Structured 30/60/90-day corrective action plans, weekly milestone reviews, and HR compliance documentation.',
    icon: AlertOctagon,
    tags: ['Milestone Review', 'HR Oversight', '30/60/90 Day'],
    gradient: 'from-rose-500/10 via-red-500/5 to-transparent',
    iconBg: 'bg-rose-500/10 dark:bg-rose-500/20',
    iconColor: 'text-rose-600 dark:text-rose-400',
    metric: { label: 'Active Plans', value: '2 Under Review' },
    actionText: 'View PIP Queue',
  },
  {
    id: 'rewards-recognition',
    title: 'Rewards & Merit Recognition',
    category: 'growth',
    description: 'Peer-to-peer kudos, employee of the month nominations, merit bonuses, and recognition badges.',
    icon: Trophy,
    tags: ['Peer Kudos', 'Merit Awards', 'Hall of Fame'],
    gradient: 'from-yellow-500/10 via-amber-500/5 to-transparent',
    iconBg: 'bg-yellow-500/10 dark:bg-yellow-500/20',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    metric: { label: 'Kudos Given', value: '318' },
    actionText: 'Send Recognition',
  },
  {
    id: 'rating-distribution',
    title: 'Bell Curve & Talent Analytics',
    category: 'reviews',
    description: 'Organizational rating distributions, 9-box grid talent mapping, high-potential retention, and flight risk scores.',
    icon: Gauge,
    tags: ['Bell Curve', '9-Box Grid', 'Flight Risk'],
    gradient: 'from-indigo-500/10 via-blue-500/5 to-transparent',
    iconBg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    metric: { label: 'High Potential', value: '18%' },
    actionText: 'View Analytics',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Modules' },
  { id: 'reviews', label: 'Appraisals & Reviews' },
  { id: 'goals', label: 'OKRs & Goals' },
  { id: 'feedback', label: 'Feedback & 1-on-1s' },
  { id: 'growth', label: 'Competencies & Rewards' },
];

export const PerformanceHubPage: React.FC = () => {
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeModal, setActiveModal] = useState<PerformanceModuleCard | null>(null);

  const filteredModules = useMemo(() => {
    return PERFORMANCE_MODULES.filter((mod) => {
      const matchesCategory = selectedCategory === 'all' || mod.category === selectedCategory;
      const matchesSearch =
        mod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mod.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-zinc-900 to-indigo-950 text-white p-6 md:p-8 border border-indigo-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
              <Gauge className="w-3.5 h-3.5" />
              <span>Performance & Growth Hub</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Talent Performance & Appraisals Center
            </h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Continuous performance enablement: quarterly appraisal cycles, OKR target tracking, 
              360-degree feedback, and 9-box talent matrix calibration.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/5 backdrop-blur-md p-3.5 rounded-xl border border-white/10 shrink-0">
            <div className="text-center px-3 py-1.5 border-r border-white/10">
              <p className="text-xs text-slate-400 font-medium">Cycle Status</p>
              <p className="text-xl font-bold text-emerald-400">Q3 Active</p>
            </div>
            <div className="text-center px-3 py-1.5 border-r border-white/10">
              <p className="text-xs text-slate-400 font-medium">OKR Avg</p>
              <p className="text-xl font-bold text-indigo-400">78.4%</p>
            </div>
            <div className="text-center px-3 py-1.5 border-r border-white/10">
              <p className="text-xs text-slate-400 font-medium">360 Feedback</p>
              <p className="text-xl font-bold text-cyan-400">142</p>
            </div>
            <div className="text-center px-3 py-1.5">
              <p className="text-xs text-slate-400 font-medium">Kudos Given</p>
              <p className="text-xl font-bold text-amber-400">318</p>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by review type, OKR goal, competency, 360 review..."
              className="w-full pl-10 pr-4 py-2 bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/15 focus:border-indigo-400 rounded-xl text-white placeholder-slate-400 text-sm focus:outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  'px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-150',
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 font-semibold'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
        {filteredModules.map((module) => {
          const Icon = module.icon;
          return (
            <div
              key={module.id}
              onClick={() => setActiveModal(module)}
              className="group relative flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:border-indigo-500/40 dark:hover:border-indigo-500/40 transition-all duration-200 cursor-pointer overflow-hidden"
            >
              {/* Subtle ambient gradient */}
              <div
                className={cn(
                  'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none',
                  module.gradient
                )}
              />

              <div className="relative z-10 space-y-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div
                    className={cn(
                      'w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-200 shadow-sm',
                      module.iconBg
                    )}
                  >
                    <Icon className={cn('w-5 h-5', module.iconColor)} />
                  </div>
                  {module.badge ? (
                    <Badge variant="brand" className="text-[11px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20">
                      {module.badge}
                    </Badge>
                  ) : module.metric ? (
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
                        {module.metric.label}
                      </span>
                      <span className="text-xs font-bold text-slate-700 dark:text-zinc-200">
                        {module.metric.value}
                      </span>
                    </div>
                  ) : null}
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {module.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {module.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {module.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200/50 dark:border-zinc-700/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative z-10 pt-4 mt-4 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  {module.actionText || 'Open Module'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
                <span className="text-[11px] text-slate-400 capitalize">
                  {module.category}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Launch Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-slate-200 dark:border-zinc-800 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', activeModal.iconBg)}>
                  <activeModal.icon className={cn('w-6 h-6', activeModal.iconColor)} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {activeModal.title}
                  </h3>
                  <p className="text-xs text-slate-500 capitalize">
                    {activeModal.category} category
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
              {activeModal.description}
            </p>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 space-y-2">
              <div className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                Core Capabilities & Deliverables
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-zinc-400">
                {activeModal.tags.map((t) => (
                  <div key={t} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-zinc-800">
              <Button variant="ghost" size="sm" onClick={() => setActiveModal(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  toast.success(`${activeModal.title} workspace launched.`, 'Success');
                  setActiveModal(null);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Launch Workspace
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceHubPage;
