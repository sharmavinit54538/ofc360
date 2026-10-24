import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Users2, Star } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Textarea } from '@/shared/ui/Textarea';
import { useToast } from '@/shared/ui/Toast';
import { cn } from '@/shared/lib/utils';
import { useSubmitPeerFeedbackMutation } from '../api/performanceApi';
import { peerFeedbackSchema, type PeerFeedbackFormData } from '../schemas/performance.schemas';
import type { ReviewCycle } from '../types/performance.types';

interface PeerFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  cycles: ReviewCycle[];
}

export const PeerFeedbackModal: React.FC<PeerFeedbackModalProps> = ({ isOpen, onClose, cycles }) => {
  const toast = useToast();
  const [submitFeedback, { isLoading: isSubmitting }] = useSubmitPeerFeedbackMutation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PeerFeedbackFormData>({
    resolver: zodResolver(peerFeedbackSchema),
    defaultValues: { toEmployeeId: '', cycleId: '', feedback: '', rating: 5 },
  });

  const watchRating = Number(watch('rating') ?? 5);
  const activeCycles = cycles.filter((c) => c.status === 'ACTIVE');
  const availableCycles = activeCycles.length > 0 ? activeCycles : cycles;

  if (!isOpen) return null;

  const handleClose = () => {
    reset({ toEmployeeId: '', cycleId: '', feedback: '', rating: 5 });
    onClose();
  };

  const onSubmit = async (data: PeerFeedbackFormData) => {
    try {
      await submitFeedback({
        toEmployeeId: data.toEmployeeId,
        cycleId: data.cycleId || undefined,
        feedback: data.feedback,
        rating: Number(data.rating),
      }).unwrap();
      toast.success('Peer feedback submitted successfully.', 'Feedback Sent');
      handleClose();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to submit peer feedback.', 'Submission Error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
      <div
        className="w-full max-w-md bg-white dark:bg-[#171717] rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-labelledby="peer-feedback-headline"
      >
        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between bg-gray-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 dark:bg-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400">
              <Users2 className="w-5 h-5" />
            </div>
            <div>
              <h2 id="peer-feedback-headline" className="text-base font-bold text-gray-900 dark:text-[#ececec]">
                Submit Peer Feedback
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                360-degree input for a colleague
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
          <Input
            label="Employee ID / Name"
            placeholder="Enter recipient employee ID or name"
            error={errors.toEmployeeId?.message}
            {...register('toEmployeeId')}
          />

          <div className="space-y-1.5">
            <label htmlFor="feedback-cycle" className="text-xs font-semibold text-gray-900 dark:text-[#ececec]">
              Review Cycle (optional)
            </label>
            <select
              id="feedback-cycle"
              className="w-full px-3 py-2 rounded-lg text-sm border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              {...register('cycleId')}
            >
              <option value="">No cycle linkage</option>
              {availableCycles.map((cycle) => (
                <option key={cycle.id} value={cycle.id}>
                  {cycle.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-gray-900 dark:text-[#ececec]">Overall Rating</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setValue('rating', star, { shouldValidate: true })}
                  className="p-0.5 transition-transform hover:scale-110"
                  aria-label={`Rate ${star} of 5`}
                >
                  <Star
                    className={cn(
                      'w-6 h-6',
                      star <= watchRating ? 'text-amber-400' : 'text-gray-300 dark:text-zinc-600'
                    )}
                    fill="currentColor"
                  />
                </button>
              ))}
            </div>
            {errors.rating?.message && <p className="text-xs text-rose-500">{errors.rating.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="peer-feedback-text" className="text-xs font-semibold text-gray-900 dark:text-[#ececec]">
              Feedback
            </label>
            <Textarea
              id="peer-feedback-text"
              rows={4}
              placeholder="Share specific, constructive observations about collaboration, delivery, and teamwork..."
              error={Boolean(errors.feedback)}
              {...register('feedback')}
            />
            {errors.feedback?.message && (
              <p className="text-xs text-rose-500">{errors.feedback.message}</p>
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
              isLoading={isSubmitting}
              disabled={isSubmitting}
              className="bg-violet-600 hover:bg-violet-700 text-white"
            >
              Submit Feedback
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PeerFeedbackModal;
