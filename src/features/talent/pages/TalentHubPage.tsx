import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Briefcase, Gauge, Sparkles } from 'lucide-react';
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
      {/* Talent Header & Tab Switcher */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 md:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-gradient-to-tr from-amber-500/20 via-orange-500/20 to-rose-500/20 border border-amber-500/30 rounded-xl text-amber-600 dark:text-amber-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Talent Management
              </h1>
            </div>
            <p className="mt-1 text-xs md:text-sm text-slate-500 dark:text-zinc-400">
              Unify talent acquisition, applicant tracking, employee appraisals, and OKR performance reviews.
            </p>
          </div>

          {/* Primary 2-Tab Switcher */}
          <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700/60 self-start md:self-center">
            <button
              type="button"
              onClick={() => handleTabSelect('recruitment')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all duration-150',
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
                'flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all duration-150',
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
