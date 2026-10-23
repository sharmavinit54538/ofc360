import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileCheck2, Send } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { useToast } from '@/shared/ui/Toast';
import { useSubmitTaxDeclarationMutation } from '../api/payrollApi';
import { taxDeclarationSchema, type TaxDeclarationFormData } from '../schemas/payroll.schemas';
import { getPayrollErrorMessage } from '../payroll.utils';
import { PayrollModalShell } from './PayrollModalShell';

interface SubmitTaxDeclarationModalProps {
  isOpen: boolean;
  onClose: () => void;
  financialYear: string;
}

export const SubmitTaxDeclarationModal: React.FC<SubmitTaxDeclarationModalProps> = ({ isOpen, onClose, financialYear }) => {
  const toast = useToast();
  const [submitDeclaration, { isLoading }] = useSubmitTaxDeclarationMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaxDeclarationFormData>({
    resolver: zodResolver(taxDeclarationSchema),
    defaultValues: { financialYear, regime: 'NEW_REGIME', section80C: 0, section80D: 0, hraRentAnnual: 0 },
  });

  useEffect(() => {
    if (isOpen) reset({ financialYear, regime: 'NEW_REGIME', section80C: 0, section80D: 0, hraRentAnnual: 0 });
  }, [isOpen, financialYear, reset]);

  const onSubmit = async (data: TaxDeclarationFormData) => {
    try {
      await submitDeclaration(data).unwrap();
      toast.success('Your tax declaration has been submitted for verification.', 'Declaration Submitted');
      onClose();
    } catch (error: unknown) {
      toast.error(getPayrollErrorMessage(error, 'Unable to submit this tax declaration.'), 'Submission Failed');
    }
  };

  return (
    <PayrollModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Submit Tax Declaration"
      description="Declare eligible investments and annual rent for payroll tax review"
      icon={<FileCheck2 className="w-5 h-5" />}
      maxWidthClassName="max-w-xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto p-5 sm:p-6 space-y-4" noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Financial Year" placeholder="YYYY-YY" error={errors.financialYear?.message} {...register('financialYear')} />
          <div className="space-y-1.5">
            <label htmlFor="declaration-regime" className="text-xs font-semibold text-gray-900 dark:text-white">Tax Regime</label>
            <select id="declaration-regime" className="w-full px-3.5 py-3 rounded-xl text-sm border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white" {...register('regime')}>
              <option value="NEW_REGIME">New Regime</option>
              <option value="OLD_REGIME">Old Regime</option>
            </select>
            {errors.regime && <p className="text-xs text-rose-600">{errors.regime.message}</p>}
          </div>
          <Input label="Section 80C" type="number" min={0} max={150000} step="0.01" error={errors.section80C?.message} {...register('section80C')} />
          <Input label="Section 80D" type="number" min={0} max={100000} step="0.01" error={errors.section80D?.message} {...register('section80D')} />
        </div>
        <Input label="Annual Rent for HRA" type="number" min={0} step="0.01" error={errors.hraRentAnnual?.message} {...register('hraRentAnnual')} />
        <div className="flex justify-end gap-2.5 pt-4 border-t border-gray-100 dark:border-zinc-800">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button type="submit" size="sm" isLoading={isLoading} leftIcon={<Send className="w-3.5 h-3.5" />}>Submit Declaration</Button>
        </div>
      </form>
    </PayrollModalShell>
  );
};

export default SubmitTaxDeclarationModal;
