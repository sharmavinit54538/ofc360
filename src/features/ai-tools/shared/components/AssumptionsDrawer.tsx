import React from 'react';
import { X, Sliders, Info, ShieldCheck } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

export interface AssumptionItem {
  key: string;
  label: string;
  value: string | number;
  source: 'Statutory Config' | 'Company Policy' | 'Heuristic Default' | 'User Scenario';
  description: string;
}

interface AssumptionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  toolName: string;
  assumptions: AssumptionItem[];
  statutoryGrounded?: boolean;
}

export const AssumptionsDrawer: React.FC<AssumptionsDrawerProps> = ({
  isOpen,
  onClose,
  toolName,
  assumptions,
  statutoryGrounded = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-[#1a1a1a] border-l border-slate-200 dark:border-zinc-800 h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Assumptions &amp; Thresholds
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                {toolName} rule parameters
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-5 overflow-y-auto space-y-3.5 flex-1 text-xs">
          {statutoryGrounded && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Statutory Grounding Protocol</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Statutory limits (PF wage ceiling ₹15,000, ESI gross cap ₹21,000, Professional Tax slabs, TDS) are retrieved directly from the live organization statutory configuration. When any parameter is unconfigured on the backend, rules are marked &ldquo;Not Evaluable&rdquo; rather than assuming values.
              </p>
            </div>
          )}

          <div className="space-y-3">
            {assumptions.map((item) => (
              <div
                key={item.key}
                className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 dark:text-white">{item.label}</span>
                  <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-indigo-600 dark:text-indigo-400">
                    {item.value}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                  {item.description}
                </p>
                <div className="pt-1 flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                  <Info className="w-3 h-3 text-slate-400" />
                  <span>Source: {item.source}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-zinc-800 shrink-0 flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

