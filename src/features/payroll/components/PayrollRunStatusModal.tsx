import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, CircleDollarSign, X } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Textarea } from '@/shared/ui/Textarea';
import { useToast } from '@/shared/ui/Toast';
import { useUpdatePayrollRunStatusMutation } from '../api/payrollApi';
import { updatePayrollRunStatusSchema, type UpdatePayrollRunStatusFormData } from '../schemas/payroll.schemas';
import type { PayrollRunItem, UpdatePayrollRunStatusPayload } from '../types/payroll.types';
import { formatPayrollMonth, getPayrollErrorMessage } from '../payroll.utils';
import { PayrollModalShell } from './PayrollModalShell';

interface PayrollRunStatusModalProps {
  run: PayrollRunItem | null;
  status: UpdatePayrollRunStatusPayload['status'];
  onClose: () => void;
}

const actionCopy: Record<UpdatePayrollRunStatusPayload['status'], { title: string; submit: string }> = {
  APPROVED: { title: 'Approve Payroll Run', submit: 'Approve Run' },
  PAID: { title: 'Mark Payroll Disbursed', submit: 'Confirm Disbursement' },
  REJECTED: { title: 'Reject Payroll Run', submit: 'Reject Run' },
};

export const PayrollRunStatusModal: React.FC<PayrollRunStatusModalProps> = ({ run, status, onClose }) => {
  const toast = useToast();
  const [updateStatus, { isLoading }] = useUpdatePayrollRunStatusMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdatePayrollRunStatusFormData>({
    resolver: zodResolver(updatePayrollRunStatusSchema),
    defaultValues: { status, transactionReference: '', remarks: '' },
  });

  useEffect(() => {
    if (run) reset({ status, transactionReference: '', remarks: '' });
  }, [run, status, reset]);

  const copy = actionCopy[status];
  const ActionIcon = status === 'APPROVED' ? Check : status === 'PAID' ? CircleDollarSign : X;

  const onSubmit = async (data: UpdatePayrollRunStatusFormData) => {
    if (!run) return;
    try {
      const payload: UpdatePayrollRunStatusPayload = {
        status: data.status,
        ...(data.status === 'PAID' && data.transactionReference?.trim()
          ? { transactionReference: data.transactionReference.trim() }
          : {}),
        ...(data.remarks?.trim() ? { remarks: data.remarks.trim() } : {}),
      };
      await updateStatus({ id: run.id, data: payload }).unwrap();
      const message = data.status === 'PAID'
        ? 'Payroll has been marked as disbursed with the supplied transaction reference.'
        : data.status === 'APPROVED'
          ? 'Payroll run approved successfully.'
          : 'Payroll run rejected and returned for correction.';
      toast.success(message, copy.title);
      onClose();
    } catch (error: unknown) {
      toast.error(getPayrollErrorMessage(error, 'Unable to update this payroll run.'), 'Status Update Failed');
    }
  };

  return (
    <PayrollModalShell
      isOpen={Boolean(run)}
      onClose={onClose}
      title={copy.title}
      description={run ? formatPayrollMonth(run.month, run.year) : undefined}
      icon={<ActionIcon className="w-5 h-5" />}
      maxWidthClassName="max-w-xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto p-5 sm:p-6 space-y-4" noValidate>
        <input type="hidden" {...register('status')} />
        {run && (
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-zinc-900/60 text-center">
            <div><p className="text-[11px] text-gray-500">Employees</p><p className="font-bold text-gray-900 dark:text-white">{run.totalEmployees}</p></div>
            <div><p className="text-[11px] text-gray-500">Gross</p><p className="font-bold text-gray-900 dark:text-white">{run.grossAmount.toLocaleString('en-IN')}</p></div>
            <div><p className="text-[11px] text-gray-500">Net Payable</p><p className="font-bold text-emerald-600">{run.netPayable.toLocaleString('en-IN')}</p></div>
          </div>
        )}

        {status === 'PAID' && (
          <Input
            label="Transaction Reference / UTR"
            placeholder="Enter the bank settlement reference"
            error={errors.transactionReference?.message}
            {...register('transactionReference')}
          />
        )}

        <div className="space-y-1.5">
          <label htmlFor="payroll-run-remarks" className="text-xs font-semibold text-gray-900 dark:text-[#ececec]">
            Remarks {status === 'REJECTED' ? '(required)' : '(optional)'}
          </label>
          <Textarea
            id="payroll-run-remarks"
            rows={4}
            error={Boolean(errors.remarks)}
            placeholder={status === 'REJECTED' ? 'Explain what must be corrected before rerunning payroll' : 'Add an audit note for this status change'}
            {...register('remarks')}
          />
          {errors.remarks && <p className="text-xs text-rose-600">{errors.remarks.message}</p>}
        </div>

        <div className="flex justify-end gap-2.5 pt-4 border-t border-gray-100 dark:border-zinc-800">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button type="submit" size="sm" variant={status === 'REJECTED' ? 'danger' : 'primary'} isLoading={isLoading} leftIcon={<ActionIcon className="w-3.5 h-3.5" />}>
            {copy.submit}
          </Button>
        </div>
      </form>
    </PayrollModalShell>
  );
};

export default PayrollRunStatusModal;
