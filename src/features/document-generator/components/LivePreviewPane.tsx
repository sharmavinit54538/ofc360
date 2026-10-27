/**
 * @file LivePreviewPane.tsx
 * @description Real-time document preview canvas displaying debounced rendered content,
 * missing placeholders indicators, and document paper simulation.
 */

import React from 'react';
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Sparkles,
  Maximize2,
  Copy,
  Check,
} from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import type {
  DocumentPreviewResponse,
  DocumentTemplateItem,
} from '../types/documentGenerator.types';

export interface LivePreviewPaneProps {
  template: DocumentTemplateItem | null;
  preview: DocumentPreviewResponse | null;
  isDebouncing?: boolean;
  isLoading?: boolean;
  previewError?: string | null;
  onRefreshPreview?: () => void;
}

export const LivePreviewPane: React.FC<LivePreviewPaneProps> = ({
  template,
  preview,
  isDebouncing = false,
  isLoading = false,
  previewError,
  onRefreshPreview,
}) => {
  const [copied, setCopied] = React.useState(false);

  const missingPlaceholders = preview?.missingPlaceholders || [];
  const hasMissing = missingPlaceholders.length > 0;
  const isBusy = isDebouncing || isLoading;

  const handleCopyContent = () => {
    if (!preview?.renderedContent) return;
    navigator.clipboard.writeText(preview.renderedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!template) {
    return (
      <div className="h-full min-h-[480px] rounded-3xl border border-dashed border-gray-300 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30 p-8 flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
          <FileText className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-gray-900 dark:text-white">
          Document Preview Canvas
        </h3>
        <p className="text-xs text-gray-500 dark:text-zinc-400 max-w-sm mt-1.5 leading-relaxed">
          Select a template on the left and enter variables to preview your rendered document in real-time.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full rounded-3xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#181818] shadow-sm overflow-hidden">
      {/* Preview Pane Header */}
      <div className="px-5 py-3.5 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between gap-3 bg-gray-50/70 dark:bg-zinc-900/50">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span className="text-xs font-bold text-gray-900 dark:text-white truncate">
            {template.name} — Preview
          </span>
        </div>

        {/* Status Pill & Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Live Status Indicator with aria-live */}
          <div aria-live="polite" className="flex items-center">
            {isBusy ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/50">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Updating Preview...</span>
              </span>
            ) : hasMissing ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
                <AlertTriangle className="w-3 h-3 text-amber-500" />
                <span>{missingPlaceholders.length} Missing Variable{missingPlaceholders.length === 1 ? '' : 's'}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span>Up to Date</span>
              </span>
            )}
          </div>

          {preview?.renderedContent && (
            <button
              type="button"
              onClick={handleCopyContent}
              title="Copy Preview Content"
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-200/60 dark:hover:bg-zinc-800 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Missing Placeholders Notification Banner */}
      <div aria-live="assertive">
        {hasMissing && (
          <div className="px-5 py-2.5 bg-amber-500/10 border-b border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div className="flex-1 min-w-0">
              <span className="font-semibold block">
                {missingPlaceholders.length} placeholder variable{missingPlaceholders.length === 1 ? ' is' : 's are'} unfilled:
              </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {missingPlaceholders.map((missing) => (
                  <code
                    key={missing}
                    className="px-1.5 py-0.5 rounded bg-amber-200/60 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200 font-mono text-[10px] font-bold"
                  >
                    {missing}
                  </code>
                ))}
              </div>
              <span className="text-[11px] text-amber-700/80 dark:text-amber-400/80 mt-1 block">
                The server will leave these raw tags in the generated file unless completed.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Preview Error Notice */}
      {previewError && (
        <div className="px-5 py-3 bg-rose-500/10 border-b border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-400 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{previewError}</span>
          </div>
          {onRefreshPreview && (
            <Button size="sm" variant="ghost" onClick={onRefreshPreview} className="text-xs h-7">
              Retry
            </Button>
          )}
        </div>
      )}

      {/* Document Simulation Paper Canvas */}
      <div className="flex-1 p-4 sm:p-6 bg-gray-100/70 dark:bg-[#121212] overflow-y-auto max-h-[640px]">
        <div className="max-w-2xl mx-auto bg-white dark:bg-[#202020] rounded-2xl p-6 sm:p-8 shadow-md border border-gray-200/80 dark:border-zinc-800 min-h-[460px] text-gray-800 dark:text-gray-200 text-xs sm:text-sm font-sans leading-relaxed relative">
          {/* Subtle Document Header Simulation */}
          <div className="border-b border-gray-200 dark:border-zinc-800 pb-4 mb-5 flex items-center justify-between text-gray-400 dark:text-zinc-500 text-[11px]">
            <span className="font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              OFC360 Enterprise Document
            </span>
            <span className="font-mono text-[10px]">
              {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
          </div>

          {/* Rendered Content */}
          {preview?.renderedContent ? (
            <div
              className="prose dark:prose-invert max-w-none text-xs sm:text-sm font-normal leading-relaxed whitespace-pre-wrap break-words"
            >
              {preview.renderedContent}
            </div>
          ) : isBusy ? (
            <div className="space-y-3 pt-6 animate-pulse">
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-zinc-700 rounded" />
              <div className="h-4 w-full bg-gray-200 dark:bg-zinc-700 rounded" />
              <div className="h-4 w-5/6 bg-gray-200 dark:bg-zinc-700 rounded" />
              <div className="h-4 w-2/3 bg-gray-200 dark:bg-zinc-700 rounded" />
              <div className="h-4 w-full bg-gray-200 dark:bg-zinc-700 rounded" />
            </div>
          ) : (
            <div className="text-gray-400 dark:text-zinc-500 italic py-12 text-center">
              No preview content rendered yet. Fill in values to generate preview.
            </div>
          )}

          {/* Paper Watermark / Footer */}
          <div className="mt-8 pt-4 border-t border-gray-100 dark:border-zinc-800/80 text-[10px] text-gray-400 dark:text-zinc-500 flex items-center justify-between">
            <span>Generated via OFC360 Document Intelligence</span>
            <span>Confidential</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivePreviewPane;

