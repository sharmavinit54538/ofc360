/**
 * @file AddTimelineEventModal.tsx
 * @description React Hook Form + Zod modal for HR administrators and managers to record
 * career milestones, promotions, performance reviews, certifications, and awards.
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  X,
  History,
  User,
  Calendar,
  FileText,
  TrendingUp,
  Award,
  Building2,
  Star,
  GraduationCap,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { useToast } from '@/shared/ui/Toast';
import { useAddTimelineEventMutation } from '../api/timelineApi';
import {
  addTimelineEventSchema,
  type AddTimelineEventFormData,
} from '../schemas/timelineForm.schema';
import type { TimelineEventType } from '../types';

interface AddTimelineEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmployeeId?: string;
  defaultEmployeeName?: string;
}

const EVENT_TYPE_OPTIONS: { label: string; value: TimelineEventType }[] = [
  { label: 'Joining & Onboarding', value: 'JOINING' },
  { label: 'Promotion', value: 'PROMOTION' },
  { label: 'Role Change', value: 'ROLE_CHANGE' },
  { label: 'Department Transfer', value: 'DEPARTMENT_TRANSFER' },
  { label: 'Performance Review', value: 'PERFORMANCE_REVIEW' },
  { label: 'Award & Recognition', value: 'AWARD_RECOGNITION' },
  { label: 'Training & Certification', value: 'TRAINING_CERTIFICATION' },
  { label: 'Leave / Sabbatical', value: 'LEAVE_SABBATICAL' },
  { label: 'Document Upload', value: 'DOCUMENT_UPLOAD' },
  { label: 'Exit Initiated', value: 'EXIT_INITIATED' },
];

export const AddTimelineEventModal: React.FC<AddTimelineEventModalProps> = ({
  isOpen,
  onClose,
  defaultEmployeeId = '',
  defaultEmployeeName = '',
}) => {
  const toast = useToast();
  const [addTimelineEvent, { isLoading }] = useAddTimelineEventMutation();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<AddTimelineEventFormData>({
    resolver: zodResolver(addTimelineEventSchema),
    defaultValues: {
      employeeId: defaultEmployeeId,
      employeeName: defaultEmployeeName,
      eventType: 'PROMOTION',
      title: '',
      description: '',
      timestamp: new Date().toISOString().split('T')[0],
      oldRole: '',
      newRole: '',
      department: '',
      rating: '',
      awardTitle: '',
      certificationName: '',
      notes: '',
    },
  });

  const selectedType = watch('eventType');

  if (!isOpen) return null;

  const onSubmit = async (data: AddTimelineEventFormData) => {
    try {
      const metadata: Record<string, any> = {};
      if (data.oldRole) metadata.oldRole = data.oldRole;
      if (data.newRole) metadata.newRole = data.newRole;
      if (data.department) metadata.department = data.department;
      if (data.rating) metadata.rating = data.rating;
      if (data.awardTitle) metadata.awardTitle = data.awardTitle;
      if (data.certificationName) metadata.certificationName = data.certificationName;
      if (data.notes) metadata.notes = data.notes;

      await addTimelineEvent({
        employeeId: data.employeeId,
        employeeName: data.employeeName,
        eventType: data.eventType,
        title: data.title,
        description: data.description,
        timestamp: data.timestamp,
        metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
      }).unwrap();

      toast.success(
        `Milestone "${data.title}" recorded for ${data.employeeName} successfully!`,
        'Event Logged'
      );
      reset();
      onClose();
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.data?.detail || 'Failed to record timeline milestone.',
        'Error'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
      <div
        className="w-full max-w-xl bg-white dark:bg-[#171717] rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-timeline-event-title"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between shrink-0 bg-gray-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 p-0.5 shadow-sm shadow-brand-500/20">
              <div className="w-full h-full bg-white dark:bg-[#171717] rounded-[10px] flex items-center justify-center text-brand-600 dark:text-brand-400">
                <History className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 id="add-timeline-event-title" className="text-base sm:text-lg font-bold text-gray-900 dark:text-[#ececec]">
                Record Career Milestone
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Log promotions, reviews, recognitions, or organizational changes
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-y-auto">
          <div className="p-6 space-y-4">
            {/* Employee ID & Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                  Employee ID / Staff Code <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    {...register('employeeId')}
                    placeholder="e.g. EMP-1049"
                    error={errors.employeeId?.message}
                    className="pl-9 font-mono"
                  />
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                  Employee Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    {...register('employeeName')}
                    placeholder="e.g. Sarah Connor"
                    error={errors.employeeName?.message}
                    className="pl-9"
                  />
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Event Category & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                  Milestone Category <span className="text-rose-500">*</span>
                </label>
                <select
                  {...register('eventType')}
                  className="w-full px-3 py-2 rounded-xl text-sm border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                >
                  {EVENT_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                  Effective Event Date <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    {...register('timestamp')}
                    type="date"
                    error={errors.timestamp?.message}
                    className="pl-9"
                  />
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Event Title */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                Milestone Headline / Title <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Input
                  {...register('title')}
                  placeholder="e.g. Promoted to Staff Software Engineer"
                  error={errors.title?.message}
                  className="pl-9"
                />
                <FileText className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Event Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                Detailed Context & Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                {...register('description')}
                rows={3}
                placeholder="Highlight key achievements, committee feedback, or reason for role transition..."
                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-[#ececec] text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
              {errors.description && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{errors.description.message}</p>
              )}
            </div>

            {/* Dynamic Metadata Section */}
            {(selectedType === 'PROMOTION' || selectedType === 'ROLE_CHANGE') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/50 dark:border-indigo-900/30">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                    Previous Designation
                  </label>
                  <Input
                    {...register('oldRole')}
                    placeholder="e.g. Senior Software Engineer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                    New Designation
                  </label>
                  <Input
                    {...register('newRole')}
                    placeholder="e.g. Staff Software Engineer"
                  />
                </div>
              </div>
            )}

            {selectedType === 'DEPARTMENT_TRANSFER' && (
              <div className="p-4 rounded-2xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-200/50 dark:border-cyan-900/30">
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                  Transfer Destination Department
                </label>
                <div className="relative">
                  <Input
                    {...register('department')}
                    placeholder="e.g. AI & Machine Learning Research"
                    className="pl-9"
                  />
                  <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>
            )}

            {selectedType === 'PERFORMANCE_REVIEW' && (
              <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30">
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                  Evaluation Score / Rating
                </label>
                <div className="relative">
                  <Input
                    {...register('rating')}
                    placeholder="e.g. Exceeds Expectations (4.8 / 5.0)"
                    className="pl-9"
                  />
                  <Star className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>
            )}

            {selectedType === 'AWARD_RECOGNITION' && (
              <div className="p-4 rounded-2xl bg-yellow-50/50 dark:bg-yellow-950/20 border border-yellow-200/50 dark:border-yellow-900/30">
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                  Award / Honor Title
                </label>
                <div className="relative">
                  <Input
                    {...register('awardTitle')}
                    placeholder="e.g. Innovator of the Year 2026"
                    className="pl-9"
                  />
                  <Award className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>
            )}

            {selectedType === 'TRAINING_CERTIFICATION' && (
              <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200/50 dark:border-teal-900/30">
                <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                  Certification Name
                </label>
                <div className="relative">
                  <Input
                    {...register('certificationName')}
                    placeholder="e.g. AWS Certified Solutions Architect"
                    className="pl-9"
                  />
                  <GraduationCap className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-zinc-800 flex items-center justify-end gap-3 bg-gray-50/50 dark:bg-zinc-900/40">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-xl text-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="rounded-xl text-sm px-5"
            >
              {isLoading ? 'Recording...' : 'Record Event'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTimelineEventModal;
