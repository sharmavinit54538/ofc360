/**
 * @file EmptyState.tsx
 * @description Standardized empty state component for lists, tables, feeds, and dashboards.
 */

import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      {icon && (
        <div className="p-3.5 rounded-2xl bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500 mb-4 inline-flex items-center justify-center">
          {icon}
        </div>
      )}
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
        {title}
      </h4>
      <p className="text-xs text-gray-500 dark:text-zinc-400 max-w-sm leading-relaxed">
        {description}
      </p>
      {action && (
        <Button
          size="sm"
          variant={action.variant || 'outline'}
          onClick={action.onClick}
          className="mt-4 text-xs rounded-xl"
          leftIcon={action.icon}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;

