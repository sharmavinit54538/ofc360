import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, UserPlus, Pencil, AlertCircle } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { useToast } from '@/shared/ui/Toast';
import { useRBAC } from '@/features/auth/hooks/useRBAC';
import {
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useGetDepartmentsQuery,
  useGetDesignationsQuery,
  useGetEmployeesQuery,
  parseEmployeeApiError,
} from '../api/workforceApi';
import {
  createEmployeeSchema,
  updateEmployeeSchema,
  type CreateEmployeeFormData,
} from '../schemas/workforce.schemas';
import type { EmployeeItem } from '../types/workforce.types';

interface AddEmployeeModalProps {
  employee: EmployeeItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const SELECT_CLASSES =
  'w-full px-3 py-2 rounded-lg text-sm border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';

const EMPTY_FORM: CreateEmployeeFormData = {
  employeeCode: '',
  firstName: '',
  lastName: '',
  email: '',
  personalEmail: '',
  phone: '',
  gender: 'MALE',
  joiningDate: new Date().toISOString().slice(0, 10),
  departmentId: '',
  designationId: '',
  reportingManagerId: '',
  employmentType: 'FULL_TIME',
  workLocation: '',
  role: 'employee',
  workMode: 'OFFICE',
};

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ employee, isOpen, onClose }) => {
  const toast = useToast();
  const isEditMode = Boolean(employee);
  const { hasAnyRole } = useRBAC();
  const canManage = hasAnyRole(['SUPER_ADMIN', 'HR_ADMIN', 'IT_ADMIN']);

  const [createEmployee, { isLoading: isCreating }] = useCreateEmployeeMutation();
  const [updateEmployee, { isLoading: isUpdating }] = useUpdateEmployeeMutation();
  const isBusy = isCreating || isUpdating;

  const [generalError, setGeneralError] = useState<string | null>(null);

  const { data: departments } = useGetDepartmentsQuery(undefined, { skip: !isOpen });
  const { data: managerPool } = useGetEmployeesQuery({ limit: 100 }, { skip: !isOpen });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<CreateEmployeeFormData>({
    resolver: zodResolver(isEditMode ? updateEmployeeSchema : createEmployeeSchema),
    defaultValues: EMPTY_FORM,
  });

  const watchedDepartmentId = watch('departmentId');
  const { data: designations } = useGetDesignationsQuery(
    watchedDepartmentId ? { departmentId: watchedDepartmentId } : undefined,
    { skip: !isOpen }
  );

  useEffect(() => {
    if (!isOpen) return;
    setGeneralError(null);
    clearErrors();

    if (employee) {
      const matchedDept = (departments || []).find(
        (d) =>
          d.id === employee.department?.id ||
          (employee.departmentName &&
            (d.department_name === employee.departmentName || d.name === employee.departmentName))
      );

      reset({
        employeeCode: employee.employeeCode && employee.employeeCode !== 'N/A' ? employee.employeeCode : '',
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        personalEmail: employee.personalEmail || '',
        phone: employee.phone,
        gender: employee.gender,
        joiningDate: employee.joiningDate?.slice(0, 10) || new Date().toISOString().slice(0, 10),
        departmentId: matchedDept?.id || employee.department?.id || '',
        designationId: employee.designation?.id || '',
        reportingManagerId: employee.reportingManager?.id || employee.reportingManagerId || '',
        employmentType: employee.employmentType,
        workLocation: employee.workLocation || '',
        role: String(employee.role || 'employee').toLowerCase(),
        workMode: 'OFFICE',
      });
    } else {
      reset(EMPTY_FORM);
    }
  }, [employee, isOpen, reset, clearErrors, departments]);

  // Clear the designation if the department changes to an incompatible one
  useEffect(() => {
    if (!designations) return;
    const current = watch('designationId');
    if (current && !designations.some((d) => d.id === current)) {
      setValue('designationId', '');
    }
  }, [designations, watch, setValue]);

  if (!isOpen) return null;

  const onSubmit = async (data: CreateEmployeeFormData) => {
    if (!canManage) {
      const msg = 'Only Super Admin and HR Admin can manage workforce personnel.';
      setGeneralError(msg);
      toast.error(msg, 'Permission Denied');
      return;
    }

    try {
      clearErrors();
      setGeneralError(null);

      // Look up department name (label, not value)
      const selectedDept = departments?.find((d) => d.id === data.departmentId);
      const departmentName =
        selectedDept?.department_name ||
        selectedDept?.name ||
        selectedDept?.departmentName ||
        data.department ||
        data.departmentId ||
        '';

      // Look up designation title (label, not value)
      const selectedDesg = designations?.find((d) => d.id === data.designationId);
      const designationName =
        selectedDesg?.title ||
        selectedDesg?.name ||
        data.designation ||
        data.designationId ||
        '';

      const payload = {
        ...data,
        department: departmentName,
        designation: designationName,
        personalEmail: data.personalEmail.trim(),
        email: data.email?.trim() || undefined,
        employeeCode: data.employeeCode?.trim() || employee?.employeeCode || undefined,
        reportingManagerId: data.reportingManagerId?.trim() || undefined,
        workLocation: data.workLocation?.trim() || undefined,
        role: String(data.role || 'employee').toLowerCase(),
      };

      if (isEditMode && employee) {
        await updateEmployee({ id: employee.id, data: payload }).unwrap();
        toast.success(`${data.firstName} ${data.lastName}'s record updated.`, 'Employee Updated');
      } else {
        await createEmployee(payload).unwrap();
        toast.success(`${data.firstName} ${data.lastName} added to the workforce.`, 'Employee Created');
      }
      onClose();
    } catch (err: any) {
      const parsed = parseEmployeeApiError(err);

      if (parsed.generalMessage) {
        setGeneralError(parsed.generalMessage);
        toast.error(parsed.generalMessage, 'Save Error');
      }

      if (parsed.fieldErrors && Object.keys(parsed.fieldErrors).length > 0) {
        Object.entries(parsed.fieldErrors).forEach(([field, msg]) => {
          setError(field as any, {
            type: 'server',
            message: msg,
          });
        });
      }
    }
  };

  const managers = (managerPool?.items || []).filter((m) => m.id !== employee?.id);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="employee-form-headline"
    >
      <div className="w-full max-w-2xl bg-white dark:bg-[#171717] rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between bg-gray-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              {isEditMode ? <Pencil className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h2 id="employee-form-headline" className="text-base font-bold text-gray-900 dark:text-[#ececec]">
                {isEditMode ? 'Edit Employee' : 'Add New Employee'}
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                {isEditMode
                  ? `${employee?.firstName} ${employee?.lastName} • ${employee?.employeeCode}`
                  : 'Personal details, role placement, and work mode'}
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

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* General Error Banner */}
          {generalError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5 text-rose-700 dark:text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium leading-relaxed">{generalError}</div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="First Name *"
              placeholder="First name"
              error={errors.firstName?.message}
              {...register('firstName')}
            />
            <Input
              label="Last Name *"
              placeholder="Last name"
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Personal Email *"
              type="email"
              placeholder="personal@gmail.com"
              error={errors.personalEmail?.message}
              helperText="Required for personnel record"
              {...register('personalEmail')}
            />
            <Input
              label="Company Email (Optional)"
              type="email"
              placeholder="name@company.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Phone *"
              placeholder="+919876543210"
              error={errors.phone?.message}
              helperText="10-15 characters"
              {...register('phone')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="emp-gender" className="text-xs font-semibold text-gray-900 dark:text-[#ececec]">
                Gender
              </label>
              <select id="emp-gender" className={SELECT_CLASSES} {...register('gender')}>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
              {errors.gender?.message && <p className="text-xs text-rose-500">{errors.gender.message}</p>}
            </div>
            <Input
              label="Joining Date *"
              type="date"
              error={errors.joiningDate?.message}
              {...register('joiningDate')}
            />
            <div className="space-y-1.5">
              <label htmlFor="emp-type" className="text-xs font-semibold text-gray-900 dark:text-[#ececec]">
                Employment Type
              </label>
              <select id="emp-type" className={SELECT_CLASSES} {...register('employmentType')}>
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERN">Intern</option>
              </select>
              {errors.employmentType?.message && (
                <p className="text-xs text-rose-500">{errors.employmentType.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="emp-department" className="text-xs font-semibold text-gray-900 dark:text-[#ececec]">
                Department *
              </label>
              <select id="emp-department" className={SELECT_CLASSES} {...register('departmentId')}>
                <option value="">Select department</option>
                {(departments || []).map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.department_name || dept.name || dept.departmentName}
                  </option>
                ))}
              </select>
              {errors.departmentId?.message && (
                <p className="text-xs text-rose-500 font-medium">{errors.departmentId.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label htmlFor="emp-designation" className="text-xs font-semibold text-gray-900 dark:text-[#ececec]">
                Designation *
              </label>
              <select id="emp-designation" className={SELECT_CLASSES} {...register('designationId')}>
                <option value="">
                  {watchedDepartmentId ? 'Select designation' : 'Select a department first'}
                </option>
                {(designations || []).map((desg) => (
                  <option key={desg.id} value={desg.id}>
                    {desg.title}
                  </option>
                ))}
              </select>
              {errors.designationId?.message && (
                <p className="text-xs text-rose-500 font-medium">{errors.designationId.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="emp-manager" className="text-xs font-semibold text-gray-900 dark:text-[#ececec]">
              Reporting Manager (Optional)
            </label>
            <select id="emp-manager" className={SELECT_CLASSES} {...register('reportingManagerId')}>
              <option value="">No manager assigned</option>
              {managers.map((mgr) => (
                <option key={mgr.id} value={mgr.id}>
                  {mgr.fullName || `${mgr.firstName} ${mgr.lastName}`}
                  {mgr.designationTitle ? ` — ${mgr.designationTitle}` : mgr.designation?.title ? ` — ${mgr.designation.title}` : ''}
                </option>
              ))}
            </select>
            {errors.reportingManagerId?.message && (
              <p className="text-xs text-rose-500 font-medium">{errors.reportingManagerId.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Work Location (Optional)"
              placeholder="e.g. Jaipur HQ"
              error={errors.workLocation?.message}
              {...register('workLocation')}
            />
            <div className="space-y-1.5">
              <label htmlFor="emp-role" className="text-xs font-semibold text-gray-900 dark:text-[#ececec]">
                Access Role Tier
              </label>
              <select id="emp-role" className={SELECT_CLASSES} {...register('role')}>
                <option value="employee">Employee (Standard Personnel)</option>
                <option value="manager">Manager (Team Lead / Approver)</option>
                <option value="it_admin">IT Admin (Systems & Infrastructure)</option>
                <option value="executive">Executive (Leadership & Director)</option>
                <option value="hr_admin">HR Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
              {errors.role?.message && <p className="text-xs text-rose-500">{errors.role.message}</p>}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100 dark:border-zinc-800">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isBusy}
              disabled={isBusy}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isEditMode ? 'Save Changes' : 'Add Employee'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
