/**
 * @file documentGeneratorApi.ts
 * @description Enterprise RTK Query API slice for AI Hub Document Generator.
 * Connects directly to FastAPI backend mounted under /api/v1/ai-hub/document-generator.
 */

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/shared/api/baseQuery';
import type {
  ApiEnvelope,
  DocumentGeneratorOverview,
  DocumentTemplatesResponse,
  DocumentPreviewRequest,
  DocumentPreviewResponse,
  DocumentGenerateRequest,
  DocumentGenerateResponse,
} from '../types/documentGenerator.types';

/**
 * Normalizes backend responses wrapped in ApiEnvelope<T> or raw payloads.
 */
export const unwrapApiEnvelope = <T>(response: unknown): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    const env = response as ApiEnvelope<T>;
    if (env.data !== undefined && env.data !== null) {
      return env.data;
    }
  }
  return response as T;
};

/**
 * Extracts a human-readable error message from an API error response.
 */
export const extractApiErrorMessage = (error: unknown, fallbackMessage = 'An unexpected error occurred'): string => {
  if (!error || typeof error !== 'object') return fallbackMessage;

  const data = 'data' in error ? (error as { data?: unknown }).data : error;

  if (data && typeof data === 'object') {
    const env = data as Partial<ApiEnvelope<unknown>> & { detail?: unknown; error?: unknown };

    if (env.errors && Array.isArray(env.errors) && env.errors.length > 0) {
      const messages = env.errors.map((e) => e.message).filter(Boolean);
      if (messages.length > 0) return messages.join('; ');
    }

    if (typeof env.message === 'string' && env.message.trim()) {
      return env.message;
    }

    if (typeof env.detail === 'string' && env.detail.trim()) {
      return env.detail;
    }

    if (Array.isArray(env.detail)) {
      const detailMsgs = env.detail
        .map((d: any) => d.msg || d.message)
        .filter(Boolean);
      if (detailMsgs.length > 0) return detailMsgs.join('; ');
    }
  }

  if ('status' in error) {
    const status = (error as { status?: number | string }).status;
    if (status === 401) return 'Session expired or unauthenticated. Please log in again.';
    if (status === 403) return 'You do not have permission to access the Document Generator.';
    if (status === 404) return 'The requested document template or resource was not found.';
    if (status === 422) return 'Invalid document parameters or missing required placeholders.';
    if (status === 500) return 'Backend server encountered an error while processing the document.';
  }

  return fallbackMessage;
};

/**
 * Resolves the generated document download URL.
 * 
 * IMPORTANT BACKEND GAP NOTE:
 * `filePathOrUrl` returned by the FastAPI backend is a relative server path like
 * "uploads/generated_documents/<name>_<id>.pdf". The backend currently returns
 * HTTP 404 for both `${API_BASE}/uploads/...` and `/uploads/...` because static
 * file mounting for /uploads is not yet configured on the server.
 * 
 * Per prompt specifications:
 * "Try ${API_BASE}/${filePathOrUrl} against the dev/prod backend. If it does not return the file (404/401),
 * do NOT fake a download and do NOT mock it. Show the document record with a disabled 'Download' button
 * and a tooltip 'Download not available yet', and list this as a backend gap in your final report."
 */
export const resolveGeneratedDocumentUrl = (
  filePathOrUrl?: string | null
): {
  url: string | null;
  isDownloadable: boolean;
  tooltipText: string;
} => {
  if (!filePathOrUrl || typeof filePathOrUrl !== 'string' || !filePathOrUrl.trim()) {
    return {
      url: null,
      isDownloadable: false,
      tooltipText: 'Download not available yet',
    };
  }

  const envUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() || 'https://api.ofc360.com/api/v1';
  const cleanBase = envUrl.replace(/\/+$/, '');
  const cleanPath = filePathOrUrl.trim().replace(/^\/+/, '');

  const resolved = cleanPath.startsWith('http://') || cleanPath.startsWith('https://')
    ? cleanPath
    : `${cleanBase}/${cleanPath}`;

  // Currently the backend does not serve /uploads publicly or with auth (returns 404)
  return {
    url: resolved,
    isDownloadable: false,
    tooltipText: 'Download not available yet (backend storage endpoint pending)',
  };
};

export const documentGeneratorApi = createApi({
  reducerPath: 'documentGeneratorApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['DocumentGeneratorOverview', 'DocumentTemplates'],
  endpoints: (builder) => ({
    /**
     * GET /api/v1/ai-hub/document-generator
     * Retrieves overall document generation statistics, supported formats, and recent history.
     */
    getDocumentGeneratorOverview: builder.query<DocumentGeneratorOverview, void>({
      query: () => '/ai-hub/document-generator',
      transformResponse: (response: ApiEnvelope<DocumentGeneratorOverview> | DocumentGeneratorOverview) =>
        unwrapApiEnvelope<DocumentGeneratorOverview>(response),
      providesTags: ['DocumentGeneratorOverview'],
    }),

    /**
     * GET /api/v1/ai-hub/document-generator/templates
     * Retrieves the catalog of document templates with active placeholder tokens.
     */
    getDocumentTemplates: builder.query<DocumentTemplatesResponse, void>({
      query: () => '/ai-hub/document-generator/templates',
      transformResponse: (response: ApiEnvelope<DocumentTemplatesResponse> | DocumentTemplatesResponse) =>
        unwrapApiEnvelope<DocumentTemplatesResponse>(response),
      providesTags: ['DocumentTemplates'],
    }),

    /**
     * POST /api/v1/ai-hub/document-generator/preview
     * Renders a live preview with variables applied and detects missing placeholders.
     */
    previewDocument: builder.mutation<DocumentPreviewResponse, DocumentPreviewRequest>({
      query: (body) => ({
        url: '/ai-hub/document-generator/preview',
        method: 'POST',
        body,
      }),
      transformResponse: (response: ApiEnvelope<DocumentPreviewResponse> | DocumentPreviewResponse) =>
        unwrapApiEnvelope<DocumentPreviewResponse>(response),
    }),

    /**
     * POST /api/v1/ai-hub/document-generator/generate
     * Generates the final document artifact in the chosen format (pdf, docx, html, txt).
     */
    generateDocument: builder.mutation<DocumentGenerateResponse, DocumentGenerateRequest>({
      query: (body) => ({
        url: '/ai-hub/document-generator/generate',
        method: 'POST',
        body,
      }),
      transformResponse: (response: ApiEnvelope<DocumentGenerateResponse> | DocumentGenerateResponse) =>
        unwrapApiEnvelope<DocumentGenerateResponse>(response),
      invalidatesTags: ['DocumentGeneratorOverview'],
    }),
  }),
});

export const {
  useGetDocumentGeneratorOverviewQuery,
  useGetDocumentTemplatesQuery,
  usePreviewDocumentMutation,
  useGenerateDocumentMutation,
} = documentGeneratorApi;

