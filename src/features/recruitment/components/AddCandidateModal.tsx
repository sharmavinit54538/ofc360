import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, UserPlus } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { useToast } from '@/shared/ui/Toast';
import { useAddCandidateMutation } from '../api/recruitmentApi';
import { addCandidateSchema, type AddCandidateFormData } from '../schemas/recruitment.schemas';
import type { JobOpening } from '../types/recruitment.types';

interface AddCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobs: JobOpening[];
}

const SOURCE_OPTIONS = [
  { id: 'PORTAL', label: 'Company Careers Portal' },
  { id: 'LINKEDIN', label: 'LinkedIn' },
  { id: 'NAUKRI', label: 'Naukri' },
  { id: 'REFERRAL', label: 'Employee Referral' },
  { id: 'WALKIN', label: 'Walk-in' },
];

const selectClass =
  'w-full px-3 py-2 rounded-lg text-sm border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';

export const AddCandidateModal: React.FC<AddCandidateModalProps> = ({ isOpen, onClose, jobs }) => {
  const toast = useToast();
  const [addCandidate, { isLoading: isSaving }] = useAddCandidateMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddCandidateFormData>({
    resolver: zodResolver(addCandidateSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      jobId: '',
      currentCompany: '',
      experienceYears: 0,
      noticePeriodDays: 30,
      resumeUrl: '',
      source: 'PORTAL',
    },
  });

  useEffect(() => {
    if (isOpen) reset();
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: AddCandidateFormData) => {
    try {
      await addCandidate({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        jobId: data.jobId,
        currentCompany: data.currentCompany || undefined,
        experienceYears: data.experienceYears,
        noticePeriodDays: data.noticePeriodDays,
        resumeUrl: data.resumeUrl || undefined,
        source: data.source || undefined,
      }).unwrap();
      toast.success(`${data.fullName} added to the hiring pipeline.`, 'Candidate Added');
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to add the candidate.', 'Save Error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
      <div
        className="w-full max-w-lg bg-white dark:bg-[#171717] rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-candidate-headline"
      >
        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between bg-gray-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 id="add-candidate-headline" className="text-base font-bold text-gray-900 dark:text-[#ececec]">
                Add Candidate
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Enter a new applicant into the pipeline
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input label="Full Name" placeholder="Candidate full name" error={errors.fullName?.message} {...register('fullName')} />
            </div>
            <Input label="Email" type="email" placeholder="name@example.com" error={errors.email?.message} {...register('email')} />
            <Input label="Phone" placeholder="+91 98xxxxxx21" error={errors.phone?.message} {...register('phone')} />

            <div className="space-y-1.5 sm:col-span-2">
              <label htmlFor="candidate-job-select" className="text-xs font-semibold text-gray-900 dark:text-[#ececec]">
                Applying For
              </label>
              <select id="candidate-job-select" className={selectClass} {...register('jobId')}>
                <option value="">Select job opening</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title} ({job.jobCode})
                  </option>
                ))}
              </select>
              {errors.jobId?.message && <p className="text-xs text-rose-500">{errors.jobId.message}</p>}
            </div>

            <Input label="Current Company" placeholder="Optional" error={errors.currentCompany?.message} {...register('currentCompany')} />
            <div className="space-y-1.5">
              <label htmlFor="candidate-source" className="text-xs font-semibold text-gray-900 dark:text-[#ececec]">
                Source
              </label>
              <select id="candidate-source" className={selectClass} {...register('source')}>
                {SOURCE_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <Input label="Experience (yrs)" type="number" error={errors.experienceYears?.message} {...register('experienceYears', { valueAsNumber: true })} />
            <Input label="Notice Period (days)" type="number" error={errors.noticePeriodDays?.message} {...register('noticePeriodDays', { valueAsNumber: true })} />

            <div className="sm:col-span-2">
              <Input label="Resume URL" placeholder="https://… (optional)" error={errors.resumeUrl?.message} {...register('resumeUrl')} />
            </div>
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
              Add Candidate
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCandidateModal;
