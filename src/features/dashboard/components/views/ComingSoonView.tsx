import React from 'react';
import { ArrowLeft, Sparkles, Shield, Clock } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import type { DashboardTabConfig } from '../dashboardTabs.data';

export interface ComingSoonViewProps {
  tab?: DashboardTabConfig;
  onNavigateToOverview?: () => void;
  onSelectTab?: (tabId: string) => void;
}

const getGroupDisplayName = (group?: string): string => {
  switch (group) {
    case 'core':
      return 'Core Module';
    case 'hr-ops':
      return 'HR Ops & Admin';
    case 'recruitment':
      return 'Recruitment Hub';
    case 'ai-hub':
      return 'AI Hub Intelligence';
    default:
      return 'Enterprise Module';
  }
};

export const ComingSoonView: React.FC<ComingSoonViewProps> = ({
  tab,
  onNavigateToOverview,
}) => {
  const Icon = tab?.icon || Sparkles;
  const label = tab?.label || 'Module';
  const groupName = getGroupDisplayName(tab?.group);

  return (
    <div className="py-8 md:py-14 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-xl p-8 md:p-10 rounded-2xl bg-card border border-border/70 text-center shadow-sm space-y-6">
        {/* Module Icon Container */}
        <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-center mx-auto text-slate-700 dark:text-slate-200 shadow-sm">
          <Icon className="w-7 h-7" />
        </div>

        {/* Header & Category */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-muted/60 text-muted-foreground border border-border/50">
            <span>{groupName}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
            {label}
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            The <span className="font-semibold text-foreground">{label}</span> module is currently in active rollout. Real-time telemetry, automated workflows, and backend sync will be accessible here soon.
          </p>
        </div>

        {/* Feature Preview Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-left">
          <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Clock className="w-3.5 h-3.5 text-brand-500" />
              <span>Real-Time Sync</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Instant backend streaming and live webhooks.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>SOC-2 RBAC</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Granular role permissions and audit trails.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              <span>AI Insights</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Predictive triggers and automated summaries.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 flex items-center justify-center gap-3">
          {onNavigateToOverview && (
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onNavigateToOverview}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              className="rounded-full px-5"
            >
              Back to Overview
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComingSoonView;
