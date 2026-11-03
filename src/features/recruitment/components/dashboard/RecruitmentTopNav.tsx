import React from 'react';
import { LayoutDashboard, Briefcase, Plus } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

interface RecruitmentTopNavProps {
  activeView: 'dashboard' | 'modules';
  onViewChange: (view: 'dashboard' | 'modules') => void;
  onCreateJobClick: () => void;
}

export const RecruitmentTopNav: React.FC<RecruitmentTopNavProps> = ({
  activeView,
  onViewChange,
  onCreateJobClick,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-zinc-800">
      {/* Tab Switcher: Recruitment Dashboard | Recruitment Module */}
      <div className="inline-flex items-center p-1 rounded-xl bg-slate-100/90 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 gap-1.5 shadow-xs">
        {/* Button 1: Recruitment Dashboard */}
        <button
          type="button"
          onClick={() => onViewChange('dashboard')}
          className={`h-[42px] px-4 rounded-lg text-sm font-semibold inline-flex items-center gap-2.5 transition-all duration-150 ${
            activeView === 'dashboard'
              ? 'bg-teal-600 text-white shadow-xs font-bold'
              : 'bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white border border-slate-200/70 dark:border-zinc-700'
          }`}
          aria-selected={activeView === 'dashboard'}
        >
          <LayoutDashboard
            className={`w-4 h-4 flex-shrink-0 ${
              activeView === 'dashboard' ? 'text-white' : 'text-teal-600 dark:text-teal-400'
            }`}
          />
          <span>Recruitment Dashboard</span>
        </button>

        {/* Button 2: Recruitment Module */}
        <button
          type="button"
          onClick={() => onViewChange('modules')}
          className={`h-[42px] px-4 rounded-lg text-sm font-semibold inline-flex items-center gap-2.5 transition-all duration-150 ${
            activeView === 'modules'
              ? 'bg-teal-600 text-white shadow-xs font-bold'
              : 'bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white border border-slate-200/70 dark:border-zinc-700'
          }`}
          aria-selected={activeView === 'modules'}
        >
          <Briefcase
            className={`w-4 h-4 flex-shrink-0 ${
              activeView === 'modules' ? 'text-white' : 'text-teal-600 dark:text-teal-400'
            }`}
          />
          <span>Recruitment Module</span>
        </button>
      </div>

      {/* Button 3: Create Job */}
      <Button
        type="button"
        variant="primary"
        onClick={onCreateJobClick}
        className="h-[42px] px-5 rounded-xl font-semibold inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white shadow-sm shadow-teal-600/20"
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
        <span>Create Job</span>
      </Button>
    </div>
  );
};
