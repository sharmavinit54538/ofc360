import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  FileText,
  ShieldCheck,
  ShieldAlert,
  BookOpen,
  FilePlus2,
  Lock,
  Search,
  Sparkles,
  ArrowRight,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Award,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { useToast } from '@/shared/ui/Toast';

interface DocumentModuleCard {
  id: string;
  title: string;
  category: 'repository' | 'policies' | 'generator' | 'signatures' | 'compliance';
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tags: string[];
  gradient: string;
  iconBg: string;
  iconColor: string;
  metric?: { label: string; value: string };
  actionText?: string;
}

const DOCUMENT_MODULES: DocumentModuleCard[] = [
  {
    id: 'document-vault',
    title: 'Document Vault & Storage',
    category: 'repository',
    description: 'Centralized repository for corporate documents, employee tax forms, ID proofs, and compliance certificates.',
    icon: FolderKanban,
    tags: ['Cloud Storage', 'Tax Records', 'ID Proofs'],
    gradient: 'from-blue-500/10 via-indigo-500/5 to-transparent',
    iconBg: 'bg-blue-500/10 dark:bg-blue-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    metric: { label: 'Stored Files', value: '4,820' },
    actionText: 'Browse Vault',
  },
  {
    id: 'policy-handbook',
    title: 'Company Policies & Handbook',
    category: 'policies',
    description: 'Official organization handbooks, remote-work guidelines, leave policies, and employee sign-off logs.',
    icon: BookOpen,
    tags: ['Handbook', 'Code of Conduct', 'Sign-Offs'],
    gradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
    iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    metric: { label: 'Sign-Off Rate', value: '98.5%' },
    actionText: 'View Policies',
  },
  {
    id: 'document-generator',
    title: 'AI Contract & Letter Generator',
    category: 'generator',
    description: 'Instantly generate legally verified appointment letters, NDAs, increment letters, and relieving certificates.',
    icon: FilePlus2,
    tags: ['Offer Letters', 'NDAs', 'Automated Templates'],
    gradient: 'from-violet-500/10 via-purple-500/5 to-transparent',
    iconBg: 'bg-violet-500/10 dark:bg-violet-500/20',
    iconColor: 'text-violet-600 dark:text-violet-400',
    metric: { label: 'Templates', value: '38 Active' },
    actionText: 'Draft Document',
  },
  {
    id: 'digital-signatures',
    title: 'Digital Signatures & E-Signs',
    category: 'signatures',
    description: 'Multi-party legally binding e-signature workflows, signature tracking, and automated expiration reminders.',
    icon: FileCheck,
    tags: ['E-Signatures', 'Audit Trail', 'Reminders'],
    gradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
    iconBg: 'bg-amber-500/10 dark:bg-amber-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
    metric: { label: 'Pending Signs', value: '14' },
    actionText: 'Track Signatures',
  },
  {
    id: 'compliance-monitor',
    title: 'Labor Law & Compliance Monitor',
    category: 'compliance',
    description: 'Continuous monitoring of labor law standards, statutory filing schedules, and compliance health alerts.',
    icon: ShieldAlert,
    tags: ['Labor Laws', 'Statutory Filings', 'Alerts'],
    gradient: 'from-rose-500/10 via-pink-500/5 to-transparent',
    iconBg: 'bg-rose-500/10 dark:bg-rose-500/20',
    iconColor: 'text-rose-600 dark:text-rose-400',
    metric: { label: 'Compliance', value: '100% Score' },
    actionText: 'Inspect Audits',
  },
  {
    id: 'recruitment-compliance',
    title: 'Hiring & Candidate Compliance',
    category: 'compliance',
    description: 'Background verification documentation, candidate credential checks, and right-to-work verification archives.',
    icon: ShieldCheck,
    tags: ['Background Checks', 'Right-to-Work', 'EEO'],
    gradient: 'from-cyan-500/10 via-sky-500/5 to-transparent',
    iconBg: 'bg-cyan-500/10 dark:bg-cyan-500/20',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    metric: { label: 'Verified Hires', value: '100%' },
    actionText: 'Check Records',
  },
  {
    id: 'policy-assistant',
    title: 'Interactive Policy AI Assistant',
    category: 'policies',
    description: 'Conversational assistant for employees to ask questions about PTO policies, medical benefits, and conduct rules.',
    icon: Sparkles,
    tags: ['AI Assistant', 'Policy Q&A', 'Employee Support'],
    gradient: 'from-purple-500/10 via-fuchsia-500/5 to-transparent',
    iconBg: 'bg-purple-500/10 dark:bg-purple-500/20',
    iconColor: 'text-purple-600 dark:text-purple-400',
    metric: { label: 'Queries Solved', value: '820+' },
    actionText: 'Ask Policy AI',
  },
  {
    id: 'audit-trail',
    title: 'Audit Logs & Access History',
    category: 'compliance',
    description: 'Immutable security log of document views, downloads, permissions changes, and regulatory inspection exports.',
    icon: Lock,
    tags: ['Immutable Logs', 'Security Trail', 'Access Control'],
    gradient: 'from-slate-600/10 via-zinc-500/5 to-transparent',
    iconBg: 'bg-slate-500/10 dark:bg-zinc-500/20',
    iconColor: 'text-slate-600 dark:text-zinc-400',
    metric: { label: 'Security Status', value: 'Encrypted' },
    actionText: 'View Audit Trail',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Modules' },
  { id: 'repository', label: 'Vault & Storage' },
  { id: 'policies', label: 'Policies & Handbooks' },
  { id: 'generator', label: 'Document Generator' },
  { id: 'signatures', label: 'E-Signatures' },
  { id: 'compliance', label: 'Compliance & Audits' },
];

export const DocumentsComplianceHubPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModal, setActiveModal] = useState<DocumentModuleCard | null>(null);

  const filteredModules = useMemo(() => {
    return DOCUMENT_MODULES.filter((m) => {
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

  const handleCardClick = (module: DocumentModuleCard) => {
    setActiveModal(module);
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
              <span>Enterprise Document Vault & Statutory Governance</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <span>Documents & Compliance Hub</span>
            </h1>
            <p className="text-sm md:text-base text-slate-300">
              Secure document storage, policy handbooks, automated contract generation, legally binding e-signatures, and real-time labor compliance.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              variant="primary"
              size="sm"
              onClick={() => toast.info('Document generation wizard ready', 'New Document')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30 flex items-center gap-2"
            >
              <FilePlus2 className="w-4 h-4" />
              <span>Generate Document</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info('Secure file upload dropzone open', 'Upload')}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white flex items-center gap-1.5"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Document</span>
            </Button>
          </div>
        </div>

        {/* Live Counters */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 text-xs">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-slate-400 block text-[11px]">Vault Stored Files</span>
            <span className="text-xl font-bold text-white mt-0.5 block">4,820 Files</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-slate-400 block text-[11px]">Compliance Status</span>
            <span className="text-xl font-bold text-emerald-400 mt-0.5 block flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Compliant
            </span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-slate-400 block text-[11px]">Pending E-Signatures</span>
            <span className="text-xl font-bold text-amber-400 mt-0.5 block">14 Awaiting</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-slate-400 block text-[11px]">Encryption Standard</span>
            <span className="text-xl font-bold text-cyan-300 mt-0.5 block flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" /> AES-256 Bit
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
            placeholder="Search documents, policies & audits..."
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

      {/* Grid of Document & Compliance Cards */}
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
                {/* Icon & Metric badge */}
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
                <span>{module.actionText || 'Manage Module'}</span>
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
            No document modules match &ldquo;{searchQuery}&rdquo;
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

      {/* Module Action Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-slate-200 dark:border-zinc-800 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', activeModal.iconBg)}>
                  <activeModal.icon className={cn('w-6 h-6', activeModal.iconColor)} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{activeModal.title}</h3>
                  <Badge variant="outline" size="sm" className="mt-1">
                    {activeModal.category.toUpperCase()}
                  </Badge>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
              {activeModal.description}
            </p>

            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-zinc-800">
              <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block">
                Features & Security Rules:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeModal.tags.map((tag) => (
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
              <Button variant="ghost" size="sm" onClick={() => setActiveModal(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  toast.success(`${activeModal.title} workspace is synchronized and active.`, 'Access Granted');
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

export default DocumentsComplianceHubPage;
