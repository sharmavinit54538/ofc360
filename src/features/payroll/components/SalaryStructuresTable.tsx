import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Pencil, RefreshCw, Search, WalletCards } from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { SkeletonTableRow } from '@/shared/ui/Skeleton';
import { useToast } from '@/shared/ui/Toast';
import { cn } from '@/shared/lib/utils';
import type { DepartmentItem } from '@/features/workforce/types/workforce.types';
import { useUpdateSalaryStructureMutation } from '../api/payrollApi';
import { updateSalaryStructureSchema, type UpdateSalaryStructureFormData } from '../schemas/payroll.schemas';
import type { SalaryStructureItem } from '../types/payroll.types';
import { formatCurrency, formatPayrollDate, getPayrollErrorMessage } from '../payroll.utils';
import { PayrollModalShell } from './PayrollModalShell';

interface SalaryStructuresTableProps {
  structures: SalaryStructureItem[];
  isLoading: boolean;
  departments: DepartmentItem[];
  search: string;
  onSearchChange: (value: string) => void;
  departmentId: string;
  onDepartmentChange: (value: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const SalaryStructureRevisionModal: React.FC<{ structure: SalaryStructureItem | null; onClose: () => void }> = ({ structure, onClose }) => {
  const toast = useToast();
  const [updateStructure, { isLoading }] = useUpdateSalaryStructureMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateSalaryStructureFormData>({
    resolver: zodResolver(updateSalaryStructureSchema),
    defaultValues: {
      annualCtc: 0,
      basic: 0,
      hra: 0,
      specialAllowance: 0,
      taxRegime: 'NEW_REGIME',
      effectiveFrom: '',
    },
  });

  useEffect(() => {
    if (structure) {
      reset({
        annualCtc: structure.annualCtc,
        basic: structure.basic,
        hra: structure.hra,
        specialAllowance: structure.specialAllowance,
        taxRegime: structure.taxRegime,
        effectiveFrom: structure.effectiveFrom.slice(0, 10),
      });
    }
  }, [structure, reset]);

  const onSubmit = async (data: UpdateSalaryStructureFormData) => {
    if (!structure) return;
    try {
      await updateStructure({ employeeId: structure.employeeId, data }).unwrap();
      toast.success(`${structure.employeeName}'s salary structure has been revised.`, 'Salary Structure Updated');
      onClose();
    } catch (error: unknown) {
      toast.error(getPayrollErrorMessage(error, 'Unable to revise this salary structure.'), 'Revision Failed');
    }
  };

  return (
    <PayrollModalShell
      isOpen={Boolean(structure)}
      onClose={onClose}
      title="Revise Salary Structure"
      description={structure ? `${structure.employeeName} · ${structure.employeeCode}` : undefined}
      icon={<WalletCards className="w-5 h-5" />}
      maxWidthClassName="max-w-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto p-5 sm:p-6 space-y-4" noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Annual CTC" type="number" min={0} step="0.01" error={errors.annualCtc?.message} {...register('annualCtc')} />
          <Input label="Monthly Basic" type="number" min={0} step="0.01" error={errors.basic?.message} {...register('basic')} />
          <Input label="Monthly HRA" type="number" min={0} step="0.01" error={errors.hra?.message} {...register('hra')} />
          <Input label="Monthly Special Allowance" type="number" min={0} step="0.01" error={errors.specialAllowance?.message} {...register('specialAllowance')} />
          <div className="space-y-1.5">
            <label htmlFor="salary-tax-regime" className="text-xs font-semibold text-gray-900 dark:text-[#ececec]">Tax Regime</label>
            <select id="salary-tax-regime" className="w-full px-3.5 py-3 rounded-xl text-sm border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white" {...register('taxRegime')}>
              <option value="NEW_REGIME">New Regime</option>
              <option value="OLD_REGIME">Old Regime</option>
            </select>
            {errors.taxRegime && <p className="text-xs text-rose-600">{errors.taxRegime.message}</p>}
          </div>
          <Input label="Effective From" type="date" error={errors.effectiveFrom?.message} {...register('effectiveFrom')} />
        </div>
        <p className="text-xs text-gray-500 dark:text-zinc-400">Monthly gross and employer PF are recalculated by the payroll service from the saved structure.</p>
        <div className="flex justify-end gap-2.5 pt-4 border-t border-gray-100 dark:border-zinc-800">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button type="submit" size="sm" isLoading={isLoading} leftIcon={<Pencil className="w-3.5 h-3.5" />}>Save Revision</Button>
        </div>
      </form>
    </PayrollModalShell>
  );
};

export const SalaryStructuresTable: React.FC<SalaryStructuresTableProps> = ({
  structures,
  isLoading,
  departments,
  search,
  onSearchChange,
  departmentId,
  onDepartmentChange,
  onRefresh,
  isRefreshing,
}) => {
  const [revisionTarget, setRevisionTarget] = useState<SalaryStructureItem | null>(null);

  return (
    <>
      <section className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] overflow-hidden shadow-sm">
        <div className="p-4 md:px-6 border-b border-gray-200 dark:border-zinc-800 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-[#ececec]">Employee CTC Structures</h2>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">Live compensation components and effective tax regimes</p>
          </div>
          <div className="flex flex-col md:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search employee or code"
                aria-label="Search salary structures"
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>
            <div className="relative">
              <Building2 className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select aria-label="Filter structures by department" value={departmentId} onChange={(event) => onDepartmentChange(event.target.value)} className="w-full md:w-auto pl-8 pr-3 py-2 rounded-xl text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white">
                <option value="">All Departments</option>
                {departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}
              </select>
            </div>
            <Button variant="outline" size="sm" onClick={onRefresh} disabled={isRefreshing} leftIcon={<RefreshCw className={cn('w-3.5 h-3.5', isRefreshing && 'animate-spin')} />}>Refresh</Button>
          </div>
        </div>

        {isLoading ? (
          <div className="p-5 space-y-3">{Array.from({ length: 7 }).map((_, index) => <SkeletonTableRow key={index} columns={6} />)}</div>
        ) : structures.length === 0 ? (
          <div className="p-12 text-center">
            <WalletCards className="w-8 h-8 mx-auto text-indigo-500 mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white">No salary structures found</h3>
            <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">Adjust the current search or department filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px] text-left text-xs md:text-sm">
              <thead className="bg-gray-50 dark:bg-zinc-800/60 text-gray-600 dark:text-zinc-400 text-xs uppercase tracking-wider font-semibold border-b border-gray-200 dark:border-zinc-800">
                <tr>
                  <th className="px-5 py-3">Employee</th>
                  <th className="px-4 py-3">Annual CTC</th>
                  <th className="px-4 py-3">Monthly Gross</th>
                  <th className="px-4 py-3">Basic</th>
                  <th className="px-4 py-3">HRA</th>
                  <th className="px-4 py-3">Special Allowance</th>
                  <th className="px-4 py-3">Employer PF</th>
                  <th className="px-4 py-3">Tax Regime</th>
                  <th className="px-4 py-3">Effective From</th>
                  <th className="px-5 py-3 text-right">Revision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/80">
                {structures.map((structure) => (
                  <tr key={structure.employeeId} className="hover:bg-gray-50/80 dark:hover:bg-zinc-800/40">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-gray-900 dark:text-white">{structure.employeeName}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">{structure.employeeCode} · {structure.department}</div>
                    </td>
                    <td className="px-4 py-4 font-semibold text-gray-900 dark:text-zinc-100 whitespace-nowrap">{formatCurrency(structure.annualCtc)}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{formatCurrency(structure.monthlyGross)}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{formatCurrency(structure.basic)}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{formatCurrency(structure.hra)}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{formatCurrency(structure.specialAllowance)}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{formatCurrency(structure.pfEmployer)}</td>
                    <td className="px-4 py-4"><Badge variant="slate" size="sm">{structure.taxRegime === 'NEW_REGIME' ? 'New' : 'Old'}</Badge></td>
                    <td className="px-4 py-4 whitespace-nowrap">{formatPayrollDate(structure.effectiveFrom)}</td>
                    <td className="px-5 py-4 text-right"><Button size="sm" variant="outline" onClick={() => setRevisionTarget(structure)} leftIcon={<Pencil className="w-3.5 h-3.5" />}>Revise</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <SalaryStructureRevisionModal structure={revisionTarget} onClose={() => setRevisionTarget(null)} />
    </>
  );
};

export default SalaryStructuresTable;
