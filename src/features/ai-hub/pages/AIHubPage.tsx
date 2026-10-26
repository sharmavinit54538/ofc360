import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  Brain,
  Video,
  LineChart,
  FileText,
  Target,
  CreditCard,
  Search,
  Activity,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { GeminiIcon } from '@/shared/ui/GeminiIcon';
import { Button } from '@/shared/ui/Button';
import { useToast } from '@/shared/ui/Toast';

interface AIModuleCard {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  path?: string;
  iconBg: string;
  iconColor: string;
}

const AI_MODULES: AIModuleCard[] = [
  {
    id: 'chat-assistant',
    title: 'OFC360 HR Copilot',
    icon: GeminiIcon,
    path: '/ai/chat-assistant',
    iconBg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
  },
  {
    id: 'meeting-intelligence',
    title: 'Meeting Intelligence',
    icon: Video,
    path: '/ai/meeting-intelligence',
    iconBg: 'bg-blue-500/10 dark:bg-blue-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    id: 'analytics-center',
    title: 'Predictive Analytics',
    icon: LineChart,
    path: '/ai/analytics-center',
    iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    id: 'ai-recruiter',
    title: 'Resume & Talent Matcher',
    icon: Brain,
    iconBg: 'bg-violet-500/10 dark:bg-violet-500/20',
    iconColor: 'text-violet-600 dark:text-violet-400',
  },
  {
    id: 'workforce-planning',
    title: 'Capacity Planner',
    icon: Target,
    iconBg: 'bg-amber-500/10 dark:bg-amber-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    id: 'attendance-monitor',
    title: 'Shift AI Monitor',
    icon: Activity,
    iconBg: 'bg-cyan-500/10 dark:bg-cyan-500/20',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
  },
  {
    id: 'payroll-insights',
    title: 'Payroll Audit Scanner',
    icon: CreditCard,
    iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    id: 'document-generator',
    title: 'Smart Legal Generator',
    icon: FileText,
    iconBg: 'bg-rose-500/10 dark:bg-rose-500/20',
    iconColor: 'text-rose-600 dark:text-rose-400',
  },
  {
    id: 'ai-copilot',
    title: 'Autonomous Workflows',
    icon: Bot,
    iconBg: 'bg-fuchsia-500/10 dark:bg-fuchsia-500/20',
    iconColor: 'text-fuchsia-600 dark:text-fuchsia-400',
  },
];

export const AIHubPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredModules = useMemo(() => {
    if (!searchQuery.trim()) return AI_MODULES;
    const q = searchQuery.toLowerCase();
    return AI_MODULES.filter((m) => m.title.toLowerCase().includes(q));
  }, [searchQuery]);

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
      {/* Top Bar with Search & Quick Launch Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
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

        {/* Quick Launch Buttons */}
        <div className="flex items-center justify-end gap-2.5 flex-wrap">
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
            className="flex items-center gap-1.5"
          >
            <Video className="w-4 h-4" />
            <span>Meeting AI</span>
          </Button>
        </div>
      </div>

      {/* Grid of AI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredModules.map((module) => {
          const Icon = module.icon;

          return (
            <div
              key={module.id}
              onClick={() => handleCardClick(module)}
              className={cn(
                'p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm',
                'hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500/60 hover:-translate-y-0.5',
                'transition-all duration-200 cursor-pointer group flex items-center justify-between gap-3'
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
              <span className="text-xs font-semibold uppercase text-gray-800 dark:text-zinc-200 tracking-wider group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {module.title}
              </span>
              <div
                className={cn(
                  'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105',
                  module.iconBg,
                  module.iconColor
                )}
              >
                <Icon className="w-4 h-4" />
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
            Try searching for another keyword.
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="mt-4 px-4 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-medium hover:bg-indigo-100 transition-colors"
          >
            Reset Search
          </button>
        </div>
      )}
    </div>
  );
};

export default AIHubPage;
