import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  FolderKanban,
  ShieldCheck,
  ShieldAlert,
  BookOpen,
  FilePlus2,
  Lock,
  Search,
  Sparkles,
  Upload,
  CheckCircle2,
  FileCheck,
  Building2,
  ArrowLeft,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { useToast } from '@/shared/ui/Toast';
import { useRBAC } from '@/features/auth/hooks/useRBAC';
import { PfComplianceCenter } from '@/features/payroll/components/PfComplianceCenter';
import { SignatureCenter } from '../components/SignatureCenter';
import { useGetSignatureStatsQuery } from '../api/signaturesApi';

interface DocumentModuleCard {
  id: string;
  title: string;
  category: 'repository' | 'policies' | 'generator' | 'signatures' | 'compliance' | 'esign';
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  iconBg: string;
  iconColor: string;
  actionText?: string;
}

const DOCUMENT_MODULES: DocumentModuleCard[] = [
  {
    id: 'document-vault',
    title: 'Document Vault & Storage',
    category: 'repository',
    icon: FolderKanban,
    gradient: 'from-blue-500/10 via-indigo-500/5 to-transparent',
    iconBg: 'bg-blue-500/10 dark:bg-blue-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    actionText: 'Browse Vault',
  },
  {
    id: 'policy-handbook',
    title: 'Company Policies & Handbook',
    category: 'policies',
    icon: BookOpen,
    gradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
    iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    actionText: 'View Policies',
  },
  {
    id: 'document-generator',
    title: 'AI Contract & Letter Generator',
    category: 'generator',
    icon: FilePlus2,
    gradient: 'from-violet-500/10 via-purple-500/5 to-transparent',
    iconBg: 'bg-violet-500/10 dark:bg-violet-500/20',
    iconColor: 'text-violet-600 dark:text-violet-400',
    actionText: 'Draft Document',
  },
  {
    id: 'digital-signatures',
    title: 'Digital Signatures & E-Signs',
    category: 'esign',
    icon: FileCheck,
    gradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
    iconBg: 'bg-amber-500/10 dark:bg-amber-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
    actionText: 'Track Signatures',
  },
  {
    id: 'compliance-monitor',
    title: 'Labor Law & Compliance Monitor',
    category: 'compliance',
    icon: ShieldAlert,
    gradient: 'from-rose-500/10 via-pink-500/5 to-transparent',
    iconBg: 'bg-rose-500/10 dark:bg-rose-500/20',
    iconColor: 'text-rose-600 dark:text-rose-400',
    actionText: 'Inspect Audits',
  },
  {
    id: 'epfo-pf-compliance',
    title: 'EPFO PF & ECR Filing Center',
    category: 'compliance',
    icon: Building2,
    gradient: 'from-amber-500/10 via-yellow-500/5 to-transparent',
    iconBg: 'bg-amber-500/10 dark:bg-amber-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
    actionText: 'Launch PF ECR Hub',
  },
  {
    id: 'recruitment-compliance',
    title: 'Hiring & Candidate Compliance',
    category: 'compliance',
    icon: ShieldCheck,
    gradient: 'from-cyan-500/10 via-sky-500/5 to-transparent',
    iconBg: 'bg-cyan-500/10 dark:bg-cyan-500/20',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    actionText: 'Check Records',
  },
  {
    id: 'policy-assistant',
    title: 'Interactive Policy AI Assistant',
    category: 'policies',
    icon: Sparkles,
    gradient: 'from-purple-500/10 via-fuchsia-500/5 to-transparent',
    iconBg: 'bg-purple-500/10 dark:bg-purple-500/20',
    iconColor: 'text-purple-600 dark:text-purple-400',
    actionText: 'Ask Policy AI',
  },
  {
    id: 'audit-trail',
    title: 'Audit Logs & Access History',
    category: 'compliance',
    icon: Lock,
    gradient: 'from-slate-600/10 via-zinc-500/5 to-transparent',
    iconBg: 'bg-slate-500/10 dark:bg-zinc-500/20',
    iconColor: 'text-slate-600 dark:text-zinc-400',
    actionText: 'View Audit Trail',
  },
];

