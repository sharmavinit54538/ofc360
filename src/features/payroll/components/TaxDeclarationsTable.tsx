import React from 'react';
import { FileCheck2 } from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { SkeletonTableRow } from '@/shared/ui/Skeleton';
import type { TaxDeclarationItem } from '../types/payroll.types';
import { formatCurrency } from '../payroll.utils';

interface TaxDeclarationsTableProps {
  declarations: TaxDeclarationItem[];
  isLoading: boolean;
}

export const TaxDeclarationsTable: React.FC<TaxDeclarationsTableProps> = ({ declarations, isLoading }) => (
  <section className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] overflow-hidden shadow-sm">
    <div className="p-4 md:px-6 border-b border-gray-200 dark:border-zinc-800">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">Investment & Rent Declarations</h2>
      <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">Live employee tax declarations and verification status</p>
    </div>
    {isLoading ? (
      <div className="p-5 space-y-3">{Array.from({ length: 6 }).map((_, index) => <SkeletonTableRow key={index} columns={5} />)}</div>
    ) : declarations.length === 0 ? (
      <div className="p-12 text-center">
        <FileCheck2 className="w-8 h-8 mx-auto text-indigo-500 mb-3" />
        <h3 className="font-semibold text-gray-900 dark:text-white">No tax declarations found</h3>
        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">Declarations submitted for the selected financial year and scope will appear here.</p>
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-xs md:text-sm">
          <thead className="bg-gray-50 dark:bg-zinc-800/60 text-gray-600 dark:text-zinc-400 text-xs uppercase tracking-wider font-semibold border-b border-gray-200 dark:border-zinc-800">
            <tr>
              <th className="px-5 py-3">Employee</th>
              <th className="px-4 py-3">Financial Year</th>
              <th className="px-4 py-3">Regime</th>
              <th className="px-4 py-3">Section 80C</th>
              <th className="px-4 py-3">Section 80D</th>
              <th className="px-4 py-3">Annual HRA Rent</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/80">
            {declarations.map((declaration) => (
              <tr key={declaration.id} className="hover:bg-gray-50/80 dark:hover:bg-zinc-800/40">
                <td className="px-5 py-4">
                  <div className="font-semibold text-gray-900 dark:text-white">{declaration.employeeName}</div>
                  <div className="text-[11px] font-mono text-gray-500 mt-0.5">{declaration.employeeId}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">{declaration.financialYear}</td>
                <td className="px-4 py-4"><Badge variant="slate" size="sm">{declaration.regime === 'NEW_REGIME' ? 'New Regime' : 'Old Regime'}</Badge></td>
                <td className="px-4 py-4 whitespace-nowrap">{formatCurrency(declaration.section80C)}</td>
                <td className="px-4 py-4 whitespace-nowrap">{formatCurrency(declaration.section80D)}</td>
                <td className="px-4 py-4 whitespace-nowrap">{formatCurrency(declaration.hraRentAnnual)}</td>
                <td className="px-5 py-4"><Badge variant={declaration.status === 'VERIFIED' ? 'success' : declaration.status === 'REJECTED' ? 'danger' : 'warning'} size="sm">{declaration.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </section>
);

export default TaxDeclarationsTable;
