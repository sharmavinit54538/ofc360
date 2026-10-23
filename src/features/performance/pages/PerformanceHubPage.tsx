import React, { useState } from 'react';
import {
  Gauge,
  ClipboardList,
  Target,
  Users2,
  Star,
  Plus,
  ArrowRightLeft,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/Button';
import { ErrorDisplay } from '@/shared/ui/ErrorDisplay';
import { SkeletonListItem } from '@/shared/ui/Skeleton';
import { PerformanceKpiCards } from '../components/PerformanceKpiCards';
import { PerformanceFilterBar } from '../components/PerformanceFilterBar';
import { AppraisalReviewsTable } from '../components/AppraisalReviewsTable';
import { GoalsProgressList } from '../components/GoalsProgressList';
import { SubmitReviewModal } from '../components/SubmitReviewModal';
import { CreateGoalModal } from '../components/CreateGoalModal';
import { UpdateGoalProgressModal } from '../components/UpdateGoalProgressModal';
import { ReviewDetailModal } from '../components/ReviewDetailModal';
import { PeerFeedbackModal } from '../components/PeerFeedbackModal';
import {
  useGetPerformanceStatsQuery,
  useGetReviewCyclesQuery,
  useGetAppraisalReviewsQuery,
  useGetGoalsQuery,
  useGetPeerFeedbackQuery,
} from '../api/performanceApi';
import type {
  AppraisalReview,
  GoalItem,
  PerformanceScope,
  ReviewStatus,
} from '../types/performance.types';

type HubTab = 'reviews' | 'goals' | 'feedback';

const HUB_TABS: { id: HubTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'reviews', label: 'Appraisal Reviews', icon: ClipboardList },
  { id: 'goals', label: 'Goals & OKRs', icon: Target },
  { id: 'feedback', label: 'Peer Feedback', icon: Users2 },
];

const GOAL_SCOPE_OPTIONS: { id: PerformanceScope; label: string }[] = [
  { id: 'MY', label: 'My Goals' },
  { id: 'TEAM', label: 'My Team' },
  { id: 'ALL', label: 'Organization' },
];

const formatFeedbackDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export const PerformanceHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<HubTab>('reviews');

  // ── Live data ───────────────────────────────────────────────────────────
  const {
    data: cycles,
    isLoading: isCyclesLoading,
    error: cyclesError,
    refetch: refetchCycles,
  } = useGetReviewCyclesQuery();

  // ── Review filters ──────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [scopeFilter, setScopeFilter] = useState<PerformanceScope>('MY');
  const [cycleFilter, setCycleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | 'ALL'>('ALL');
  const [goalScope, setGoalScope] = useState<PerformanceScope>('MY');

  const {
    data: stats,
    isLoading: isStatsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useGetPerformanceStatsQuery({
    cycleId: cycleFilter !== 'ALL' ? cycleFilter : undefined,
  });

  const {
    data: reviewsData,
    isLoading: isReviewsLoading,
    isFetching: isReviewsFetching,
    error: reviewsError,
    refetch: refetchReviews,
  } = useGetAppraisalReviewsQuery({
    search: searchQuery || undefined,
    status: statusFilter,
    scope: scopeFilter,
    cycleId: cycleFilter !== 'ALL' ? cycleFilter : undefined,
    limit: 100,
  });

  const {
    data: goals,
    isLoading: isGoalsLoading,
    error: goalsError,
    refetch: refetchGoals,
  } = useGetGoalsQuery({ scope: goalScope });

  const {
    data: feedbackItems,
    isLoading: isFeedbackLoading,
    error: feedbackError,
    refetch: refetchFeedback,
  } = useGetPeerFeedbackQuery();

  const reviews = reviewsData?.items || [];

  // ── Modal state ─────────────────────────────────────────────────────────
  const [submitReviewTarget, setSubmitReviewTarget] = useState<AppraisalReview | null>(null);
  const [reviewDetailTarget, setReviewDetailTarget] = useState<AppraisalReview | null>(null);
  const [goalProgressTarget, setGoalProgressTarget] = useState<GoalItem | null>(null);
  const [isCreateGoalOpen, setIsCreateGoalOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const handleResetFilters = () => {
    setSearchQuery('');
    setScopeFilter('MY');
    setCycleFilter('ALL');
    setStatusFilter('ALL');
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner with live KPIs */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-zinc-900 to-indigo-950 text-white p-6 md:p-8 border border-indigo-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
              <Gauge className="w-3.5 h-3.5" />
              <span>Performance & Growth Hub</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Talent Performance & Appraisals Center
            </h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Live appraisal cycles, competency reviews, OKR progress tracking,
              and 360-degree peer feedback — synced with the performance engine.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/5 backdrop-blur-md p-3.5 rounded-xl border border-white/10 shrink-0">
            <div className="text-center px-3 py-1.5 border-r border-white/10">
              <p className="text-xs text-slate-400 font-medium">Avg Rating</p>
              <p className="text-xl font-bold text-amber-400 inline-flex items-center gap-1">
                {isStatsLoading ? '—' : (
                  <>
                    <Star className="w-4 h-4" fill="currentColor" />
                    {(stats?.averageRating ?? 0).toFixed(1)}
                  </>
                )}
              </p>
            </div>
            <div className="text-center px-3 py-1.5 border-r border-white/10">
              <p className="text-xs text-slate-400 font-medium">Reviews Done</p>
              <p className="text-xl font-bold text-emerald-400">
                {isStatsLoading ? '—' : `${stats?.completedReviews ?? 0}/${stats?.totalReviews ?? 0}`}
              </p>
            </div>
            <div className="text-center px-3 py-1.5 border-r border-white/10">
              <p className="text-xs text-slate-400 font-medium">Goals On Track</p>
              <p className="text-xl font-bold text-cyan-400">
                {isStatsLoading ? '—' : `${Math.round(stats?.goalsOnTrackPercentage ?? 0)}%`}
              </p>
            </div>
            <div className="text-center px-3 py-1.5">
              <p className="text-xs text-slate-400 font-medium">Active PIPs</p>
              <p className="text-xl font-bold text-rose-400">
                {isStatsLoading ? '—' : stats?.activePips ?? 0}
              </p>
            </div>
          </div>
        </div>

        {/* Hub tab switcher */}
        <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {HUB_TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-150',
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 font-semibold'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* KPI strip */}
      {statsError ? (
        <ErrorDisplay
          title="Failed to Load Performance Stats"
          error={statsError}
          onRetry={() => refetchStats()}
        />
      ) : (
        <PerformanceKpiCards stats={stats} isLoading={isStatsLoading} />
      )}

      {/* ── Tab: Appraisal Reviews ─────────────────────────────────────── */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {cyclesError ? (
            <ErrorDisplay
              title="Failed to Load Review Cycles"
              error={cyclesError}
              onRetry={() => refetchCycles()}
            />
          ) : (
            <PerformanceFilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              scopeFilter={scopeFilter}
              onScopeChange={setScopeFilter}
              cycleFilter={cycleFilter}
              onCycleChange={setCycleFilter}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              cycles={cycles || []}
              onResetFilters={handleResetFilters}
              onRefresh={() => {
                refetchReviews();
                refetchStats();
              }}
              isRefreshing={isReviewsFetching && !isReviewsLoading}
            />
          )}

          {reviewsError ? (
            <ErrorDisplay
              title="Failed to Load Appraisal Reviews"
              error={reviewsError}
              onRetry={() => refetchReviews()}
            />
          ) : (
            <AppraisalReviewsTable
              reviews={reviews}
              isLoading={isReviewsLoading || isCyclesLoading}
              showEmployeeColumn={scopeFilter !== 'MY'}
              onStartReview={(review) => setSubmitReviewTarget(review)}
              onViewDetails={(review) => setReviewDetailTarget(review)}
            />
          )}
        </div>
      )}

      {/* ── Tab: Goals & OKRs ──────────────────────────────────────────── */}
      {activeTab === 'goals' && (
        <div className="space-y-4">
          <div className="inline-flex p-1 rounded-xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 text-xs font-semibold shadow-sm">
            {GOAL_SCOPE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setGoalScope(opt.id)}
                className={cn(
                  'px-3 py-1.5 rounded-lg transition-all',
                  goalScope === opt.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {goalsError ? (
            <ErrorDisplay
              title="Failed to Load Goals"
              error={goalsError}
              onRetry={() => refetchGoals()}
            />
          ) : (
            <GoalsProgressList
              goals={goals || []}
              isLoading={isGoalsLoading}
              onCreateGoal={() => setIsCreateGoalOpen(true)}
              onUpdateProgress={(goal) => setGoalProgressTarget(goal)}
            />
          )}
        </div>
      )}

      {/* ── Tab: Peer Feedback ─────────────────────────────────────────── */}
      {activeTab === 'feedback' && (
        <div className="space-y-4">
          {feedbackError ? (
            <ErrorDisplay
              title="Failed to Load Peer Feedback"
              error={feedbackError}
              onRetry={() => refetchFeedback()}
            />
          ) : (
            <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] overflow-hidden shadow-sm">
              <div className="p-4 md:p-6 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-[#ececec] flex items-center gap-2">
                    <Users2 className="w-5 h-5 text-violet-600" />
                    360-Degree Peer Feedback
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                    Live multi-rater submissions from colleagues
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setIsFeedbackOpen(true)}
                  className="text-xs bg-violet-600 hover:bg-violet-700 text-white"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Submit Feedback
                </Button>
              </div>

              {isFeedbackLoading ? (
                <div className="p-4 space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonListItem key={i} />
                  ))}
                </div>
              ) : (feedbackItems || []).length === 0 ? (
                <div className="p-12 text-center">
                  <div className="mx-auto w-14 h-14 rounded-2xl bg-violet-500/10 dark:bg-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-4">
                    <Users2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-[#ececec]">
                    No peer feedback yet
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400 max-w-sm mx-auto">
                    As colleagues submit 360-degree input, the live feed appears here.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-zinc-800/80">
                  {(feedbackItems || []).map((item) => (
                    <div key={item.id} className="px-4 md:px-6 py-4 hover:bg-gray-50/80 dark:hover:bg-zinc-800/40 transition-colors">
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <span className="text-sm font-semibold text-gray-900 dark:text-[#ececec] inline-flex items-center gap-1.5">
                          {item.fromEmployee.name}
                          <ArrowRightLeft className="w-3 h-3 text-gray-400" />
                          {item.toEmployee.name}
                        </span>
                        <span className="inline-flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={cn(
                                'w-3.5 h-3.5',
                                star <= item.rating ? 'text-amber-400' : 'text-gray-300 dark:text-zinc-600'
                              )}
                              fill="currentColor"
                            />
                          ))}
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm text-gray-600 dark:text-zinc-300 leading-relaxed">
                        {item.feedback}
                      </p>
                      <p className="mt-1 text-[11px] text-gray-400 dark:text-zinc-500">
                        {formatFeedbackDate(item.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <SubmitReviewModal
        review={submitReviewTarget}
        isOpen={Boolean(submitReviewTarget)}
        onClose={() => setSubmitReviewTarget(null)}
      />
      <ReviewDetailModal
        review={reviewDetailTarget}
        isOpen={Boolean(reviewDetailTarget)}
        onClose={() => setReviewDetailTarget(null)}
      />
      <CreateGoalModal isOpen={isCreateGoalOpen} onClose={() => setIsCreateGoalOpen(false)} />
      <UpdateGoalProgressModal
        goal={goalProgressTarget}
        isOpen={Boolean(goalProgressTarget)}
        onClose={() => setGoalProgressTarget(null)}
      />
      <PeerFeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        cycles={cycles || []}
      />
    </div>
  );
};

export default PerformanceHubPage;
