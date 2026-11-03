/**
 * @file ScheduleInterviewSlotModal.tsx
 * @description Dialog for scheduling an interview slot with 7-day range validation,
 * Online/Offline mode branching, slot conflict handling (409), and calendar invite trigger.
 * Connects to: POST /api/v1/interviews/{interview_id}/schedule
 */

import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  X,
  Calendar,
  Clock,
  Video,
  MapPin,
  AlertCircle,
  Loader2,
  CalendarCheck,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { useToast } from '@/shared/ui/Toast';
import {
  scheduleSlotSchema,
  type ScheduleSlotFormData,
} from '../schemas/interviewScheduler.schema';
import {
  interviewSchedulerClient,
  InterviewApiError,
} from '../api/interviewSchedulerApi';
import type { InterviewMode } from '../types/interviewScheduler.types';

interface ScheduleInterviewSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  interviewId: string;
  roundName: string;
  candidateName?: string;
  jobTitle?: string;
  onSuccess?: () => void;
}

const PRESET_TIME_SLOTS = [
  { label: '09:30 AM', value: '09:30:00' },
  { label: '10:30 AM', value: '10:30:00' },
  { label: '11:30 AM', value: '11:30:00' },
  { label: '02:00 PM', value: '14:00:00' },
  { label: '03:30 PM', value: '15:30:00' },
  { label: '04:30 PM', value: '16:30:00' },
  { label: '05:30 PM', value: '17:30:00' },
];

