/**
 * @file TemplateSelector.tsx
 * @description Searchable and accessible template picker component for AI Document Generator.
 */

import React, { useState, useMemo } from 'react';
import { FileText, Search, Check, Sparkles, AlertCircle } from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { EmptyState } from '@/shared/ui/EmptyState';
import { ErrorDisplay } from '@/shared/ui/ErrorDisplay';
import type { DocumentTemplateItem } from '../types/documentGenerator.types';

export interface TemplateSelectorProps {
  templates: DocumentTemplateItem[];
  selectedTemplateId: string | null;
  onSelectTemplate: (template: DocumentTemplateItem) => void;
  isLoading?: boolean;
  error?: unknown;
  onRetry?: () => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  selectedTemplateId,
  onSelectTemplate,
  isLoading = false,
  error,
  onRetry,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = useMemo(() => {
    if (!searchQuery.trim()) return templates;
    const q = searchQuery.toLowerCase();
    return templates.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        t.placeholders.some((p) => p.toLowerCase().includes(q))
    );
  }, [templates, searchQuery]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-4 w-32 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
        <div className="grid grid-cols-1 gap-2.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#1a1a1a] space-y-2 animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="h-4 w-40 bg-gray-200 dark:bg-zinc-800 rounded" />
                <div className="h-4 w-16 bg-gray-200 dark:bg-zinc-800 rounded-full" />
              </div>
              <div className="h-3 w-3/4 bg-gray-100 dark:bg-zinc-800/60 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/50 dark:bg-rose-950/20">
        <ErrorDisplay
          error={error as any}
          title="Failed to Load Document Templates"
          message="Could not retrieve template catalog from the backend."
          onRetry={onRetry}
        />
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="p-6 rounded-2xl border border-dashed border-gray-300 dark:border-zinc-800 bg-white dark:bg-[#171717]">
        <EmptyState
          icon={<FileText className="w-8 h-8 text-gray-400 dark:text-zinc-500" />}
          title="No Document Templates Found"
          description="The server returned zero active document templates. Contact an administrator to add standard templates."
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label
          htmlFor="template-search-input"
          className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400"
        >
          1. Select Template <span className="text-rose-500">*</span>
        </label>
        <span className="text-[11px] text-gray-400 dark:text-zinc-500">
          {templates.length} template{templates.length === 1 ? '' : 's'} available
        </span>
      </div>

      {/* Search Input for Templates */}
      {templates.length > 3 && (
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            id="template-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates by title or token..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/60 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      )}

      {/* Template Cards List */}
      <div className="grid grid-cols-1 gap-2.5 max-h-[320px] overflow-y-auto pr-1">
        {filteredTemplates.map((template) => {
          const isSelected = template.templateId === selectedTemplateId;
          const placeholderCount = template.placeholders?.length ?? 0;

          return (
            <button
              key={template.templateId}
              type="button"
              onClick={() => onSelectTemplate(template)}
              className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-150 flex items-start justify-between gap-3 ${
                isSelected
                  ? 'border-indigo-500 ring-2 ring-indigo-500/25 bg-indigo-50/40 dark:bg-indigo-950/20 shadow-sm'
                  : 'border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#1a1a1a] hover:border-indigo-300 dark:hover:border-zinc-700 hover:bg-gray-50/50 dark:hover:bg-zinc-900/40'
              }`}
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white truncate">
                    {template.name}
                  </span>
                  {isSelected && (
                    <span className="shrink-0 w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}
                </div>

                {template.description && (
                  <p className="text-[11px] text-gray-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {template.description}
                  </p>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <Badge
                    variant={isSelected ? 'brand' : 'slate'}
                    size="sm"
                    className="text-[10px] font-mono px-2"
                  >
                    <Sparkles className="w-2.5 h-2.5 mr-1" />
                    {placeholderCount} variable{placeholderCount === 1 ? '' : 's'}
                  </Badge>
                </div>
              </div>
            </button>
          );
        })}

        {filteredTemplates.length === 0 && (
          <div className="p-4 rounded-xl text-center text-xs text-gray-500 dark:text-zinc-400 border border-dashed border-gray-200 dark:border-zinc-800">
            No templates matching &ldquo;{searchQuery}&rdquo;.
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateSelector;

