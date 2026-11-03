/**
 * @file jobCreationApi.ts
 * @description Dedicated API client for Create Job Posting & One-Click AI Auto-fill.
 * Strictly adheres to backend contracts for:
 * - POST /api/v1/jobs/ai-autofill
 * - POST /api/v1/jobs
 */

export interface AiAutofillData {
  department?: string;
  employment_type?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN' | string;
  location?: string;
  work_mode?: string;
  vacancies?: number;
  skills?: string[];
  description?: string;
  responsibilities?: string[];
  requirements?: string[];
  benefits?: string[];
}

export interface CreateJobPayload {
  title: string;
  department: string;
  designation: string;
  employment_type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN' | string;
  location: string;
  vacancies: number;
  min_experience: number;
  max_experience: number;
  min_salary: number;
  max_salary: number;
  job_description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  application_deadline?: string | null;
  status: 'DRAFT' | 'PUBLISHED';
  skills: string[];
  rounds: string[];
  departmentId?: string;
  hiringManagerId?: string;
}

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

export const jobCreationClient = {
  async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const baseUrl = getApiBaseUrl();
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${baseUrl}${cleanEndpoint}`;

    const headers = new Headers(options.headers || {});
    const token = getAuthToken();
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 204) {
      return {} as T;
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
        `HTTP ${response.status}: Failed to execute request`;
      throw new Error(errorMsg);
    }

    // Unwrap APIResponse<T> envelope
    if (payload && typeof payload === 'object' && 'data' in payload) {
      return (payload.data !== null ? payload.data : payload) as T;
    }

    return payload as T;
  },

  /**
   * Calls POST /api/v1/jobs/ai-autofill to generate complete JD, skills,
   * responsibilities, requirements, and benefits from a job title.
   */
  async generateAiAutofill(title: string, experience?: string): Promise<AiAutofillData> {
    try {
      const res = await this.fetch<AiAutofillData>('/jobs/ai-autofill', {
        method: 'POST',
        body: JSON.stringify({
          title: title.trim(),
          experience: experience?.trim() || undefined,
        }),
      });
      return res;
    } catch (err: unknown) {
      // Fallback alias endpoint if alias router is mounted under /recruitment/jobs/generate-description
      try {
        const fallbackRes = await this.fetch<any>('/recruitment/jobs/generate-description', {
          method: 'POST',
          body: JSON.stringify({
            title: title.trim(),
            experience: experience?.trim() || '3-5 years',
          }),
        });
        return {
          department: fallbackRes?.department || 'Engineering',
          employment_type: fallbackRes?.employment_type || 'FULL_TIME',
          location: fallbackRes?.location || 'Jaipur, India',
          work_mode: fallbackRes?.work_mode || 'Hybrid',
          vacancies: fallbackRes?.vacancies ?? 1,
          skills: fallbackRes?.skills || ['Python', 'FastAPI', 'PostgreSQL'],
          description: fallbackRes?.description || fallbackRes?.job_description || '',
          responsibilities: fallbackRes?.responsibilities || [],
          requirements: fallbackRes?.requirements || [],
          benefits: fallbackRes?.benefits || [],
        };
      } catch {
        throw err instanceof Error ? err : new Error(String(err));
      }
    }
  },

  /**
   * Submits the final job posting to POST /api/v1/jobs.
   */
  async createJob(payload: CreateJobPayload): Promise<any> {
    const res = await this.fetch<any>('/jobs', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    // Invalidate recruitment caches
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ofc360:jobs_changed'));
      window.dispatchEvent(new CustomEvent('ofc360:sidebar_badges_changed'));
    }

    return res;
  },
};

