import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Building,
  Laptop,
  CreditCard,
  FileCheck,
  User,
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
  useSubmitClearanceSignoffMutation,
} from '../api/exitsApi';
import type {
  ExitCase,
  ClearanceDepartment,
  ClearanceStatus,
  DepartmentClearanceItem,
} from '../types/exit.types';

export const ExitClearancePage: React.FC = () => {
  const toast = useToast();
  const { user } = useAuth();
  const userRole = user?.role || 'EMPLOYEE';

  // Selected clearance action modal state
  const [activeSignoff, setActiveSignoff] = useState<{
    exitCase: ExitCase;
    dept: ClearanceDepartment;
    currentClearance: DepartmentClearanceItem;
  } | null>(null);

  const [signoffStatus, setSignoffStatus] = useState<ClearanceStatus>('CLEARED');
  const [signoffReason, setSignoffReason] = useState('');
  const [signoffRemarks, setSignoffRemarks] = useState('');
  const [deptFilter, setDeptFilter] = useState<ClearanceDepartment | 'ALL'>('ALL');

  const {
    data: casesResponse,
    isLoading,
    error,
    refetch,
  } = useGetExitCasesQuery();

  const [submitClearance, { isLoading: isSubmitting }] = useSubmitClearanceSignoffMutation();

  const allCases = casesResponse?.items || [];
  const activeCases = allCases.filter(
    (c) => c.stage !== 'COMPLETED' && c.stage !== 'REJECTED' && c.stage !== 'WITHDRAWN'
  );

  const canSignDept = (dept: ClearanceDepartment): boolean => {
    if (userRole === 'SUPER_ADMIN') return true;
    if (userRole === 'HR_ADMIN') return true; // HR_ADMIN signs on behalf of Finance and Admin
    if (userRole === 'MANAGER' && dept === 'MANAGER') return true;
    if (userRole === 'IT_ADMIN' && dept === 'IT') return true;
    return false;
  };

  const handleOpenSignoff = (exitCase: ExitCase, clearance: DepartmentClearanceItem) => {
    setActiveSignoff({
      exitCase,
      dept: clearance.department,
      currentClearance: clearance,
    });
    setSignoffStatus(clearance.status === 'PENDING' ? 'CLEARED' : clearance.status);
    setSignoffReason(clearance.reason || '');
    setSignoffRemarks(clearance.remarks || '');
  };

  const handleConfirmSignoff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSignoff) return;

    if ((signoffStatus === 'ON_HOLD' || signoffStatus === 'REJECTED') && (!signoffReason || signoffReason.trim().length < 5)) {
      toast.warning('A reason (minimum 5 characters) is required when holding or rejecting clearance.', 'Validation');
      return;
    }

    try {
      await submitClearance({
        id: activeSignoff.exitCase.id,
        department: activeSignoff.dept,
        status: signoffStatus,
        remarks: signoffRemarks.trim() || undefined,
        reason: signoffReason.trim() || undefined,
      }).unwrap();

      toast.success(
        `${activeSignoff.dept} clearance sign-off recorded as ${signoffStatus} for ${activeSignoff.exitCase.employeeName}!`,
        'Clearance Updated'
      );
      setActiveSignoff(null);
    } catch (err: any) {
      toast.error(
        err?.data?.detail || err?.data?.message || 'Failed to submit clearance sign-off',
        'Action Error'
      );
    }
  };

  const getDeptIcon = (dept: ClearanceDepartment) => {
    switch (dept) {
      case 'MANAGER':
        return <User className="w-4 h-4 text-amber-500" />;
      case 'IT':
        return <Laptop className="w-4 h-4 text-blue-500" />;
      case 'FINANCE':
        return <CreditCard className="w-4 h-4 text-emerald-500" />;
      case 'ADMIN':
        return <Building className="w-4 h-4 text-purple-500" />;
      case 'HR':
        return <FileCheck className="w-4 h-4 text-rose-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-500" />
            <span>Departmental Clearances (5 Departments)</span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-zinc-400">
            Sign-offs required across Manager, IT, Finance, Administration, and Human Resources.
          </p>
        </div>

        {/* Department Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Filter Dept:</span>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-200"
          >
            <option value="ALL">All Departments</option>
            <option value="MANAGER">Manager</option>
            <option value="IT">IT Department</option>
            <option value="FINANCE">Finance (On-behalf)</option>
            <option value="ADMIN">Administration (On-behalf)</option>
            <option value="HR">Human Resources</option>
          </select>
        </div>
      </div>

      {/* Role Delegation Notice */}
      <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 flex items-start gap-3">
        <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-blue-800 dark:text-blue-300">
          <span className="font-semibold">Sign-off Delegation Notice:</span> System roles are `SUPER_ADMIN`, `HR_ADMIN`, `MANAGER`, `EMPLOYEE`, and `IT_ADMIN`. Finance and Administration sign-offs are signed off by HR_ADMIN / SUPER_ADMIN on behalf of those administrative units.
        </div>
      </div>

      {/* 4 States */}
      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-44 bg-gray-100 dark:bg-zinc-900 rounded-2xl" />
          <div className="h-44 bg-gray-100 dark:bg-zinc-900 rounded-2xl" />
        </div>
      ) : error ? (
        <ErrorDisplay title="Unable to load clearance workflow" error={error} onRetry={refetch} />
      ) : activeCases.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717]">
          <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
            All Clearances Complete
          </h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
            No pending departmental sign-offs for departing employees.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {activeCases.map((exitCase) => {
            const clearances = exitCase.clearances || [];
            const clearedCount = clearances.filter((c) => c.status === 'CLEARED').length;
            const isAllCleared = clearedCount === 5;

            const visibleClearances = clearances.filter(
              (c) => deptFilter === 'ALL' || c.department === deptFilter
            );

            return (
              <div
                key={exitCase.id}
                className="p-6 rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm space-y-5"
              >
                {/* Case Header & No Dues Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-zinc-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-900 dark:text-gray-100">
                        {exitCase.employeeName}
                      </span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400">
                        {exitCase.caseNumber}
                      </span>
                      <Badge variant="brand" size="sm">
                        LWD: {exitCase.expectedLastWorkingDay ? new Date(exitCase.expectedLastWorkingDay).toLocaleDateString() : 'TBD'}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                      {exitCase.designation} &bull; {exitCase.department} &bull; Mgr: {exitCase.managerName}
                    </p>
                  </div>

                  {/* No Dues Indicator */}
                  <div>
                    {isAllCleared ? (
                      <Badge variant="success" size="md" className="gap-1.5 font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        No Dues Certificate: Approved
                      </Badge>
                    ) : (
                      <Badge variant="warning" size="md" className="gap-1.5 font-bold">
                        <Clock className="w-4 h-4" />
                        Dues Pending: {clearedCount}/5 Cleared
                      </Badge>
                    )}
                  </div>
                </div>

                {/* 5 Department Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {visibleClearances.map((c) => {
                    const isPermitted = canSignDept(c.department);

                    let cardBorder = 'border-gray-200 dark:border-zinc-800';
                    let statusBadgeVariant: 'success' | 'warning' | 'error' | 'neutral' = 'neutral';

                    if (c.status === 'CLEARED') {
                      cardBorder = 'border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/20';
                      statusBadgeVariant = 'success';
                    } else if (c.status === 'ON_HOLD') {
                      cardBorder = 'border-amber-200 dark:border-amber-900/40 bg-amber-50/20';
                      statusBadgeVariant = 'warning';
                    } else if (c.status === 'REJECTED') {
                      cardBorder = 'border-rose-200 dark:border-rose-900/40 bg-rose-50/20';
                      statusBadgeVariant = 'error';
                    }

                    return (
                      <div
                        key={c.department}
                        className={`p-3.5 rounded-xl border flex flex-col justify-between ${cardBorder}`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5 font-bold text-xs text-gray-900 dark:text-gray-100">
                              {getDeptIcon(c.department)}
                              <span>{c.department}</span>
                            </div>
                            <Badge variant={statusBadgeVariant} size="sm">
                              {c.status}
                            </Badge>
                          </div>

                          {c.remarks && (
                            <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-1 line-clamp-2">
                              {c.remarks}
                            </p>
                          )}

                          {c.reason && (
                            <p className="text-[11px] text-rose-500 font-medium mt-1">
                              Reason: {c.reason}
                            </p>
                          )}
                        </div>

                        <div className="pt-3 mt-2 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                          <span className="text-[10px] text-gray-400">
                            {c.signedByName || (c.status === 'CLEARED' ? 'Signed' : 'Awaiting')}
                          </span>

                          {isPermitted ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenSignoff(exitCase, c)}
                              className="text-[11px] h-6 px-2"
                            >
                              Sign-off
                            </Button>
                          ) : (
                            <span className="text-[10px] text-gray-400 italic">No access</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Clearance Signoff Modal */}
      {activeSignoff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
          <div
            className="w-full max-w-md bg-white dark:bg-[#171717] rounded-3xl border border-gray-200 dark:border-zinc-800 p-6 shadow-2xl space-y-4"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-900 dark:text-[#ececec]">
                  {activeSignoff.dept} Clearance Sign-off
                </h4>
                <p className="text-xs text-gray-500 dark:text-zinc-400">
                  Employee: {activeSignoff.exitCase.employeeName} ({activeSignoff.exitCase.caseNumber})
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmSignoff} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                  Clearance Action Status *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'CLEARED', label: 'Clear', color: 'bg-emerald-50 text-emerald-700 border-emerald-300' },
                    { id: 'ON_HOLD', label: 'Hold', color: 'bg-amber-50 text-amber-700 border-amber-300' },
                    { id: 'REJECTED', label: 'Reject', color: 'bg-rose-50 text-rose-700 border-rose-300' },
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      type="button"
                      onClick={() => setSignoffStatus(btn.id as any)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                        signoffStatus === btn.id
                          ? `${btn.color} ring-2 ring-brand-500/30`
                          : 'border-gray-200 text-gray-600 dark:border-zinc-800 dark:text-zinc-400'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {(signoffStatus === 'ON_HOLD' || signoffStatus === 'REJECTED') && (
                <div>
                  <label className="block text-xs font-semibold text-rose-600 dark:text-rose-400 mb-1">
                    Hold / Rejection Reason * (minimum 5 characters)
                  </label>
                  <textarea
                    rows={3}
                    value={signoffReason}
                    onChange={(e) => setSignoffReason(e.target.value)}
                    placeholder="Specify the outstanding dues, unreturned assets, or pending deliverables..."
                    className="w-full text-xs p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/20 dark:bg-rose-950/20 focus:ring-2 focus:ring-rose-500 resize-none"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                  Optional Remarks / Reference Notes
                </label>
                <Input
                  value={signoffRemarks}
                  onChange={(e) => setSignoffRemarks(e.target.value)}
                  placeholder="e.g. Verified zero dues, all obligations settled..."
                  className="text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveSignoff(null)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={
                    isSubmitting ||
                    ((signoffStatus === 'ON_HOLD' || signoffStatus === 'REJECTED') &&
                      signoffReason.trim().length < 5)
                  }
                  className="text-xs bg-brand-600 hover:bg-brand-700 text-white"
                >
                  {isSubmitting ? 'Saving...' : 'Submit Sign-off'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExitClearancePage;
