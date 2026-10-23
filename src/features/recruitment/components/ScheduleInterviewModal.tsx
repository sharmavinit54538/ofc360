import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, CalendarDays } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Textarea } from '@/shared/ui/Textarea';
import { useToast } from '@/shared/ui/Toast';
import type { EmployeeItem } from '@/features/workforce/types/workforce.types';
import { useScheduleInterviewMutation } from '../api/recruitmentApi';
import { scheduleInterviewSchema, type ScheduleInterviewFormData } from '../schemas/recruitment.schemas';
import type { CandidateItem, JobOpening } from '../types/recruitment.types';

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidates: CandidateItem[];
  jobs: JobOpening[];
  interviewers: EmployeeItem[];
  preSelectedCandidateId?: string;
}

const selectClass =
  'w-full px-3 py-2 rounded-lg text-sm border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';

const Field: React.FC<{ label: string; error?: string; children: React.ReactNode }> = ({
  label,
  error,
  children,
}) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-gray-900 dark:text-[#ececec]">{label}</label>
    {children}
    {error && <p className="text-xs text-rose-500">{error}</p>}
  </div>
);

export const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({
  isOpen,
  onClose,
  candidates,
  jobs,
  interviewers,
  preSelectedCandidateId,
}) => {
  const toast = useToast();
  const [scheduleInterview, { isLoading: isSaving }] = useScheduleInterviewMutation();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ScheduleInterviewFormData>({
    resolver: zodResolver(scheduleInterviewSchema),
    defaultValues: {
      candidateId: preSelectedCandidateId || '',
      jobId: '',
      roundName: 'Technical Round',
      roundNumber: 1,
      interviewDate: '',
      startTime: '',
      endTime: '',
      interviewerIds: [],
      meetingType: 'ONLINE',
      meetingLink: '',
      instructions: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        candidateId: preSelectedCandidateId || '',
        jobId: '',
        roundName: 'Technical Round',
        roundNumber: 1,
        interviewDate: '',
        startTime: '',
        endTime: '',
        interviewerIds: [],
        meetingType: 'ONLINE',
        meetingLink: '',
        instructions: '',
      });
    }
  }, [isOpen, preSelectedCandidateId, reset]);

  const meetingType = watch('meetingType');

  if (!isOpen) return null;

  const onSubmit = async (data: ScheduleInterviewFormData) => {
    try {
      await scheduleInterview({
        ...data,
        meetingLink: data.meetingLink?.trim() ? data.meetingLink.trim() : undefined,
        instructions: data.instructions?.trim() ? data.instructions.trim() : undefined,
      }).unwrap();
      toast.success('Interview round scheduled successfully.', 'Interview Scheduled');
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to schedule the interview.', 'Save Error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
      <div
        className="w-full max-w-lg bg-white dark:bg-[#171717] rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-labelledby="schedule-interview-headline"
      >
        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between bg-gray-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 dark:bg-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h2 id="schedule-interview-headline" className="text-base font-bold text-gray-900 dark:text-[#ececec]">
                Schedule Interview
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Book the next conversation round for a candidate
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

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <Field label="Candidate" error={errors.candidateId?.message}>
            <select className={selectClass} {...register('candidateId')}>
              <option value="">Select candidate</option>
              {candidates.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName} — {c.appliedJob?.title}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Job Opening" error={errors.jobId?.message}>
            <select className={selectClass} {...register('jobId')}>
              <option value="">Select job</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title} ({job.jobCode})
                </option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Round Name" placeholder="Technical Round" error={errors.roundName?.message} {...register('roundName')} />
            <Input label="Round Number" type="number" error={errors.roundNumber?.message} {...register('roundNumber', { valueAsNumber: true })} />
            <Input label="Interview Date" type="date" error={errors.interviewDate?.message} {...register('interviewDate')} />
            <div className="grid grid-cols-2 gap-2">
              <Input label="Start Time" type="time" error={errors.startTime?.message} {...register('startTime')} />
              <Input label="End Time" type="time" error={errors.endTime?.message} {...register('endTime')} />
            </div>
          </div>

          <Field label="Interviewers" error={errors.interviewerIds?.message as string | undefined}>
            <select multiple size={4} className={selectClass} {...register('interviewerIds')}>
              {interviewers.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName} — {emp.designation?.title || emp.department?.name || ''}
                </option>
              ))}
            </select>
            <p className="text-[10px] text-gray-400">Hold Ctrl/Cmd to select multiple interviewers.</p>
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Meeting Type" error={errors.meetingType?.message}>
              <select className={selectClass} {...register('meetingType')}>
                <option value="ONLINE">Online (Video Call)</option>
                <option value="IN_PERSON">In Person</option>
              </select>
            </Field>
            <Input
              label="Meeting Link"
              placeholder={meetingType === 'ONLINE' ? 'https://meet.example.com/…' : 'Not required for in-person'}
              error={errors.meetingLink?.message}
              {...register('meetingLink')}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="interview-instructions" className="text-xs font-semibold text-gray-900 dark:text-[#ececec]">
              Instructions (optional)
            </label>
            <Textarea
              id="interview-instructions"
              rows={3}
              placeholder="Prep notes, attachments directions, access details…"
              error={Boolean(errors.instructions)}
              {...register('instructions')}
            />
            {errors.instructions?.message && <p className="text-xs text-rose-500">{errors.instructions.message}</p>}
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
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Schedule Round
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleInterviewModal;
