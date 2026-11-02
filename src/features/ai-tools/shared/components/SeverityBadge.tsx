import React from 'react';
import { cn } from '@/shared/lib/utils';
import type { Severity } from '../types';

interface SeverityBadgeProps {
  severity: Severity;
  className?: string;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, className }) => {
  const styles = {
    critical: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    warn: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  }[severity] || 'bg-slate-500/10 text-slate-600 border-slate-500/20';

  const label = {
    critical: 'Critical',
    warn: 'Warning',
    info: 'Notice',
  }[severity] || severity;

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border uppercase tracking-wider',
        styles,
        className
      )}
    >
      {label}
    </span>
  );
};

