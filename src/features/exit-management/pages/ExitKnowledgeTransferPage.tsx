import React, { useState } from 'react';
import {
  FileCheck,
  CheckCircle2,
  Clock,
  User,
  CheckSquare,
  AlertTriangle,
  Info,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { Input } from '@/shared/ui/Input';
import { ErrorDisplay } from '@/shared/ui/ErrorDisplay';
import { useToast } from '@/shared/ui/Toast';
import {
  useGetExitCasesQuery,
  useCompleteKnowledgeTransferMutation,
} from '../api/exitsApi';
import type { ExitCase } from '../types/exit.types';

export const ExitKnowledgeTransferPage: React.FC = () => {
  const toast = useToast();
  const { user } = useAuth();
  const userRole = user?.role || 'EMPLOYEE';
  const isManagerOrAdmin = userRole === 'MANAGER' || userRole === 'HR_ADMIN' || userRole === 'SUPER_ADMIN';

  const [ktRemarks, setKtRemarks] = useState<Record<string, string>>({});

  const {
    data: casesResponse,
    isLoading,
    error,
    refetch,
  } = useGetExitCasesQuery();

  const [completeKt, { isLoading: isCompleting }] = useCompleteKnowledgeTransferMutation();

  const allCases = casesResponse?.items || [];
  const activeCases = allCases.filter(
    (c) => c.stage !== 'COMPLETED' && c.stage !== 'REJECTED' && c.stage !== 'WITHDRAWN'
  );

  const defaultKtItems = [
    { title: 'Project Overview & Architecture Handoff', category: 'Project' },
    { title: 'Code Repository & Git Credentials Access Reassignment', category: 'Code Repository' },
    { title: 'Technical Documentation & Runbook Updates', category: 'Documentation' },
    { title: 'Client / External Stakeholder Relationship Handover', category: 'Client' },
    { title: 'Outstanding Tickets & Pending Sprints Reassignment', category: 'Pending Tasks' },
    { title: 'Peer / Replacement Employee Training & Shadowing', category: 'New Employee Training' },
    { title: 'Final Manager Knowledge Transfer Verification', category: 'Final Verification' },
  ];

  const handleMarkComplete = async (exitCase: ExitCase) => {
    try {
      await completeKt({
        id: exitCase.id,
        remarks: ktRemarks[exitCase.id]?.trim() || undefined,
      }).unwrap();

      toast.success(
        `Knowledge Transfer for ${exitCase.employeeName} has been verified and marked as complete!`,
        'KT Sign-off Complete'
      );
    } catch (err: any) {
      toast.error(
        err?.data?.detail || err?.data?.message || 'Failed to complete Knowledge Transfer',
        'Action Error'
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-brand-500" />
            <span>Knowledge Transfer &amp; Handover</span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-zinc-400">
            Verify handover of code repositories, project assets, documentation, and client transitions.
          </p>
        </div>
      </div>

      {/* API Gap Notification */}
      <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-800 dark:text-amber-300">
          <span className="font-semibold">Task-Level KT Tracking Pending:</span> The backend does not expose granular task-level endpoints (&apos;/exits/:id/kt-tasks&apos;). The 7 standard handover categories are displayed as guidance; managers sign off on the overall KT handover below.
        </div>
      </div>

      {/* 4 States */}
      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-44 bg-gray-100 dark:bg-zinc-900 rounded-2xl" />
          <div className="h-44 bg-gray-100 dark:bg-zinc-900 rounded-2xl" />
        </div>
      ) : error ? (
        <ErrorDisplay title="Unable to load Knowledge Transfer data" error={error} onRetry={refetch} />
      ) : activeCases.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717]">
          <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
            No Active Knowledge Transfers
          </h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
            All departing employees have completed handover protocols.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {activeCases.map((exitCase) => {
            const hasPayloadTasks = exitCase.ktTasks && exitCase.ktTasks.length > 0;
            const isCompleted = exitCase.ktStatus;

            return (
              <div
                key={exitCase.id}
                className="p-6 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm space-y-5"
              >
                {/* Employee Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-zinc-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-900 dark:text-gray-100">
                        {exitCase.employeeName}
                      </span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400">
                        {exitCase.caseNumber}
                      </span>
                      {isCompleted ? (
                        <Badge variant="success" size="sm" className="gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          KT Complete &amp; Verified
                        </Badge>
                      ) : (
                        <Badge variant="warning" size="sm" className="gap-1">
                          <Clock className="w-3 h-3" />
                          Handover Pending
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                      {exitCase.designation} &bull; {exitCase.department} &bull; Reporting Manager: {exitCase.managerName}
                    </p>
                  </div>

                  <span className="text-xs text-gray-400">
                    LWD: {exitCase.expectedLastWorkingDay ? new Date(exitCase.expectedLastWorkingDay).toLocaleDateString() : 'TBD'}
                  </span>
                </div>

                {/* 7-Task Checklist (Real tasks if present in payload, otherwise standard guidance) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-700 dark:text-zinc-300">
                    <span>Handover Deliverables</span>
                    <span className="text-gray-400 font-normal">
                      {hasPayloadTasks ? 'Server Task-List' : 'Standard 7-Point Checklist (Guidance)'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {(hasPayloadTasks ? exitCase.ktTasks : defaultKtItems).map((task, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50/70 dark:bg-zinc-900/60 flex items-start gap-2.5"
                      >
                        <div className="p-1 rounded bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-brand-600 dark:text-brand-400 mt-0.5">
                          <CheckSquare className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="font-semibold text-gray-800 dark:text-gray-200 block">
                            {task.title}
                          </span>
                          <span className="text-[11px] text-gray-400">
                            Category: {task.category}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sign-off Action Bar */}
                {!isCompleted && isManagerOrAdmin && (
                  <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <Input
                      placeholder="Manager KT verification remarks (e.g. Code reviewed, documentation verified)..."
                      value={ktRemarks[exitCase.id] || ''}
                      onChange={(e) =>
                        setKtRemarks((prev) => ({ ...prev, [exitCase.id]: e.target.value }))
                      }
                      className="text-xs sm:max-w-md"
                    />

                    <Button
                      variant="primary"
                      size="sm"
                      disabled={isCompleting}
                      onClick={() => handleMarkComplete(exitCase)}
                      className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 whitespace-nowrap"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isCompleting ? 'Signing off...' : 'Mark KT Complete (Manager Signoff)'}</span>
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExitKnowledgeTransferPage;
