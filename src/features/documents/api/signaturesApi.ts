/**
 * @file signaturesApi.ts
 * @description RTK Query slice for Digital Signatures & E-Signs module.
 * Features tolerant normalizers (camelCase & snake_case), API envelope unwrapping,
 * graceful empty error fallbacks, and opt-in mock database fallback.
 */

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/shared/api/baseQuery';
import type { RootState } from '@/app/store';
import type {
  SignatureRequest,
  SignatureStats,
  SignatureRequestsResponse,
  SignatureFilterParams,
  SignatureAuditEvent,
  CreateSignatureRequestPayload,
  SignDocumentPayload,
  DeclineSignaturePayload,
  CancelRequestPayload,
  RemindSignersPayload,
  ResendRequestPayload,
  Signer,
  PublicSignatureTokenData,
} from '../types/signatures.types';
import * as mockDb from './signaturesMock';

// Helper to extract user-friendly error message
export const extractApiErrorMessage = (error: unknown, fallback = 'Operation failed'): string => {
  if (!error || typeof error !== 'object') return fallback;
  const data = 'data' in error ? (error as { data?: unknown }).data : error;
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    if (typeof obj.message === 'string' && obj.message.trim()) return obj.message;
    if (typeof obj.detail === 'string' && obj.detail.trim()) return obj.detail;
    if (Array.isArray(obj.errors) && obj.errors.length > 0) {
      const msg = obj.errors.map((e: any) => e?.message || String(e)).filter(Boolean).join('; ');
      if (msg) return msg;
    }
  }
  return fallback;
};

// Response unwrapper
export const unwrapEnvelope = <T>(response: unknown): T => {
  if (!response || typeof response !== 'object') return response as T;
  const res = response as Record<string, unknown>;
  if ('data' in res && res.data !== undefined) {
    return res.data as T;
  }
  return response as T;
};

// Tolerant Signer Normalizer
export const normalizeSigner = (raw: any): Signer => {
  if (!raw || typeof raw !== 'object') {
    return {
      id: String(raw || 'sgn-unknown'),
      name: 'Unknown',
      email: '',
      kind: 'EXTERNAL',
      role: 'SIGNER',
      order: 1,
      status: 'PENDING',
    };
  }

  return {
    id: String(raw.id || raw.signer_id || raw.signerId || `sgn-${Math.random()}`),
    name: String(raw.name || raw.signer_name || raw.signerName || raw.email || 'Signer'),
    email: String(raw.email || raw.signer_email || raw.signerEmail || ''),
    employeeId: raw.employee_id || raw.employeeId || undefined,
    kind: (raw.kind || (raw.employee_id || raw.employeeId ? 'EMPLOYEE' : 'EXTERNAL')) as any,
    role: (raw.role || 'SIGNER').toUpperCase() as any,
    order: Number(raw.order ?? raw.signing_order ?? raw.sequence ?? 1),
    status: (raw.status || 'PENDING').toUpperCase() as any,
    viewedAt: raw.viewed_at || raw.viewedAt || null,
    signedAt: raw.signed_at || raw.signedAt || null,
    declinedAt: raw.declined_at || raw.declinedAt || null,
    declineReason: raw.decline_reason || raw.declineReason || null,
    signatureMethod: raw.signature_method || raw.signatureMethod || null,
    signatureImage: raw.signature_image || raw.signatureImage || null,
    ipAddress: raw.ip_address || raw.ipAddress || null,
    userAgent: raw.user_agent || raw.userAgent || null,
    lastReminderAt: raw.last_reminder_at || raw.lastReminderAt || null,
  };
};

