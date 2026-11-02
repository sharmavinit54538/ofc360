import React from 'react';
import { ArrowLeft, Sliders, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { ExportButton } from './ExportButton';

interface ToolHeaderProps {
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg?: string;
  iconColor?: string;
  badgeText?: string;
  onOpenAssumptions?: () => void;
  exportFilename?: string;
  exportData?: Record<string, any>[];
  exportHeaders?: string[];
  actions?: React.ReactNode;
}

export const ToolHeader: React.FC<ToolHeaderProps> = ({
  title,
  subtitle,
  icon: Icon,
  iconBg = 'bg-indigo-500/10 dark:bg-indigo-500/20',
  iconColor = 'text-indigo-600 dark:text-indigo-400',
  badgeText = 'Deterministic Advisory Engine',
  onOpenAssumptions,
  exportFilename,
  exportData,
  exportHeaders,
  actions,
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/dashboard/ai-hub')}
          className="text-xs gap-1.5 border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#1a1a1a] text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to AI Hub</span>
        </Button>

        <div className="flex items-center gap-2">
          {onOpenAssumptions && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenAssumptions}
              className="text-xs gap-1.5 border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#1a1a1a] text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800"
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-500" />
              <span>Assumptions &amp; Thresholds</span>
            </Button>
          )}

          {exportFilename && exportData && (
            <ExportButton
              filename={exportFilename}
              data={exportData}
              headers={exportHeaders}
            />
          )}

          {actions}
        </div>
      </div>

      {/* Main Header Box */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {title}
              </h1>
              <Badge variant="brand" size="sm" className="font-semibold text-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span>{badgeText}</span>
              </Badge>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400 max-w-2xl">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

