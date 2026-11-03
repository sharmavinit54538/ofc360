/**
 * @file interviewSchedulerApi.ts
 * @description Dedicated API client and reactive query/mutation hooks for Interview Scheduler & Evaluation.
 * Conforms strictly to backend FastAPI endpoints with zero mock data policy,
 * JWT Bearer token authentication, error mapping (400, 409), and reactive cache invalidation.
 */

import { useState, useEffect, useCallback } from 'react';
import type {
  InterviewDetail,
  ScheduleSlotPayload,
  RoundFeedbackPayload,
  APIResponse,
  InterviewFilterOptions,
} from '../types/interviewScheduler.types';

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

// Real-time cache event dispatcher
export const invalidateInterviewCache = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ofc360:interview_cache_invalidated'));
    window.dispatchEvent(new CustomEvent('ofc360:ats_cache_invalidated'));
    window.dispatchEvent(new CustomEvent('ofc360:applications_changed'));
    window.dispatchEvent(new CustomEvent('ofc360:sidebar_badges_changed'));
  }
};

export class InterviewApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'InterviewApiError';
    this.status = status;
    this.data = data;
  }
}

export const interviewSchedulerClient = {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const baseUrl = getApiBaseUrl();
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${baseUrl}${cleanEndpoint}`;

    const headers = new Headers(options.headers || {});
    const token = getAuthToken();
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    if (!headers.has('Content-Type') && options.body && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    let json: any = null;
    const text = await response.text();
    if (text) {
      try {
        json = JSON.parse(text);
      } catch {
        json = { message: text };
      }
    }

    if (!response.ok) {
      let errMsg = json?.message || json?.detail || 'Interview service request failed.';
      if (response.status === 409) {
        errMsg = json?.detail || json?.message || 'This time slot is already booked. Please choose another slot.';
      } else if (response.status === 400) {
        errMsg = json?.detail || json?.message || 'Invalid interview schedule parameters. Date must be within the next 7 days.';
      }
      throw new InterviewApiError(errMsg, response.status, json);
    }

    return json as T;
  },

  /**
   * POST /api/v1/applications/{application_id}/send-interview?round_names=...
   */
  async initiateInterview(
    applicationId: string,
    roundNames: string[]
  ): Promise<APIResponse<InterviewDetail>> {
    const query = roundNames
      .map((name) => `round_names=${encodeURIComponent(name.trim())}`)
      .join('&');
    const endpoint = `/applications/${applicationId}/send-interview${query ? `?${query}` : ''}`;

    const res = await this.request<APIResponse<InterviewDetail>>(endpoint, {
      method: 'POST',
    });
    invalidateInterviewCache();
    return res;
  },

  /**
   * POST /api/v1/interviews/{interview_id}/schedule
   */
  async bookInterviewSlot(
    interviewId: string,
    payload: ScheduleSlotPayload
  ): Promise<APIResponse<InterviewDetail>> {
    // Ensure time has seconds: HH:MM -> HH:MM:00
    let formattedTime = payload.interview_time.trim();
    if (/^\d{2}:\d{2}$/.test(formattedTime)) {
      formattedTime += ':00';
    }

    const body: ScheduleSlotPayload = {
      interview_date: payload.interview_date,
      interview_time: formattedTime,
      mode: payload.mode,
      meeting_url: payload.mode === 'ONLINE' ? payload.meeting_url || null : null,
      office_address: payload.mode === 'OFFLINE' ? payload.office_address || null : null,
    };

    const res = await this.request<APIResponse<InterviewDetail>>(
      `/interviews/${interviewId}/schedule`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      }
    );
    invalidateInterviewCache();
    return res;
  },

  /**
   * GET /api/v1/interviews/{interview_id}
   */
  async getInterviewDetail(interviewId: string): Promise<APIResponse<InterviewDetail>> {
    return this.request<APIResponse<InterviewDetail>>(`/interviews/${interviewId}`, {
      method: 'GET',
    });
  },

  /**
   * PATCH /api/v1/interviews/rounds/{round_id}/pass
   * PATCH /api/v1/interviews/rounds/{round_id}/reject
   * PATCH /api/v1/interviews/rounds/{round_id}/hold
   */
  async submitRoundDecision(
    roundId: string,
    decision: 'pass' | 'reject' | 'hold',
    payload: RoundFeedbackPayload
  ): Promise<APIResponse<unknown>> {
    const res = await this.request<APIResponse<unknown>>(
      `/interviews/rounds/${roundId}/${decision}`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          interviewer_name: payload.interviewer_name.trim(),
          score: payload.score.trim(),
          feedback: payload.feedback.trim(),
        }),
      }
    );
    invalidateInterviewCache();
    return res;
  },

  /**
   * GET /api/v1/interviews
   */
  async listInterviews(
    params: { status?: string; page?: number; limit?: number } = {}
  ): Promise<APIResponse<InterviewDetail[] | { items: InterviewDetail[]; total: number }>> {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));

    const qs = query.toString();
    return this.request<APIResponse<InterviewDetail[] | { items: InterviewDetail[]; total: number }>>(
      `/interviews${qs ? `?${qs}` : ''}`,
      { method: 'GET' }
    );
  },
};

/**
 * Hook to retrieve an interview's detailed progress and rounds.
 */
export const useInterviewDetail = (interviewId: string | null) => {
  const [data, setData] = useState<InterviewDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(interviewId));
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!interviewId) {
      setData(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await interviewSchedulerClient.getInterviewDetail(interviewId);
      setData(res.data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load interview details.');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [interviewId]);

  useEffect(() => {
    fetchDetail();

    const handleInvalidation = () => {
      fetchDetail();
    };

    window.addEventListener('ofc360:interview_cache_invalidated', handleInvalidation);
    return () => {
      window.removeEventListener('ofc360:interview_cache_invalidated', handleInvalidation);
    };
  }, [fetchDetail]);

  return { data, isLoading, error, refetch: fetchDetail };
};

/**
 * Hook to list interviews with live cache listening.
 */
export const useInterviewsList = (options: InterviewFilterOptions = {}) => {
  const [interviews, setInterviews] = useState<InterviewDetail[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInterviews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await interviewSchedulerClient.listInterviews({
        status: options.status,
        limit: 100,
      });

      let items: InterviewDetail[] = [];
      if (Array.isArray(res.data)) {
        items = res.data;
      } else if (res.data && Array.isArray((res.data as any).items)) {
        items = (res.data as any).items;
      }
      setInterviews(items);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch interviews.');
      setInterviews([]);
    } finally {
      setIsLoading(false);
    }
  }, [options.status]);

  useEffect(() => {
    fetchInterviews();

    const handleInvalidation = () => {
      fetchInterviews();
    };

    window.addEventListener('ofc360:interview_cache_invalidated', handleInvalidation);
    return () => {
      window.removeEventListener('ofc360:interview_cache_invalidated', handleInvalidation);
    };
  }, [fetchInterviews]);

  return { interviews, isLoading, error, refetch: fetchInterviews };
};

