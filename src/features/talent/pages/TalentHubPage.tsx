import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Briefcase, Gauge } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { RecruitmentHubPage } from '@/features/recruitment/pages/RecruitmentHubPage';
import { PerformanceHubPage } from '@/features/performance/pages/PerformanceHubPage';

export type TalentTabType = 'recruitment' | 'performance';

export const TalentHubPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentTab = useMemo<TalentTabType>(() => {
    const tabParam = searchParams.get('tab')?.toLowerCase();
    if (tabParam === 'performance') return 'performance';
    return 'recruitment';
  }, [searchParams]);

  const handleTabSelect = (tab: TalentTabType) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('tab', tab);
    setSearchParams(nextParams, { replace: true });
  };

  return (
    <div className="space-y-6">
      {/* Primary 2-Tab Switcher */}
      <div className="flex items-center justify-start">
        <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700/60 shadow-xs">
          <button
            type="button"
            onClick={() => handleTabSelect('recruitment')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all duration-150 cursor-pointer',
              currentTab === 'recruitment'
                ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            )}
          >
            <Briefcase className="w-4 h-4" />
            <span>Recruitment</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabSelect('performance')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all duration-150 cursor-pointer',
              currentTab === 'performance'
                ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            )}
          >
            <Gauge className="w-4 h-4" />
            <span>Performance</span>
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div className="transition-opacity duration-200">
        {currentTab === 'recruitment' && (
          <div key="talent-recruitment-tab">
            <RecruitmentHubPage />
          </div>
        )}

        {currentTab === 'performance' && (
          <div key="talent-performance-tab">
            <PerformanceHubPage />
          </div>
        )}
      </div>
    </div>
  );
};

export default TalentHubPage;
