import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface PayrollModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  maxWidthClassName?: string;
}

export const PayrollModalShell: React.FC<PayrollModalShellProps> = ({
  isOpen,
  onClose,
  title,
  description,
  icon,
  children,
  maxWidthClassName = 'max-w-lg',
}) => {
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in-50"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className={cn(
          'w-full bg-white dark:bg-[#171717] rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95',
          maxWidthClassName
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="payroll-modal-title"
        aria-describedby={description ? 'payroll-modal-description' : undefined}
      >
        <div className="px-5 sm:px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between gap-4 shrink-0 bg-gray-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-3 min-w-0">
            {icon && (
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                {icon}
              </div>
            )}
            <div className="min-w-0">
              <h2 id="payroll-modal-title" className="text-base sm:text-lg font-bold text-gray-900 dark:text-[#ececec] truncate">
                {title}
              </h2>
              {description && (
                <p id="payroll-modal-description" className="text-xs text-gray-500 dark:text-zinc-400 truncate">
                  {description}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default PayrollModalShell;
