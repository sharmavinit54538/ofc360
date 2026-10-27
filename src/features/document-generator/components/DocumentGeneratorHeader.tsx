/**
 * @file DocumentGeneratorHeader.tsx
 * @description Enterprise hero header banner with overview metrics, format pills,
 * and quick recent generated documents modal trigger for the AI Document Generator.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  FileCheck2,
  Sparkles,
  ArrowLeft,
  History,
  FileCode,
  FileType,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import type { DocumentGeneratorOverview } from '../types/documentGenerator.types';

export interface DocumentGeneratorHeaderProps {
  overview?: DocumentGeneratorOverview | null;
  isLoading?: boolean;
  onOpenRecent?: () => void;
}

export const DocumentGeneratorHeader: React.FC<DocumentGeneratorHeaderProps> = ({
  overview,
  isLoading = false,
  onOpenRecent,
}) => {
  const navigate = useNavigate();

  const totalTemplates = overview?.totalTemplates ?? 0;
  const totalGenerated = overview?.totalGeneratedDocuments ?? 0;
  const recentCount = overview?.recentGenerated?.length ?? 0;
  const supportedFormats = overview?.supportedFormats?.length
    ? overview.supportedFormats
    : ['pdf', 'docx', 'html', 'txt'];

  const getFormatIcon = (format: string) => {
    const f = format.toLowerCase();
    if (f === 'pdf') return <FileText className="w-3 h-3 text-rose-500" />;
    if (f === 'docx') return <FileType className="w-3 h-3 text-blue-500" />;
    if (f === 'html') return <FileCode className="w-3 h-3 text-amber-500" />;
    return <FileText className="w-3 h-3 text-slate-500" />;
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-6 md:p-8 shadow-xl border border-white/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.22),transparent_50%)] pointer-events-none" />

      {/* Top Breadcrumb & Navigation */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard/ai-hub')}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white transition-all flex items-center gap-1.5 text-xs font-medium"
            aria-label="Back to AI Hub"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">AI Hub</span>
          </button>
          <span className="text-slate-500">/</span>
          <span className="text-xs font-semibold text-indigo-300">Document Generator</span>
        </div>

        {/* Recent Generated Documents Trigger */}
        {recentCount > 0 && onOpenRecent && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onOpenRecent}
            className="text-xs text-white bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl flex items-center gap-2"
          >
            <History className="w-3.5 h-3.5 text-indigo-300" />
            <span>Recent Documents ({recentCount})</span>
          </Button>
        )}
      </div>

      {/* Main Title & Value Proposition */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 backdrop-blur border border-indigo-400/30 text-xs font-medium text-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300 animate-pulse" />
            <span>AI Automated Legal & Employment Documents</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <span>Document Generator</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Generate legally compliant appointment letters, NDAs, compensation revisions, and relieving certificates.
            Type variables to see instantaneous token previews with missing-field verification.
          </p>
        </div>

        {/* Live Counters & Formats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto shrink-0">
          {/* Templates Count */}
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 min-w-[130px]">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>Templates</span>
            </div>
            <div className="mt-2">
              {isLoading ? (
                <div className="h-7 w-12 bg-white/10 rounded animate-pulse" />
              ) : (
                <span className="text-2xl font-black text-white">{totalTemplates}</span>
              )}
            </div>
          </div>

          {/* Generated Documents Count */}
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 min-w-[130px]">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Generated</span>
            </div>
            <div className="mt-2">
              {isLoading ? (
                <div className="h-7 w-12 bg-white/10 rounded animate-pulse" />
              ) : (
                <span className="text-2xl font-black text-emerald-300">{totalGenerated}</span>
              )}
            </div>
          </div>

          {/* Formats Pill Strip */}
          <div className="col-span-2 sm:col-span-1 bg-white/5 rounded-2xl p-4 border border-white/10">
            <span className="text-slate-400 text-xs font-medium block mb-2">Supported</span>
            <div className="flex flex-wrap gap-1.5">
              {supportedFormats.map((fmt) => (
                <Badge
                  key={fmt}
                  variant="slate"
                  size="sm"
                  className="bg-white/10 text-white border-white/15 text-[10px] uppercase font-bold flex items-center gap-1"
                >
                  {getFormatIcon(fmt)}
                  <span>{fmt}</span>
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentGeneratorHeader;