export const ScheduleInterviewSlotModal: React.FC<ScheduleInterviewSlotModalProps> = ({
  isOpen,
  onClose,
  interviewId,
  roundName,
  candidateName,
  jobTitle,
  onSuccess,
}) => {
  const toast = useToast();
  const [conflictError, setConflictError] = useState<string | null>(null);

  // Calculate 7-day constraint boundaries (Today to Today + 7 days)
  const { minDate, maxDate, defaultDate } = useMemo(() => {
    const now = new Date();
    const min = now.toISOString().split('T')[0];

    const maxObj = new Date(now);
    maxObj.setDate(now.getDate() + 7);
    const max = maxObj.toISOString().split('T')[0];

    // Default to tomorrow or today
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const def = tomorrow.toISOString().split('T')[0];

    return { minDate: min, maxDate: max, defaultDate: def };
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ScheduleSlotFormData>({
    resolver: zodResolver(scheduleSlotSchema),
    defaultValues: {
      interview_date: defaultDate,
      interview_time: '11:30:00',
      mode: 'ONLINE',
      meeting_url: 'https://meet.google.com/',
      office_address: '',
    },
  });

  const selectedMode = watch('mode');
  const selectedTime = watch('interview_time');

  if (!isOpen) return null;

  const onSubmit = async (values: ScheduleSlotFormData) => {
    setConflictError(null);
    try {
      await interviewSchedulerClient.bookInterviewSlot(interviewId, {
        interview_date: values.interview_date,
        interview_time: values.interview_time,
        mode: values.mode,
        meeting_url: values.mode === 'ONLINE' ? values.meeting_url : null,
        office_address: values.mode === 'OFFLINE' ? values.office_address : null,
      });

      toast.success(
        `Interview scheduled for ${values.interview_date} at ${values.interview_time}. Calendar invite has been sent.`,
        'Slot Confirmed'
      );

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      if (err instanceof InterviewApiError && err.status === 409) {
        setConflictError(err.message);
      } else {
        const msg = err?.message || 'Failed to schedule interview slot.';
        setConflictError(msg);
        toast.error(msg, 'Scheduling Error');
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="schedule-slot-title"
    >
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between bg-gradient-to-r from-teal-500/10 via-sky-500/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="schedule-slot-title"
                className="text-base font-bold text-gray-900 dark:text-zinc-100"
              >
                Schedule Interview Slot
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                {candidateName ? `${candidateName} • ` : ''}
                <span className="font-semibold text-teal-600 dark:text-teal-400">
                  {roundName}
                </span>
                {jobTitle ? ` (${jobTitle})` : ''}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* 409 Conflict / Error Alert */}
          {conflictError && (
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Scheduling Conflict</p>
                <p>{conflictError}</p>
              </div>
            </div>
          )}

          {/* Current Round Indicator */}
          <div className="p-3.5 rounded-2xl bg-teal-50/60 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span className="text-xs text-teal-900 dark:text-teal-300 font-medium">
                Target Round:
              </span>
              <span className="text-xs font-bold text-teal-950 dark:text-teal-100">
                {roundName}
              </span>
            </div>
            <span className="text-[11px] font-semibold text-teal-700 dark:text-teal-400 uppercase tracking-wider">
              Next in Queue
            </span>
          </div>

          {/* Date Picker (Strict 7 days window) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-800 dark:text-zinc-200 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                Interview Date
              </label>
              <span className="text-[11px] text-gray-400">Within next 7 days</span>
            </div>
            <input
              type="date"
              min={minDate}
              max={maxDate}
              {...register('interview_date')}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {errors.interview_date && (
              <p className="text-xs text-rose-500 font-medium mt-1">
                {errors.interview_date.message}
              </p>
            )}
          </div>

          {/* Time Picker & Quick Presets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-800 dark:text-zinc-200 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                Time Slot
              </label>
              <span className="text-[11px] text-gray-400">Standard 45-60 min</span>
            </div>

            {/* Quick Slot Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {PRESET_TIME_SLOTS.map((slot) => {
                const isActive = selectedTime === slot.value;
                return (
                  <button
                    key={slot.value}
                    type="button"
                    onClick={() => {
                      setValue('interview_time', slot.value, { shouldValidate: true });
                      setConflictError(null);
                    }}
                    className={`px-2.5 py-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                      isActive
                        ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                        : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border-gray-200 dark:border-zinc-700 hover:border-teal-400 hover:bg-teal-50/50'
                    }`}
                  >
                    {slot.label}
                  </button>
                );
              })}
            </div>

            {/* Manual Custom Time input */}
            <input
              type="time"
              step="300"
              {...register('interview_time')}
              className="w-full mt-1 px-3.5 py-2 rounded-xl text-xs border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {errors.interview_time && (
              <p className="text-xs text-rose-500 font-medium">
                {errors.interview_time.message}
              </p>
            )}
          </div>

          {/* Mode Toggle (Online vs In-person) */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-800 dark:text-zinc-200 block">
              Interview Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center gap-2.5 p-3 rounded-2xl border cursor-pointer transition-all ${
                  selectedMode === 'ONLINE'
                    ? 'border-teal-600 bg-teal-50/40 dark:bg-teal-950/20 text-teal-900 dark:text-teal-200 shadow-sm'
                    : 'border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800/60 text-gray-700 dark:text-zinc-300'
                }`}
              >
                <input
                  type="radio"
                  value="ONLINE"
                  {...register('mode')}
                  className="sr-only"
                />
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    selectedMode === 'ONLINE'
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 dark:bg-zinc-800 text-gray-500'
                  }`}
                >
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold">Online (Video)</p>
                  <p className="text-[11px] text-gray-500 dark:text-zinc-400">
                    Google Meet / Zoom
                  </p>
                </div>
              </label>

              <label
                className={`flex items-center gap-2.5 p-3 rounded-2xl border cursor-pointer transition-all ${
                  selectedMode === 'OFFLINE'
                    ? 'border-teal-600 bg-teal-50/40 dark:bg-teal-950/20 text-teal-900 dark:text-teal-200 shadow-sm'
                    : 'border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800/60 text-gray-700 dark:text-zinc-300'
                }`}
              >
                <input
                  type="radio"
                  value="OFFLINE"
                  {...register('mode')}
                  className="sr-only"
                />
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    selectedMode === 'OFFLINE'
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 dark:bg-zinc-800 text-gray-500'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold">In-person (Offline)</p>
                  <p className="text-[11px] text-gray-500 dark:text-zinc-400">
                    Office / Tech Park
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Conditional Input: Online (meeting_url) vs Offline (office_address) */}
          {selectedMode === 'ONLINE' ? (
            <div className="space-y-1.5 animate-in fade-in-50 duration-200">
              <label className="text-xs font-semibold text-gray-800 dark:text-zinc-200 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-teal-600" />
                Meeting URL
              </label>
              <input
                type="url"
                placeholder="https://meet.google.com/abc-defg-hij"
                {...register('meeting_url')}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {errors.meeting_url && (
                <p className="text-xs text-rose-500 font-medium mt-1">
                  {errors.meeting_url.message}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-1.5 animate-in fade-in-50 duration-200">
              <label className="text-xs font-semibold text-gray-800 dark:text-zinc-200 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                Office Address / Room
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Tower B, 5th Floor, Conference Room Alpha, Tech Park"
                {...register('office_address')}
                className="w-full px-3.5 py-2 rounded-xl text-sm border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {errors.office_address && (
                <p className="text-xs text-rose-500 font-medium mt-1">
                  {errors.office_address.message}
                </p>
              )}
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="bg-teal-600 hover:bg-teal-700 text-white font-medium shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                  Booking Slot...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  Confirm & Send Calendar Invite
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

