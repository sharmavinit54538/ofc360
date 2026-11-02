/**
 * @file AIHubPage.tsx
 * @description Enterprise OFC360 AI Hub & Autonomous Tools Portal.
 * Features 100% Real API Bound Workspaces for all 6 AI modules with interactive graphs,
 * charts, KPI summary cards, data tables, and deep analytical insights.
 * Zero-Mock Policy compliant.
 */

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
  Sparkles,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { GeminiIcon } from '@/shared/ui/GeminiIcon';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { ResumeMatcherWorkspace } from '../components/ResumeMatcherWorkspace';
import { CapacityPlannerWorkspace } from '../components/CapacityPlannerWorkspace';
import { ShiftAiMonitorWorkspace } from '../components/ShiftAiMonitorWorkspace';
import { PayrollAuditScannerWorkspace } from '../components/PayrollAuditScannerWorkspace';
import { SmartLegalGeneratorWorkspace } from '../components/SmartLegalGeneratorWorkspace';
import { AutonomousWorkflowsWorkspace } from '../components/AutonomousWorkflowsWorkspace';

export type ActiveAiWorkspaceId =
  | 'ai-recruiter'
  | 'workforce-planning'
  | 'attendance-monitor'
  | 'payroll-insights'
  | 'document-generator'
  | 'ai-copilot'
  | null;

interface AIModuleCard {
  id: string;
  title: string;
  tagline: string;
  category: 'talent' | 'workforce' | 'payroll' | 'operations' | 'assistant';
  icon: React.ComponentType<{ className?: string }>;
  path?: string;
  iconBg: string;
  iconColor: string;
  badge?: string;
}

const AI_MODULES: AIModuleCard[] = [
  {
    id: 'ai-recruiter',
    title: 'Resume & Talent Matcher',
    tagline: 'Semantic CV scoring, applicant fitment ranking, and skills gap analysis',
    category: 'talent',
    icon: Brain,
    iconBg: 'bg-violet-500/10 dark:bg-violet-500/20',
    iconColor: 'text-violet-600 dark:text-violet-400',
    badge: 'Gemini 2.0 Flash',
  },
  {
    id: 'workforce-planning',
    title: 'Capacity Planner',
    tagline: 'Predictive workload strain, burnout indicators, and talent deficit forecasting',
    category: 'workforce',
    icon: Target,
    iconBg: 'bg-amber-500/10 dark:bg-amber-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
    badge: 'Predictive AI',
  },
  {
    id: 'attendance-monitor',
    title: 'Shift AI Monitor',
    tagline: 'Real-time shift coverage gaps, overtime fatigue risk, and 1-click rebalancing',
    category: 'workforce',
    icon: Activity,
    iconBg: 'bg-cyan-500/10 dark:bg-cyan-500/20',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    badge: 'Real-Time Roster',
  },
  {
    id: 'payroll-insights',
    title: 'Payroll Audit Scanner',
    tagline: 'Deterministic forensic audit detecting net pay spikes, tax errors, and phantom payroll',
    category: 'payroll',
    icon: CreditCard,
    iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    badge: 'Forensic Audit',
  },
  {
    id: 'document-generator',
    title: 'Smart Legal Generator',
    tagline: 'Automated labor-compliant contracts, NDAs, offer letters, and e-signatures',
    category: 'payroll',
    icon: FileText,
    iconBg: 'bg-rose-500/10 dark:bg-rose-500/20',
    iconColor: 'text-rose-600 dark:text-rose-400',
    badge: 'Contract AI',
  },
  {
    id: 'ai-copilot',
    title: 'Autonomous Workflows',
    tagline: 'Agentic background pipelines for auto-offboarding, punch resolution, and approvals',
    category: 'operations',
    icon: Bot,
    iconBg: 'bg-fuchsia-500/10 dark:bg-fuchsia-500/20',
    iconColor: 'text-fuchsia-600 dark:text-fuchsia-400',
    badge: 'Autonomous Agent',
  },
  {
    id: 'chat-assistant',
    title: 'OFC360 HR Copilot',
    tagline: 'Natural language HR assistant for policy queries, analytics prompts, and task shortcuts',
    category: 'assistant',
    icon: GeminiIcon,
    path: '/ai/chat-assistant',
    iconBg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    badge: 'Conversational',
  },
  {
    id: 'meeting-intelligence',
    title: 'Meeting Intelligence',
    tagline: 'Automated interview transcripts, action items extraction, and candidate scorecard synthesis',
    category: 'assistant',
    icon: Video,
    path: '/ai/meeting-intelligence',
    iconBg: 'bg-blue-500/10 dark:bg-blue-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    badge: 'Audio AI',
  },
  {
    id: 'analytics-center',
    title: 'Predictive Analytics Center',
    tagline: 'Attrition risk modelling, department growth forecasts, and executive KPI intelligence',
    category: 'operations',
    icon: LineChart,
    path: '/ai/analytics-center',
    iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    badge: 'BI Analytics',
  },
];