export const DocumentsComplianceHubPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useToast();
  const { hasRole } = useRBAC();
  const isAdmin = hasRole(['SUPER_ADMIN', 'HR_ADMIN']);

  const {
    data: signatureStats,
    isLoading: statsLoading,
    isError: statsError,
  } = useGetSignatureStatsQuery();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    return searchParams.get('view') === 'esign' ? 'esign' : 'all';
  });
  const [activeModal, setActiveModal] = useState<DocumentModuleCard | null>(null);

  useEffect(() => {
    if (searchParams.get('view') === 'esign') {
      setSelectedCategory('esign');
    }
  }, [searchParams]);

  const filteredModules = useMemo(() => {
    if (!searchQuery.trim()) return DOCUMENT_MODULES;
    const q = searchQuery.toLowerCase();
    return DOCUMENT_MODULES.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const handleCardClick = (module: DocumentModuleCard) => {
    if (module.id === 'epfo-pf-compliance') {
      setSelectedCategory('epfo-pf');
      return;
    }
    if (module.id === 'digital-signatures') {
      setSelectedCategory('esign');
      return;
    }
    if (module.id === 'document-generator') {
      navigate('/ai/document-generator');
      return;
    }
    setActiveModal(module);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Accessible Landmark Title */}
      <h1 className="sr-only">Documents &amp; Compliance Hub</h1>

      {/* Top Action & Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents, policies & audits..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-2xs"
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

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedCategory('epfo-pf')}
            className="text-xs flex items-center gap-1.5 border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#1a1a1a] text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 shadow-2xs"
          >
            <Building2 className="w-3.5 h-3.5 text-amber-500" />
            <span>EPFO PF &amp; ECR</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedCategory('esign')}
            className="text-xs flex items-center gap-1.5 border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#1a1a1a] text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 shadow-2xs"
          >
            <FileCheck className="w-3.5 h-3.5 text-indigo-500" />
            <span>E-Sign</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/ai/document-generator')}
            className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-1.5"
          >
            <FilePlus2 className="w-3.5 h-3.5" />
            <span>Generate Document</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.info('Secure file upload dropzone open', 'Upload')}
            className="text-xs flex items-center gap-1.5 border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#1a1a1a] text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 shadow-2xs"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Document</span>
          </Button>
        </div>
      </div>

      {/* View Switch: EPFO PF Center vs Digital Signatures vs Document Modules */}
      {selectedCategory === 'epfo-pf' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-100 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Documents & Policies Vault</span>
            </button>
            <div className="flex items-center gap-2">
              <Badge variant="warning" size="sm">
                EPFO ECR v2.0
              </Badge>
              <Badge variant="slate" size="sm">
                Sec 7Q / 14B Compliance Engine
              </Badge>
            </div>
          </div>
          <PfComplianceCenter />
        </div>
      ) : selectedCategory === 'esign' ? (
        <SignatureCenter
          onBackToVault={() => setSelectedCategory('all')}
          initialDocumentId={searchParams.get('sourceDocumentId') || undefined}
          autoOpenWizard={searchParams.get('new') === '1'}
        />
      ) : (
        <>
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
                    {/* Module Icon */}
                    <div
                      className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 duration-200',
                        module.iconBg
                      )}
                    >
                      <Icon className={cn('w-6 h-6', module.iconColor)} />
                    </div>

                    {/* Module Title */}
                    <div>
                      <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {module.title}
                      </h3>
                    </div>
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
                Try searching for another keyword or clear your search query.
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
                      <Badge variant="slate" size="sm" className="mt-1">
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

                <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-zinc-800">
                  <Button variant="ghost" size="sm" onClick={() => setActiveModal(null)}>
                    Close
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      if (activeModal.id === 'epfo-pf-compliance') {
                        setSelectedCategory('epfo-pf');
                        setActiveModal(null);
                        return;
                      }
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
        </>
      )}
    </div>
  );
};

export default DocumentsComplianceHubPage;
