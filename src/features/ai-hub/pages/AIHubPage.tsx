import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  Brain,
  Sparkles,
  Video,
  LineChart,
  FileText,
  Target,
  CreditCard,
  ArrowRight,
  Search,
  Zap,
  Activity,
  Layers,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { GeminiIcon } from '@/shared/ui/GeminiIcon';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { useToast } from '@/shared/ui/Toast';

interface AIModuleCard {
  id: string;
  title: string;
  category: 'conversational' | 'analytics' | 'automation' | 'intelligence';
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  path?: string;
  actionText?: string;
  tags: string[];
  gradient: string;
  iconBg: string;
  iconColor: string;
  badge?: string;
  isLive?: boolean;
}

const AI_MODULES: AIModuleCard[] = [
  {
    id: 'chat-assistant',
    title: 'Gemini HR Copilot',
    category: 'conversational',
    description: 'Conversational AI assistant for policy inquiries, leave applications, payroll questions, and employee support.',
    icon: GeminiIcon,
    path: '/ai/chat-assistant',
    actionText: 'Launch Chat Assistant',
    tags: ['Gemini 1.5 Pro', 'Zero-Latency', 'RAG Context'],
    gradient: 'from-indigo-600/15 via-purple-600/10 to-transparent',
    iconBg: 'bg-indigo-500/15 dark:bg-indigo-500/25',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    badge: 'LIVE NOW',
    isLive: true,
  },
  {
    id: 'meeting-intelligence',
    title: 'Meeting Intelligence',
    category: 'intelligence',
    description: 'Automatic video meeting transcription, speaker diarization, sentiment tracking, and action items extraction.',
    icon: Video,
    path: '/ai/meeting-intelligence',
    actionText: 'Open Meeting Room',
    tags: ['Speech AI', 'Auto Minutes', 'Action Items'],
    gradient: 'from-blue-600/15 via-cyan-500/10 to-transparent',
    iconBg: 'bg-blue-500/15 dark:bg-blue-500/25',
    iconColor: 'text-blue-600 dark:text-blue-400',
    badge: 'LIVE NOW',
    isLive: true,
  },
  {
    id: 'analytics-center',
    title: 'Predictive Analytics Center',
    category: 'analytics',
    description: 'Workforce attrition risk modeling, headcount forecast projections, and organizational health metrics.',
    icon: LineChart,
    path: '/ai/analytics-center',
    actionText: 'View Predictive Insights',
    tags: ['Attrition Risk', 'Forecasting', 'Health Score'],
    gradient: 'from-emerald-600/15 via-teal-500/10 to-transparent',
    iconBg: 'bg-emerald-500/15 dark:bg-emerald-500/25',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    badge: 'LIVE NOW',
    isLive: true,
  },
  {
    id: 'ai-recruiter',
    title: 'AI Resume & Talent Matcher',
    category: 'intelligence',
    description: 'Semantic parsing of resumes, automated skills gap scoring against job descriptions, and candidate rank ordering.',
    icon: Brain,
    actionText: 'Screen Candidates',
    tags: ['CV Parsing', 'Skill Scoring', 'Rank Ordering'],
    gradient: 'from-violet-600/15 via-purple-500/10 to-transparent',
    iconBg: 'bg-violet-500/15 dark:bg-violet-500/25',
    iconColor: 'text-violet-600 dark:text-violet-400',
  },
  {
    id: 'workforce-planning',
    title: 'Workforce Capacity Planner',
    category: 'analytics',
    description: 'Dynamic skills demand forecasting, department workload balance simulation, and hiring velocity models.',
    icon: Target,
    actionText: 'Simulate Capacity',
    tags: ['Workload Balance', 'Skills Matrix', 'Headcount Plan'],
    gradient: 'from-amber-600/15 via-orange-500/10 to-transparent',
    iconBg: 'bg-amber-500/15 dark:bg-amber-500/25',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    id: 'attendance-monitor',
    title: 'Shift & Attendance AI Monitor',
    category: 'automation',
    description: 'Real-time shift anomaly detection, chronic late check-in pattern flags, and overtime burnout alerts.',
    icon: Activity,
    actionText: 'Inspect Anomalies',
    tags: ['Anomaly Detection', 'Overtime Alerts', 'Burnout Flags'],
    gradient: 'from-cyan-600/15 via-sky-500/10 to-transparent',
    iconBg: 'bg-cyan-500/15 dark:bg-cyan-500/25',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
  },
  {
    id: 'payroll-insights',
    title: 'Payroll Anomaly & Audit Scanner',
    category: 'automation',
    description: 'Automated tax deduction variance audit, salary leakage detection, and statutory compliance cross-checks.',
    icon: CreditCard,
    actionText: 'Scan Payroll',
    tags: ['Tax Leakage', 'Audit Scan', 'Statutory Checks'],
    gradient: 'from-green-600/15 via-emerald-500/10 to-transparent',
    iconBg: 'bg-green-500/15 dark:bg-green-500/25',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  {
    id: 'document-generator',
    title: 'Smart Legal & Policy Generator',
    category: 'automation',
    description: 'Generate legally compliant offer contracts, NDA addendums, and customized company policy briefs in seconds.',
    icon: FileText,
    actionText: 'Draft Document',
    tags: ['Offer Letters', 'NDAs', 'Policy Briefs'],
    gradient: 'from-rose-600/15 via-pink-500/10 to-transparent',
    iconBg: 'bg-rose-500/15 dark:bg-rose-500/25',
    iconColor: 'text-rose-600 dark:text-rose-400',
  },
  {
    id: 'ai-copilot',
    title: 'Custom Workflow Autonomous Agents',
    category: 'conversational',
    description: 'Deploy multi-step autonomous background agents for employee onboarding tasks, reminder followups, and approvals.',
    icon: Bot,
    actionText: 'Manage Agents',
    tags: ['Multi-Step', 'Background Tasks', 'Autonomous'],
    gradient: 'from-fuchsia-600/15 via-purple-500/10 to-transparent',
    iconBg: 'bg-fuchsia-500/15 dark:bg-fuchsia-500/25',
    iconColor: 'text-fuchsia-600 dark:text-fuchsia-400',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All AI Engines' },
  { id: 'conversational', label: 'Conversational AI' },
  { id: 'intelligence', label: 'Speech & Audio Intelligence' },
  { id: 'analytics', label: 'Predictive Analytics' },
  { id: 'automation', label: 'Autonomous Workflows' },
];

export const AIHubPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredModules = useMemo(() => {
    return AI_MODULES.filter((m) => {
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

  const handleCardClick = (module: AIModuleCard) => {
    if (module.path) {
      navigate(module.path);
    } else {
      toast.success(
        `${module.title} workspace is being orchestrated with Gemini enterprise models.`,
        'Model Pipeline Ready'
      );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white p-6 md:p-8 shadow-xl border border-indigo-500/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(129,140,248,0.25),transparent_50%)]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 backdrop-blur border border-indigo-400/30 text-xs font-medium text-indigo-200">
              <Zap className="w-3.5 h-3.5 text-indigo-300" />
              <span>Google Gemini Powered Intelligence Hub</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <span>AI Intelligence Hub</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" title="AI Services Online" />
            </h1>
            <p className="text-sm md:text-base text-slate-300">
              Harness multimodal reasoning, real-time speech intelligence, predictive attrition forecasting, and generative HR automation.
            </p>
          </div>

          {/* Quick Launch Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/ai/chat-assistant')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30 flex items-center gap-2"
            >
              <GeminiIcon className="w-4 h-4" />
              <span>Chat Assistant</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/ai/meeting-intelligence')}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white flex items-center gap-1.5"
            >
              <Video className="w-4 h-4" />
              <span>Meeting AI</span>
            </Button>
          </div>
        </div>

        {/* Live System Capabilities */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 text-xs">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-slate-400 block text-[11px]">Primary Model</span>
            <span className="text-sm font-bold text-white mt-0.5 block">Gemini 1.5 Pro</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-slate-400 block text-[11px]">Reasoning Latency</span>
            <span className="text-sm font-bold text-emerald-400 mt-0.5 block">&lt; 180ms</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-slate-400 block text-[11px]">Active AI Engines</span>
            <span className="text-sm font-bold text-indigo-300 mt-0.5 block">9 Active</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-slate-400 block text-[11px]">Security & Privacy</span>
            <span className="text-sm font-bold text-cyan-300 mt-0.5 block flex items-center gap-1">
              <Lock className="w-3 h-3" /> Zero Data Retention
            </span>
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
            placeholder="Search AI engines & tools..."
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

      {/* Grid of AI Module Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
                  'absolute top-0 right-0 w-40 h-40 bg-gradient-to-br opacity-80 pointer-events-none rounded-bl-full transition-opacity group-hover:opacity-100',
                  module.gradient
                )}
              />

              <div className="relative z-10 space-y-4">
                {/* Icon & Live Badge */}
                <div className="flex items-center justify-between">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 duration-200',
                      module.iconBg
                    )}
                  >
                    <Icon className={cn('w-6 h-6', module.iconColor)} />
                  </div>
                  {module.badge && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {module.badge}
                    </span>
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
                <span>{module.actionText || 'Open Tool'}</span>
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
            No AI engines match &ldquo;{searchQuery}&rdquo;
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Try searching for another keyword or select &quot;All AI Engines&quot;.
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
    </div>
  );
};

export default AIHubPage;
