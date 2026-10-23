import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Users,
  UserSearch,
  UserCheck,
  Layers,
  CalendarCheck,
  CalendarDays,
  ClipboardCheck,
  FileText,
  FileSpreadsheet,
  FilePlus,
  MessageSquare,
  ScanText,
  Gift,
  Building2,
  Globe,
  Workflow,
  ShieldCheck,
  Search,
  Sparkles,
  ArrowRight,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { useToast } from '@/shared/ui/Toast';

interface RecruitmentModule {
  id: string;
  title: string;
  category: 'jobs' | 'pipeline' | 'interviews' | 'offers' | 'operations';
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tags: string[];
  gradient: string;
  iconBg: string;
  iconColor: string;
  metric?: { label: string; value: string | number };
}

const RECRUITMENT_MODULES: RecruitmentModule[] = [
  {
    id: 'all-jobs',
    title: 'Job Openings & Listings',
    category: 'jobs',
    description: 'Create, review, and publish corporate job requisitions across career portals and job boards.',
    icon: Briefcase,
    tags: ['Active Jobs', 'Job Descriptions', 'Publishing'],
    gradient: 'from-blue-500/10 via-indigo-500/5 to-transparent',
    iconBg: 'bg-blue-500/10 dark:bg-blue-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    metric: { label: 'Active Openings', value: '24' },
  },
  {
    id: 'requisitions',
    title: 'Job Requisitions',
    category: 'jobs',
    description: 'Manage department hiring requests, headcount budget approvals, and requisition workflows.',
    icon: FileSpreadsheet,
    tags: ['Headcount', 'Approvals', 'Department Requests'],
    gradient: 'from-indigo-500/10 via-purple-500/5 to-transparent',
    iconBg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    metric: { label: 'Pending Approval', value: '7' },
  },
  {
    id: 'pipeline',
    title: 'Hiring Pipeline (ATS)',
    category: 'pipeline',
    description: 'Visual candidate pipeline tracking from sourcing and screening to final offer acceptance.',
    icon: Layers,
    tags: ['Kanban Board', 'Stage Tracking', 'Candidate Flow'],
    gradient: 'from-violet-500/10 via-purple-500/5 to-transparent',
    iconBg: 'bg-violet-500/10 dark:bg-violet-500/20',
    iconColor: 'text-violet-600 dark:text-violet-400',
    metric: { label: 'Candidates in Flow', value: '142' },
  },
  {
    id: 'candidates',
    title: 'Candidate Database',
    category: 'pipeline',
    description: 'Unified searchable directory of applicant profiles, skills, notes, and historical evaluations.',
    icon: UserSearch,
    tags: ['Profiles', 'Global Search', 'Candidate CRM'],
    gradient: 'from-cyan-500/10 via-sky-500/5 to-transparent',
    iconBg: 'bg-cyan-500/10 dark:bg-cyan-500/20',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    metric: { label: 'Total Applicants', value: '1,890' },
  },
  {
    id: 'resume-intelligence',
    title: 'AI Resume Intelligence',
    category: 'pipeline',
    description: 'AI-assisted resume parsing, automated skill gap scoring, and candidate-job matching.',
    icon: ScanText,
    tags: ['AI Parsing', 'Skill Match', 'Candidate Scoring'],
    gradient: 'from-purple-500/10 via-fuchsia-500/5 to-transparent',
    iconBg: 'bg-purple-500/10 dark:bg-purple-500/20',
    iconColor: 'text-purple-600 dark:text-purple-400',
    metric: { label: 'Match Accuracy', value: '94%' },
  },
  {
    id: 'interviews',
    title: 'Interviews & Panel Scheduling',
    category: 'interviews',
    description: 'Automated interviewer availability coordination, Google/Outlook sync, and video links.',
    icon: CalendarCheck,
    tags: ['Scheduling', 'Panel Coordination', 'Calendar Sync'],
    gradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
    iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    metric: { label: 'Scheduled Today', value: '18' },
  },
  {
    id: 'scorecards',
    title: 'Evaluation Scorecards',
    category: 'interviews',
    description: 'Structured interview rubrics, technical skill ratings, and interviewer alignment consensus.',
    icon: ClipboardCheck,
    tags: ['Structured Rubrics', 'Consensus', 'Feedback'],
    gradient: 'from-teal-500/10 via-green-500/5 to-transparent',
    iconBg: 'bg-teal-500/10 dark:bg-teal-500/20',
    iconColor: 'text-teal-600 dark:text-teal-400',
    metric: { label: 'Completed Reviews', value: '312' },
  },
  {
    id: 'offers',
    title: 'Offers & Compensation',
    category: 'offers',
    description: 'Digital offer letter generation, compensation breakdown, salary approval matrix, and e-signatures.',
    icon: FileText,
    tags: ['Digital Letters', 'Compensation', 'E-Signatures'],
    gradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
    iconBg: 'bg-amber-500/10 dark:bg-amber-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
    metric: { label: 'Offers Pending', value: '6' },
  },
  {
    id: 'talent-pool',
    title: 'Talent Pool & Sourcing',
    category: 'pipeline',
    description: 'Nurture passive talent, maintain pre-vetted silver-medalist pools, and outbound campaigns.',
    icon: UserCheck,
    tags: ['Passive Sourcing', 'Silver Medalists', 'Nurturing'],
    gradient: 'from-blue-600/10 via-indigo-500/5 to-transparent',
    iconBg: 'bg-blue-600/10 dark:bg-blue-600/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    metric: { label: 'Talent Community', value: '450+' },
  },
  {
    id: 'referrals',
    title: 'Employee Referrals',
    category: 'operations',
    description: 'Internal employee referral submissions, reward milestones, bonus tracking, and status alerts.',
    icon: Gift,
    tags: ['Employee Referrals', 'Bonus Tracking', 'Milestones'],
    gradient: 'from-pink-500/10 via-rose-500/5 to-transparent',
    iconBg: 'bg-pink-500/10 dark:bg-pink-500/20',
    iconColor: 'text-pink-600 dark:text-pink-400',
    metric: { label: 'Referred Hires', value: '38%' },
  },
  {
    id: 'career-site',
    title: 'Career Portal & Branding',
    category: 'operations',
    description: 'Customizable company career site, brand storytelling, departmental vacancy widgets, and SEO.',
    icon: Globe,
    tags: ['Career Site', 'Brand Showcase', 'Mobile Friendly'],
    gradient: 'from-sky-500/10 via-blue-500/5 to-transparent',
    iconBg: 'bg-sky-500/10 dark:bg-sky-500/20',
    iconColor: 'text-sky-600 dark:text-sky-400',
    metric: { label: 'Portal Visits', value: '12.4k' },
  },
  {
    id: 'compliance',
    title: 'Compliance & EEO Audits',
    category: 'operations',
    description: 'Equal opportunity compliance monitoring, hiring audit logs, diversity metrics, and GDPR rules.',
    icon: ShieldCheck,
    tags: ['EEO Compliance', 'Audit Logs', 'GDPR Ready'],
    gradient: 'from-rose-500/10 via-red-500/5 to-transparent',
    iconBg: 'bg-rose-500/10 dark:bg-rose-500/20',
    iconColor: 'text-rose-600 dark:text-rose-400',
    metric: { label: 'Compliance Score', value: '100%' },
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Modules' },
  { id: 'jobs', label: 'Jobs & Requisitions' },
  { id: 'pipeline', label: 'Candidate Pipeline' },
  { id: 'interviews', label: 'Interviews & Reviews' },
  { id: 'offers', label: 'Offers & Approvals' },
  { id: 'operations', label: 'Operations & Brand' },
];

export const RecruitmentHubPage: React.FC = () => {
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedModule, setSelectedModule] = useState<RecruitmentModule | null>(null);

  const filteredModules = useMemo(() => {
    return RECRUITMENT_MODULES.filter((m) => {
      if (selectedCategory !== 'all' && m.category !== selectedCategory) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [selectedCategory, searchQuery]);

  const handleOpenModule = (mod: RecruitmentModule) => {
    setSelectedModule(mod);
    toast.info(`Opening ${mod.title}`, 'Module Active');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-6 md:p-8 shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.2),transparent_50%)]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/10 text-xs font-medium text-indigo-200">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Enterprise Talent Acquisition Suite</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Recruitment & Hiring Hub
            </h1>
            <p className="text-sm md:text-base text-slate-300">
              Centralized platform for talent requisitions, pipeline management, automated screening, interview panels, and offer signoffs.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              variant="primary"
              size="sm"
              onClick={() => toast.success('New Job Creation Form initialized', 'Create Job')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Job</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info('Candidate upload ready', 'Add Candidate')}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
            >
              <Users className="w-4 h-4 mr-1.5" />
              <span>Add Candidate</span>
            </Button>
          </div>
        </div>

        {/* Quick KPI Strip */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 text-xs">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-slate-400 block text-[11px]">Active Job Openings</span>
            <span className="text-xl font-bold text-white mt-0.5 block">24</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-slate-400 block text-[11px]">Pipeline Candidates</span>
            <span className="text-xl font-bold text-indigo-300 mt-0.5 block">142</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-slate-400 block text-[11px]">Interviews Scheduled</span>
            <span className="text-xl font-bold text-emerald-400 mt-0.5 block">18</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-slate-400 block text-[11px]">Pending Offers</span>
            <span className="text-xl font-bold text-amber-400 mt-0.5 block">6</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                'px-3.5 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all duration-150',
                selectedCategory === cat.id
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm font-semibold'
                  : 'bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-zinc-700 hover:text-slate-900 dark:hover:text-white'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-72 shrink-0">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recruitment tools..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Grid of Recruitment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredModules.map((module) => {
          const Icon = module.icon;

          return (
            <div
              key={module.id}
              onClick={() => handleOpenModule(module)}
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
                  handleOpenModule(module);
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
                {/* Icon & Metrics badge */}
                <div className="flex items-center justify-between">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 duration-200',
                      module.iconBg
                    )}
                  >
                    <Icon className={cn('w-6 h-6', module.iconColor)} />
                  </div>
                  {module.metric && (
                    <div className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800/80 border border-slate-200/60 dark:border-zinc-700/60 text-right">
                      <span className="text-[10px] text-slate-500 dark:text-zinc-400 block leading-none">
                        {module.metric.label}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 block leading-none">
                        {module.metric.value}
                      </span>
                    </div>
                  )}
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
                <span>Manage Module</span>
                <span className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-200">
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredModules.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-slate-200 dark:border-zinc-800">
          <Search className="w-10 h-10 text-slate-400 dark:text-zinc-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            No recruitment modules match &ldquo;{searchQuery}&rdquo;
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Try searching for another keyword or select &quot;All Modules&quot;.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="mt-4 px-4 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-medium hover:bg-indigo-100 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Selected Module Detail Modal / Drawer Simulation */}
      {selectedModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-slate-200 dark:border-zinc-800 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', selectedModule.iconBg)}>
                  <selectedModule.icon className={cn('w-6 h-6', selectedModule.iconColor)} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedModule.title}</h3>
                  <Badge variant="outline" size="sm" className="mt-1">
                    {selectedModule.category.toUpperCase()}
                  </Badge>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedModule(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
              {selectedModule.description}
            </p>

            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-zinc-800">
              <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block">
                Included Capabilities:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedModule.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300"
                  >
                    ✓ {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-zinc-800">
              <Button variant="ghost" size="sm" onClick={() => setSelectedModule(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  toast.success(`${selectedModule.title} dashboard ready for execution`, 'Launch Successful');
                  setSelectedModule(null);
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

export default RecruitmentHubPage;
