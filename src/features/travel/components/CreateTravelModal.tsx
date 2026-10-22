import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Plane, DollarSign, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { useToast } from '@/shared/ui/Toast';
import { useCreateTravelRequestMutation } from '../api/travelApi';
import { createTravelRequestSchema, type CreateTravelRequestFormData } from '../schemas/travel.schemas';

interface CreateTravelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTravelModal: React.FC<CreateTravelModalProps> = ({ isOpen, onClose }) => {
  const toast = useToast();
  const [createTravelRequest, { isLoading }] = useCreateTravelRequestMutation();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateTravelRequestFormData>({
    resolver: zodResolver(createTravelRequestSchema),
    defaultValues: {
      origin: '',
      destination: '',
      travelType: 'DOMESTIC',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      purpose: '',
      businessJustification: '',
      urgency: 'MEDIUM',
      expenses: {
        flights: 0,
        hotel: 0,
        cabs: 0,
        perDiem: 0,
        other: 0,
        currency: 'USD',
      },
      emergencyContact: '',
      notes: '',
    },
  });

  const watchExpenses = watch('expenses');
  const totalCalculated =
    Number(watchExpenses?.flights || 0) +
    Number(watchExpenses?.hotel || 0) +
    Number(watchExpenses?.cabs || 0) +
    Number(watchExpenses?.perDiem || 0) +
    Number(watchExpenses?.other || 0);

  if (!isOpen) return null;

  const onSubmit = async (data: CreateTravelRequestFormData) => {
    try {
      await createTravelRequest(data).unwrap();
      toast.success('Travel request submitted successfully for approval!', 'Request Created');
      reset();
      onClose();
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.data?.detail || 'Failed to submit travel request. Please check inputs and try again.',
        'Submission Error'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#171717] rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between shrink-0 bg-gray-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 p-0.5 shadow-sm shadow-brand-500/20">
              <div className="w-full h-full bg-white dark:bg-[#171717] rounded-[10px] flex items-center justify-center text-brand-600 dark:text-brand-400">
                <Plane className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 id="modal-headline" className="text-base sm:text-lg font-bold text-gray-900 dark:text-[#ececec]">
                Create Travel Request
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Submit corporate itinerary & expense estimates for managerial approval
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

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Section 1: Route & Type */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
              1. Itinerary & Travel Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Origin City"
                placeholder="e.g. New York, USA"
                leftIcon={<MapPin className="w-4 h-4" />}
                error={errors.origin?.message}
                {...register('origin')}
              />
              <Input
                label="Destination City"
                placeholder="e.g. London, UK"
                leftIcon={<MapPin className="w-4 h-4" />}
                error={errors.destination?.message}
                {...register('destination')}
              />
              <div>
                <label className="block font-semibold text-gray-900 dark:text-[#ececec] text-xs mb-1.5">
                  Travel Type
                </label>
                <select
                  {...register('travelType')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-[#212121] text-gray-900 dark:text-[#ececec] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
                >
                  <option value="DOMESTIC">Domestic</option>
                  <option value="INTERNATIONAL">International</option>
                </select>
                {errors.travelType?.message && (
                  <p className="text-xs text-rose-500 mt-1">{errors.travelType.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Start Date"
                type="date"
                leftIcon={<Calendar className="w-4 h-4" />}
                error={errors.startDate?.message}
                {...register('startDate')}
              />
              <Input
                label="End Date"
                type="date"
                leftIcon={<Calendar className="w-4 h-4" />}
                error={errors.endDate?.message}
                {...register('endDate')}
              />
            </div>
          </div>

          {/* Section 2: Purpose & Business Justification */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
              2. Business Purpose
            </h3>
            <Input
              label="Primary Purpose of Visit"
              placeholder="e.g. Client Onsite Quarterly Business Review & Architecture Workshop"
              error={errors.purpose?.message}
              {...register('purpose')}
            />
            <div>
              <label className="block font-semibold text-gray-900 dark:text-[#ececec] text-xs mb-1.5">
                Business Justification & Deliverables (Optional)
              </label>
              <textarea
                {...register('businessJustification')}
                rows={2}
                placeholder="Outline how this trip impacts corporate milestones or project revenue..."
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-[#212121] text-gray-900 dark:text-[#ececec] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors placeholder-gray-400 dark:placeholder-zinc-500"
              />
            </div>
          </div>

          {/* Section 3: Expense Estimates */}
          <div className="space-y-3 p-4 rounded-2xl bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-brand-500" />
                3. Estimated Expense Breakdown
              </h3>
              <div className="text-xs font-bold text-brand-600 dark:text-brand-400">
                Total Estimate: ${totalCalculated.toLocaleString()}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Input
                label="Airfare / Train"
                type="number"
                placeholder="0"
                inputSize="sm"
                error={errors.expenses?.flights?.message}
                {...register('expenses.flights')}
              />
              <Input
                label="Hotel / Lodging"
                type="number"
                placeholder="0"
                inputSize="sm"
                error={errors.expenses?.hotel?.message}
                {...register('expenses.hotel')}
              />
              <Input
                label="Local Transit / Cab"
                type="number"
                placeholder="0"
                inputSize="sm"
                error={errors.expenses?.cabs?.message}
                {...register('expenses.cabs')}
              />
              <Input
                label="Daily Per Diem"
                type="number"
                placeholder="0"
                inputSize="sm"
                error={errors.expenses?.perDiem?.message}
                {...register('expenses.perDiem')}
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Emergency Contact Phone"
              placeholder="+1 (555) 019-2834"
              error={errors.emergencyContact?.message}
              {...register('emergencyContact')}
            />
            <Input
              label="Special Instructions / Notes"
              placeholder="e.g. Dietary preferences, visa assistance required"
              error={errors.notes?.message}
              {...register('notes')}
            />
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-4 border-t border-gray-200 dark:border-zinc-800 flex items-center justify-end gap-3 shrink-0">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              Submit Request for Approval
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
