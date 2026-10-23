import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Briefcase, Plus } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Textarea } from '@/shared/ui/Textarea';
import { useToast } from '@/shared/ui/Toast';
import type { DepartmentItem } from '@/features/workforce/types/workforce.types';
import type { EmployeeItem } from '@/features/workforce/types/workforce.types';
import { useCreateJobMutation } from '../api/recruitmentApi';
import { createJobSchema, type CreateJobFormData } from '../schemas/recruitment.schemas';

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  departments: DepartmentItem[];
  managers: EmployeeItem[];
}

const JOB_TYPE_OPTIONS = [
  { id: 'FULL_TIME', label: 'Full Time' },
  { id: 'PART_TIME', label: 'Part Time' },
  { id: 'CONTRACT', label: 'Contract' },
  { id: 'INTERN', label: 'Intern' },
] as const;

const CURRENCY_OPTIONS = ['INR', 'USD', 'EUR', 'GBP'];

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

export const CreateJobModal: React.FC<CreateJobModalProps> = ({
  isOpen,
  onClose,
  departments,
  managers,
}) => {
  const toast = useToast();
  const [createJob, { isLoading: isSaving }] = useCreateJobMutation();
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateJobFormData>({
    resolver: zodResolver(createJobSchema),
    defaultValues: {
      title: '',
      departmentId: '',
      location: '',
      jobType: 'FULL_TIME',
      openingsCount: 1,
      experienceMinYears: 0,
      experienceMaxYears: 3,
      minSalary: 0,
      maxSalary: 0,
      currency: 'INR',
      description: '',
      skills: [],
      hiringManagerId: '',
      targetCloseDate: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset();
      setSkills([]);
      setSkillInput('');
    }
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    if (!skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      const next = [...skills, trimmed];
      setSkills(next);
      setValue('skills', next, { shouldValidate: true });
    }
    setSkillInput('');
  };

  const removeSkill = (index: number) => {
    const next = skills.filter((_, i) => i !== index);
    setSkills(next);
    setValue('skills', next, { shouldValidate: true });
  };

  const onSubmit = async (data: CreateJobFormData) => {
    try {
      await createJob(data).unwrap();
      toast.success(`Job requisition "${data.title}" created.`, 'Job Created');
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to create the job requisition.', 'Save Error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in-50">
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#171717] rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-job-headline"
      >
        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between bg-gray-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 id="create-job-headline" className="text-base font-bold text-gray-900 dark:text-[#ececec]">
                Create Job Requisition
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Publish a new opening into the hiring pipeline
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
              <Input label="Job Title" placeholder="e.g. Senior Frontend Engineer" error={errors.title?.message} {...register('title')} />
            </div>

            <Field label="Department" error={errors.departmentId?.message}>
              <select className={selectClass} {...register('departmentId')}>
                <option value="">Select department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </Field>

            <Input label="Work Location" placeholder="e.g. Jaipur / Remote" error={errors.location?.message} {...register('location')} />

            <Field label="Job Type" error={errors.jobType?.message}>
              <select className={selectClass} {...register('jobType')}>
                {JOB_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Field>

            <Input label="Openings" type="number" error={errors.openingsCount?.message} {...register('openingsCount', { valueAsNumber: true })} />

            <Input label="Experience Min (yrs)" type="number" error={errors.experienceMinYears?.message} {...register('experienceMinYears', { valueAsNumber: true })} />

            <Input label="Experience Max (yrs)" type="number" error={errors.experienceMaxYears?.message} {...register('experienceMaxYears', { valueAsNumber: true })} />

            <Input label="Min Salary (annual)" type="number" error={errors.minSalary?.message} {...register('minSalary', { valueAsNumber: true })} />

            <Input label="Max Salary (annual)" type="number" error={errors.maxSalary?.message} {...register('maxSalary', { valueAsNumber: true })} />

            <Field label="Currency" error={errors.currency?.message}>
              <select className={selectClass} {...register('currency')}>
                {CURRENCY_OPTIONS.map((cur) => (
                  <option key={cur} value={cur}>
                    {cur}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Hiring Manager" error={errors.hiringManagerId?.message}>
              <select className={selectClass} {...register('hiringManagerId')}>
                <option value="">Select hiring manager</option>
                {managers.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName}
                  </option>
                ))}
              </select>
            </Field>

            <Input label="Target Close Date" type="date" error={errors.targetCloseDate?.message} {...register('targetCloseDate')} />
          </div>

          {/* Skills tag input */}
          <Field label="Required Skills" error={errors.skills?.message as string | undefined}>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                placeholder="Type a skill and press Enter"
                className="flex-1 px-3 py-2 rounded-lg text-sm border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button type="button" variant="secondary" size="sm" onClick={addSkill} leftIcon={<Plus className="w-3.5 h-3.5" />}>
                Add
              </Button>
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {skills.map((skill, idx) => (
                  <span
                    key={`${skill}-${idx}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(idx)}
                      className="hover:text-rose-500 transition-colors"
                      aria-label={`Remove ${skill}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </Field>

          <div className="space-y-1.5">
            <label htmlFor="job-description" className="text-xs font-semibold text-gray-900 dark:text-[#ececec]">
              Job Description
            </label>
            <Textarea
              id="job-description"
              rows={4}
              placeholder="Responsibilities, expectations, growth path… (min 20 characters)"
              error={Boolean(errors.description)}
              {...register('description')}
            />
            {errors.description?.message && <p className="text-xs text-rose-500">{errors.description.message}</p>}
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
              Create Job
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJobModal;
