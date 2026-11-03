/**
 * @file candidate.types.ts
 * @description Enterprise TypeScript domain types for the Candidate & Applicant Management Module (RMS/ATS).
 * Strictly mirrors the architectural API contract for:
 * - /api/v1/candidates (Master Talent Pool)
 * - /api/v1/applications (Candidate Job Applications)
 * - /api/v1/recruitment/resume/upload (AI Resume Screening & ATS Match)
 */

export type ApplicationWorkflowStage =
  | 'APPLIED'
  | 'UNDER_REVIEW'
  | 'SHORTLISTED'
  | 'INTERVIEW_SCHEDULED'
  | 'INTERVIEW_COMPLETED'
  | 'SELECTED'
  | 'REJECTED'
  | 'HOLD'
  | 'OFFER_SENT'
  | 'OFFER_ACCEPTED'
  | 'OFFER_REJECTED'
  | 'EMPLOYEE_CREATED';

export interface ApplicationJobRef {
  id: string;
  title: string;
  department?: string | null;
  location?: string | null;
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
  country: string;
  state: string;
  city: string;
  current_company?: string | null;
  current_designation?: string | null;
  current_ctc?: number | null;
  expected_ctc?: number | null;
  notice_period?: string | null;
  highest_qualification?: string | null;
  experience_years: number;
  linkedin_url?: string | null;
  portfolio_url?: string | null;
  cover_letter?: string | null;
  declaration_checked?: boolean;
  status: ApplicationWorkflowStage;
  job?: ApplicationJobRef | null;
  created_at: string;
  updated_at: string;
}

export interface CandidateItemRecord {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  location: string;
  summary?: string | null;
  skills?: string[] | null;
  tags?: string[] | null;
  years_experience: number;
  current_company?: string | null;
  current_role?: string | null;
  expected_salary?: number | null;
  notice_days: number;
  resume_path?: string | null;
  resume_name?: string | null;
  source: string;
  is_talent_pool: boolean;
  vendor_id?: string | null;
  created_at: string;
  updated_at: string;
  ats_score?: number | null;
  job_match?: number | null;
  applications?: ApplicationItem[];
}

export interface CandidateCreatePayload {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  location: string;
  summary?: string | null;
  skills?: string[] | null;
  tags?: string[] | null;
  years_experience?: number;
  current_company?: string | null;
  current_role?: string | null;
  expected_salary?: number | null;
  notice_days?: number;
  source?: string;
  is_talent_pool?: boolean;
  vendor_id?: string | null;
}

export interface CandidateUpdatePayload {
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  summary?: string | null;
  skills?: string[] | null;
  tags?: string[] | null;
  years_experience?: number | null;
  current_company?: string | null;
  current_role?: string | null;
  expected_salary?: number | null;
  notice_days?: number | null;
  source?: string | null;
  is_talent_pool?: boolean | null;
  vendor_id?: string | null;
}

export interface CandidateListPagination {
  items: CandidateItemRecord[];
  total: number;
  page: number;
  limit: number;
  pages?: number;
}

export interface CandidateQueryParams {
  search?: string;
  tag?: string;
  is_talent_pool?: boolean;
  page?: number;
  limit?: number;
}

export interface ApplicationQueryParams {
  job_id?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface BulkMovePayload {
  application_ids: string[];
  status: ApplicationWorkflowStage;
}

export interface BulkTagPayload {
  candidate_ids: string[];
  tags: string[];
}

export interface AtsBreakdown {
  overall_ats_score: number;
  skill_match_score?: number;
  experience_match_score?: number;
  education_match_score?: number;
  matched_skills: string[];
  missing_skills: string[];
  extra_skills?: string[];
}

export interface AiInsights {
  candidate_summary?: string;
  strengths: string[];
  weaknesses: string[];
  hiring_recommendation: 'SHORTLIST' | 'REVIEW' | 'REJECT' | string;
  recommended_interview_questions: string[];
}

export interface CandidateScreeningResponse {
  candidate_id: string;
  application_id?: string | null;
  resume_document_id?: string;
  job_id?: string | null;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  ats_score: number;
  rank?: number;
  match_tier?: string;
  parsing_confidence?: number;
  candidate_details: {
    candidate_name: string;
    email: string;
    phone: string;
    address?: string;
    linkedin?: string;
    github?: string;
    summary?: string;
    total_experience_years?: number;
    current_company?: string;
    current_designation?: string;
    skills?: string[];
    technical_skills?: string[];
    soft_skills?: string[];
    education?: Array<{
      degree?: string;
      field_of_study?: string;
      university?: string;
      passing_year?: number | string;
      grade?: string;
    }>;
    work_history?: Array<{
      company?: string;
      designation?: string;
      duration_months?: number;
      is_current?: boolean;
      responsibilities?: string[];
    }>;
  };
  ats_breakdown: AtsBreakdown;
  ai_insights: AiInsights;
  quality_analysis?: {
    is_valid: boolean;
    issues: string[];
    formatting_score?: number;
    is_readable?: boolean;
  };
  duplicate_info?: {
    is_duplicate: boolean;
    duplicate_candidate_id?: string | null;
    matched_by?: string[];
  };
  created_at?: string;
}

