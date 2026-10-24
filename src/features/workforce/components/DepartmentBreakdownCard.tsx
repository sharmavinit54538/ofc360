import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Plus, X } from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { SkeletonListItem } from '@/shared/ui/Skeleton';
import { useToast } from '@/shared/ui/Toast';
import { useCreateDepartmentMutation, useGetEmployeesQuery } from '../api/workforceApi';
import { departmentFormSchema, type DepartmentFormData } from '../schemas/workforce.schemas';
import type { DepartmentItem, EmployeeItem } from '../types/workforce.types';

interface DepartmentBreakdownCardProps {
  departments: DepartmentItem[];
  isLoading: boolean;
  employees?: EmployeeItem[];
}

export const DepartmentBreakdownCard: React.FC<DepartmentBreakdownCardProps> = ({
  departments,
  isLoading,
  employees,
}) => {
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createDepartment, { isLoading: isCreating }] = useCreateDepartmentMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: { name: '', code: '' },
  });

  // Check if all departments returned 0 headcount from backend
  const allZeroHeadcount = useMemo(
    () => departments.length > 0 && departments.every((d) => (d.headcount ?? d.totalEmployees ?? d.employeeCount ?? 0) === 0),
    [departments]
  );

  // Fetch employees as fallback if all departments returned 0 and no employees prop was provided
  const { data: empQueryData } = useGetEmployeesQuery(
    { limit: 500 },
    { skip: !allZeroHeadcount || Boolean(employees && employees.length > 0) }
  );

  const activeEmployeeList = employees ?? empQueryData?.items ?? [];

  // Compute map of department counts if backend reported 0 across all
  const fallbackCounts = useMemo(() => {
    if (!allZeroHeadcount || activeEmployeeList.length === 0) return null;
    const map = new Map<string, number>();
    for (const emp of activeEmployeeList) {
      const dId = emp.departmentId || emp.department?.id;
      const dName = emp.departmentName || emp.department?.name;
      if (dId) map.set(dId, (map.get(dId) ?? 0) + 1);
      if (dName) map.set(dName.toLowerCase(), (map.get(dName.toLowerCase()) ?? 0) + 1);
    }
    return map;
  }, [allZeroHeadcount, activeEmployeeList]);

  const getDeptHeadcount = (d: DepartmentItem): number => {
    if (fallbackCounts) {
      const byId = fallbackCounts.get(d.id);
      if (byId !== undefined) return byId;
      const byName = fallbackCounts.get(d.name?.toLowerCase());
      if (byName !== undefined) return byName;
      if (d.departmentName) {
        const byDeptName = fallbackCounts.get(d.departmentName.toLowerCase());
        if (byDeptName !== undefined) return byDeptName;
      }
    }
    return d.headcount ?? d.totalEmployees ?? d.employeeCount ?? 0;
  };

  const totalStaff = departments.reduce((sum, d) => sum + getDeptHeadcount(d), 0);
  const maxHeadcount = Math.max(1, ...departments.map(getDeptHeadcount));
  const activeCount = departments.filter((d) => d.isActive).length;

  const openModal = () => {
    reset({ name: '', code: '' });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: DepartmentFormData) => {
    try {
      await createDepartment({ name: data.name, code: data.code.toUpperCase() }).unwrap();
      toast.success(`Department "${data.name}" created successfully.`, 'Department Created');
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to create the department.', 'Save Error');
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] overflow-hidden shadow-sm">
        <div className="p-4 md:p-6 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-[#ececec] flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" />
              Department Breakdown
            </h2>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
              {activeCount} active units • {totalStaff} total staff across departments
            </p>
          </div>
          <Button
            size="sm"
            onClick={openModal}
            className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Department
          </Button>
        </div>

        {isLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonListItem key={i} />
            ))}
          </div>
        ) : departments.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
              <Building2 className="w-7 h-7" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-[#ececec]">
              No departments configured yet
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400 max-w-sm mx-auto">
              Create your first department to start organizing the workforce into units.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-zinc-800/80">
            {departments.map((dept) => {
              const count = getDeptHeadcount(dept);
              const share = maxHeadcount > 0 ? Math.min(100, Math.max(0, Math.round((count / maxHeadcount) * 100))) : 0;
              const safeShare = Number.isNaN(share) ? 0 : share;
              const orgShare = totalStaff > 0 ? Math.min(100, Math.max(0, Math.round((count / totalStaff) * 100))) : 0;
              const safeOrgShare = Number.isNaN(orgShare) ? 0 : orgShare;
              return (
                <div
                  key={dept.id}
                  className="px-4 md:px-6 py-4 hover:bg-gray-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900 dark:text-[#ececec] truncate">
                          {dept.name}
                        </span>
                        <span className="font-mono text-[10px] text-gray-500 dark:text-zinc-400 uppercase">
                          {dept.code}
                        </span>
                        <Badge
                          variant={dept.isActive ? 'success' : 'slate'}
                          size="sm"
                          className="font-semibold text-[10px]"
                        >
                          {dept.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        {dept.budget !== undefined && dept.budget > 0 && (
                          <span className="font-mono text-[10px] text-gray-500 dark:text-zinc-400">
                            • Budget: ₹{dept.budget.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5">
                        {dept.headOfDepartment ? `HOD: ${dept.headOfDepartment.name}` : 'HOD not assigned'}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-[#ececec] whitespace-nowrap">
                      {count} <span className="text-xs font-medium text-gray-400">staff</span>
                    </span>
                  </div>

                  <div className="mt-2.5 flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                        style={{ width: `${safeShare}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-gray-500 dark:text-zinc-400 whitespace-nowrap">
                      {safeOrgShare}% of org
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create department modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
          <div
            className="w-full max-w-md bg-white dark:bg-[#171717] rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-department-headline"
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between bg-gray-50/50 dark:bg-zinc-900/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 id="create-department-headline" className="text-base font-bold text-gray-900 dark:text-[#ececec]">
                    Create Department
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">
                    New organizational unit / cost center
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <Input
                label="Department Name"
                placeholder="e.g. Platform Engineering"
                error={errors.name?.message}
                {...register('name')}
              />
              <Input
                label="Department Code"
                placeholder="e.g. PLAT-ENG"
                error={errors.code?.message}
                {...register('code')}
              />

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100 dark:border-zinc-800">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isCreating}
                  disabled={isCreating}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Create Department
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default DepartmentBreakdownCard;
