import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, UserCog } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Textarea } from '@/shared/ui/Textarea';
import { useToast } from '@/shared/ui/Toast';
import { useUpdateEmployeeStatusMutation } from '../api/workforceApi';
import {
  updateEmployeeStatusSchema,
  type UpdateEmployeeStatusFormData,
} from '../schemas/workforce.schemas';
import type { EmployeeItem, EmployeeStatusAction } from '../types/workforce.types';

interface UpdateStatusModalProps {
  employee: EmployeeItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const STATUS_OPTIONS: { id: EmployeeStatusAction; label: string }[] = [
  { id: 'ACTIVE', label: 'Active' },
  { id: 'PROBATION', label: 'Probation' },
  { id: 'ONBOARDING', label: 'Onboarding' },
  { id: 'INVITED', label: 'Invited' },
  { id: 'PENDING', label: 'Pending' },
  { id: 'ON_LEAVE', label: 'On Leave' },
  { id: 'NOTICE_PERIOD', label: 'Notice Period' },
  { id: 'SUSPENDED', label: 'Suspended' },
  { id: 'DEACTIVATED', label: 'Deactivated' },
  { id: 'TERMINATED', label: 'Terminated' },
  { id: 'INACTIVE', label: 'Inactive' },
];

const STATUS_DESCRIPTIONS: Partial<Record<EmployeeStatusAction, string>> = {
  ACTIVE: 'Confirmed employee on active rolls',
  PROBATION: 'Under probationary evaluation period',
  ONBOARDING: 'Currently completing onboarding orientation',
  INVITED: 'Invitation sent; account awaiting activation',
  PENDING: 'Pending registration or invitation',
  ON_LEAVE: 'On approved leave of absence',
  NOTICE_PERIOD: 'Serving notice before exit date',
  SUSPENDED: 'Temporarily relieved of duties pending review',
  DEACTIVATED: 'Account deactivated from system access',
  TERMINATED: 'Employment formally ended',
  INACTIVE: 'Record marked inactive',
};

export const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({ employee, isOpen, onClose }) => {
  const toast = useToast();
  const [updateStatus, { isLoading: isSaving }] = useUpdateEmployeeStatusMutation();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<UpdateEmployeeStatusFormData>({
    resolver: zodResolver(updateEmployeeStatusSchema),
    defaultValues: {
      status: 'ACTIVE',
      effectiveDate: new Date().toISOString().slice(0, 10),
      reason: '',
    },
  });

  useEffect(() => {
    if (employee && isOpen) {
      const match = STATUS_OPTIONS.find((o) => o.id === (employee.status as any));
      reset({
        status: match ? match.id : 'ACTIVE',
        effectiveDate: new Date().toISOString().slice(0, 10),
        reason: '',
      });
    }
  }, [employee, isOpen, reset]);

  const watchedStatus = watch('status');

  if (!isOpen || !employee) return null;

  const onSubmit = async (data: UpdateEmployeeStatusFormData) => {
    try {
      await updateStatus({ id: employee.id, data }).unwrap();
      toast.success(
        `${employee.firstName} ${employee.lastName}'s status changed to ${data.status}.`,
        'Status Updated'
      );
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update employee status.', 'Save Error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
      <div
        className="w-full max-w-md bg-white dark:bg-[#171717] rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-labelledby="update-status-headline"
      >
        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between bg-gray-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <UserCog className="w-5 h-5" />
            </div>
            <div>
              <h2 id="update-status-headline" className="text-base font-bold text-gray-900 dark:text-[#ececec]">
                Update Employee Status
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                {employee.firstName} {employee.lastName} • {employee.employeeCode}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="status-select" className="text-xs font-semibold text-gray-900 dark:text-[#ececec]">
              New Status
            </label>
            <select
              id="status-select"
              className="w-full px-3 py-2 rounded-lg text-sm border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              {...register('status')}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
            {STATUS_DESCRIPTIONS[watchedStatus] && (
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                {STATUS_DESCRIPTIONS[watchedStatus]}
              </p>
            )}
            {errors.status?.message && <p className="text-xs text-rose-500">{errors.status.message}</p>}
          </div>

          <Input
            label="Effective Date"
            type="date"
            error={errors.effectiveDate?.message}
            {...register('effectiveDate')}
          />

          <div className="space-y-1.5">
            <label htmlFor="status-reason" className="text-xs font-semibold text-gray-900 dark:text-[#ececec]">
              Reason for Change
            </label>
            <Textarea
              id="status-reason"
              rows={3}
              placeholder="Explain the context of this status transition (min 10 characters)..."
              error={Boolean(errors.reason)}
              {...register('reason')}
            />
            {errors.reason?.message && <p className="text-xs text-rose-500">{errors.reason.message}</p>}
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100 dark:border-zinc-800">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSaving}
              disabled={isSaving}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Update Status
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateStatusModal;
