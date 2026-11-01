import React, { useState } from 'react';
import {
  MessageSquare,
  Star,
  CheckCircle2,
  Lock,
  ThumbsUp,
  ThumbsDown,
  User,
  Building,
  Calendar,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { Input } from '@/shared/ui/Input';
import { ErrorDisplay } from '@/shared/ui/ErrorDisplay';
import { useToast } from '@/shared/ui/Toast';
import {
  useGetExitCasesQuery,
  useSubmitExitInterviewMutation,
} from '../api/exitsApi';
import type { ExitCase } from '../types/exit.types';

export const ExitInterviewPage: React.FC = () => {
  const toast = useToast();
  const { user } = useAuth();
  const userRole = user?.role || 'EMPLOYEE';
  const isAuthorized = userRole === 'HR_ADMIN' || userRole === 'SUPER_ADMIN';

  const [selectedCaseId, setSelectedCaseId] = useState<string>('');
  const [reasonForLeaving, setReasonForLeaving] = useState('');
  const [workEnvironmentRating, setWorkEnvironmentRating] = useState(4);
  const [managerBehaviourRating, setManagerBehaviourRating] = useState(4);
  const [salaryBenefitsRating, setSalaryBenefitsRating] = useState(4);
  const [careerGrowthRating, setCareerGrowthRating] = useState(4);
  const [whatShouldImprove, setWhatShouldImprove] = useState('');
  const [wouldRejoin, setWouldRejoin] = useState(true);
  const [additionalComments, setAdditionalComments] = useState('');

  const {
    data: casesResponse,
    isLoading,
    error,
    refetch,
  } = useGetExitCasesQuery();

  const [submitInterview, { isLoading: isSubmitting }] = useSubmitExitInterviewMutation();

  // Strict RBAC: Manager and other roles are forbidden from viewing interview answers
  if (!isAuthorized) {
    return (
      <div className="p-12 text-center rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
          Confidential Feedback — Access Restricted
        </h3>
        <p className="text-xs text-gray-500 dark:text-zinc-400 max-w-md mx-auto">
          Exit interview feedback and manager behavioral ratings are strictly confidential and accessible only to HR Administration and Super Admins.
        </p>
      </div>
    );
  }

  const allCases = casesResponse?.items || [];
  const activeCases = allCases.filter(
    (c) => c.stage !== 'REJECTED' && c.stage !== 'WITHDRAWN'
  );

  const activeCase =
    activeCases.find((c) => c.id === selectedCaseId) || activeCases[0] || null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCase) return;

    if (!reasonForLeaving.trim()) {
      toast.warning('Reason for leaving is required.', 'Validation');
      return;
    }
    if (!whatShouldImprove.trim() || whatShouldImprove.trim().length < 5) {
      toast.warning('Suggestions for improvement must be at least 5 characters.', 'Validation');
      return;
    }

    try {
      await submitInterview({
        id: activeCase.id,
        reasonForLeaving: reasonForLeaving.trim(),
        workEnvironmentRating,
        managerBehaviourRating,
        salaryBenefitsRating,
        careerGrowthRating,
        whatShouldImprove: whatShouldImprove.trim(),
        wouldRejoin,
        additionalComments: additionalComments.trim() || undefined,
      }).unwrap();

      toast.success(
        `Exit interview recorded successfully for ${activeCase.employeeName}!`,
        'Interview Saved'
      );
    } catch (err: any) {
      toast.error(
        err?.data?.detail || err?.data?.message || 'Failed to submit exit interview',
        'Submission Error'
      );
    }
  };

  const interview = activeCase?.interview;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-brand-500" />
            <span>Confidential Exit Interviews</span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-zinc-400">
            Workplace culture feedback, manager dynamics, compensation ratings, and retention insights.
          </p>
        </div>

        <Badge variant="brand" size="sm" className="font-semibold">
          HR &amp; SUPER ADMIN CONFIDENTIAL
        </Badge>
      </div>

      {/* Main 4 States */}
      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-44 bg-gray-100 dark:bg-zinc-900 rounded-2xl" />
          <div className="h-64 bg-gray-100 dark:bg-zinc-900 rounded-2xl" />
        </div>
      ) : error ? (
        <ErrorDisplay title="Unable to load exit interview cases" error={error} onRetry={refetch} />
      ) : activeCases.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717]">
          <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
            No Exit Cases Found
          </h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
            There are currently no cases requiring exit interviews.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Case Selector */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
              Departing Employees ({activeCases.length})
            </h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto no-scrollbar">
              {activeCases.map((c) => {
                const isSelected = activeCase?.id === c.id;
                const hasInterview = Boolean(c.interview);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setSelectedCaseId(c.id);
                      if (c.interview) {
                        setReasonForLeaving(c.interview.reasonForLeaving);
                        setWorkEnvironmentRating(c.interview.workEnvironmentRating);
                        setManagerBehaviourRating(c.interview.managerBehaviourRating);
                        setSalaryBenefitsRating(c.interview.salaryBenefitsRating);
                        setCareerGrowthRating(c.interview.careerGrowthRating);
                        setWhatShouldImprove(c.interview.whatShouldImprove);
                        setWouldRejoin(c.interview.wouldRejoin);
                        setAdditionalComments(c.interview.additionalComments || '');
                      } else {
                        setReasonForLeaving(c.reason);
                        setWhatShouldImprove('');
                        setAdditionalComments('');
                      }
                    }}
                    className={`w-full p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-brand-500 bg-brand-50/20 dark:bg-brand-950/20 shadow-xs'
                        : 'border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-gray-900 dark:text-gray-100">
                        {c.employeeName}
                      </span>
                      <Badge variant={hasInterview ? 'success' : 'neutral'} size="sm">
                        {hasInterview ? 'Recorded' : 'Pending'}
                      </Badge>
                    </div>
                    <div className="text-[11px] text-gray-500 dark:text-zinc-400 mt-1">
                      {c.caseNumber} &bull; {c.department}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interview Details / Form */}
          <div className="lg:col-span-2 space-y-6">
            {activeCase && (
              <>
                <div className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      {activeCase.employeeName}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-zinc-400 font-mono">
                      {activeCase.caseNumber} &bull; {activeCase.designation} &bull; Mgr: {activeCase.managerName}
                    </p>
                  </div>
                  {interview ? (
                    <Badge variant="success" size="sm" className="gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Interview Completed
                    </Badge>
                  ) : (
                    <Badge variant="warning" size="sm">
                      Awaiting Response
                    </Badge>
                  )}
                </div>

                {/* Form / Recorded View */}
                <form
                  onSubmit={handleSubmit}
                  className="p-6 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4"
                >
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                      Primary Reason for Leaving *
                    </label>
                    <Input
                      value={reasonForLeaving}
                      onChange={(e) => setReasonForLeaving(e.target.value)}
                      placeholder="e.g. Higher compensation, relocation, career pivot..."
                      className="text-xs"
                      required
                    />
                  </div>

                  {/* 4 Ratings Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300">
                        Work Environment &amp; Culture (1-5)
                      </label>
                      <select
                        value={workEnvironmentRating}
                        onChange={(e) => setWorkEnvironmentRating(Number(e.target.value))}
                        className="w-full text-xs p-2 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-800"
                      >
                        {[5, 4, 3, 2, 1].map((r) => (
                          <option key={r} value={r}>
                            {r} Stars — {r === 5 ? 'Exceptional' : r === 4 ? 'Good' : r === 3 ? 'Average' : 'Needs Improvement'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300">
                        Reporting Manager Dynamics (1-5)
                      </label>
                      <select
                        value={managerBehaviourRating}
                        onChange={(e) => setManagerBehaviourRating(Number(e.target.value))}
                        className="w-full text-xs p-2 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-800"
                      >
                        {[5, 4, 3, 2, 1].map((r) => (
                          <option key={r} value={r}>
                            {r} Stars — {r === 5 ? 'Highly Supportive' : r === 4 ? 'Effective' : r === 3 ? 'Neutral' : 'Unsupportive'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300">
                        Compensation &amp; Benefits (1-5)
                      </label>
                      <select
                        value={salaryBenefitsRating}
                        onChange={(e) => setSalaryBenefitsRating(Number(e.target.value))}
                        className="w-full text-xs p-2 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-800"
                      >
                        {[5, 4, 3, 2, 1].map((r) => (
                          <option key={r} value={r}>
                            {r} Stars — {r === 5 ? 'Market Leading' : r === 4 ? 'Competitive' : r === 3 ? 'Fair' : 'Below Expectation'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300">
                        Career Growth &amp; Learning (1-5)
                      </label>
                      <select
                        value={careerGrowthRating}
                        onChange={(e) => setCareerGrowthRating(Number(e.target.value))}
                        className="w-full text-xs p-2 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-800"
                      >
                        {[5, 4, 3, 2, 1].map((r) => (
                          <option key={r} value={r}>
                            {r} Stars — {r === 5 ? 'High Growth' : r === 4 ? 'Good Learning' : r === 3 ? 'Stagnant' : 'No Growth'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                      What could the organization improve? * (min 5 characters)
                    </label>
                    <textarea
                      rows={3}
                      value={whatShouldImprove}
                      onChange={(e) => setWhatShouldImprove(e.target.value)}
                      placeholder="Feedback on management, process efficiency, team communication..."
                      className="w-full text-xs p-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 resize-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                      Additional Comments / Reflections
                    </label>
                    <textarea
                      rows={2}
                      value={additionalComments}
                      onChange={(e) => setAdditionalComments(e.target.value)}
                      placeholder="Optional parting notes or reflections..."
                      className="w-full text-xs p-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={wouldRejoin}
                        onChange={(e) => setWouldRejoin(e.target.checked)}
                        className="rounded text-brand-600 focus:ring-brand-500"
                      />
                      <span>Would recommend OFC360 or consider rejoining in future</span>
                    </label>

                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      disabled={isSubmitting || whatShouldImprove.trim().length < 5}
                      className="text-xs bg-brand-600 hover:bg-brand-700 text-white"
                    >
                      {isSubmitting ? 'Saving...' : 'Save Exit Interview Record'}
                    </Button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExitInterviewPage;
