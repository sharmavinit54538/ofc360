/**
 * @file UploadMeetingModal.tsx
 * @description Upload modal with React Hook Form + Zod schema validation
 * for submitting audio/video recording files or calendar links for AI transcription.
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  X,
  Upload,
  Video,
  FileAudio,
  Link,
  Calendar,
  Tag,
  Users,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import type { ProcessMeetingAudioPayload } from '../types';

const uploadSchema = z.object({
  meetingTitle: z.string().min(3, 'Meeting title must be at least 3 characters'),
  meetingDate: z.string().min(1, 'Meeting date is required'),
  recordingUrl: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
  tags: z.string().optional(),
  participants: z.string().optional(),
});

type UploadFormData = z.infer<typeof uploadSchema>;

interface UploadMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: ProcessMeetingAudioPayload) => Promise<void>;
  isSubmitting?: boolean;
}

export const UploadMeetingModal: React.FC<UploadMeetingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      meetingTitle: '',
      meetingDate: new Date().toISOString().split('T')[0],
      recordingUrl: '',
      tags: '',
      participants: '',
    },
  });

  if (!isOpen) return null;

  const handleFormSubmit = async (data: UploadFormData) => {
    const payload: ProcessMeetingAudioPayload = {
      meetingTitle: data.meetingTitle,
      meetingDate: data.meetingDate,
      recordingUrl: data.recordingUrl || undefined,
      file: selectedFile || undefined,
      tags: data.tags
        ? data.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : undefined,
      participants: data.participants
        ? data.participants.split(',').map((p) => p.trim()).filter(Boolean)
        : undefined,
    };

    await onSubmit(payload);
    reset();
    setSelectedFile(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between bg-gray-50/60 dark:bg-zinc-900/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 flex items-center justify-center border border-brand-200/60 dark:border-brand-900/40">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900 dark:text-[#ececec]">
                Process Meeting Intelligence
              </h3>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Upload audio/video or link meeting recording for automated AI synthesis
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
          {/* Meeting Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
              Meeting Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Q3 Strategic Workforce Alignment"
              {...register('meetingTitle')}
              className="w-full px-3 py-2 rounded-xl text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
            {errors.meetingTitle && (
              <p className="mt-1 text-[11px] text-rose-500 font-medium">
                {errors.meetingTitle.message}
              </p>
            )}
          </div>

          {/* Meeting Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
              Meeting Date *
            </label>
            <input
              type="date"
              {...register('meetingDate')}
              className="w-full px-3 py-2 rounded-xl text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
            {errors.meetingDate && (
              <p className="mt-1 text-[11px] text-rose-500 font-medium">
                {errors.meetingDate.message}
              </p>
            )}
          </div>

          {/* Audio/Video File Dropzone */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
              Recording File (MP3, WAV, MP4, M4A)
            </label>
            <div className="relative border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-2xl p-5 text-center hover:border-brand-500/50 transition-colors bg-gray-50/50 dark:bg-zinc-900/30">
              <input
                type="file"
                accept="audio/*,video/*"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <FileAudio className="w-7 h-7 mx-auto mb-1.5 text-gray-400 dark:text-zinc-500" />
              <p className="text-xs font-semibold text-gray-700 dark:text-zinc-300">
                {selectedFile ? selectedFile.name : 'Click to select or drag audio/video file'}
              </p>
              <p className="text-[10px] text-gray-400 dark:text-zinc-500 mt-0.5">
                Supports up to 500MB recordings
              </p>
            </div>
          </div>

          {/* Alternative Recording URL */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
              Or Cloud Recording URL
            </label>
            <div className="relative">
              <Link className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="url"
                placeholder="https://zoom.us/rec/play/..."
                {...register('recordingUrl')}
                className="w-full pl-8 pr-3 py-2 rounded-xl text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
            {errors.recordingUrl && (
              <p className="mt-1 text-[11px] text-rose-500 font-medium">
                {errors.recordingUrl.message}
              </p>
            )}
          </div>

          {/* Tags & Participants */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                placeholder="Strategy, Executive, HR"
                {...register('tags')}
                className="w-full px-3 py-2 rounded-xl text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1">
                Participants (names or emails)
              </label>
              <input
                type="text"
                placeholder="Sarah, Alex, Elena"
                {...register('participants')}
                className="w-full px-3 py-2 rounded-xl text-xs border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-[#ececec] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmitting}
              className="rounded-xl flex items-center gap-1.5 shadow-sm shadow-brand-500/20"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Processing Audio...' : 'Start Transcription'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadMeetingModal;
