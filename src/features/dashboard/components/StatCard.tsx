import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: LucideIcon | React.ReactNode;
  iconColor?: string;
  valueColor?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  icon: Icon,
  iconColor,
  valueColor = 'text-gray-900 dark:text-[#ececec]',
  className = '',
}) => {
  return (
    <div
      className={`p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 space-y-2 transition-colors hover:border-gray-300 dark:hover:border-zinc-700 ${className}`}
    >
      <div className="flex items-center justify-between text-gray-600 dark:text-zinc-400 gap-2">
        <span className="text-xs uppercase font-semibold tracking-wider truncate">{label}</span>
        {Icon && (
          <div className="shrink-0">
            {typeof Icon === 'function' ? (
              // Lucide component
              <Icon className={`w-4 h-4 ${iconColor || 'text-gray-600 dark:text-zinc-400'}`} />
            ) : (
              // ReactNode element
              Icon
            )}
          </div>
        )}
      </div>
      <div className={`text-xl sm:text-2xl font-bold truncate ${valueColor}`}>{value}</div>
      {subtext && <div className="text-[11px] text-gray-600 dark:text-zinc-400 font-medium">{subtext}</div>}
    </div>
  );
};

export default StatCard;
