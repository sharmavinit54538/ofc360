import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Building2, Plus, Pencil, Eye, MoreVertical, MapPin } from 'lucide-react';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { SkeletonTableRow } from '@/shared/ui/Skeleton';
import { Portal } from '@/shared/ui/Portal';
import { useGetEmployeesQuery, isUuid } from '../api/workforceApi';
import { useRBAC } from '@/features/auth/hooks/useRBAC';
import { cn } from '@/shared/lib/utils';
import { DepartmentModal } from './DepartmentModal';
import { DepartmentDetailModal } from './DepartmentDetailModal';
import type { DepartmentItem, EmployeeItem, DepartmentStatus } from '../types/workforce.types';

export interface DepartmentBreakdownCardProps {
  departments: DepartmentItem[];
  isLoading: boolean;
  employees?: EmployeeItem[];
}

interface MenuPosition {
  top?: number;
  bottom?: number;
  right: number;
}

export const DepartmentBreakdownCard: React.FC<DepartmentBreakdownCardProps> = ({
  departments,
  isLoading,
  employees,
}) => {
  const { hasAnyRole } = useRBAC();
  const canManage = hasAnyRole(['SUPER_ADMIN', 'HR_ADMIN', 'IT_ADMIN']);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentItem | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewDepartment, setViewDepartment] = useState<DepartmentItem | null>(null);

  // Close the open dropdown when clicking outside, scrolling, or pressing Escape
  useEffect(() => {
    if (!openMenuId) return;

    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (menuRef.current && menuRef.current.contains(target)) return;
      if (target.closest('[data-dropdown-trigger]')) return;
      setOpenMenuId(null);
      setMenuPosition(null);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenMenuId(null);
        setMenuPosition(null);
      }
    };

    const handleScrollOrResize = () => {
      setOpenMenuId(null);
      setMenuPosition(null);
    };

    document.addEventListener('mousedown', handleDocumentClick);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true);

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
    };
  }, [openMenuId]);

  // Fetch employees pool to resolve department manager names and fallbacks
  const { data: empQueryData } = useGetEmployeesQuery({ limit: 500 });
  const activeEmployeeList = employees ?? empQueryData?.items ?? [];

  // Map employee ID / employeeCode to full name for resolving manager ID to display name
  const managerLookupMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const emp of activeEmployeeList) {
      const name = emp.fullName?.trim() || `${emp.firstName || ''} ${emp.lastName || ''}`.trim();
      if (emp.id && name) map.set(String(emp.id).trim(), name);
      if (emp.employeeCode && name) map.set(String(emp.employeeCode).trim(), name);
    }
    return map;
  }, [activeEmployeeList]);

  // Check if all departments returned 0 headcount from backend
  const allZeroHeadcount = useMemo(
    () => departments.length > 0 && departments.every((d) => (d.headcount ?? d.totalEmployees ?? d.employeeCount ?? 0) === 0),
    [departments]
  );

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
    setIsEditModalOpen(true);
  };

  const handleOpenEditModal = (dept: DepartmentItem) => {
    setSelectedDepartment(dept);
    setIsEditModalOpen(true);
  };

  const handleOpenViewModal = (dept: DepartmentItem) => {
    setViewDepartment(dept);
    setIsViewModalOpen(true);
  };

  const handleToggleMenu = (deptId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    if (openMenuId === deptId) {
      setOpenMenuId(null);
      setMenuPosition(null);
    } else {
      const rect = event.currentTarget.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const opensUpward = spaceBelow < 140;

      setOpenMenuId(deptId);
      setMenuPosition({
        top: opensUpward ? undefined : rect.bottom + 4,
        bottom: opensUpward ? window.innerHeight - rect.top + 4 : undefined,
        right: Math.max(8, window.innerWidth - rect.right),
      });
    }
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

  const getDeptManagerName = (dept: DepartmentItem): string => {
    const rawDept = dept as any;
    const mgrId =
      dept.manager_id ||
      dept.managerId ||
      dept.head_id ||
      dept.headId ||
      rawDept.headOfDepartment?.id;

    const rawName = dept.managerName || dept.headName || rawDept.headOfDepartment?.name;

    // If a human-readable name is already populated and not a raw UUID or ID, use it
    if (
      rawName &&
      rawName !== 'Unassigned' &&
      !isUuid(rawName) &&
      (!mgrId || rawName.trim() !== String(mgrId).trim())
    ) {
      return rawName;
    }

    if (mgrId) {
      const matched = managerLookupMap.get(String(mgrId).trim());
      if (matched) return matched;
    }

    return 'Not assigned';
  };

  const activeMenuDept = departments.find((d) => d.id === openMenuId);

  return (
    <>
      <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] overflow-hidden shadow-xs">
        {/* Header Bar */}
        <div className="p-4 md:p-6 border-b border-gray-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#171717]">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-[#ececec] flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Department Directory
            </h2>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
              {activeCount} active {activeCount === 1 ? 'unit' : 'units'} • {totalStaff} total staff across departments
            </p>
          </div>
          {canManage && (
            <Button
              size="sm"
              onClick={handleOpenCreateModal}
              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 self-start sm:self-auto rounded-xl shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Department
            </Button>
          )}
        </div>

        {/* Content Table or Empty/Loading State */}
        {isLoading ? (
          <div className="overflow-x-auto min-w-0">
            <table className="w-full min-w-[840px] text-left text-xs md:text-sm">
              <thead className="bg-gray-50 dark:bg-zinc-800/60 text-gray-600 dark:text-zinc-400 text-xs uppercase tracking-wider font-semibold border-b border-gray-200 dark:border-zinc-800">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Manager</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Staff / Capacity</th>
                  <th className="px-4 py-3">Budget</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/80">
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonTableRow key={i} columns={8} />
                ))}
              </tbody>
            </table>
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
            {canManage && (
              <Button
                size="sm"
                onClick={handleOpenCreateModal}
                className="mt-4 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Department
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto min-w-0">
            <table className="w-full min-w-[840px] text-left text-xs md:text-sm">
              <thead className="bg-gray-50 dark:bg-zinc-800/60 text-gray-600 dark:text-zinc-400 text-xs uppercase tracking-wider font-semibold border-b border-gray-200 dark:border-zinc-800">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Manager</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Staff / Capacity</th>
                  <th className="px-4 py-3">Budget</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/80">
                {departments.map((dept) => {
                  const count = getDeptHeadcount(dept);
                  const capacity = dept.employee_capacity ?? dept.employeeCapacity ?? 100;
                  const share = maxHeadcount > 0 ? Math.min(100, Math.max(0, Math.round((count / maxHeadcount) * 100))) : 0;
                  const safeShare = Number.isNaN(share) ? 0 : share;
                  const orgShare = totalStaff > 0 ? Math.min(100, Math.max(0, Math.round((count / totalStaff) * 100))) : 0;
                  const safeOrgShare = Number.isNaN(orgShare) ? 0 : orgShare;
                  const status = dept.status || (dept.isActive ? 'ACTIVE' : 'INACTIVE');
                  const deptName = dept.department_name || dept.departmentName || dept.name || 'Unnamed Department';
                  const deptCode = dept.department_code || dept.departmentCode || dept.code || '—';
                  const managerDisplay = getDeptManagerName(dept);
                  const isMenuOpen = openMenuId === dept.id;

                  return (
                    <tr
                      key={dept.id}
                      className="hover:bg-gray-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      {/* Code */}
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-xs text-gray-600 dark:text-zinc-400 font-medium">
                          {deptCode}
                        </span>
                      </td>

                      {/* Department Icon + Name + Cost Center / Subtitle */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">
                            <Building2 className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-gray-900 dark:text-[#ececec] truncate">
                              {deptName}
                            </div>
                            <div className="text-[11px] text-gray-500 dark:text-zinc-400 truncate">
                              {dept.cost_center
                                ? `Cost Center: ${dept.cost_center}`
                                : dept.description
                                ? dept.description
                                : 'Core Unit'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Manager */}
                      <td className="px-4 py-3.5 text-gray-700 dark:text-zinc-300 whitespace-nowrap">
                        {managerDisplay}
                      </td>

                      {/* Location */}
                      <td className="px-4 py-3.5 text-gray-700 dark:text-zinc-300 whitespace-nowrap">
                        {dept.location ? (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-gray-400 dark:text-zinc-500 shrink-0" />
                            <span>{dept.location}</span>
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>

                      {/* Staff / Capacity + Org Utilization */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900 dark:text-[#ececec]">
                            {count} <span className="text-gray-400 dark:text-zinc-500 font-normal">/ {capacity}</span>
                          </span>
                          <span className="text-[11px] font-medium text-gray-500 dark:text-zinc-400">
                            ({safeOrgShare}% org)
                          </span>
                        </div>
                        <div className="w-24 h-1.5 rounded-full bg-gray-100 dark:bg-zinc-800 overflow-hidden mt-1.5">
                          <div
                            className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                            style={{ width: `${safeShare}%` }}
                          />
                        </div>
                      </td>

                      {/* Budget */}
                      <td className="px-4 py-3.5 font-mono text-xs text-gray-700 dark:text-zinc-300 whitespace-nowrap">
                        {dept.budget !== undefined && dept.budget > 0
                          ? `₹${dept.budget.toLocaleString('en-IN')}`
                          : '—'}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <Badge
                          variant={getStatusBadgeVariant(dept.status, dept.isActive)}
                          size="sm"
                          className="font-semibold text-[11px]"
                        >
                          {status}
                        </Badge>
                      </td>

                      {/* Actions (3-Dots Dropdown Trigger) */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <button
                          type="button"
                          data-dropdown-trigger
                          onClick={(e) => handleToggleMenu(dept.id, e)}
                          className={cn(
                            'p-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50',
                            isMenuOpen
                              ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                              : 'text-gray-400 hover:text-gray-700 dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800'
                          )}
                          aria-label={`Actions for ${deptName}`}
                          title="More actions"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Floating Three-Dot Actions Dropdown Menu (Rendered via Portal to eliminate overflow clipping) */}
      {openMenuId && menuPosition && activeMenuDept && (
        <Portal>
          <div
            ref={menuRef}
            style={{
              position: 'fixed',
              top: menuPosition.top,
              bottom: menuPosition.bottom,
              right: menuPosition.right,
              zIndex: 9999,
            }}
            className="w-48 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-[#1f1f1f] shadow-2xl py-1 divide-y divide-gray-100 dark:divide-zinc-800/80 animate-in fade-in-50 zoom-in-95"
            onClick={(e) => e.stopPropagation()}
            data-testid="department-actions-menu"
          >
            <div className="py-1">
              <button
                type="button"
                onClick={() => {
                  const dept = activeMenuDept;
                  setOpenMenuId(null);
                  setMenuPosition(null);
                  if (dept) handleOpenViewModal(dept);
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors text-left cursor-pointer"
              >
                <Eye className="w-4 h-4 text-blue-500 shrink-0" />
                <span>View Details</span>
              </button>
              {canManage && (
                <button
                  type="button"
                  onClick={() => {
                    const dept = activeMenuDept;
                    setOpenMenuId(null);
                    setMenuPosition(null);
                    if (dept) handleOpenEditModal(dept);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors text-left cursor-pointer"
                >
                  <Pencil className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Edit Department</span>
                </button>
              )}
            </div>
          </div>
        </Portal>
      )}

      {/* Create / Edit Department Modal */}
      <DepartmentModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedDepartment(null);
        }}
        department={selectedDepartment}
        departments={departments}
      />

      {/* View Department Details Modal */}
      <DepartmentDetailModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewDepartment(null);
        }}
        department={viewDepartment}
        managerName={viewDepartment ? getDeptManagerName(viewDepartment) : 'Not assigned'}
        staffCount={viewDepartment ? getDeptHeadcount(viewDepartment) : 0}
        onEdit={(dept) => {
          setIsViewModalOpen(false);
          handleOpenEditModal(dept);
        }}
      />
    </>
  );
};

export default DepartmentBreakdownCard;
