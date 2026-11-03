/**
 * @file ats.types.ts
 * @description Domain types for OFC360 Application Tracking System (ATS) & Candidate Pipeline.
 * Formulated to strictly align with backend FastAPI /api/v1/applications models and contracts.
 */

export type ApplicationStage =
  | 'APPLIED'
  | 'UNDER_REVIEW'
  | 'SHORTLISTED'
  | 'INTERVIEW_SCHEDULED'
  | 'INTERVIEW_COMPLETED'
  | 'SELECTED'
  | 'OFFER_SENT'
  | 'OFFER_ACCEPTED'
  | 'OFFER_REJECTED'
  | 'EMPLOYEE_CREATED'
  | 'REJECTED'
  | 'HOLD';

export interface ApplicationJobInfo {
  id: string;
  title: string;
  department: string;
  location?: string;
}

export interface ApplicationItem {
  id: string;
  company_id?: string | null;
  job_id: string;
  candidate_id?: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  current_company?: string | null;
  current_designation?: string | null;
  experience_years: number;
  current_ctc?: string | number | null;
  expected_ctc?: string | number | null;
  notice_period?: string | null;
  status: ApplicationStage;
  created_at: string;
  updated_at: string;
  job?: ApplicationJobInfo | null;
}

export interface ApplicationListPagination {
  items: ApplicationItem[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ApplicationQueryParams {
  job_id?: string;
  status?: ApplicationStage | string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface MoveStagePayload {
  stage: ApplicationStage;
}

export interface BulkMovePayload {
  application_ids: string[];
  status: ApplicationStage;
}

export interface KanbanColumnConfig {
  id: ApplicationStage;
  label: string;
  headerColor: string;
  badgeColor: string;
  borderColor: string;
}

export interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors: Array<{ field?: string | null; message: string }> | null;
  meta?: Record<string, unknown> | null;
}
