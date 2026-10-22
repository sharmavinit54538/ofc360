/**
 * @file AttritionRiskTable.tsx
 * @description Predictive AI turnover and attrition risk table identifying high-risk talent,
 * primary contributing factors, model confidence scores, and mitigation actions.
 */

import React from 'react';
import {
  Sparkles,
  AlertTriangle,
  AlertOctagon,
  ShieldCheck,
  User,
  ArrowRight,
  CheckCircle2,
  Brain,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import type { AIAttritionRiskItem, AttritionRiskLevel } from '../types';

interface AttritionRiskTableProps {
  items: AIAttritionRiskItem[];
  isLoading: boolean;
  onTakeAction: (item: AIAttritionRiskItem) => void;
}

export const AttritionRiskTable: React.FC<AttritionRiskTableProps> = ({
  items,
  isLoading,
  onTakeAction,
}) => {
  const getRiskBadge = (level: AttritionRiskLevel, score?: number) => {
    switch (level) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 animate-pulse">
            <AlertOctagon className="w-3 h-3" />
            Critical {score !== undefined && `(${score}%)`}
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <AlertTriangle className="w-3 h-3" />
            High {score !== undefined && `(${score}%)`}
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            Moderate {score !== undefined && `(${score}%)`}
          </span>
        );
      case 'LOW':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-3 h-3" />
            Low {score !== undefined && `(${score}%)`}
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-200 dark:border-zinc-800 animate-pulse">
          <div className="h-4 w-44 bg-gray-200 dark:bg-zinc-800 rounded" />
        </div>
        <div className="divide-y divide-gray-100 dark:divide-zinc-800/80">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4 animate-pulse">
              <div className="flex items-center gap-3 w-1/4">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-zinc-800 shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 w-28 bg-gray-200 dark:bg-zinc-800 rounded" />
                  <div className="h-3 w-20 bg-gray-200 dark:bg-zinc-800 rounded" />
                </div>
              </div>
              <div className="h-6 w-24 bg-gray-200 dark:bg-zinc-800 rounded-full" />
              <div className="h-4 w-44 bg-gray-200 dark:bg-zinc-800 rounded hidden md:block" />
              <div className="h-8 w-24 bg-gray-200 dark:bg-zinc-800 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 dark:border-zinc-800 bg-white dark:bg-[#171717] p-10 text-center shadow-sm">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3 border border-emerald-200/50 dark:border-emerald-900/30">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-[#ececec]">
          Zero High-Risk Attrition Detected
        </h4>
        <p className="mt-1 text-xs text-gray-500 dark:text-zinc-400 max-w-sm mx-auto">
          Predictive retention models currently indicate low departure risk across staff profiles.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between bg-gray-50/50 dark:bg-zinc-900/40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-200/60 dark:border-purple-900/40">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-[#ececec] text-sm">
              AI Turnover Risk & Flight Probability
            </h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400">
              Predictive machine learning models based on tenure, engagement, and compensation
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-900/30">
          {items.length} Monitored Profiles
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50/75 dark:bg-zinc-900/60 border-b border-gray-200 dark:border-zinc-800 text-[11px] uppercase tracking-wider font-semibold text-gray-500 dark:text-zinc-400">
            <tr>
              <th className="py-3.5 px-4">Employee & Role</th>
              <th className="py-3.5 px-4">Risk Probability</th>
              <th className="py-3.5 px-4">Primary Risk Factors</th>
              <th className="py-3.5 px-4">AI Recommended Action</th>
              <th className="py-3.5 px-4 text-right">Intervention</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/80 text-gray-700 dark:text-zinc-300">
            {items.map((item) => (
              <tr
                key={item.employeeId}
                className="hover:bg-gray-50/50 dark:hover:bg-zinc-900/30 transition-colors"
              >
                {/* Employee Profile */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-500/20 to-brand-500/20 text-purple-600 dark:text-purple-400 font-bold flex items-center justify-center border border-purple-200/40 dark:border-purple-900/30 shrink-0 text-xs">
                      {item.employeeName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2) || 'EM'}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-[#ececec] text-xs">
                        {item.employeeName}
                      </div>
                      <div className="text-[11px] text-gray-500 dark:text-zinc-400">
                        {item.role || 'Staff'} • {item.department}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Risk Level */}
                <td className="py-3.5 px-4">
                  {getRiskBadge(item.riskLevel, item.riskScore)}
                </td>

                {/* Primary Factors */}
                <td className="py-3.5 px-4">
                  <div className="flex flex-wrap gap-1 max-w-sm">
                    {item.primaryFactors.map((factor, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300"
                      >
                        {factor}
                      </span>
                    ))}
                  </div>
                </td>

                {/* Recommended Action */}
                <td className="py-3.5 px-4 text-xs font-medium text-gray-800 dark:text-zinc-200 max-w-xs">
                  <div className="flex items-center gap-1.5 text-brand-600 dark:text-brand-400">
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.recommendedAction}</span>
                  </div>
                </td>

                {/* Action CTA */}
                <td className="py-3.5 px-4 text-right">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onTakeAction(item)}
                    className="rounded-lg text-xs px-3 py-1 flex items-center gap-1 ml-auto shadow-sm"
                  >
                    <span>Engage</span>
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttritionRiskTable;