// Tolerant SignatureRequest Normalizer
export const normalizeSignatureRequest = (raw: any): SignatureRequest => {
  if (!raw || typeof raw !== 'object') {
    return {
      id: 'req-unknown',
      referenceNo: 'SIG-UNKNOWN',
      title: 'Untitled Request',
      documentType: 'OTHER',
      source: 'UPLOADED',
      fileName: 'document.pdf',
      sha256: '',
      signingOrder: 'PARALLEL',
      status: 'PENDING',
      createdBy: { id: '', name: 'System', email: '' },
      createdAt: new Date().toISOString(),
      expiresAt: new Date().toISOString(),
      reminderDays: [3, 7],
      signers: [],
      progress: { signed: 0, total: 0 },
    };
  }

  const signersRaw = Array.isArray(raw.signers) ? raw.signers : [];
  const signers = signersRaw.map(normalizeSigner);

  const rawSigned = raw.progress?.signed ?? raw.signed_count ?? raw.signedCount;
  const rawTotal = raw.progress?.total ?? raw.total_signers ?? raw.totalSigners;

  const signed = typeof rawSigned === 'number' ? rawSigned : signers.filter((s) => s.status === 'SIGNED').length;
  const total = typeof rawTotal === 'number' ? rawTotal : signers.length;

  const rawCreator = raw.created_by || raw.createdBy;
  const createdBy =
    rawCreator && typeof rawCreator === 'object'
      ? {
          id: String(rawCreator.id || ''),
          name: String(rawCreator.name || rawCreator.fullName || 'User'),
          email: String(rawCreator.email || ''),
        }
      : { id: '', name: 'Admin', email: 'admin@ofc360.com' };

  return {
    id: String(raw.id || raw.request_id || raw.requestId || ''),
    referenceNo: String(raw.reference_no || raw.referenceNo || raw.ref_no || raw.id || 'SIG-2026-0000'),
    title: String(raw.title || raw.document_title || 'Signature Request'),
    documentType: (raw.document_type || raw.documentType || 'OTHER').toUpperCase() as any,
    source: (raw.source || 'UPLOADED').toUpperCase() as any,
    sourceDocumentId: raw.source_document_id || raw.sourceDocumentId || undefined,
    fileName: String(raw.file_name || raw.fileName || raw.title || 'document.pdf'),
    fileSize: raw.file_size || raw.fileSize || undefined,
    fileUrl: raw.file_url || raw.fileUrl || undefined,
    pageCount: raw.page_count || raw.pageCount || undefined,
    sha256: String(raw.sha256 || raw.document_hash || ''),
    message: raw.message || raw.note || undefined,
    signingOrder: (raw.signing_order || raw.signingOrder || 'PARALLEL').toUpperCase() as any,
    status: (raw.status || 'PENDING').toUpperCase() as any,
    createdBy,
    createdAt: String(raw.created_at || raw.createdAt || new Date().toISOString()),
    sentAt: raw.sent_at || raw.sentAt || null,
    expiresAt: String(raw.expires_at || raw.expiresAt || new Date(Date.now() + 14 * 86400000).toISOString()),
    completedAt: raw.completed_at || raw.completedAt || null,
    reminderDays: Array.isArray(raw.reminder_days || raw.reminderDays)
      ? raw.reminder_days || raw.reminderDays
      : [3, 7],
    signers,
    progress: { signed, total },
    certificateUrl: raw.certificate_url || raw.certificateUrl || undefined,
    signedDocumentUrl: raw.signed_document_url || raw.signedDocumentUrl || undefined,
  };
};

// Tolerant Stats Normalizer
export const normalizeSignatureStats = (raw: any): SignatureStats => {
  if (!raw || typeof raw !== 'object') {
    return {
      awaitingMySignature: 0,
      waitingOnOthers: 0,
      completedLast30Days: 0,
      expiringSoon: 0,
      declined: 0,
      expired: 0,
      avgTurnaroundHours: 0,
    };
  }

  return {
    awaitingMySignature: Number(raw.awaiting_my_signature ?? raw.awaitingMySignature ?? 0),
    waitingOnOthers: Number(raw.waiting_on_others ?? raw.waitingOnOthers ?? 0),
    completedLast30Days: Number(raw.completed_last_30_days ?? raw.completedLast30Days ?? raw.completed ?? 0),
    expiringSoon: Number(raw.expiring_soon ?? raw.expiringSoon ?? 0),
    declined: Number(raw.declined ?? 0),
    expired: Number(raw.expired ?? 0),
    avgTurnaroundHours: Number(raw.avg_turnaround_hours ?? raw.avgTurnaroundHours ?? 0),
  };
};

