/**
 * @file candidatesApi.ts
 * @description Standardized API client and custom React hooks for Candidate & Applicant Management.
 * Communicates directly with backend /api/v1/candidates, /api/v1/applications, and /api/v1/recruitment/resume endpoints.
 * Handles JWT token injection, unified APIResponse unwrapping, error normalizations, and reactive invalidations.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  CandidateItemRecord,
  CandidateCreatePayload,
  CandidateUpdatePayload,
  CandidateListPagination,
  CandidateQueryParams,
  ApplicationItem,
  ApplicationQueryParams,
  ApplicationWorkflowStage,
  BulkMovePayload,
  BulkTagPayload,
  CandidateScreeningResponse,
  AtsBreakdown,
} from '../types/candidate.types';

export interface UniversalApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors: Array<{ field?: string | null; message: string }> | null;
  meta?: Record<string, unknown> | null;
}

const getApiBaseUrl = (): string => {
  const envUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();
  if (envUrl) {
    return envUrl.replace(/\/+$/, '');
  }
  return 'https://api.ofc360.com/api/v1';
};

const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return (
    localStorage.getItem('ofc360_access_token') ||
    sessionStorage.getItem('ofc360_access_token') ||
    null
  );
};

export const candidatesClient = {
  async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const baseUrl = getApiBaseUrl();
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${baseUrl}${cleanEndpoint}`;

    const headers = new Headers(options.headers || {});
    const token = getAuthToken();
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 204) {
      return {} as T;
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/csv')) {
      return (await response.blob()) as unknown as T;
    }

    let payload: any = null;
    try {
      payload = await response.json();
    } catch {
      payload = { message: response.statusText };
    }

    if (!response.ok) {
      const errorMsg =
        payload?.message ||
        (Array.isArray(payload?.errors) && payload.errors[0]?.message) ||
        `Request failed with status ${response.status}`;
      throw new Error(errorMsg);
    }

    // Unwrap APIResponse<T> if enveloped
    if (payload && typeof payload === 'object' && 'success' in payload && 'data' in payload) {
      return payload.data as T;
    }

    return payload as T;
  },

  // 1. Master Candidates
  async listCandidates(params: CandidateQueryParams = {}): Promise<CandidateListPagination> {
    const q = new URLSearchParams();
    if (params.search) q.append('search', params.search);
    if (params.tag) q.append('tag', params.tag);
    if (params.is_talent_pool !== undefined) q.append('is_talent_pool', String(params.is_talent_pool));
    if (params.page) q.append('page', String(params.page));
    if (params.limit) q.append('limit', String(params.limit));

    const qs = q.toString();
    return this.fetch<CandidateListPagination>(`/candidates${qs ? `?${qs}` : ''}`, {
      method: 'GET',
    });
  },

  async getCandidate(id: string): Promise<CandidateItemRecord> {
    return this.fetch<CandidateItemRecord>(`/candidates/${id}`, {
      method: 'GET',
    });
  },

  async createCandidate(payload: CandidateCreatePayload): Promise<CandidateItemRecord> {
    const result = await this.fetch<CandidateItemRecord>('/candidates', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    this.notifyChange();
    return result;
  },

  async updateCandidate(id: string, payload: CandidateUpdatePayload): Promise<CandidateItemRecord> {
    const result = await this.fetch<CandidateItemRecord>(`/candidates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    this.notifyChange();
    return result;
  },

  async deleteCandidate(id: string): Promise<{ success: boolean; message: string }> {
    const result = await this.fetch<{ success: boolean; message: string }>(`/candidates/${id}`, {
      method: 'DELETE',
    });
    this.notifyChange();
    return result;
  },

  async exportCandidatesCsv(): Promise<Blob> {
    return this.fetch<Blob>('/candidates/export/csv', {
      method: 'GET',
    });
  },

  // 2. Candidate Job Applications
  async listApplications(params: ApplicationQueryParams = {}): Promise<{ items: ApplicationItem[]; total: number; page: number; limit: number }> {
    const q = new URLSearchParams();
    if (params.job_id) q.append('job_id', params.job_id);
    if (params.status) q.append('status', params.status);
    if (params.search) q.append('search', params.search);
    if (params.page) q.append('page', String(params.page));
    if (params.limit) q.append('limit', String(params.limit));

    const qs = q.toString();
    const res = await this.fetch<any>(`/applications${qs ? `?${qs}` : ''}`, {
      method: 'GET',
    });
    return {
      items: res?.items || (Array.isArray(res) ? res : []),
      total: res?.total ?? (Array.isArray(res) ? res.length : 0),
      page: res?.page ?? 1,
      limit: res?.limit ?? 50,
    };
  },

  async getApplication(id: string): Promise<ApplicationItem> {
    return this.fetch<ApplicationItem>(`/applications/${id}`, {
      method: 'GET',
    });
  },

  async updateApplicationStage(id: string, stage: ApplicationWorkflowStage): Promise<ApplicationItem> {
    const result = await this.fetch<ApplicationItem>(`/applications/${id}/stage`, {
      method: 'PATCH',
      body: JSON.stringify({ stage }),
    });
    this.notifyChange();
    return result;
  },

  async shortlistApplication(id: string): Promise<ApplicationItem> {
    const result = await this.fetch<ApplicationItem>(`/applications/${id}/shortlist`, {
      method: 'PATCH',
    });
    this.notifyChange();
    return result;
  },

  async rejectApplication(id: string): Promise<ApplicationItem> {
    const result = await this.fetch<ApplicationItem>(`/applications/${id}/reject`, {
      method: 'PATCH',
    });
    this.notifyChange();
    return result;
  },

  async holdApplication(id: string): Promise<ApplicationItem> {
    const result = await this.fetch<ApplicationItem>(`/applications/${id}/hold`, {
      method: 'PATCH',
    });
    this.notifyChange();
    return result;
  },

  async bulkMoveApplications(payload: BulkMovePayload): Promise<{ success: boolean; count: number }> {
    const result = await this.fetch<{ success: boolean; count: number }>('/applications/bulk-move', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    this.notifyChange();
    return result;
  },

  async bulkTagCandidates(payload: BulkTagPayload): Promise<{ success: boolean }> {
    const result = await this.fetch<{ success: boolean }>('/applications/bulk-tag', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    this.notifyChange();
    return result;
  },

  // 3. AI Resume Screening & Scoring
  async uploadAndScreenResume(file: File, jobId?: string): Promise<CandidateScreeningResponse> {
    const formData = new FormData();
    formData.append('file', file);
    if (jobId) {
      formData.append('job_id', jobId);
    }

    const result = await this.fetch<CandidateScreeningResponse>('/recruitment/resume/upload', {
      method: 'POST',
      body: formData,
    });
    this.notifyChange();
    return result;
  },

  async getCandidateAtsAnalysis(candidateId: string): Promise<AtsBreakdown> {
    return this.fetch<AtsBreakdown>(`/recruitment/candidates/${candidateId}/ats`, {
      method: 'GET',
    });
  },

  notifyChange(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ofc360:candidates_changed'));
      window.dispatchEvent(new CustomEvent('ofc360:applications_changed'));
    }
  },
};

// ============================================================================
// REACT HOOKS
// ============================================================================

export const useCandidates = (params: CandidateQueryParams = {}) => {
  const [data, setData] = useState<CandidateListPagination>({ items: [], total: 0, page: 1, limit: 50 });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCandidates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await candidatesClient.listCandidates(params);
      setData(res);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [params.search, params.tag, params.is_talent_pool, params.page, params.limit]);

  useEffect(() => {
    fetchCandidates();
    const handleSync = () => fetchCandidates();
    window.addEventListener('ofc360:candidates_changed', handleSync);
    return () => window.removeEventListener('ofc360:candidates_changed', handleSync);
  }, [fetchCandidates]);

  return { data, isLoading, error, refetch: fetchCandidates };
};

export const useApplications = (params: ApplicationQueryParams = {}) => {
  const [data, setData] = useState<{ items: ApplicationItem[]; total: number; page: number; limit: number }>({
    items: [],
    total: 0,
    page: 1,
    limit: 50,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchApps = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await candidatesClient.listApplications(params);
      setData(res);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [params.job_id, params.status, params.search, params.page, params.limit]);

  useEffect(() => {
    fetchApps();
    const handleSync = () => fetchApps();
    window.addEventListener('ofc360:applications_changed', handleSync);
    return () => window.removeEventListener('ofc360:applications_changed', handleSync);
  }, [fetchApps]);

  return { data, isLoading, error, refetch: fetchApps };
};

export const useCandidateDetail = (candidateId: string | null) => {
  const [candidate, setCandidate] = useState<CandidateItemRecord | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!candidateId) {
      setCandidate(null);
      return;
    }
    let isMounted = true;
    setIsLoading(true);
    candidatesClient
      .getCandidate(candidateId)
      .then((res) => {
        if (isMounted) setCandidate(res);
      })
      .catch((err) => {
        if (isMounted) setError(err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [candidateId]);

  return { candidate, isLoading, error };
};

