import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, Play } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Textarea } from '@/shared/ui/Textarea';
import { useToast } from '@/shared/ui/Toast';
import { useInitiatePayrollRunMutation } from '../api/payrollApi';
import { initiatePayrollSchema, type InitiatePayrollFormData } from '../schemas/payroll.schemas';
import { formatPayrollMonth, getPayrollErrorMessage } from '../payroll.utils';
import { PayrollModalShell } from './PayrollModalShell';

interface InitiatePayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  month: number;
  year: number;
  onSuccess?: () => void;
}

export const InitiatePayrollModal: React.FC<InitiatePayrollModalProps> = ({
  isOpen,
  onClose,
  month,
  year,
  onSuccess,
}) => {
  const toast = useToast();
  const [initiatePayrollRun, { isLoading }] = useInitiatePayrollRunMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InitiatePayrollFormData>({
    resolver: zodResolver(initiatePayrollSchema),
    defaultValues: {
      month,
      year,
      includeApprovedExpenses: true,
      syncAttendanceLop: true,
      notes: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        month,
        year,
        includeApprovedExpenses: true,
        syncAttendanceLop: true,
        notes: '',
      });
    }
  }, [isOpen, month, year, reset]);

  const onSubmit = async (data: InitiatePayrollFormData) => {
    try {
      await initiatePayrollRun({
        ...data,
        notes: data.notes?.trim() || undefined,
      }).unwrap();
      toast.success(`${formatPayrollMonth(data.month, data.year)} payroll has been initiated.`, 'Payroll Run Created');
      onSuccess?.();
      onClose();
    } catch (error: unknown) {
      toast.error(getPayrollErrorMessage(error, 'Unable to initiate this payroll run.'), 'Initiation Failed');
    }
  };

  return (
    <PayrollModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Initiate Payroll Run"
      description={`Create a live batch for ${formatPayrollMonth(month, year)}`}
      icon={<Play className="w-5 h-5" />}
      maxWidthClassName="max-w-xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto p-5 sm:p-6 space-y-5" noValidate>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Month" type="number" min={1} max={12} error={errors.month?.message} {...register('month')} />
          <Input label="Year" type="number" min={2020} error={errors.year?.message} {...register('year')} />
        </div>

        <div className="space-y-3 rounded-2xl border border-gray-200 dark:border-zinc-800 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
            <Calendar className="w-4 h-4 text-indigo-500" /> Payroll Inputs
          </div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" className="mt-1 w-4 h-4 accent-indigo-600" {...register('syncAttendanceLop')} />
            <span>
              <span className="block text-sm font-medium text-gray-800 dark:text-zinc-200">Sync attendance and LOP</span>
              <span className="block text-xs text-gray-500 dark:text-zinc-400 mt-0.5">Use approved attendance records to calculate loss-of-pay deductions.</span>
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" className="mt-1 w-4 h-4 accent-indigo-600" {...register('includeApprovedExpenses')} />
            <span>
              <span className="block text-sm font-medium text-gray-800 dark:text-zinc-200">Include approved expense reimbursements</span>
              <span className="block text-xs text-gray-500 dark:text-zinc-400 mt-0.5">Add eligible approved expenses to this period's earnings.</span>
            </span>
          </label>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="initiate-payroll-notes" className="text-xs font-semibold text-gray-900 dark:text-[#ececec]">Notes (optional)</label>
          <Textarea
            id="initiate-payroll-notes"
            rows={3}
            placeholder="Add processing context for approvers"
            error={Boolean(errors.notes)}
            {...register('notes')}
          />
          {errors.notes && <p className="text-xs text-rose-600">{errors.notes.message}</p>}
        </div>

        <div className="flex justify-end gap-2.5 pt-4 border-t border-gray-100 dark:border-zinc-800">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button type="submit" size="sm" isLoading={isLoading} leftIcon={<Play className="w-3.5 h-3.5" />}>
            Initiate Payroll
          </Button>
        </div>
      </form>
    </PayrollModalShell>
  );
};

export default InitiatePayrollModal;
