import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CirclePlus } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Textarea } from '@/shared/ui/Textarea';
import { useToast } from '@/shared/ui/Toast';
import { useAddPayrollAdjustmentMutation } from '../api/payrollApi';
import { payrollAdjustmentSchema, type PayrollAdjustmentFormData } from '../schemas/payroll.schemas';
import type { SalaryStructureItem } from '../types/payroll.types';
import { getPayrollErrorMessage } from '../payroll.utils';
import { PayrollModalShell } from './PayrollModalShell';

interface AddAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  month: number;
  year: number;
  employees: SalaryStructureItem[];
  employeesLoading: boolean;
  initialEmployeeId?: string;
}

const adjustmentTypes = [
  { value: 'BONUS', label: 'Bonus' },
  { value: 'INCENTIVE', label: 'Incentive' },
  { value: 'ARREAR', label: 'Arrear' },
  { value: 'DEDUCTION', label: 'Deduction' },
  { value: 'RECOVERY', label: 'Recovery' },
] as const;

export const AddAdjustmentModal: React.FC<AddAdjustmentModalProps> = ({
  isOpen,
  onClose,
  month,
  year,
  employees,
  employeesLoading,
  initialEmployeeId,
}) => {
  const toast = useToast();
  const [addPayrollAdjustment, { isLoading }] = useAddPayrollAdjustmentMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PayrollAdjustmentFormData>({
    resolver: zodResolver(payrollAdjustmentSchema),
    defaultValues: {
      employeeId: initialEmployeeId || '',
      month,
      year,
      type: 'BONUS',
      amount: 0,
      isTaxable: true,
      reason: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        employeeId: initialEmployeeId || '',
        month,
        year,
        type: 'BONUS',
        amount: 0,
        isTaxable: true,
        reason: '',
      });
    }
  }, [isOpen, initialEmployeeId, month, year, reset]);

  const onSubmit = async (data: PayrollAdjustmentFormData) => {
    try {
      await addPayrollAdjustment(data).unwrap();
      toast.success('The payroll adjustment has been added to the selected period.', 'Adjustment Added');
      onClose();
    } catch (error: unknown) {
      toast.error(getPayrollErrorMessage(error, 'Unable to add this payroll adjustment.'), 'Adjustment Failed');
    }
  };

  return (
    <PayrollModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Add Payroll Adjustment"
      description="Apply a one-time earning or recovery to an employee"
      icon={<CirclePlus className="w-5 h-5" />}
      maxWidthClassName="max-w-xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto p-5 sm:p-6 space-y-4" noValidate>
        <div className="space-y-1.5">
          <label htmlFor="adjustment-employee" className="text-xs font-semibold text-gray-900 dark:text-[#ececec]">Employee</label>
          <select
            id="adjustment-employee"
            disabled={employeesLoading}
            className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-60"
            {...register('employeeId')}
          >
            <option value="">{employeesLoading ? 'Loading employees…' : 'Select an employee'}</option>
            {employees.map((employee) => (
              <option key={employee.employeeId} value={employee.employeeId}>
                {employee.employeeName} · {employee.employeeCode} · {employee.department}
              </option>
            ))}
          </select>
          {errors.employeeId && <p className="text-xs text-rose-600">{errors.employeeId.message}</p>}
          {!employeesLoading && employees.length === 0 && (
            <p className="text-xs text-amber-600 dark:text-amber-400">No employee salary structures are available for adjustment.</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input label="Month" type="number" min={1} max={12} error={errors.month?.message} {...register('month')} />
          <Input label="Year" type="number" min={2020} error={errors.year?.message} {...register('year')} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label htmlFor="adjustment-type" className="text-xs font-semibold text-gray-900 dark:text-[#ececec]">Adjustment Type</label>
            <select
              id="adjustment-type"
              className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              {...register('type')}
            >
              {adjustmentTypes.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            {errors.type && <p className="text-xs text-rose-600">{errors.type.message}</p>}
          </div>
          <Input label="Amount" type="number" min={0} step="0.01" error={errors.amount?.message} {...register('amount')} />
        </div>

        <label className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-zinc-900/60 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 accent-indigo-600" {...register('isTaxable')} />
          <span className="text-sm text-gray-700 dark:text-zinc-300">Include this adjustment in taxable income</span>
        </label>

        <div className="space-y-1.5">
          <label htmlFor="adjustment-reason" className="text-xs font-semibold text-gray-900 dark:text-[#ececec]">Reason</label>
          <Textarea id="adjustment-reason" rows={3} error={Boolean(errors.reason)} {...register('reason')} />
          {errors.reason && <p className="text-xs text-rose-600">{errors.reason.message}</p>}
        </div>

        <div className="flex justify-end gap-2.5 pt-4 border-t border-gray-100 dark:border-zinc-800">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button type="submit" size="sm" isLoading={isLoading} leftIcon={<CirclePlus className="w-3.5 h-3.5" />}>
            Add Adjustment
          </Button>
        </div>
      </form>
    </PayrollModalShell>
  );
};

export default AddAdjustmentModal;
