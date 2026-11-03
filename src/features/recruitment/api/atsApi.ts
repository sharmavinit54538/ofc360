/**
 * @file atsApi.ts
 * @description Dedicated API client and reactive query/mutation hooks for OFC360 ATS Pipeline.
 * Connects directly to verified backend /api/v1/applications endpoints with Bearer auth,
 * multi-channel event invalidation, and strict APIResponse unwrapping.
 */

import { useState, useEffect, useCallback } from 'react';
import type {
  ApplicationItem,
  ApplicationListPagination,
  ApplicationQueryParams,
  ApplicationStage,
  MoveStagePayload,
  BulkMovePayload,
  APIResponse,
} from '../types/ats.types';

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

// Event bus dispatcher for real-time cache synchronization
export const invalidateAtsCache = (keys: string[] = ['applications', 'application-stats', 'sidebar', 'badges']) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ofc360:ats_cache_invalidated', { detail: { keys } }));
    window.dispatchEvent(new CustomEvent('ofc360:applications_changed'));
    window.dispatchEvent(new CustomEvent('ofc360:sidebar_badges_changed'));
  }
};

export const atsClient = {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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

    let payload: APIResponse<T> | null = null;
    try {
      payload = (await response.json()) as APIResponse<T>;
    } catch {
      payload = {
        success: false,
        message: response.statusText,
        data: null,
        errors: [{ message: response.statusText }],
      };
    }

    if (!response.ok) {
      const errorMsg =
        payload?.message ||
        (Array.isArray(payload?.errors) && payload.errors[0]?.message) ||
        `HTTP Error ${response.status}: Failed to execute request`;
      throw new Error(errorMsg);
    }

    if (payload && typeof payload === 'object' && 'data' in payload) {
      return (payload.data !== null ? payload.data : (payload as unknown)) as T;
    }

    return payload as unknown as T;
  },

  // 1. Get Applications
  async getApplications(params: ApplicationQueryParams = {}): Promise<ApplicationListPagination> {
    const q = new URLSearchParams();
    if (params.job_id) q.append('job_id', params.job_id);
    if (params.status) q.append('status', params.status);
    if (params.search) q.append('search', params.search);
    if (params.page) q.append('page', String(params.page));
    if (params.limit) q.append('limit', String(params.limit));

    const qs = q.toString();
    const res = await this.request<any>(`/applications${qs ? `?${qs}` : ''}`, {
      method: 'GET',
    });

    return {
      items: Array.isArray(res?.items) ? res.items : Array.isArray(res) ? res : [],
      total: res?.total ?? (Array.isArray(res?.items) ? res.items.length : Array.isArray(res) ? res.length : 0),
      page: res?.page ?? params.page ?? 1,
      limit: res?.limit ?? params.limit ?? 20,
      pages: res?.pages ?? 1,
    };
  },

  // 2. Get Application Detail
  async getApplicationById(id: string): Promise<ApplicationItem> {
    return this.request<ApplicationItem>(`/applications/${id}`, {
      method: 'GET',
    });
  },

  // 3. Move Stage
  async moveStage(id: string, stage: ApplicationStage): Promise<ApplicationItem> {
    const res = await this.request<ApplicationItem>(`/applications/${id}/stage`, {
      method: 'PATCH',
      body: JSON.stringify({ stage } as MoveStagePayload),
    });
    invalidateAtsCache(['applications', 'application-stats', 'sidebar', 'badges']);
    return res;
  },

  // 4. Quick Actions
  async shortlist(id: string): Promise<ApplicationItem> {
    const res = await this.request<ApplicationItem>(`/applications/${id}/shortlist`, {
      method: 'PATCH',
    });
    invalidateAtsCache(['applications', 'application-stats', 'sidebar', 'badges']);
    return res;
  },

  async reject(id: string): Promise<ApplicationItem> {
    const res = await this.request<ApplicationItem>(`/applications/${id}/reject`, {
      method: 'PATCH',
    });
    invalidateAtsCache(['applications', 'application-stats', 'sidebar', 'badges']);
    return res;
  },

  async hold(id: string): Promise<ApplicationItem> {
    const res = await this.request<ApplicationItem>(`/applications/${id}/hold`, {
      method: 'PATCH',
    });
    invalidateAtsCache(['applications', 'application-stats', 'sidebar', 'badges']);
    return res;
  },

  // 5. Bulk Move
  async bulkMove(payload: BulkMovePayload): Promise<{ updated_count: number }> {
    const res = await this.request<{ updated_count: number }>('/applications/bulk-move', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    invalidateAtsCache(['applications', 'application-stats', 'sidebar', 'badges']);
    return res;
  },
};