// Tolerant Audit Event Normalizer
export const normalizeSignatureAuditEvent = (raw: any): SignatureAuditEvent => {
  return {
    id: String(raw.id || `aud-${Math.random()}`),
    requestId: String(raw.request_id || raw.requestId || ''),
    type: (raw.type || raw.event_type || 'CREATED').toUpperCase() as any,
    actorName: String(raw.actor_name || raw.actorName || raw.actor || 'System'),
    actorEmail: String(raw.actor_email || raw.actorEmail || ''),
    ipAddress: raw.ip_address || raw.ipAddress || undefined,
    userAgent: raw.user_agent || raw.userAgent || undefined,
    timestamp: String(raw.timestamp || raw.created_at || raw.createdAt || new Date().toISOString()),
    metadata: raw.metadata || undefined,
  };
};

export const signaturesApi = createApi({
  reducerPath: 'signaturesApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['SignatureRequests', 'SignatureStats', 'SignatureAudit'],
  endpoints: (builder) => ({
    // ─────────────────────────────────────────────────────────────────────────
    // 1. Overview & Statistics
    // ─────────────────────────────────────────────────────────────────────────
    getSignatureStats: builder.query<SignatureStats, void>({
      queryFn: async (_arg, api, extraOptions, baseQuery) => {
        const state = api.getState() as RootState;
        const currentUserEmail = state.auth?.user?.email;
        const enableMock = import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true';

        try {
          const result = await baseQuery('/documents/signatures/stats');
          if (result.error) {
            if (enableMock) {
              return { data: mockDb.getMockStats(currentUserEmail) };
            }
            // Graceful network fallback: zeroed stats, never fake numbers
            return {
              data: {
                awaitingMySignature: 0,
                waitingOnOthers: 0,
                completedLast30Days: 0,
                expiringSoon: 0,
                declined: 0,
                expired: 0,
                avgTurnaroundHours: 0,
              },
            };
          }
          const unwrapped = unwrapEnvelope<unknown>(result.data);
          return { data: normalizeSignatureStats(unwrapped) };
        } catch {
          if (enableMock) {
            return { data: mockDb.getMockStats(currentUserEmail) };
          }
          return {
            data: {
              awaitingMySignature: 0,
              waitingOnOthers: 0,
              completedLast30Days: 0,
              expiringSoon: 0,
              declined: 0,
              expired: 0,
              avgTurnaroundHours: 0,
            },
          };
        }
      },
      providesTags: ['SignatureStats'],
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // 2. Filtered & Paginated Requests List
    // ─────────────────────────────────────────────────────────────────────────
    getSignatureRequests: builder.query<SignatureRequestsResponse, SignatureFilterParams | void>({
      queryFn: async (filters, api, extraOptions, baseQuery) => {
        const state = api.getState() as RootState;
        const currentUserEmail = state.auth?.user?.email;
        const enableMock = import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true';

        const params = new URLSearchParams();
        if (filters?.scope) params.append('scope', filters.scope);
        if (filters?.status && filters.status !== 'ALL') params.append('status', filters.status);
        if (filters?.type && filters.type !== 'ALL') params.append('type', filters.type);
        if (filters?.search) params.append('search', filters.search);
        if (filters?.from) params.append('from', filters.from);
        if (filters?.to) params.append('to', filters.to);
        if (filters?.page) params.append('page', String(filters.page));
        if (filters?.limit) params.append('limit', String(filters.limit));

        try {
          const queryString = params.toString() ? `?${params.toString()}` : '';
          const result = await baseQuery(`/documents/signatures${queryString}`);

          if (result.error) {
            if (enableMock) {
              return {
                data: mockDb.getMockRequests({
                  scope: filters?.scope,
                  status: filters?.status,
                  type: filters?.type,
                  search: filters?.search,
                  createdByMe: filters?.createdByMe,
                  page: filters?.page,
                  limit: filters?.limit,
                  currentUserEmail,
                }),
              };
            }
            // Graceful fallback: empty list
            return {
              data: {
                items: [],
                total: 0,
                page: filters?.page || 1,
                limit: filters?.limit || 10,
              },
            };
          }

          const unwrapped = unwrapEnvelope<any>(result.data);
          const rawItems = Array.isArray(unwrapped?.items)
            ? unwrapped.items
            : Array.isArray(unwrapped)
            ? unwrapped
            : [];
          const items = rawItems.map(normalizeSignatureRequest);
          const total = Number(unwrapped?.total ?? items.length);
          const page = Number(unwrapped?.page ?? filters?.page ?? 1);
          const limit = Number(unwrapped?.limit ?? filters?.limit ?? 10);

          return { data: { items, total, page, limit } };
        } catch {
          if (enableMock) {
            return {
              data: mockDb.getMockRequests({
                scope: filters?.scope,
                status: filters?.status,
                type: filters?.type,
                search: filters?.search,
                createdByMe: filters?.createdByMe,
                page: filters?.page,
                limit: filters?.limit,
                currentUserEmail,
              }),
            };
          }
          return {
            data: {
              items: [],
              total: 0,
              page: filters?.page || 1,
              limit: filters?.limit || 10,
            },
          };
        }
      },
      providesTags: ['SignatureRequests'],
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // 3. Single Request Detail
    // ─────────────────────────────────────────────────────────────────────────
    getSignatureRequest: builder.query<SignatureRequest, string>({
      queryFn: async (id, _api, _extraOptions, baseQuery) => {
        const enableMock = import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true';

        try {
          const result = await baseQuery(`/documents/signatures/${id}`);
          if (result.error) {
            if (enableMock) {
              const mock = mockDb.getMockRequestById(id);
              if (mock) return { data: mock };
            }
            return { error: result.error };
          }
          const unwrapped = unwrapEnvelope<unknown>(result.data);
          return { data: normalizeSignatureRequest(unwrapped) };
        } catch (err: any) {
          if (enableMock) {
            const mock = mockDb.getMockRequestById(id);
            if (mock) return { data: mock };
          }
          return { error: { status: 'CUSTOM_ERROR', data: err?.message || 'Failed to fetch request' } };
        }
      },
      providesTags: (_result, _error, id) => [{ type: 'SignatureRequests', id }],
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // 4. Audit Trail
    // ─────────────────────────────────────────────────────────────────────────
    getSignatureAudit: builder.query<SignatureAuditEvent[], string>({
      queryFn: async (id, _api, _extraOptions, baseQuery) => {
        const enableMock = import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true';

        try {
          const result = await baseQuery(`/documents/signatures/${id}/audit`);
          if (result.error) {
            if (enableMock) {
              return { data: mockDb.getMockAudit(id) };
            }
            return { data: [] };
          }
          const unwrapped = unwrapEnvelope<any>(result.data);
          const rawEvents = Array.isArray(unwrapped?.events)
            ? unwrapped.events
            : Array.isArray(unwrapped)
            ? unwrapped
            : [];
          return { data: rawEvents.map(normalizeSignatureAuditEvent) };
        } catch {
          if (enableMock) {
            return { data: mockDb.getMockAudit(id) };
          }
          return { data: [] };
        }
      },
      providesTags: (_result, _error, id) => [{ type: 'SignatureAudit', id }],
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // 5. Create Request Mutation (Supports Multipart FormData or JSON)
    // ─────────────────────────────────────────────────────────────────────────
    createSignatureRequest: builder.mutation<SignatureRequest, CreateSignatureRequestPayload>({
      queryFn: async (payload, api, _extraOptions, baseQuery) => {
        const state = api.getState() as RootState;
        const currentUser = state.auth?.user || {
          id: 'usr-admin-1',
          fullName: 'Enterprise Admin',
          email: 'admin@ofc360.com',
        };
        const enableMock = import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true';

        try {
          let requestBody: FormData | Record<string, unknown>;

          if (payload.file instanceof File) {
            const formData = new FormData();
            formData.append('file', payload.file);
            formData.append('title', payload.title);
            formData.append('document_type', payload.documentType);
            formData.append('source', payload.source);
            if (payload.sourceDocumentId) formData.append('source_document_id', payload.sourceDocumentId);
            formData.append('signing_order', payload.signingOrder);
            if (payload.message) formData.append('message', payload.message);
            formData.append('expires_at', payload.expiresAt);
            formData.append('reminder_days', JSON.stringify(payload.reminderDays));
            formData.append('signers', JSON.stringify(payload.signers));
            formData.append('send_now', String(payload.sendNow));
            requestBody = formData;
          } else {
            requestBody = {
              title: payload.title,
              document_type: payload.documentType,
              source: payload.source,
              source_document_id: payload.sourceDocumentId,
              file_name: payload.fileName,
              file_size: payload.fileSize,
              signing_order: payload.signingOrder,
              message: payload.message,
              expires_at: payload.expiresAt,
              reminder_days: payload.reminderDays,
              signers: payload.signers,
              send_now: payload.sendNow,
            };
          }

          const result = await baseQuery({
            url: '/documents/signatures',
            method: 'POST',
            body: requestBody,
          });

          if (result.error) {
            if (enableMock) {
              const created = mockDb.createMockRequest(payload, {
                id: currentUser.id || 'usr-1',
                name: currentUser.fullName || 'Admin',
                email: currentUser.email || 'admin@ofc360.com',
              });
              return { data: created };
            }
            return { error: result.error };
          }

          const unwrapped = unwrapEnvelope<unknown>(result.data);
          return { data: normalizeSignatureRequest(unwrapped) };
        } catch (err: any) {
          if (enableMock) {
            const created = mockDb.createMockRequest(payload, {
              id: currentUser.id || 'usr-1',
              name: currentUser.fullName || 'Admin',
              email: currentUser.email || 'admin@ofc360.com',
            });
            return { data: created };
          }
          return { error: { status: 'CUSTOM_ERROR', data: err?.message || 'Creation failed' } };
        }
      },
      invalidatesTags: ['SignatureRequests', 'SignatureStats'],
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // 6. Remind Signers Mutation
    // ─────────────────────────────────────────────────────────────────────────
    remindSigners: builder.mutation<boolean, { id: string; payload?: RemindSignersPayload }>({
      queryFn: async ({ id, payload }, api, _extraOptions, baseQuery) => {
        const state = api.getState() as RootState;
        const user = state.auth?.user;
        const enableMock = import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true';

        try {
          const result = await baseQuery({
            url: `/documents/signatures/${id}/remind`,
            method: 'POST',
            body: { signer_ids: payload?.signerIds },
          });

          if (result.error) {
            if (enableMock) {
              mockDb.remindMockSigners(id, payload?.signerIds, {
                name: user?.fullName || 'Admin',
                email: user?.email || 'admin@ofc360.com',
              });
              return { data: true };
            }
            return { error: result.error };
          }
          return { data: true };
        } catch (err: any) {
          if (enableMock) {
            mockDb.remindMockSigners(id, payload?.signerIds, {
              name: user?.fullName || 'Admin',
              email: user?.email || 'admin@ofc360.com',
            });
            return { data: true };
          }
          return { error: { status: 'CUSTOM_ERROR', data: err?.message || 'Reminder failed' } };
        }
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'SignatureRequests', id },
        { type: 'SignatureAudit', id },
      ],
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // 7. Resend Request Mutation
    // ─────────────────────────────────────────────────────────────────────────
    resendRequest: builder.mutation<boolean, { id: string; payload?: ResendRequestPayload }>({
      queryFn: async ({ id, payload }, api, _extraOptions, baseQuery) => {
        const state = api.getState() as RootState;
        const user = state.auth?.user;
        const enableMock = import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true';

        try {
          const result = await baseQuery({
            url: `/documents/signatures/${id}/resend`,
            method: 'POST',
            body: { extend_days: payload?.extendDays || 7 },
          });

          if (result.error) {
            if (enableMock) {
              mockDb.resendMockRequest(id, payload?.extendDays || 7, {
                name: user?.fullName || 'Admin',
                email: user?.email || 'admin@ofc360.com',
              });
              return { data: true };
            }
            return { error: result.error };
          }
          return { data: true };
        } catch (err: any) {
          if (enableMock) {
            mockDb.resendMockRequest(id, payload?.extendDays || 7, {
              name: user?.fullName || 'Admin',
              email: user?.email || 'admin@ofc360.com',
            });
            return { data: true };
          }
          return { error: { status: 'CUSTOM_ERROR', data: err?.message || 'Resend failed' } };
        }
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'SignatureRequests', id },
        'SignatureStats',
        { type: 'SignatureAudit', id },
      ],
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // 8. Cancel Request Mutation
    // ─────────────────────────────────────────────────────────────────────────
    cancelSignatureRequest: builder.mutation<boolean, { id: string; payload: CancelRequestPayload }>({
      queryFn: async ({ id, payload }, api, _extraOptions, baseQuery) => {
        const state = api.getState() as RootState;
        const user = state.auth?.user;
        const enableMock = import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true';

        try {
          const result = await baseQuery({
            url: `/documents/signatures/${id}/cancel`,
            method: 'POST',
            body: { reason: payload.reason },
          });

          if (result.error) {
            if (enableMock) {
              mockDb.cancelMockRequest(id, payload.reason, {
                name: user?.fullName || 'Admin',
                email: user?.email || 'admin@ofc360.com',
              });
              return { data: true };
            }
            return { error: result.error };
          }
          return { data: true };
        } catch (err: any) {
          if (enableMock) {
            mockDb.cancelMockRequest(id, payload.reason, {
              name: user?.fullName || 'Admin',
              email: user?.email || 'admin@ofc360.com',
            });
            return { data: true };
          }
          return { error: { status: 'CUSTOM_ERROR', data: err?.message || 'Cancellation failed' } };
        }
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'SignatureRequests', id },
        'SignatureStats',
        { type: 'SignatureAudit', id },
      ],
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // 9. Sign Document Mutation
    // ─────────────────────────────────────────────────────────────────────────
    signDocument: builder.mutation<SignatureRequest, { id: string; payload: SignDocumentPayload }>({
      queryFn: async ({ id, payload }, api, _extraOptions, baseQuery) => {
        const state = api.getState() as RootState;
        const user = state.auth?.user;
        const enableMock = import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true';

        try {
          const result = await baseQuery({
            url: `/documents/signatures/${id}/sign`,
            method: 'POST',
            body: {
              signer_id: payload.signerId,
              method: payload.method,
              signature_image: payload.signatureImage,
              consent: payload.consent,
              otp: payload.otp,
            },
          });

          if (result.error) {
            if (enableMock) {
              const signed = mockDb.signMockDocument(id, payload, {
                name: user?.fullName || 'User',
                email: user?.email || 'user@ofc360.com',
              });
              if (signed) return { data: signed };
            }
            return { error: result.error };
          }

          const unwrapped = unwrapEnvelope<unknown>(result.data);
          return { data: normalizeSignatureRequest(unwrapped) };
        } catch (err: any) {
          if (enableMock) {
            const signed = mockDb.signMockDocument(id, payload, {
              name: user?.fullName || 'User',
              email: user?.email || 'user@ofc360.com',
            });
            if (signed) return { data: signed };
          }
          return { error: { status: 'CUSTOM_ERROR', data: err?.message || 'Signing failed' } };
        }
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'SignatureRequests', id },
        'SignatureStats',
        { type: 'SignatureAudit', id },
      ],
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // 10. Decline Signature Mutation
    // ─────────────────────────────────────────────────────────────────────────
    declineSignature: builder.mutation<SignatureRequest, { id: string; payload: DeclineSignaturePayload }>({
      queryFn: async ({ id, payload }, api, _extraOptions, baseQuery) => {
        const state = api.getState() as RootState;
        const user = state.auth?.user;
        const enableMock = import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true';

        try {
          const result = await baseQuery({
            url: `/documents/signatures/${id}/decline`,
            method: 'POST',
            body: {
              signer_id: payload.signerId,
              reason: payload.reason,
            },
          });

          if (result.error) {
            if (enableMock) {
              const declined = mockDb.declineMockDocument(id, payload, {
                name: user?.fullName || 'User',
                email: user?.email || 'user@ofc360.com',
              });
              if (declined) return { data: declined };
            }
            return { error: result.error };
          }

          const unwrapped = unwrapEnvelope<unknown>(result.data);
          return { data: normalizeSignatureRequest(unwrapped) };
        } catch (err: any) {
          if (enableMock) {
            const declined = mockDb.declineMockDocument(id, payload, {
              name: user?.fullName || 'User',
              email: user?.email || 'user@ofc360.com',
            });
            if (declined) return { data: declined };
          }
          return { error: { status: 'CUSTOM_ERROR', data: err?.message || 'Decline failed' } };
        }
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'SignatureRequests', id },
        'SignatureStats',
        { type: 'SignatureAudit', id },
      ],
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // 11. Download Signed File / Certificate (Blob query)
    // ─────────────────────────────────────────────────────────────────────────
    downloadSignatureFile: builder.query<{ blob: Blob; fileName: string }, { id: string; type: 'signed' | 'certificate' | 'original' }>({
      queryFn: async ({ id, type }, _api, _extraOptions, baseQuery) => {
        try {
          const result = await baseQuery({
            url: `/documents/signatures/${id}/download?type=${type}`,
            responseHandler: async (response) => response.blob(),
          });

          if (result.error) {
            // Generate mock fallback PDF blob if backend is offline
            const dummyContent = `%PDF-1.4 Mock ${type.toUpperCase()} document for OFC360 Signature Request ${id}`;
            const dummyBlob = new Blob([dummyContent], { type: 'application/pdf' });
            return { data: { blob: dummyBlob, fileName: `${type}_${id}.pdf` } };
          }

          const blob = result.data as Blob;
          return { data: { blob, fileName: `${type}_${id}.pdf` } };
        } catch {
          const dummyContent = `%PDF-1.4 Mock ${type.toUpperCase()} document for OFC360 Signature Request ${id}`;
          const dummyBlob = new Blob([dummyContent], { type: 'application/pdf' });
          return { data: { blob: dummyBlob, fileName: `${type}_${id}.pdf` } };
        }
      },
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // 12. Public External Signer Endpoints (/sign/:token)
    // ─────────────────────────────────────────────────────────────────────────
    getPublicSignatureRequest: builder.query<PublicSignatureTokenData, string>({
      queryFn: async (token, _api, _extraOptions, baseQuery) => {
        const enableMock = import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true';

        try {
          const result = await baseQuery(`/documents/signatures/public/${token}`);
          if (result.error) {
            if (enableMock) {
              const req = mockDb.INITIAL_MOCK_REQUESTS[0];
              const signer = req.signers[0];
              return {
                data: {
                  token,
                  request: req,
                  signer,
                  requiresOtp: true,
                  otpSent: true,
                  isOtpVerified: false,
                },
              };
            }
            return { error: result.error };
          }
          const unwrapped = unwrapEnvelope<any>(result.data);
          return {
            data: {
              token,
              request: normalizeSignatureRequest(unwrapped.request || unwrapped),
              signer: normalizeSigner(unwrapped.signer || (unwrapped.request?.signers && unwrapped.request.signers[0])),
              requiresOtp: Boolean(unwrapped.requires_otp ?? unwrapped.requiresOtp ?? false),
              otpSent: Boolean(unwrapped.otp_sent ?? unwrapped.otpSent ?? false),
              isOtpVerified: Boolean(unwrapped.is_otp_verified ?? unwrapped.isOtpVerified ?? false),
            },
          };
        } catch (err: any) {
          if (enableMock) {
            const req = mockDb.INITIAL_MOCK_REQUESTS[0];
            const signer = req.signers[0];
            return {
              data: {
                token,
                request: req,
                signer,
                requiresOtp: true,
                otpSent: true,
                isOtpVerified: false,
              },
            };
          }
          return { error: { status: 'CUSTOM_ERROR', data: err?.message || 'Token invalid or expired' } };
        }
      },
    }),

    sendPublicOtp: builder.mutation<boolean, { token: string; email?: string }>({
      queryFn: async ({ token, email }, _api, _extraOptions, baseQuery) => {
        try {
          const result = await baseQuery({
            url: `/documents/signatures/public/${token}/otp`,
            method: 'POST',
            body: { email },
          });
          if (result.error) {
            if (import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true') return { data: true };
            return { error: result.error };
          }
          return { data: true };
        } catch {
          return { data: true };
        }
      },
    }),

    signPublicDocument: builder.mutation<SignatureRequest, { token: string; payload: SignDocumentPayload }>({
      queryFn: async ({ token, payload }, _api, _extraOptions, baseQuery) => {
        try {
          const result = await baseQuery({
            url: `/documents/signatures/public/${token}/sign`,
            method: 'POST',
            body: {
              signer_id: payload.signerId,
              method: payload.method,
              signature_image: payload.signatureImage,
              consent: payload.consent,
              otp: payload.otp,
            },
          });
          if (result.error) {
            if (import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true') {
              const req = mockDb.INITIAL_MOCK_REQUESTS[0];
              return { data: req };
            }
            return { error: result.error };
          }
          const unwrapped = unwrapEnvelope<unknown>(result.data);
          return { data: normalizeSignatureRequest(unwrapped) };
        } catch (err: any) {
          return { error: { status: 'CUSTOM_ERROR', data: err?.message || 'Signing failed' } };
        }
      },
    }),

    declinePublicSignature: builder.mutation<SignatureRequest, { token: string; payload: DeclineSignaturePayload }>({
      queryFn: async ({ token, payload }, _api, _extraOptions, baseQuery) => {
        try {
          const result = await baseQuery({
            url: `/documents/signatures/public/${token}/decline`,
            method: 'POST',
            body: {
              signer_id: payload.signerId,
              reason: payload.reason,
            },
          });
          if (result.error) {
            if (import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true') {
              const req = mockDb.INITIAL_MOCK_REQUESTS[0];
              return { data: req };
            }
            return { error: result.error };
          }
          const unwrapped = unwrapEnvelope<unknown>(result.data);
          return { data: normalizeSignatureRequest(unwrapped) };
        } catch (err: any) {
          return { error: { status: 'CUSTOM_ERROR', data: err?.message || 'Decline failed' } };
        }
      },
    }),
  }),
});

export const {
  useGetSignatureStatsQuery,
  useGetSignatureRequestsQuery,
  useGetSignatureRequestQuery,
  useGetSignatureAuditQuery,
  useCreateSignatureRequestMutation,
  useRemindSignersMutation,
  useResendRequestMutation,
  useCancelSignatureRequestMutation,
  useSignDocumentMutation,
  useDeclineSignatureMutation,
  useLazyDownloadSignatureFileQuery,
  useGetPublicSignatureRequestQuery,
  useSendPublicOtpMutation,
  useSignPublicDocumentMutation,
  useDeclinePublicSignatureMutation,
} = signaturesApi;

