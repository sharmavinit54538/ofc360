/**
 * @file requisition.types.ts
 * @description Enterprise TypeScript definitions for the Job Requisitions (Manpower Request) module.
 * Fully typed with verified backend response envelopes and zero 'any' usage.
 */

export interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors: Array<{ field?: string | null; message: string }> | null;
  meta?: Record<string, unknown> | null;
}

export type RequisitionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type RequisitionStatusFilter = 'ALL' | RequisitionStatus;

export interface JobRequisitionCreatePayload {
  title: string;
  department: string;
  vacancies?: number;
  min_experience?: number;
  max_experience?: number | null;
  min_salary?: string | number | null;
  max_salary?: string | number | null;
  description: string;
}

export interface RequisitionApprovalPayload {
  requisition_id: string;
  approve: boolean;
}

export interface JobRequisitionItem {
  id: string;
  title: string;
  department: string;
  vacancies: number;
  min_experience: number;
  max_experience: number | null;
  min_salary: string | null;
  max_salary: string | null;
  description: string;
  status: RequisitionStatus;
  requested_by: string;
  approved_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface RequisitionListPagination {
  items: JobRequisitionItem[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface RequisitionQueryParams {
  status?: RequisitionStatusFilter;
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
}

