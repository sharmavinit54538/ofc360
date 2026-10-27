/**
 * @file MissingPlaceholdersModal.tsx
 * @description Accessible confirmation modal warning users about unfilled placeholders
 * before proceeding with final document artifact generation.
 */

import React, { useEffect } from 'react';
import { AlertTriangle, X, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

export interface MissingPlaceholdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  missingPlaceholders: string[];
  isGenerating?: boolean;
}

export const MissingPlaceholdersModal: React.FC<MissingPlaceholdersModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  missingPlaceholders,
  isGenerating = false,
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
        className="w-full max-w-md bg-white dark:bg-[#1a1a1a] rounded-3xl border border-amber-200 dark:border-amber-900/50 shadow-2xl overflow-hidden animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-labelledby="missing-placeholders-title"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between bg-amber-500/10">
          <div className="flex items-center gap-2.5 text-amber-700 dark:text-amber-400">
            <div className="p-2 rounded-xl bg-amber-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 id="missing-placeholders-title" className="text-base font-bold text-gray-900 dark:text-white">
              Unfilled Variables Warning
            </h2>
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

        {/* Modal Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-300 leading-relaxed">
            There {missingPlaceholders.length === 1 ? 'is' : 'are'}{' '}
            <strong className="text-amber-600 dark:text-amber-400">
              {missingPlaceholders.length} placeholder variable{missingPlaceholders.length === 1 ? '' : 's'}
            </strong>{' '}
            currently left blank in your document:
          </p>

          <div className="p-3 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 rounded-2xl max-h-40 overflow-y-auto space-y-1">
            {missingPlaceholders.map((ph) => (
              <div key={ph} className="flex items-center gap-1.5 font-mono text-xs font-semibold text-amber-900 dark:text-amber-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span>{ph}</span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-gray-50 dark:bg-zinc-900/60 border border-gray-200 dark:border-zinc-800 rounded-xl text-[11px] text-gray-500 dark:text-zinc-400">
            <strong>Backend behavior note:</strong> The backend will NOT block generation for missing placeholders,
            meaning these raw tags will appear unreplaced in the final exported file.
          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-end gap-2.5 bg-gray-50/50 dark:bg-zinc-900/40">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isGenerating}
          >
            Back & Complete Fields
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={onConfirm}
            isLoading={isGenerating}
            disabled={isGenerating}
            className="bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/20"
          >
            <span>Proceed Anyway</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MissingPlaceholdersModal;

