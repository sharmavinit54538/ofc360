/**
 * @file UploadResumeModal.tsx
 * @description Modal for AI-powered candidate resume parsing and ATS scoring.
 * Connects to POST /api/v1/recruitment/resume/upload with multipart/form-data.
 */

import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Layers,
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { useToast } from '@/shared/ui/Toast';
import { candidatesClient } from '../api/candidatesApi';
import type { CandidateScreeningResponse } from '../types/candidate.types';
import type { JobOpening } from '../types/recruitment.types';

interface UploadResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobs: JobOpening[];
  onUploadSuccess?: () => void;
}

export const UploadResumeModal: React.FC<UploadResumeModalProps> = ({
  isOpen,
  onClose,
  jobs,
  onUploadSuccess,
}) => {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [result, setResult] = useState<CandidateScreeningResponse | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size cannot exceed 10 MB.', 'File Too Large');
        return;
      }
      setSelectedFile(file);
      setResult(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size cannot exceed 10 MB.', 'File Too Large');
        return;
      }
      setSelectedFile(file);
      setResult(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select a resume file (.pdf, .docx).', 'Missing File');
      return;
    }

    setIsUploading(true);
    try {
      const screening = await candidatesClient.uploadAndScreenResume(
        selectedFile,
        selectedJobId || undefined
      );
      setResult(screening);
      toast.success(
        `Parsed ${screening.candidate_details?.candidate_name || 'Candidate'} with ${Math.round(screening.ats_score)}% match!`,
        'Resume Screened'
      );
      if (onUploadSuccess) onUploadSuccess();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to screen resume.', 'Upload Failed');
    } finally {
      setIsUploading(false);
    }
  };

  const resetState = () => {
    setSelectedFile(null);
    setResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in-50">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200/80 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 dark:border-zinc-800 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">AI Resume Screening</h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Upload candidate CV for instant OCR extraction & ATS scoring
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={resetState}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {!result ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Job Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                  Target Job Opening (Optional for ATS match)
                </label>
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">General Talent Pool (No job match)</option>
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.title} ({j.department?.name || 'Open'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
                  isDragOver
                    ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/20'
                    : 'border-slate-200 dark:border-zinc-800 hover:border-teal-500/60 bg-slate-50/50 dark:bg-zinc-800/20'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <UploadCloud className="w-10 h-10 text-teal-600 dark:text-teal-400 mx-auto mb-2" />
                {selectedFile ? (
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">{selectedFile.name}</p>
                    <p className="text-[11px] text-slate-400">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready for AI Parse
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                      Click to upload or drag & drop resume file
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">PDF or DOCX up to 10 MB</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex justify-end gap-2">
                <Button variant="outline" size="sm" type="button" onClick={resetState} disabled={isUploading}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  disabled={!selectedFile || isUploading}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-semibold"
                >
                  {isUploading ? 'Parsing & Scoring...' : 'Start AI Screening'}
                </Button>
              </div>
            </form>
          ) : (
            /* Results Display */
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
                    ATS Match Result
                  </span>
                  <h3 className="text-xl font-black text-teal-700 dark:text-teal-300 mt-0.5">
                    {Math.round(result.ats_score)}%
                  </h3>
                  <p className="text-[11px] text-teal-700 dark:text-teal-400 font-semibold">
                    {result.match_tier || 'Match Scored'} • {result.ai_insights?.hiring_recommendation}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-slate-900 dark:text-white">
                    {result.candidate_details?.candidate_name}
                  </span>
                  <p className="text-[10px] text-slate-500">{result.candidate_details?.email}</p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200/80 dark:border-zinc-800 p-3 space-y-2">
                <span className="font-bold text-slate-800 dark:text-zinc-200 text-[11px]">Matched Skills:</span>
                <div className="flex flex-wrap gap-1">
                  {(result.ats_breakdown?.matched_skills || []).map((s, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-medium text-[10px]"
                    >
                      {s}
                    </span>
                  ))}
                  {(result.ats_breakdown?.matched_skills || []).length === 0 && (
                    <span className="text-slate-400 text-[11px]">No skill overlaps found</span>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="primary" size="sm" onClick={resetState} className="bg-teal-600 text-white">
                  Done & View Pipeline
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