// ============================================================================
// REACT QUERY / MUTATION HOOKS
// ============================================================================

/**
 * Hook to retrieve and cache applications list with filters
 */
export const useApplications = (params?: ApplicationQueryParams) => {
  const [data, setData] = useState<ApplicationListPagination>({
    items: [],
    total: 0,
    page: 1,
    limit: 20,
    pages: 1,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await atsClient.getApplications(params);
      setData(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [params?.job_id, params?.status, params?.search, params?.page, params?.limit]);

  useEffect(() => {
    fetchApplications();
    const handleInvalidate = () => {
      fetchApplications();
    };
    window.addEventListener('ofc360:ats_cache_invalidated', handleInvalidate);
    window.addEventListener('ofc360:applications_changed', handleInvalidate);
    return () => {
      window.removeEventListener('ofc360:ats_cache_invalidated', handleInvalidate);
      window.removeEventListener('ofc360:applications_changed', handleInvalidate);
    };
  }, [fetchApplications]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchApplications,
  };
};

/**
 * Hook to retrieve single application details
 */
export const useApplicationDetail = (id: string | null) => {
  const [data, setData] = useState<ApplicationItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!id) {
      setData(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await atsClient.getApplicationById(id);
      setData(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
    const handleInvalidate = () => {
      fetchDetail();
    };
    window.addEventListener('ofc360:ats_cache_invalidated', handleInvalidate);
    return () => {
      window.removeEventListener('ofc360:ats_cache_invalidated', handleInvalidate);
    };
  }, [fetchDetail]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchDetail,
  };
};

/**
 * Hook to transition candidate stage
 */
export const useMoveApplicationStage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const mutateAsync = useCallback(async (params: { id: string; stage: ApplicationStage }): Promise<ApplicationItem> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await atsClient.moveStage(params.id, params.stage);
      return res;
    } catch (err: unknown) {
      const errObj = err instanceof Error ? err : new Error(String(err));
      setError(errObj);
      throw errObj;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    mutate: mutateAsync,
    mutateAsync,
    isLoading,
    isPending: isLoading,
    error,
  };
};

/**
 * Hook for quick triage actions (shortlist, reject, hold)
 */
export const useQuickAction = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const shortlistAsync = useCallback(async (id: string): Promise<ApplicationItem> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await atsClient.shortlist(id);
      return res;
    } catch (err: unknown) {
      const errObj = err instanceof Error ? err : new Error(String(err));
      setError(errObj);
      throw errObj;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const rejectAsync = useCallback(async (id: string): Promise<ApplicationItem> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await atsClient.reject(id);
      return res;
    } catch (err: unknown) {
      const errObj = err instanceof Error ? err : new Error(String(err));
      setError(errObj);
      throw errObj;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const holdAsync = useCallback(async (id: string): Promise<ApplicationItem> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await atsClient.hold(id);
      return res;
    } catch (err: unknown) {
      const errObj = err instanceof Error ? err : new Error(String(err));
      setError(errObj);
      throw errObj;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    shortlist: shortlistAsync,
    reject: rejectAsync,
    hold: holdAsync,
    isLoading,
    isPending: isLoading,
    error,
  };
};

/**
 * Hook for bulk stage transitions
 */
export const useBulkMoveApplications = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const mutateAsync = useCallback(async (payload: BulkMovePayload): Promise<{ updated_count: number }> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await atsClient.bulkMove(payload);
      return res;
    } catch (err: unknown) {
      const errObj = err instanceof Error ? err : new Error(String(err));
      setError(errObj);
      throw errObj;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    mutate: mutateAsync,
    mutateAsync,
    isLoading,
    isPending: isLoading,
    error,
  };
};

