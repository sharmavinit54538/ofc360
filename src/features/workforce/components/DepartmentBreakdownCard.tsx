import React, { useState, useMemo } from 'react';
import { Building2, Plus, Edit2, MapPin, Hash } from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { SkeletonListItem } from '@/shared/ui/Skeleton';
import { useGetEmployeesQuery } from '../api/workforceApi';
import { DepartmentModal } from './DepartmentModal';
import type { DepartmentItem, EmployeeItem, DepartmentStatus } from '../types/workforce.types';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentItem | null>(null);

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
  const activeCount = departments.filter((d) => (d.status ? d.status === 'ACTIVE' : d.isActive)).length;

  const handleOpenCreateModal = () => {
    setSelectedDepartment(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (dept: DepartmentItem) => {
    setSelectedDepartment(dept);
    setIsModalOpen(true);
  };

  const getStatusBadgeVariant = (status?: DepartmentStatus, isActive?: boolean): 'success' | 'slate' | 'brand' | 'warning' => {
    if (!status && isActive !== undefined) return isActive ? 'success' : 'slate';
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'HIRING':
        return 'brand';
      case 'GROWING':
        return 'warning';
      case 'INACTIVE':
      default:
        return 'slate';
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
            onClick={handleOpenCreateModal}
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
              const capacity = dept.employee_capacity ?? dept.employeeCapacity ?? 100;
              const share = maxHeadcount > 0 ? Math.min(100, Math.max(0, Math.round((count / maxHeadcount) * 100))) : 0;
              const safeShare = Number.isNaN(share) ? 0 : share;
              const orgShare = totalStaff > 0 ? Math.min(100, Math.max(0, Math.round((count / totalStaff) * 100))) : 0;
              const safeOrgShare = Number.isNaN(orgShare) ? 0 : orgShare;
              const status = dept.status || (dept.isActive ? 'ACTIVE' : 'INACTIVE');

              return (
                <div
                  key={dept.id}
                  className="px-4 md:px-6 py-4 hover:bg-gray-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-gray-900 dark:text-[#ececec] truncate">
                          {dept.department_name || dept.departmentName || dept.name}
                        </span>
                        <span className="font-mono text-[10px] text-gray-500 dark:text-zinc-400 uppercase font-bold">
                          {dept.department_code || dept.departmentCode || dept.code}
                        </span>
                        <Badge
                          variant={getStatusBadgeVariant(dept.status, dept.isActive)}
                          size="sm"
                          className="font-semibold text-[10px]"
                        >
                          {status}
                        </Badge>
                        {dept.budget !== undefined && dept.budget > 0 && (
                          <span className="font-mono text-[10px] text-gray-500 dark:text-zinc-400">
                            • Budget: ₹{dept.budget.toLocaleString('en-IN')}
                          </span>
                        )}
                        {dept.cost_center && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-gray-500 dark:text-zinc-400 font-mono">
                            <Hash className="w-2.5 h-2.5" />
                            {dept.cost_center}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 mt-1 flex-wrap text-[11px] text-gray-500 dark:text-zinc-400">
                        <span>
                          {dept.managerName && dept.managerName !== 'Unassigned'
                            ? `Manager: ${dept.managerName}`
                            : dept.headOfDepartment
                            ? `Manager: ${dept.headOfDepartment.name}`
                            : 'Manager not assigned'}
                        </span>
                        {dept.location && (
                          <span className="inline-flex items-center gap-1 text-gray-500 dark:text-zinc-400">
                            <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
                            {dept.location}
                          </span>
                        )}
                        {capacity > 0 && (
                          <span className="text-gray-400 dark:text-zinc-500">
                            Capacity: {count}/{capacity}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm font-bold text-gray-900 dark:text-[#ececec] whitespace-nowrap">
                        {count} <span className="text-xs font-medium text-gray-400">staff</span>
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenEditModal(dept)}
                        className="text-xs px-2.5 py-1 text-gray-700 dark:text-zinc-300 border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800"
                        title={`Edit ${dept.name || 'department'}`}
                      >
                        <Edit2 className="w-3.5 h-3.5 mr-1 text-gray-500" />
                        Edit
                      </Button>
                    </div>
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

      {/* Create / Edit Department Modal */}
      <DepartmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDepartment(null);
        }}
        department={selectedDepartment}
        departments={departments}
      />
    </>
  );
};

export default DepartmentBreakdownCard;
