import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Award, Calendar, Clock } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Textarea } from '@/shared/ui/Textarea';
import { useToast } from '@/shared/ui/Toast';
import { useRequestCompOffMutation } from '../api/leaveApi';
import { compOffRequestSchema, type CompOffRequestFormData } from '../schemas/leave.schemas';

interface CompOffModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompOffModal: React.FC<CompOffModalProps> = ({ isOpen, onClose }) => {
  const toast = useToast();
  const [requestCompOff, { isLoading }] = useRequestCompOffMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompOffRequestFormData>({
    resolver: zodResolver(compOffRequestSchema),
    defaultValues: {
      workedDate: new Date().toISOString().split('T')[0],
      hoursWorked: 8,
      reason: '',
    },
  });

  if (!isOpen) return null;

  const onSubmit = async (data: CompOffRequestFormData) => {
    try {
      await requestCompOff(data).unwrap();
      toast.success('Comp-off claim submitted for HR review!', 'Claim Created');
      reset();
      onClose();
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.data?.detail || 'Failed to submit comp-off claim. Please try again.',
        'Submission Error'
      );
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
      <div
        className="w-full max-w-lg bg-white dark:bg-[#171717] rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-labelledby="compoff-headline"
      >
        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between bg-gray-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 dark:bg-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 id="compoff-headline" className="text-base font-bold text-gray-900 dark:text-[#ececec]">
                Claim Compensatory Off
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Credit time-off for weekend or holiday duty
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Extra Duty Date"
              type="date"
              leftIcon={<Calendar className="w-4 h-4" />}
              error={errors.workedDate?.message}
              {...register('workedDate')}
            />
            <Input
              label="Hours Worked"
              type="number"
              step="0.5"
              min="0"
              max="24"
              leftIcon={<Clock className="w-4 h-4" />}
              error={errors.hoursWorked?.message}
              {...register('hoursWorked')}
            />
          </div>

          <div className="w-full space-y-1.5">
            <label htmlFor="reason" className="block text-xs font-semibold text-gray-900 dark:text-[#ececec]">
              Duty Description
            </label>
            <Textarea
              id="reason"
              rows={3}
              placeholder="Describe the weekend / holiday duty performed..."
              {...register('reason')}
            />
            {errors.reason && (
              <p className="text-xs text-rose-600 dark:text-rose-400">{errors.reason.message}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100 dark:border-zinc-800">
            <Button type="button" variant="ghost" size="sm" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isLoading}
              disabled={isLoading}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              Submit Comp-Off Claim
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompOffModal;