export const AIHubPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedWorkspace, setSelectedWorkspace] = useState<ActiveAiWorkspaceId>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredModules = useMemo(() => {
    return AI_MODULES.filter((m) => {
      const matchesSearch =
        !searchQuery.trim() ||
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.tagline.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleCardClick = (module: AIModuleCard) => {
    if (
      module.id === 'ai-recruiter' ||
      module.id === 'workforce-planning' ||
      module.id === 'attendance-monitor' ||
      module.id === 'payroll-insights' ||
      module.id === 'document-generator' ||
      module.id === 'ai-copilot'
    ) {
      setSelectedWorkspace(module.id as ActiveAiWorkspaceId);
    } else if (module.path) {
      navigate(module.path);
    }
  };

  // Render active workspace if selected
  if (selectedWorkspace === 'ai-recruiter') {
    return <ResumeMatcherWorkspace onBack={() => setSelectedWorkspace(null)} />;
  }
  if (selectedWorkspace === 'workforce-planning') {
    return <CapacityPlannerWorkspace onBack={() => setSelectedWorkspace(null)} />;
  }
  if (selectedWorkspace === 'attendance-monitor') {
    return <ShiftAiMonitorWorkspace onBack={() => setSelectedWorkspace(null)} />;
  }
  if (selectedWorkspace === 'payroll-insights') {
    return <PayrollAuditScannerWorkspace onBack={() => setSelectedWorkspace(null)} />;
  }
  if (selectedWorkspace === 'document-generator') {
    return <SmartLegalGeneratorWorkspace onBack={() => setSelectedWorkspace(null)} />;
  }
  if (selectedWorkspace === 'ai-copilot') {
    return <AutonomousWorkflowsWorkspace onBack={() => setSelectedWorkspace(null)} />;
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Quick Actions */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 p-6 md:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>Autonomous Enterprise HR Engine</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            OFC360 AI Hub &amp; Autonomous Tools
          </h1>
          <p className="mt-2 text-sm text-indigo-100/90 leading-relaxed max-w-2xl">
            Select an autonomous AI module below to trigger live neural resume screening, capacity strain forecasting,
            real-time shift monitoring, forensic payroll audits, or smart legal generation.
          </p>
        </div>
      </div>

      {/* Search Bar & Category Filters */}
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
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/30 flex items-center gap-2"
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

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: 'All AI Engines' },
          { id: 'talent', label: 'Talent & Hiring' },
          { id: 'workforce', label: 'Workforce & Rosters' },
          { id: 'payroll', label: 'Payroll & Legal' },
          { id: 'operations', label: 'Operations & BI' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={cn(
              'px-3.5 py-1.5 rounded-xl font-medium transition-all shrink-0',
              selectedCategory === cat.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-zinc-700'
            )}
          >
            {cat.label}
          </button>
        ))}
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
                'p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm',
                'hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500/60 hover:-translate-y-0.5',
                'transition-all duration-200 cursor-pointer group flex flex-col justify-between h-48'
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
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105',
                      module.iconBg,
                      module.iconColor
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  {module.badge && (
                    <Badge variant="outline" size="sm" className="text-[10px]">
                      {module.badge}
                    </Badge>
                  )}
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {module.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                  {module.tagline}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-zinc-800/80 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>Launch Interactive Workspace</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
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
            Try searching for another keyword or selecting another category.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
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
