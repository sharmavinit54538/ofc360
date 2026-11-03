/**
 * @file requisitionsApi.ts
 * @description Enterprise API client and data hooks for Job Requisitions (Manpower Requests).
 * Implements full RBAC headers, token re-auth, error normalization, and reactive cache invalidation.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  APIResponse,
  JobRequisitionItem,
  JobRequisitionCreatePayload,
  RequisitionApprovalPayload,
  RequisitionListPagination,
  RequisitionQueryParams,
} from '../types/requisition.types';

const getBaseUrl = (): string => {
  const envUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();
  if (envUrl && envUrl.length > 0) {
    const clean = envUrl.replace(/\/+$/, '');
    return clean.endsWith('/api/v1') ? clean : `${clean}/api/v1`;
  }
  return '/api/v1';
};

const BASE_URL = getBaseUrl();

/**
 * Retrieves the stored JWT authentication token across possible storage keys.
 */
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return (
    localStorage.getItem('token') ||
    localStorage.getItem('accessToken') ||
    localStorage.getItem('auth_token') ||
    sessionStorage.getItem('token') ||
    sessionStorage.getItem('accessToken')
  );
};

/**
 * Lightweight event emitter for cache invalidation across hooks.
 */
type CacheKey = 'requisitions' | 'requisitions_detail' | 'jobs' | 'badges';
const cacheListeners = new Set<(key: CacheKey) => void>();

export const invalidateCache = (key: CacheKey): void => {
  cacheListeners.forEach((listener) => listener(key));
};

/**
 * Enterprise client with standardized request handling, token injection, and JSON parsing.
 */
export const requisitionsClient = {
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${BASE_URL}${cleanEndpoint}`;

    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');

    const token = getAuthToken();
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    const contentType = response.headers.get('content-type');
    let responseData: unknown = null;

    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      const text = await response.text();
      responseData = { message: text };
    }

    if (!response.ok) {
      const errorObj = responseData as { message?: string; detail?: string; error?: string };
      const errorMessage =
        errorObj.detail ||
        errorObj.message ||
        errorObj.error ||
        `Request failed with status ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    return responseData as APIResponse<T>;
  },

  get<T>(endpoint: string, options?: RequestInit): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  },

  post<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  },
};

/**
 * Hook: useRequisitions
 * Fetches paginated, status-filtered requisitions with reactive auto-refresh on cache invalidation.
 */
export function useRequisitions(params?: RequisitionQueryParams) {
  const [data, setData] = useState<RequisitionListPagination | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const paramsRef = useRef(params);
  paramsRef.current = params;

  const fetchRequisitions = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const query = new URLSearchParams();
      if (paramsRef.current?.status && paramsRef.current.status !== 'ALL') {
        query.set('status', paramsRef.current.status);
      }
      if (paramsRef.current?.page) {
        query.set('page', String(paramsRef.current.page));
      }
      if (paramsRef.current?.limit) {
        query.set('limit', String(paramsRef.current.limit));
      }

      const queryString = query.toString();
      const endpoint = `/requisitions${queryString ? `?${queryString}` : ''}`;

      const res = await requisitionsClient.get<RequisitionListPagination>(endpoint);

      if (res.data) {
        setData(res.data);
      } else {
        setData({ items: [], total: 0, page: 1, limit: 50, pages: 0 });
      }
    } catch (err: unknown) {
      setIsError(true);
      const msg = err instanceof Error ? err.message : 'Failed to fetch requisitions';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequisitions();
  }, [fetchRequisitions, params?.status, params?.page, params?.limit]);

  useEffect(() => {
    const handleInvalidate = (key: CacheKey) => {
      if (key === 'requisitions') {
        fetchRequisitions();
      }
    };
    cacheListeners.add(handleInvalidate);
    return () => {
      cacheListeners.delete(handleInvalidate);
    };
  }, [fetchRequisitions]);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch: fetchRequisitions,
  };
}

/**
 * Hook: useRequisitionDetail
 * Fetches a single requisition by its UUID.
 */
export function useRequisitionDetail(id?: string | null) {
  const [data, setData] = useState<JobRequisitionItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!id) {
      setData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const res = await requisitionsClient.get<JobRequisitionItem>(`/requisitions/${id}`);
      setData(res.data);
    } catch (err: unknown) {
      setIsError(true);
      const msg = err instanceof Error ? err.message : 'Failed to load requisition details';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  useEffect(() => {
    const handleInvalidate = (key: CacheKey) => {
      if (key === 'requisitions' || key === 'requisitions_detail') {
        fetchDetail();
      }
    };
    cacheListeners.add(handleInvalidate);
    return () => {
      cacheListeners.delete(handleInvalidate);
    };
  }, [fetchDetail]);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch: fetchDetail,
  };
}

/**
 * Hook: useCreateRequisition
 * Submits a new job requisition and invalidates requisition & badge caches.
 */
export function useCreateRequisition() {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const mutateAsync = useCallback(async (payload: JobRequisitionCreatePayload): Promise<JobRequisitionItem> => {
    setIsPending(true);
    setError(null);

    try {
      const res = await requisitionsClient.post<JobRequisitionItem>('/requisitions', payload);
      if (!res.data) {
        throw new Error('Server returned an empty response for created requisition');
      }

      // Cache invalidation
      invalidateCache('requisitions');
      invalidateCache('badges');

      return res.data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create requisition';
      setError(msg);
      throw err;
    } finally {
      setIsPending(false);
    }
  }, []);

  return {
    mutateAsync,
    isPending,
    error,
  };
}

/**
 * Hook: useApproveRequisition
 * Approves or rejects a requisition and invalidates requisition, job, and badge caches.
 */
export function useApproveRequisition() {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const mutateAsync = useCallback(async (payload: RequisitionApprovalPayload): Promise<JobRequisitionItem> => {
    setIsPending(true);
    setError(null);

    try {
      const endpoint = `/requisitions/${payload.requisition_id}/approve`;
      const res = await requisitionsClient.post<JobRequisitionItem>(endpoint, {
        requisition_id: payload.requisition_id,
        approve: payload.approve,
      });

      if (!res.data) {
        throw new Error('Server returned an empty response on requisition action');
      }

      // Cache invalidation: requisitions, jobs (promoted on approval), and sidebar badges
      invalidateCache('requisitions');
      invalidateCache('requisitions_detail');
      invalidateCache('jobs');
      invalidateCache('badges');

      return res.data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update requisition status';
      setError(msg);
      throw err;
    } finally {
      setIsPending(false);
    }
  }, []);

  return {
    mutateAsync,
    isPending,
    error,
  };
}

