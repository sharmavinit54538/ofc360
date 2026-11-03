/**
 * @file interviewScheduler.types.ts
 * @description Enterprise TypeScript definitions for Interview Scheduler & Evaluation Module.
 * Conforms strictly to FastAPI backend contracts:
 * - POST /api/v1/applications/{application_id}/send-interview
 * - POST /api/v1/interviews/{interview_id}/schedule
 * - GET /api/v1/interviews/{interview_id}
 * - PATCH /api/v1/interviews/rounds/{round_id}/pass
 * - PATCH /api/v1/interviews/rounds/{round_id}/reject
 * - PATCH /api/v1/interviews/rounds/{round_id}/hold
 */

export type InterviewRoundStatus = 'PENDING' | 'SCHEDULED' | 'PASSED' | 'REJECTED' | 'HOLD' | 'COMPLETED';

export type InterviewMode = 'ONLINE' | 'OFFLINE';

export type InterviewEvaluationDecision = 'pass' | 'reject' | 'hold';

export interface InterviewRoundItem {
  id: string;
  round_name: string;
  round_order: number;
  status: InterviewRoundStatus;
  score: string | null;
  feedback: string | null;
  interviewer_name: string | null;
  conducted_at: string | null;
  scheduled_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface InterviewDetail {
  id: string;
  application_id: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | string;
  current_round_index: number;
  interview_date?: string | null;
  interview_time?: string | null;
  mode?: InterviewMode | null;
  meeting_url?: string | null;
  office_address?: string | null;
  candidate_id?: string | null;
  candidate_name?: string | null;
  candidate_email?: string | null;
  candidate_phone?: string | null;
  job_id?: string | null;
  job_title?: string | null;
  department?: string | null;
  rounds: InterviewRoundItem[];
  created_at?: string;
  updated_at?: string;
}

export interface ScheduleSlotPayload {
  interview_date: string; // YYYY-MM-DD (must be within next 7 days)
  interview_time: string; // HH:MM:SS
  mode: InterviewMode;
  meeting_url?: string | null; // required if mode === ONLINE
  office_address?: string | null; // required if mode === OFFLINE
}

export interface RoundFeedbackPayload {
  interviewer_name: string;
  score: string;
  feedback: string;
}

export interface InitiateInterviewPayload {
  application_id: string;
  round_names: string[];
}

export interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors: Array<{ field?: string | null; message: string }> | null;
  meta?: Record<string, unknown> | null;
}

export interface InterviewFilterOptions {
  status?: string;
  search?: string;
  mode?: 'ALL' | 'ONLINE' | 'OFFLINE';
  view?: 'ALL' | 'TODAY' | 'UPCOMING' | 'NEEDS_EVALUATION' | 'COMPLETED';
}

