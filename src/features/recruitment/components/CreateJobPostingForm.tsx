/**
 * @file CreateJobPostingForm.tsx
 * @description Modern SaaS "Create Job Posting" form component with one-click AI Auto-fill.
 * Integrates directly with:
 * - POST /api/v1/jobs/ai-autofill
 * - POST /api/v1/jobs
 * Conforms to Linear / Stripe design aesthetics with full reactivity, dynamic bullet lists, and draft/publish flows.
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Loader2,
  Plus,
  X,
  Briefcase,
  MapPin,
  DollarSign,
  Building2,
  Calendar,
  Layers,
  CheckCircle2,
  AlertCircle,
  FileText,
  ListChecks,
  Gift,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Textarea } from '@/shared/ui/Textarea';
import { Badge } from '@/shared/ui/Badge';
import { useToast } from '@/shared/ui/Toast';
import { jobCreationClient, type CreateJobPayload } from '../api/jobCreationApi';
import type { DepartmentItem, EmployeeItem } from '@/features/workforce/types/workforce.types';

export interface CreateJobPostingFormProps {
  departments?: DepartmentItem[];
  managers?: EmployeeItem[];
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EMPLOYMENT_TYPES = [
  { value: 'FULL_TIME', label: 'Full Time' },
  { value: 'PART_TIME', label: 'Part Time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'INTERN', label: 'Internship' },
];

const DEFAULT_ROUNDS = ['Screening Round', 'Technical Interview', 'Managerial Round', 'HR Round'];

export const CreateJobPostingForm: React.FC<CreateJobPostingFormProps> = ({
  departments = [],
  managers = [],
  onSuccess,
  onCancel,
}) => {
  const toast = useToast();

  // Core Form State
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [employmentType, setEmploymentType] = useState('FULL_TIME');
  const [location, setLocation] = useState('Jaipur, India');
  const [vacancies, setVacancies] = useState<number>(1);
  const [minExperience, setMinExperience] = useState<number>(3);
  const [maxExperience, setMaxExperience] = useState<number>(5);
  const [minSalary, setMinSalary] = useState<number>(1200000);
  const [maxSalary, setMaxSalary] = useState<number>(1800000);
  const [jobDescription, setJobDescription] = useState('');
  const [applicationDeadline, setApplicationDeadline] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );

  // Dynamic Array Fields
  const [skills, setSkills] = useState<string[]>(['Python', 'FastAPI', 'PostgreSQL']);
  const [skillInput, setSkillInput] = useState('');

  const [responsibilities, setResponsibilities] = useState<string[]>([
    'Architect and implement scalable backend microservices using FastAPI.',
    'Optimize database performance, schema design, and asynchronous query throughput.',
  ]);
  const [newRespInput, setNewRespInput] = useState('');

  const [requirements, setRequirements] = useState<string[]>([
    '3+ years of professional backend development with Python.',
    'Proven production experience with PostgreSQL and asynchronous concurrency.',
  ]);
  const [newReqInput, setNewReqInput] = useState('');

  const [benefits, setBenefits] = useState<string[]>([
    'Comprehensive health insurance coverage for family.',
    'Flexible hybrid work policy and annual learning stipend.',
  ]);
  const [newBenefitInput, setNewBenefitInput] = useState('');

  // UI / Async States
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // AI Auto-fill Trigger
  const handleAiAutofill = async () => {
    if (!title.trim()) {
      toast.error('Please enter a Job Title before generating with AI.', 'Job Title Required');
      return;
    }

    setIsAiLoading(true);
    setErrorMessage(null);
    try {
      const expRange = `${minExperience}-${maxExperience} years`;
      const aiData = await jobCreationClient.generateAiAutofill(title, expRange);

      // Auto-fill returned fields
      if (aiData.department) setDepartment(aiData.department);
      if (aiData.employment_type) setEmploymentType(aiData.employment_type);
      if (aiData.location) setLocation(aiData.location);
      if (aiData.vacancies) setVacancies(aiData.vacancies);
      if (aiData.description) setJobDescription(aiData.description);
      if (!designation) setDesignation(title.trim());

      if (Array.isArray(aiData.skills) && aiData.skills.length > 0) {
        setSkills(aiData.skills);
      }
      if (Array.isArray(aiData.responsibilities) && aiData.responsibilities.length > 0) {
        setResponsibilities(aiData.responsibilities);
      }
      if (Array.isArray(aiData.requirements) && aiData.requirements.length > 0) {
        setRequirements(aiData.requirements);
      }
      if (Array.isArray(aiData.benefits) && aiData.benefits.length > 0) {
        setBenefits(aiData.benefits);
      }

      toast.success(
        'AI successfully generated the job description, skills, and requirements!',
        'AI Auto-Fill Completed'
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'AI generation failed.';
      setErrorMessage(msg);
      toast.error(msg, 'AI Auto-Fill Error');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Skill Chip Management
  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    if (!skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setSkills((prev) => [...prev, trimmed]);
    }
    setSkillInput('');
  };

  const removeSkill = (index: number) => {
    setSkills((prev) => prev.filter((_, i) => i !== index));
  };

  // List Management Helpers
  const addResponsibility = () => {
    if (!newRespInput.trim()) return;
    setResponsibilities((prev) => [...prev, newRespInput.trim()]);
    setNewRespInput('');
  };

  const removeResponsibility = (idx: number) => {
    setResponsibilities((prev) => prev.filter((_, i) => i !== idx));
  };

  const addRequirement = () => {
    if (!newReqInput.trim()) return;
    setRequirements((prev) => [...prev, newReqInput.trim()]);
    setNewReqInput('');
  };

  const removeRequirement = (idx: number) => {
    setRequirements((prev) => prev.filter((_, i) => i !== idx));
  };

  const addBenefit = () => {
    if (!newBenefitInput.trim()) return;
    setBenefits((prev) => [...prev, newBenefitInput.trim()]);
    setNewBenefitInput('');
  };

  const removeBenefit = (idx: number) => {
    setBenefits((prev) => prev.filter((_, i) => i !== idx));
  };

  // Submit Handler (Draft vs Published)
  const handleSubmit = async (submitStatus: 'DRAFT' | 'PUBLISHED') => {
    if (!title.trim()) {
      toast.error('Job Title is required.', 'Validation Error');
      return;
    }
    if (!department.trim()) {
      toast.error('Department is required.', 'Validation Error');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const payload: CreateJobPayload = {
      title: title.trim(),
      department: department.trim(),
      designation: designation.trim() || title.trim(),
      employment_type: employmentType,
      location: location.trim(),
      vacancies: Number(vacancies) || 1,
      min_experience: Number(minExperience) || 0,
      max_experience: Number(maxExperience) || 0,
      min_salary: Number(minSalary) || 0,
      max_salary: Number(maxSalary) || 0,
      job_description: jobDescription.trim() || `${title} position overview.`,
      responsibilities,
      requirements,
      benefits,
      application_deadline: applicationDeadline || null,
      status: submitStatus,
      skills,
      rounds: DEFAULT_ROUNDS,
    };

    try {
      await jobCreationClient.createJob(payload);
      toast.success(
        `Job posting "${payload.title}" ${submitStatus === 'PUBLISHED' ? 'published live' : 'saved as draft'}!`,
        submitStatus === 'PUBLISHED' ? 'Job Published' : 'Draft Saved'
      );
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create job posting.';
      setErrorMessage(msg);
      toast.error(msg, 'Submission Failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Error Banner */}
      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-center justify-between text-rose-700 dark:text-rose-300">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-medium text-xs">{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-rose-500 hover:text-rose-700 dark:hover:text-rose-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* SECTION 1: Job Title & One-Click AI Trigger */}
      <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-zinc-800/40 border border-slate-200/80 dark:border-zinc-800 space-y-3">
        <label htmlFor="job-title-input" className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Job Title & AI Auto-Fill <span className="text-rose-500">*</span>
        </label>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1">
            <Briefcase className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="job-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Backend Engineer, Lead DevOps Architect..."
              className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs"
            />
          </div>

          <button
            type="button"
            onClick={handleAiAutofill}
            disabled={isAiLoading}
            className="h-[38px] px-4 rounded-xl font-bold text-xs inline-flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-sm shadow-teal-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {isAiLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>AI is drafting JD...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
                <span>Generate with AI ✨</span>
              </>
            )}
          </button>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-zinc-400">
          Enter any position title and click <strong className="text-teal-600 dark:text-teal-400">Generate with AI</strong> to automatically draft the department, overview description, skills, responsibilities, and requirements.
        </p>
      </div>

      {/* SECTION 2: Core Job Parameters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* Department */}
        <div>
          <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
            Department <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="e.g. Engineering"
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Designation */}
        <div>
          <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
            Designation Title
          </label>
          <input
            type="text"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            placeholder="Official designation"
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Employment Type */}
        <div>
          <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
            Employment Type
          </label>
          <select
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {EMPLOYMENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Work Location */}
        <div>
          <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
            Work Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Jaipur, India / Remote"
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Open Vacancies */}
        <div>
          <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
            Number of Openings
          </label>
          <input
            type="number"
            min="1"
            value={vacancies}
            onChange={(e) => setVacancies(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Application Deadline */}
        <div>
          <label className="block font-semibold text-slate-700 dark:text-zinc-300 mb-1">
            Application Deadline
          </label>
          <input
            type="date"
            value={applicationDeadline}
            onChange={(e) => setApplicationDeadline(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* SECTION 3: Experience & Compensation Ranges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800">
        <div>
          <label className="block font-semibold text-slate-600 dark:text-zinc-400 mb-1">
            Min Experience (Years)
          </label>
          <input
            type="number"
            min="0"
            value={minExperience}
            onChange={(e) => setMinExperience(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-600 dark:text-zinc-400 mb-1">
            Max Experience (Years)
          </label>
          <input
            type="number"
            min={minExperience}
            value={maxExperience}
            onChange={(e) => setMaxExperience(Math.max(minExperience, parseInt(e.target.value) || minExperience))}
            className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-600 dark:text-zinc-400 mb-1">
            Min Annual Salary (₹)
          </label>
          <input
            type="number"
            step="50000"
            value={minSalary}
            onChange={(e) => setMinSalary(parseInt(e.target.value) || 0)}
            className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-600 dark:text-zinc-400 mb-1">
            Max Annual Salary (₹)
          </label>
          <input
            type="number"
            step="50000"
            value={maxSalary}
            onChange={(e) => setMaxSalary(parseInt(e.target.value) || 0)}
            className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* SECTION 4: Skills Chip Tagging */}
      <div className="space-y-2 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800">
        <label className="block font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider text-[11px]">
          Required Skills & Technologies ({skills.length})
        </label>
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
            placeholder="Type skill name and press Enter (e.g. Docker, TypeScript)"
            className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <Button type="button" variant="outline" size="sm" onClick={addSkill} className="shrink-0 text-xs">
            <Plus className="w-3.5 h-3.5" />
            <span>Add Skill</span>
          </Button>
        </div>

        {/* Skill Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {skills.map((skill, idx) => (
            <span
              key={`${skill}-${idx}`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/40"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => removeSkill(idx)}
                className="hover:text-rose-500 transition-colors"
                title={`Remove ${skill}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* SECTION 5: Job Description Rich Textarea */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="job-description-box" className="font-bold text-slate-800 dark:text-zinc-200 text-xs">
            Job Overview & Description
          </label>
          <span className="text-[11px] text-slate-400">Markdown supported</span>
        </div>
        <textarea
          id="job-description-box"
          rows={5}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Detailed role summary, team mission, and impact..."
          className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs"
        />
      </div>

      {/* SECTION 6: Key Responsibilities (Dynamic Bullet Points) */}
      <div className="space-y-2.5 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-800 dark:text-zinc-200 text-xs flex items-center gap-1.5">
            <ListChecks className="w-4 h-4 text-teal-600" />
            <span>Key Responsibilities ({responsibilities.length})</span>
          </span>
        </div>

        <ul className="space-y-1.5">
          {responsibilities.map((item, idx) => (
            <li
              key={idx}
              className="flex items-start justify-between gap-2 p-2 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800 text-xs"
            >
              <span className="flex-1 text-slate-700 dark:text-zinc-300 leading-normal">• {item}</span>
              <button
                type="button"
                onClick={() => removeResponsibility(idx)}
                className="text-slate-400 hover:text-rose-500 p-0.5 shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="text"
            value={newRespInput}
            onChange={(e) => setNewRespInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addResponsibility();
              }
            }}
            placeholder="Add new responsibility bullet..."
            className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white"
          />
          <Button type="button" variant="outline" size="sm" onClick={addResponsibility} className="text-xs">
            Add
          </Button>
        </div>
      </div>

      {/* SECTION 7: Requirements & Qualifications (Dynamic Bullet Points) */}
      <div className="space-y-2.5 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-800 dark:text-zinc-200 text-xs flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-teal-600" />
            <span>Requirements & Qualifications ({requirements.length})</span>
          </span>
        </div>

        <ul className="space-y-1.5">
          {requirements.map((item, idx) => (
            <li
              key={idx}
              className="flex items-start justify-between gap-2 p-2 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800 text-xs"
            >
              <span className="flex-1 text-slate-700 dark:text-zinc-300 leading-normal">• {item}</span>
              <button
                type="button"
                onClick={() => removeRequirement(idx)}
                className="text-slate-400 hover:text-rose-500 p-0.5 shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="text"
            value={newReqInput}
            onChange={(e) => setNewReqInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addRequirement();
              }
            }}
            placeholder="Add new requirement bullet..."
            className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white"
          />
          <Button type="button" variant="outline" size="sm" onClick={addRequirement} className="text-xs">
            Add
          </Button>
        </div>
      </div>

      {/* SECTION 8: Perks & Benefits */}
      <div className="space-y-2.5 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-800 dark:text-zinc-200 text-xs flex items-center gap-1.5">
            <Gift className="w-4 h-4 text-teal-600" />
            <span>Perks & Benefits ({benefits.length})</span>
          </span>
        </div>

        <ul className="space-y-1.5">
          {benefits.map((item, idx) => (
            <li
              key={idx}
              className="flex items-start justify-between gap-2 p-2 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800 text-xs"
            >
              <span className="flex-1 text-slate-700 dark:text-zinc-300 leading-normal">• {item}</span>
              <button
                type="button"
                onClick={() => removeBenefit(idx)}
                className="text-slate-400 hover:text-rose-500 p-0.5 shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="text"
            value={newBenefitInput}
            onChange={(e) => setNewBenefitInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addBenefit();
              }
            }}
            placeholder="Add new benefit bullet..."
            className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white"
          />
          <Button type="button" variant="outline" size="sm" onClick={addBenefit} className="text-xs">
            Add
          </Button>
        </div>
      </div>

      {/* Bottom Sticky Action Buttons */}
      <div className="pt-4 border-t border-slate-200/80 dark:border-zinc-800 flex items-center justify-between gap-3 flex-wrap">
        <div>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCancel}
              disabled={isSubmitting}
              className="text-xs"
            >
              Cancel
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleSubmit('DRAFT')}
            disabled={isSubmitting || !title.trim()}
            className="text-xs font-semibold"
          >
            {isSubmitting ? 'Saving...' : 'Save as Draft'}
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => handleSubmit('PUBLISHED')}
            disabled={isSubmitting || !title.trim()}
            className="text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-xs"
          >
            {isSubmitting ? 'Publishing...' : 'Publish Job'}
          </Button>
        </div>
      </div>
    </div>
  );
};

