/**
 * @file GeneratedDocumentCard.tsx
 * @description Success display card for newly generated document artifacts with
 * disabled download state and tooltip explanation for backend storage gaps.
 */

import React from 'react';
import {
  FileCheck,
  Download,
  Calendar,
  Hash,
  Sparkles,
  RotateCcw,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Tooltip } from '@/shared/ui/Tooltip';
import { resolveGeneratedDocumentUrl } from '../api/documentGeneratorApi';
import { formatDocumentDate } from '../utils/documentGeneratorUtils';
import type { DocumentGenerateResponse } from '../types/documentGenerator.types';

export interface GeneratedDocumentCardProps {
  document: DocumentGenerateResponse;
  onGenerateAnother: () => void;
}

export const GeneratedDocumentCard: React.FC<GeneratedDocumentCardProps> = ({
  document,
  onGenerateAnother,
}) => {
  const { url, isDownloadable, tooltipText } = resolveGeneratedDocumentUrl(document.filePathOrUrl);

  return (
    <div className="p-6 rounded-3xl border border-emerald-200 dark:border-emerald-900/50 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-transparent shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Document Generated Successfully
              </span>
              <Badge variant="success" size="sm" className="font-mono text-[10px] uppercase">
                {document.format}
              </Badge>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mt-0.5">
              {document.title}
            </h3>
          </div>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={onGenerateAnother}
          className="text-xs rounded-xl"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          <span>New Document</span>
        </Button>
      </div>

      {/* Metadata Attributes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-zinc-800 text-xs">
        <div className="space-y-1">
          <span className="text-gray-400 dark:text-zinc-500 flex items-center gap-1.5 text-[11px]">
            <Hash className="w-3 h-3" /> Document ID
          </span>
          <span className="font-mono text-gray-900 dark:text-zinc-200 font-semibold truncate block">
            {document.documentId}
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-gray-400 dark:text-zinc-500 flex items-center gap-1.5 text-[11px]">
            <Calendar className="w-3 h-3" /> Generated At
          </span>
          <span className="text-gray-900 dark:text-zinc-200 font-semibold block">
            {formatDocumentDate(document.generatedAt)}
          </span>
        </div>

        <div className="col-span-1 sm:col-span-2 space-y-1">
          <span className="text-gray-400 dark:text-zinc-500 flex items-center gap-1.5 text-[11px]">
            <FileText className="w-3 h-3" /> Server File Path
          </span>
          <code className="text-[11px] font-mono text-gray-600 dark:text-zinc-400 bg-gray-50 dark:bg-zinc-900 px-2 py-1 rounded block truncate">
            {document.filePathOrUrl || 'No file path returned'}
          </code>
        </div>
      </div>

      {/* Download Action & Backend Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="text-[11px]">
            Server storage note: The backend generated the record but does not serve static file downloads.
          </span>
        </div>

        <div className="shrink-0">
          {isDownloadable && url ? (
            <a
              href={url}
              download={document.title}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download {document.format.toUpperCase()}</span>
            </a>
          ) : (
            <Tooltip content={tooltipText} position="top">
              <span>
                <Button
                  size="sm"
                  variant="outline"
                  disabled
                  className="opacity-60 cursor-not-allowed text-xs rounded-xl"
                  aria-disabled="true"
                >
                  <Download className="w-3.5 h-3.5 mr-1" />
                  <span>Download Not Available</span>
                </Button>
              </span>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneratedDocumentCard;

