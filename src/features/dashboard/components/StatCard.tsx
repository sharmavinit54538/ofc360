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
  valueColor = 'text-white',
  className = '',
}) => {
  return (
    <div
      className={`p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 transition-colors hover:border-slate-700/80 ${className}`}
    >
      <div className="flex items-center justify-between text-slate-400">
        <span className="text-xs uppercase font-semibold tracking-wider">{label}</span>
        {Icon && (
          <div className="shrink-0">
            {typeof Icon === 'function' ? (
              // Lucide component
              <Icon className="w-4 h-4 text-slate-400" />
            ) : (
              // ReactNode element
              Icon
            )}
          </div>
        )}
      </div>
      <div className={`text-2xl font-bold ${valueColor}`}>{value}</div>
      {subtext && <div className="text-[11px] text-slate-400 font-medium">{subtext}</div>}
    </div>
  );
};

export default StatCard;
