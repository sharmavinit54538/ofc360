import React, { useState } from 'react';
import {
  History,
  CheckCircle2,
  Search,
  FileCheck,
  CreditCard,
  Building,
  User,
  Info,
  Calendar,
  Download,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { Input } from '@/shared/ui/Input';
import { ErrorDisplay } from '@/shared/ui/ErrorDisplay';
import { useGetExitCasesQuery } from '../api/exitsApi';
import type { ExitCase } from '../types/exit.types';

export const ExitedEmployeesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: casesResponse,
    isLoading,
    error,
    refetch,
  } = useGetExitCasesQuery();

  const allCases = casesResponse?.items || [];
  const completedCases = allCases.filter(
    (c) => c.stage === 'COMPLETED' || c.exitStatus === 'COMPLETED'
  );

  const filteredCases = completedCases.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.employeeName.toLowerCase().includes(q) ||
      c.caseNumber.toLowerCase().includes(q) ||
      c.department.toLowerCase().includes(q) ||
      c.designation.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <History className="w-5 h-5 text-brand-500" />
            <span>Exited Employees &amp; Post-Exit Archives</span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-zinc-400">
            Historical records of separated employees, final document issuance, and settlement audit trails.
          </p>
        </div>

        <Badge variant="brand" size="sm">
          {completedCases.length} Completed Exits
        </Badge>
      </div>

      {/* API Gap Banner */}
      <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-800 dark:text-amber-300">
          <span className="font-semibold">Post-Exit Feature Notice:</span> Rehire eligibility ratings, Alumni network portal registration, and statutory document retention schedules require dedicated backend routes (API Gap #6) and are rendered as read-only.
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400 pointer-events-none" />
        <Input
          placeholder="Search by exited employee name, case ID, department..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 text-xs"
        />
      </div>

      {/* 4 States */}
      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-32 bg-gray-100 dark:bg-zinc-900 rounded-2xl" />
          <div className="h-32 bg-gray-100 dark:bg-zinc-900 rounded-2xl" />
        </div>
      ) : error ? (
        <ErrorDisplay title="Unable to load exited employees archive" error={error} onRetry={refetch} />
      ) : filteredCases.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717]">
          <History className="w-10 h-10 mx-auto text-gray-300 dark:text-zinc-600 mb-2" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
            No Exited Employee Records Found
          </h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
            Completed exit cases will automatically be archived into this directory.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white dark:bg-[#171717] border border-gray-200 dark:border-zinc-800 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-zinc-800 bg-gray-50/75 dark:bg-zinc-900/50 text-gray-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Employee Details</th>
                  <th className="py-3 px-4">Departure Date</th>
                  <th className="py-3 px-4">Reason for Exit</th>
                  <th className="py-3 px-4">Document Package</th>
                  <th className="py-3 px-4">F&amp;F Settlement</th>
                  <th className="py-3 px-4">Rehire Eligibility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/60">
                {filteredCases.map((exitCase) => {
                  const isFnfPaid = exitCase.fnfStatus === 'PAID';
                  const docCount = exitCase.documents?.length || 0;

                  return (
                    <tr key={exitCase.id} className="hover:bg-gray-50/60 dark:hover:bg-zinc-800/30">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                          {exitCase.employeeName}
                        </div>
                        <div className="text-[11px] font-mono text-gray-500 dark:text-zinc-400">
                          {exitCase.caseNumber} &bull; {exitCase.designation} &bull; {exitCase.department}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-gray-700 dark:text-zinc-300">
                        {exitCase.completedAt
                          ? new Date(exitCase.completedAt).toLocaleDateString()
                          : exitCase.expectedLastWorkingDay
                          ? new Date(exitCase.expectedLastWorkingDay).toLocaleDateString()
                          : 'Recorded'}
                      </td>

                      <td className="py-3.5 px-4 text-gray-700 dark:text-zinc-300">
                        {exitCase.reason}
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge variant="brand" size="sm" className="gap-1">
                          <FileCheck className="w-3 h-3" />
                          <span>{docCount > 0 ? `${docCount} Issued` : 'All Issued'}</span>
                        </Badge>
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge
                          variant={isFnfPaid ? 'success' : 'warning'}
                          size="sm"
                        >
                          {exitCase.fnfStatus} (₹{(exitCase.settlement?.netPayable ?? 0).toLocaleString()})
                        </Badge>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-[11px] text-gray-400 italic">
                          Eligible (Pending Route)
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExitedEmployeesPage;
