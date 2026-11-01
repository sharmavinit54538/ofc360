import React, { useState } from 'react';
import {
  UserX,
  Laptop,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ShieldAlert,
  Lock,
  Mail,
  Key,
  Database,
  Cloud,
  CheckSquare,
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
  useCompleteExitMutation,
} from '../api/exitsApi';
import type { ExitCase } from '../types/exit.types';

export const ExitAccessDeactivationPage: React.FC = () => {
  const toast = useToast();
  const { user } = useAuth();
  const userRole = user?.role || 'EMPLOYEE';
  const isAuthorized = userRole === 'IT_ADMIN' || userRole === 'HR_ADMIN' || userRole === 'SUPER_ADMIN';

  const [selectedCaseId, setSelectedCaseId] = useState<string>('');
  const [completionRemarks, setCompletionRemarks] = useState('');

  const {
    data: casesResponse,
    isLoading,
    error,
    refetch,
  } = useGetExitCasesQuery();

  const [completeExit, { isLoading: isCompleting }] = useCompleteExitMutation();

  const allCases = casesResponse?.items || [];
  const activeCases = allCases.filter(
    (c) => c.stage !== 'REJECTED' && c.stage !== 'WITHDRAWN'
  );

  const activeCase =
    activeCases.find((c) => c.id === selectedCaseId) || activeCases[0] || null;

  // Revocation system items
  const standardRevocationSystems = [
    { id: 'email', name: 'Corporate Email & Google Workspace', icon: Mail },
    { id: 'ofc360', name: 'OFC360 HRMS Portal Login', icon: UserX },
    { id: 'vpn', name: 'Enterprise Corporate VPN & Tunnels', icon: Lock },
    { id: 'cloud', name: 'Cloud Consoles (AWS / GCP / Azure)', icon: Cloud },
    { id: 'git', name: 'GitHub / GitLab Organization Repos', icon: Key },
    { id: 'internal', name: 'Internal Tools, Jira & Confluence', icon: CheckSquare },
    { id: 'db', name: 'Database & Read-Replica Credentials', icon: Database },
    { id: 'chat', name: 'Slack / Microsoft Teams Workspace', icon: Laptop },
  ];

  // Compare dates: UI refuses premature revocation before employee's LWD
  const now = new Date();
  const todayMs = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  let isPrematureRevocation = false;
  let lwdDateStr = 'TBD';

  if (activeCase?.expectedLastWorkingDay) {
    const lwdDate = new Date(activeCase.expectedLastWorkingDay);
    lwdDateStr = lwdDate.toLocaleDateString();
    const lwdMs = new Date(lwdDate.getFullYear(), lwdDate.getMonth(), lwdDate.getDate()).getTime();
    if (todayMs < lwdMs) {
      isPrematureRevocation = true;
    }
  }

  // Conditions for Final Completion
  const isManagerApproved = activeCase?.managerApproval.status === 'APPROVED';
  const isHrApproved = activeCase?.hrApproval.status === 'APPROVED';
  const isKtDone = Boolean(activeCase?.ktStatus);
  const clearances = activeCase?.clearances || [];
  const isAllClearancesDone = clearances.length > 0 && clearances.every((c) => c.status === 'CLEARED');

  // F&F pending does NOT block completion!
  const canCompleteExit =
    isManagerApproved &&
    isHrApproved &&
    isKtDone &&
    isAllClearancesDone &&
    activeCase?.stage !== 'COMPLETED';

  const handleCompleteExit = async () => {
    if (!activeCase) return;

    try {
      await completeExit({
        id: activeCase.id,
        remarks: completionRemarks.trim() || undefined,
      }).unwrap();

      toast.success(
        `Exit process successfully completed for ${activeCase.employeeName}!`,
        'Exit Finalized'
      );
      setCompletionRemarks('');
    } catch (err: any) {
      toast.error(
        err?.data?.detail || err?.data?.message || 'Failed to complete exit case',
        'Completion Error'
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <UserX className="w-5 h-5 text-brand-500" />
            <span>IT Access Revocation &amp; Exit Completion</span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-zinc-400">
            System account deactivations, security credential revoking, and final case signoff.
          </p>
        </div>
      </div>

      {/* API Notice */}
      <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-800 dark:text-amber-300">
          <span className="font-semibold">Security Integrity Policy:</span> Premature access revocation before the employee&apos;s actual Last Working Day is strictly disallowed by policy. Scheduled batch revocation endpoints are pending backend implementation.
        </div>
      </div>

      {/* Main 4 States */}
      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-44 bg-gray-100 dark:bg-zinc-900 rounded-2xl" />
          <div className="h-64 bg-gray-100 dark:bg-zinc-900 rounded-2xl" />
        </div>
      ) : error ? (
        <ErrorDisplay title="Unable to load exit cases" error={error} onRetry={refetch} />
      ) : activeCases.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717]">
          <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
            No Exit Cases Found
          </h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
            All cases are either archived or no departures are in progress.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Employee Selector */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
              Select Case ({activeCases.length})
            </h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto no-scrollbar">
              {activeCases.map((c) => {
                const isSelected = activeCase?.id === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCaseId(c.id)}
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
                      <Badge variant={c.stage === 'COMPLETED' ? 'success' : 'neutral'} size="sm">
                        {c.stage}
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

          {/* Details & Actions */}
          <div className="lg:col-span-2 space-y-5">
            {activeCase && (
              <>
                <div className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      {activeCase.employeeName}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-zinc-400 font-mono">
                      {activeCase.caseNumber} &bull; LWD: {lwdDateStr}
                    </p>
                  </div>
                  <Badge variant={activeCase.stage === 'COMPLETED' ? 'success' : 'brand'} size="sm">
                    Stage: {activeCase.stage}
                  </Badge>
                </div>

                {/* Premature Revocation Warning Banner */}
                {isPrematureRevocation && (
                  <div className="p-4 rounded-2xl bg-rose-50/80 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-rose-800 dark:text-rose-300">
                        Premature Revocation Refused by Policy
                      </h4>
                      <p className="text-xs text-rose-700 dark:text-rose-400 mt-0.5">
                        Access revocation is locked until the employee&apos;s actual Last Working Day ({lwdDateStr}). System credentials must remain intact for active notice period duties and handover tasks.
                      </p>
                    </div>
                  </div>
                )}

                {/* System Revocation List */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
                  <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                    IT Security Account Revocation Checklist
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {standardRevocationSystems.map((sys) => {
                      const Icon = sys.icon;
                      const isDeactivated = activeCase.isDeactivated || activeCase.stage === 'COMPLETED';

                      return (
                        <div
                          key={sys.id}
                          className="p-3 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className="w-4 h-4 text-gray-400" />
                            <span className="font-semibold text-gray-800 dark:text-gray-200">
                              {sys.name}
                            </span>
                          </div>
                          <Badge
                            variant={isDeactivated ? 'success' : 'neutral'}
                            size="sm"
                          >
                            {isDeactivated ? 'Revoked' : 'Active'}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Final Case Completion Gate */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                      Final Exit Completion Gate
                    </h4>
                    <span className="text-[11px] text-gray-400">
                      F&amp;F settlement pending does not block completion
                    </span>
                  </div>

                  {/* Criteria Checklist */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 flex items-center justify-between">
                      <span>Manager Approval</span>
                      {isManagerApproved ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                      )}
                    </div>
                    <div className="p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 flex items-center justify-between">
                      <span>HR Approval</span>
                      {isHrApproved ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                      )}
                    </div>
                    <div className="p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 flex items-center justify-between">
                      <span>Knowledge Transfer</span>
                      {isKtDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                      )}
                    </div>
                    <div className="p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 flex items-center justify-between">
                      <span>5 Clearances</span>
                      {isAllClearancesDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                      )}
                    </div>
                  </div>

                  {activeCase.stage !== 'COMPLETED' && isAuthorized && (
                    <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                      <Input
                        placeholder="Final exit completion notes / archives remarks..."
                        value={completionRemarks}
                        onChange={(e) => setCompletionRemarks(e.target.value)}
                        className="text-xs sm:max-w-md"
                      />

                      <Button
                        variant="primary"
                        size="sm"
                        disabled={!canCompleteExit || isCompleting}
                        onClick={handleCompleteExit}
                        className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white whitespace-nowrap"
                        title={
                          !canCompleteExit
                            ? 'All approvals, KT, and clearances must be cleared first'
                            : 'Formally complete employee exit'
                        }
                      >
                        {isCompleting ? 'Completing...' : 'Formally Complete Exit Case'}
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExitAccessDeactivationPage;
