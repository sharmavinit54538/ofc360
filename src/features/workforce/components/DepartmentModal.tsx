import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, X, AlertCircle } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { useToast } from '@/shared/ui/Toast';
import {
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useGetEmployeesQuery,
  useGetDepartmentsQuery,
  parseDepartmentApiError,
  toDepartmentPayload,
} from '../api/workforceApi';
import { departmentFormSchema, type DepartmentFormData } from '../schemas/workforce.schemas';
import type { DepartmentItem, DepartmentFormPayload } from '../types/workforce.types';

export interface DepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  department?: DepartmentItem | null; // null/undefined for Create, DepartmentItem for Edit
  departments?: DepartmentItem[]; // Existing departments for Parent Department dropdown
  onSuccess?: (dept: DepartmentItem) => void;
}

export const DepartmentModal: React.FC<DepartmentModalProps> = ({
  isOpen,
  onClose,
  department,
  departments: propDepartments,
  onSuccess,
}) => {
  const toast = useToast();
  const isEditMode = Boolean(department?.id);

  const [createDepartment, { isLoading: isCreating }] = useCreateDepartmentMutation();
  const [updateDepartment, { isLoading: isUpdating }] = useUpdateDepartmentMutation();
  const isSubmitting = isCreating || isUpdating;

  // Global banner error state
  const [generalError, setGeneralError] = useState<string | null>(null);

  // 1. Fetch Manager candidates: Must query and filter ONLY users with the MANAGER role
  // Backend returns 400 if a user without the MANAGER role is selected
  const { data: managerPool, isLoading: isLoadingManagers } = useGetEmployeesQuery(
    { role: 'MANAGER', limit: 200 },
    { skip: !isOpen }
  );

  const managers = useMemo(() => {
    const list = managerPool?.items || [];
    return list.filter((emp) => String(emp.role || '').toUpperCase() === 'MANAGER');
  }, [managerPool]);

  // 2. Fetch Parent Department candidates: GET /api/v1/departments
  const { data: fetchedDepartments } = useGetDepartmentsQuery(undefined, {
    skip: !isOpen || Boolean(propDepartments && propDepartments.length > 0),
  });

  const availableDepartments = propDepartments || fetchedDepartments || [];

  // Exclude current department from parent candidates so it cannot parent itself
  const parentCandidates = useMemo(() => {
    return availableDepartments.filter((d) => d.id !== department?.id);
  }, [availableDepartments, department?.id]);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: {
      department_name: '',
      description: '',
      location: '',
      manager_id: '',
      parent_department_id: '',
      branch_id: '',
      cost_center: '',
      budget: 0,
      extension_number: '',
      employee_capacity: 100,
      status: 'ACTIVE',
    },
  });

  const descriptionValue = watch('description') || '';

  // Reset form when modal opens or target department changes
  useEffect(() => {
    if (isOpen) {
      setGeneralError(null);
      clearErrors();

      if (department) {
        reset({
          department_name: department.department_name || department.departmentName || department.name || '',
          description: department.description || '',
          location: department.location || '',
          manager_id:
            department.manager_id ||
            department.managerId ||
            department.head_id ||
            department.headId ||
            '',
          parent_department_id:
            department.parent_department_id ||
            department.parentDepartmentId ||
            '',
          branch_id: department.branch_id || department.branchId || '',
          cost_center: department.cost_center || department.costCenter || '',
          budget: department.budget !== undefined ? Number(department.budget) : 0,
          extension_number:
            department.extension_number || department.extensionNumber || '',
          employee_capacity:
            department.employee_capacity !== undefined
              ? Number(department.employee_capacity)
              : department.employeeCapacity !== undefined
              ? Number(department.employeeCapacity)
              : 100,
          status: department.status || (department.isActive ? 'ACTIVE' : 'INACTIVE'),
        });
      } else {
        reset({
          department_name: '',
          description: '',
          location: '',
          manager_id: '',
          parent_department_id: '',
          branch_id: '',
          cost_center: '',
          budget: 0,
          extension_number: '',
          employee_capacity: 100,
          status: 'ACTIVE',
        });
      }
    }
  }, [isOpen, department, reset, clearErrors]);

  if (!isOpen) return null;

  const onSubmit = async (data: DepartmentFormData) => {
    setGeneralError(null);
    clearErrors();

    // Clean payload via toDepartmentPayload (omits empty keys, never sends null, removes code)
    const payload = toDepartmentPayload(data, { isCreate: !isEditMode });

    try {
      if (isEditMode && department?.id) {
        // PUT /api/v1/departments/{id}
        const updated = await updateDepartment({
          id: department.id,
          data: payload,
        }).unwrap();

        const deptName = updated.department_name || updated.name || data.department_name;
        toast.success(`Department "${deptName}" updated successfully.`, 'Department Updated');
        if (onSuccess) onSuccess(updated);
        onClose();
      } else {
        // POST /api/v1/departments
        // Response shape is { success, message, data, errors }; read created department from data
        const created = await createDepartment(payload as DepartmentFormPayload).unwrap();

        const deptName = created.department_name || created.name || data.department_name;
        const deptCode = created.department_code || created.code;
        const msg = deptCode
          ? `Department "${deptName}" (${deptCode}) created successfully.`
          : `Department "${deptName}" created successfully.`;

        toast.success(msg, 'Department Created');
        if (onSuccess) onSuccess(created);
        onClose();
      }
    } catch (err: any) {
      // Map errors:
      // 422 -> field-level messages (FastAPI detail[].loc / msg, or errors[] in response wrapper)
      // 409 -> "Department name already exists"
      // 403 -> "Only Super Admin, HR Admin and IT Admin can manage departments"
      // 400 -> show backend message
      const parsed = parseDepartmentApiError(err);

      if (parsed.generalMessage) {
        setGeneralError(parsed.generalMessage);
        toast.error(parsed.generalMessage, 'Department Error');
      }

      if (parsed.fieldErrors && Object.keys(parsed.fieldErrors).length > 0) {
        Object.entries(parsed.fieldErrors).forEach(([field, msg]) => {
          // Map to react-hook-form field names
          const fieldKey = (
            field === 'name' ? 'department_name' :
            field === 'managerId' || field === 'head_id' || field === 'headId' ? 'manager_id' :
            field === 'parentDepartmentId' ? 'parent_department_id' :
            field === 'branchId' ? 'branch_id' :
            field === 'costCenter' ? 'cost_center' :
            field === 'extensionNumber' ? 'extension_number' :
            field === 'employeeCapacity' ? 'employee_capacity' :
            field
          ) as keyof DepartmentFormData;

          setError(fieldKey, {
            type: 'server',
            message: msg,
          });
        });
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="department-modal-title"
    >
      <div className="w-full max-w-2xl bg-white dark:bg-[#171717] rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden my-auto animate-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between bg-gray-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="department-modal-title"
                className="text-base sm:text-lg font-bold text-gray-900 dark:text-[#ececec]"
              >
                {isEditMode ? 'Edit Department' : 'Create Department'}
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                {isEditMode
                  ? 'Update organizational unit details and assignment'
                  : 'New organizational unit / cost center'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* General Error Banner */}
          {generalError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5 text-rose-700 dark:text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium leading-relaxed">{generalError}</div>
            </div>
          )}

          {/* Read-Only Department Code in Edit Mode */}
          {isEditMode && department && (
            <div className="p-3 rounded-2xl bg-gray-50 dark:bg-zinc-900/60 border border-gray-200 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
                  Department Code (Read-Only)
                </label>
                <div className="mt-0.5">
                  <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">
                    {department.department_code || department.departmentCode || department.code || 'GENERATED'}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-gray-400 dark:text-zinc-500 text-right max-w-xs">
                Code is generated automatically upon creation and cannot be modified.
              </p>
            </div>
          )}

          {/* Row 1: Name and Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Department Name *"
              placeholder="e.g. Platform Engineering"
              error={errors.department_name?.message}
              helperText="1-100 characters, unique per organization"
              {...register('department_name')}
            />
            <Input
              label="Location *"
              placeholder="e.g. Jaipur HQ, Tower A - 4th Floor"
              error={errors.location?.message}
              helperText="1-100 characters"
              {...register('location')}
            />
          </div>

          {/* Row 2: Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="dept-description"
                className="block text-xs font-semibold text-gray-900 dark:text-[#ececec]"
              >
                Description *
              </label>
              <span className="text-[11px] text-gray-400 dark:text-zinc-500">
                {descriptionValue.length}/1000 characters
              </span>
            </div>
            <textarea
              id="dept-description"
              rows={3}
              placeholder="Detailed responsibilities, deliverables, and operational mandate of the department..."
              className={`w-full px-3 py-2 text-xs rounded-xl border bg-white dark:bg-zinc-900 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors resize-y ${
                errors.description?.message
                  ? 'border-rose-500 focus:ring-rose-500'
                  : 'border-gray-200 dark:border-zinc-800'
              }`}
              {...register('description')}
            />
            {errors.description?.message && (
              <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 font-medium">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Row 3: Manager and Parent Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Manager Dropdown: strictly lists users with MANAGER role */}
            <div>
              <label
                htmlFor="dept-manager"
                className="block text-xs font-semibold text-gray-900 dark:text-[#ececec] mb-1.5"
              >
                Department Manager (Optional)
              </label>
              <select
                id="dept-manager"
                className={`w-full px-3 py-2 text-xs rounded-xl border bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                  errors.manager_id?.message
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-gray-200 dark:border-zinc-800'
                }`}
                {...register('manager_id')}
              >
                <option value="">No manager assigned</option>
                {isLoadingManagers && <option disabled>Loading managers...</option>}
                {managers.map((mgr) => (
                  <option key={mgr.id} value={mgr.id}>
                    {mgr.fullName || `${mgr.firstName} ${mgr.lastName}`}
                    {mgr.employeeCode && mgr.employeeCode !== 'N/A' ? ` (${mgr.employeeCode})` : ''}
                  </option>
                ))}
              </select>
              {errors.manager_id?.message ? (
                <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 font-medium">
                  {errors.manager_id.message}
                </p>
              ) : (
                <p className="text-[10px] text-gray-500 dark:text-zinc-400 mt-1">
                  Only users with the MANAGER role are eligible.
                </p>
              )}
            </div>

            {/* Parent Department Dropdown */}
            <div>
              <label
                htmlFor="dept-parent"
                className="block text-xs font-semibold text-gray-900 dark:text-[#ececec] mb-1.5"
              >
                Parent Department (Optional)
              </label>
              <select
                id="dept-parent"
                className={`w-full px-3 py-2 text-xs rounded-xl border bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                  errors.parent_department_id?.message
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-gray-200 dark:border-zinc-800'
                }`}
                {...register('parent_department_id')}
              >
                <option value="">None (Top-Level Department)</option>
                {parentCandidates.map((pDept) => (
                  <option key={pDept.id} value={pDept.id}>
                    {pDept.department_name || pDept.departmentName || pDept.name} (
                    {pDept.department_code || pDept.code})
                  </option>
                ))}
              </select>
              {errors.parent_department_id?.message ? (
                <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 font-medium">
                  {errors.parent_department_id.message}
                </p>
              ) : (
                <p className="text-[10px] text-gray-500 dark:text-zinc-400 mt-1">
                  Defines organizational hierarchy nesting.
                </p>
              )}
            </div>
          </div>

          {/* Row 4: Cost Center and Branch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Cost Center (Optional)"
              placeholder="e.g. CC-1042"
              error={errors.cost_center?.message}
              helperText="Max 50 characters"
              {...register('cost_center')}
            />
            <Input
              label="Branch (Optional)"
              placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
              error={errors.branch_id?.message}
              helperText="Branch identifier / UUID if scoped to branch office"
              {...register('branch_id')}
            />
          </div>

          {/* Row 5: Budget and Extension Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Annual Budget (₹)"
              type="number"
              min={0}
              step="any"
              placeholder="0"
              error={errors.budget?.message}
              helperText="Default: 0"
              {...register('budget')}
            />
            <Input
              label="Extension Number (Optional)"
              placeholder="e.g. +91 141 2345 or ext. 402"
              error={errors.extension_number?.message}
              helperText="Max 50 characters"
              {...register('extension_number')}
            />
          </div>

          {/* Row 6: Employee Capacity and Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Employee Capacity"
              type="number"
              min={0}
              step={1}
              placeholder="100"
              error={errors.employee_capacity?.message}
              helperText="Target headcount limit (default: 100)"
              {...register('employee_capacity')}
            />
            <div>
              <label
                htmlFor="dept-status"
                className="block text-xs font-semibold text-gray-900 dark:text-[#ececec] mb-1.5"
              >
                Status
              </label>
              <select
                id="dept-status"
                className={`w-full px-3 py-2 text-xs rounded-xl border bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                  errors.status?.message
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-gray-200 dark:border-zinc-800'
                }`}
                {...register('status')}
              >
                <option value="ACTIVE">ACTIVE (Operational)</option>
                <option value="HIRING">HIRING (Actively recruiting)</option>
                <option value="GROWING">GROWING (Expanding unit)</option>
                <option value="INACTIVE">INACTIVE (Deactivated / archived)</option>
              </select>
              {errors.status?.message && (
                <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 font-medium">
                  {errors.status.message}
                </p>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-100 dark:border-zinc-800">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[140px]"
            >
              {isEditMode ? 'Save Changes' : 'Create Department'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentModal;
