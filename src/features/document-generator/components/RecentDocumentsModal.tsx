/**
 * @file RecentDocumentsModal.tsx
 * @description Accessible modal displaying recently generated documents history.
 */

import React, { useEffect } from 'react';
import { History, X, FileText, Download, Calendar, Hash } from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Tooltip } from '@/shared/ui/Tooltip';
import { formatDocumentDate } from '../utils/documentGeneratorUtils';
import type { RecentGeneratedDocument } from '../types/documentGenerator.types';

export interface RecentDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  recentDocuments: RecentGeneratedDocument[];
}

export const RecentDocumentsModal: React.FC<RecentDocumentsModalProps> = ({
  isOpen,
  onClose,
  recentDocuments,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
      <div
        className="w-full max-w-xl bg-white dark:bg-[#1a1a1a] rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[85vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="recent-docs-title"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between bg-gray-50/60 dark:bg-zinc-900/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 id="recent-docs-title" className="text-base font-bold text-gray-900 dark:text-white">
                Recent Generated Documents
              </h2>
              <p className="text-[11px] text-gray-500 dark:text-zinc-400">
                {recentDocuments.length} document{recentDocuments.length === 1 ? '' : 's'} recorded in this organization
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List Content */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {recentDocuments.length === 0 ? (
            <div className="py-12 text-center text-xs text-gray-500 dark:text-zinc-400">
              No recent documents generated yet.
            </div>
          ) : (
            recentDocuments.map((doc) => (
              <div
                key={doc.documentId}
                className="p-4 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#202020] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-gray-300 dark:hover:border-zinc-700 transition-all"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white truncate">
                      {doc.title}
                    </span>
                    <Badge variant="slate" size="sm" className="font-mono text-[10px] uppercase font-bold shrink-0">
                      {doc.format}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400 dark:text-zinc-500 pt-0.5">
                    <span className="flex items-center gap-1 font-mono">
                      <Hash className="w-2.5 h-2.5" />
                      {doc.documentId.slice(0, 8)}...
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5" />
                      {formatDocumentDate(doc.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 self-end sm:self-auto">
                  <Tooltip content="Download not available yet (backend storage endpoint pending)" position="left">
                    <span>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled
                        className="text-xs opacity-60 cursor-not-allowed h-8 px-2.5"
                        aria-disabled="true"
                      >
                        <Download className="w-3.5 h-3.5 mr-1" />
                        <span>Download</span>
                      </Button>
                    </span>
                  </Tooltip>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-gray-100 dark:border-zinc-800 flex justify-end bg-gray-50/50 dark:bg-zinc-900/30">
          <Button size="sm" variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecentDocumentsModal;

