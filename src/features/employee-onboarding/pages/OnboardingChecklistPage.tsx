import React, { useState, useMemo } from 'react';
import { Search, RefreshCw, X, Shield } from 'lucide-react';
import { ErrorDisplay } from '@/shared/ui/ErrorDisplay';
import { useToast } from '@/shared/ui/Toast';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  useGetOnboardingChecklistQuery,
  useGetNewHiresListQuery,
} from '../api/onboardingApi';
import type {
  OnboardingTaskCategory,
  OnboardingTask,
} from '../types/onboarding.types';
import { OnboardingProgressCard } from '../components/OnboardingProgressCard';
import { OnboardingTaskCategoryTabs } from '../components/OnboardingTaskCategoryTabs';
import { OnboardingTaskList } from '../components/OnboardingTaskList';
import { AdminVerificationModal } from '../components/AdminVerificationModal';
import { NewHireSelector } from '../components/NewHireSelector';

export const OnboardingChecklistPage: React.FC = () => {
  const toast = useToast();
  const { user, activeRole } = useAuth();

  const isHRorAdmin =
    activeRole === 'HR_ADMIN' ||
    activeRole === 'SUPER_ADMIN' ||
    activeRole === 'MANAGER' ||
    user?.role === 'HR_ADMIN' ||
    user?.role === 'SUPER_ADMIN';

  // Filter States
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | undefined>(undefined);
  const [activeCategory, setActiveCategory] = useState<OnboardingTaskCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdminReviewMode, setIsAdminReviewMode] = useState<boolean>(isHRorAdmin);

  // Modal State
  const [selectedTaskForVerify, setSelectedTaskForVerify] = useState<OnboardingTask | null>(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  // Queries
  const {
    data: newHiresData,
    isLoading: isNewHiresLoading,
  } = useGetNewHiresListQuery(undefined, { skip: !isHRorAdmin });

  const effectiveEmployeeId = selectedEmployeeId || (isHRorAdmin && newHiresData?.[0]?.employeeId) || undefined;

  const {
    data: checklistData,
    isLoading: isChecklistLoading,
    isFetching: isChecklistFetching,
    error: checklistError,
    refetch: refetchChecklist,
  } = useGetOnboardingChecklistQuery(effectiveEmployeeId);

  const handleRefresh = () => {
    refetchChecklist();
    toast.info('Refreshed onboarding checklist from server', 'Syncing Data');
  };

  const handleOpenVerify = (task: OnboardingTask) => {
    setSelectedTaskForVerify(task);
    setIsVerifyModalOpen(true);
  };

  const tasks = checklistData?.tasks || [];

  // Filtered Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      // Category match
      if (activeCategory !== 'ALL' && t.category !== activeCategory) {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesDesc = t.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc) return false;
      }
      return true;
    });
  }, [tasks, activeCategory, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Controls: HR Admin Switcher & Mode Toggle */}
      {isHRorAdmin && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-gray-50/70 dark:bg-[#1a1a1a] border border-gray-200 dark:border-zinc-800">
          <NewHireSelector
            newHires={newHiresData || []}
            selectedEmployeeId={effectiveEmployeeId}
            onSelectEmployee={setSelectedEmployeeId}
            isLoading={isNewHiresLoading}
          />

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => setIsAdminReviewMode((prev) => !prev)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isAdminReviewMode
                  ? 'bg-brand-600 text-white'
                  : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border border-gray-200 dark:border-zinc-700'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{isAdminReviewMode ? 'HR Verification Mode' : 'New Hire View'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Progress Card */}
      <OnboardingProgressCard
        employee={checklistData?.employee}
        progress={checklistData?.progress}
        isLoading={isChecklistLoading}
      />

      {/* Search & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search milestones, guidelines, or requirements..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-[#212121] text-gray-900 dark:text-[#ececec] placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isChecklistFetching}
            className="p-2 rounded-xl text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-[#212121] hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
            title="Refresh checklist milestones"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isChecklistFetching ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <OnboardingTaskCategoryTabs
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        tasks={tasks}
      />

      {/* Error or Task List */}
      {checklistError ? (
        <ErrorDisplay
          title="Unable to load onboarding checklist"
          error={checklistError}
          onRetry={refetchChecklist}
        />
      ) : (
        <OnboardingTaskList
          tasks={filteredTasks}
          employeeId={effectiveEmployeeId}
          isAdmin={isAdminReviewMode}
          onAdminVerify={handleOpenVerify}
        />
      )}

      {/* Admin Verification Modal */}
      <AdminVerificationModal
        task={selectedTaskForVerify}
        employeeId={effectiveEmployeeId}
        isOpen={isVerifyModalOpen}
        onClose={() => {
          setIsVerifyModalOpen(false);
          setSelectedTaskForVerify(null);
        }}
      />
    </div>
  );
};

export default OnboardingChecklistPage;
