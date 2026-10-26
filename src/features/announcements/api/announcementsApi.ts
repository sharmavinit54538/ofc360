/**
 * @file announcementsApi.ts
 * @description Enterprise RTK Query API slice for the Announcements module:
 * 1. Company-level Announcement CRUD, Publish, Archive, and Filtering (app/api/announcements.py)
 * 2. Super Admin Platform-wide Broadcast Endpoints (app/api/super_admin.py)
 * 3. Unified Internal Dashboard Feed Endpoint (app/api/internal.py)
 */

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/shared/api/baseQuery';
import type {
  AnnouncementResponse,
  CreateAnnouncementPayload,
  UpdateAnnouncementPayload,
  AnnouncementListParams,
  AnnouncementListResponse,
  SuperAdminAnnouncementPayload,
  UpdateSuperAdminAnnouncementPayload,
  SuperAdminAnnouncementResponse,
  InternalDashboardFeedResponse,
} from '../types/announcements.types';

/**
 * Normalizes backend announcement list responses to consistent AnnouncementListResponse.
 * Handles raw arrays, { data: [...] }, and paginated envelopes { items: [...], total: ... }.
 */
export const normalizeAnnouncementList = (response: any): AnnouncementListResponse => {
  if (Array.isArray(response)) {
    return {
      items: response as AnnouncementResponse[],
      data: response as AnnouncementResponse[],
      total: response.length,
      page: 1,
      limit: 20,
      total_pages: Math.max(1, Math.ceil(response.length / 20)),
      pages: Math.max(1, Math.ceil(response.length / 20)),
    };
  }

  if (response && typeof response === 'object') {
    const rawItems: AnnouncementResponse[] = Array.isArray(response.items)
      ? response.items
      : Array.isArray(response.data)
      ? response.data
      : Array.isArray(response.announcements)
      ? response.announcements
      : Array.isArray(response.data?.items)
      ? response.data.items
      : [];

    const total =
      typeof response.total === 'number'
        ? response.total
        : typeof response.data?.total === 'number'
        ? response.data.total
        : rawItems.length;

    const page =
      typeof response.page === 'number'
        ? response.page
        : typeof response.data?.page === 'number'
        ? response.data.page
        : 1;

    const limit =
      typeof response.limit === 'number'
        ? response.limit
        : typeof response.data?.limit === 'number'
        ? response.data.limit
        : 20;

    const total_pages =
      typeof response.total_pages === 'number'
        ? response.total_pages
        : typeof response.pages === 'number'
        ? response.pages
        : typeof response.data?.total_pages === 'number'
        ? response.data.total_pages
        : Math.ceil(total / (limit || 20));

    return {
      items: rawItems,
      data: rawItems,
      total,
      page,
      limit,
      total_pages,
      pages: total_pages,
    };
  }

  return { items: [], data: [], total: 0, page: 1, limit: 20, total_pages: 0, pages: 0 };
};

/**
 * Normalizes Super Admin announcements payload to SuperAdminAnnouncementResponse[].
 */
export const normalizeSuperAdminAnnouncements = (response: any): SuperAdminAnnouncementResponse[] => {
  const unwrapped = response?.data !== undefined ? response.data : response;
  if (Array.isArray(unwrapped)) return unwrapped as SuperAdminAnnouncementResponse[];
  if (Array.isArray(unwrapped?.items)) return unwrapped.items as SuperAdminAnnouncementResponse[];
  if (Array.isArray(unwrapped?.announcements)) return unwrapped.announcements as SuperAdminAnnouncementResponse[];
  return [];
};

/**
 * Normalizes Unified Internal Dashboard Feed response.
 */
export const normalizeInternalDashboardFeed = (response: any): InternalDashboardFeedResponse => {
  const unwrapped = response?.data !== undefined ? response.data : response;
  return {
    pinned_announcements: Array.isArray(unwrapped?.pinned_announcements)
      ? unwrapped.pinned_announcements
      : Array.isArray(unwrapped?.pinned)
      ? unwrapped.pinned
      : [],
    recent_announcements: Array.isArray(unwrapped?.recent_announcements)
      ? unwrapped.recent_announcements
      : Array.isArray(unwrapped?.recent)
      ? unwrapped.recent
      : Array.isArray(unwrapped)
      ? unwrapped
      : [],
    news: Array.isArray(unwrapped?.news) ? unwrapped.news : [],
    events: Array.isArray(unwrapped?.events) ? unwrapped.events : [],
    polls: Array.isArray(unwrapped?.polls) ? unwrapped.polls : [],
    super_admin_broadcasts: Array.isArray(unwrapped?.super_admin_broadcasts)
      ? unwrapped.super_admin_broadcasts
      : Array.isArray(unwrapped?.broadcasts)
      ? unwrapped.broadcasts
      : [],
  };
};

export const announcementsApi = createApi({
  reducerPath: 'announcementsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Announcements',
    'AnnouncementDetail',
    'SuperAdminAnnouncements',
    'InternalDashboard',
  ],
  endpoints: (builder) => ({
    // =========================================================================
    // SECTION A: COMPANY-LEVEL ANNOUNCEMENTS (app/api/announcements.py)
    // =========================================================================

    /**
     * 1. getAnnouncements: GET /api/v1/announcements
     * Query params: { status, priority, department, branch, search, page, limit }
     * Access: Any logged-in user
     */
    getAnnouncements: builder.query<AnnouncementListResponse, AnnouncementListParams | void>({
      query: (params) => {
        const queryParams: Record<string, string | number> = {};
        if (params?.status) queryParams.status = params.status;
        if (params?.priority) queryParams.priority = params.priority;
        if (params?.department) queryParams.department = params.department;
        if (params?.branch) queryParams.branch = params.branch;
        if (params?.search) queryParams.search = params.search;
        queryParams.page = params?.page ?? 1;
        queryParams.limit = params?.limit ?? 20;

        return {
          url: '/api/v1/announcements',
          params: queryParams,
        };
      },
      transformResponse: (response: any) => normalizeAnnouncementList(response),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'Announcements' as const, id })),
              { type: 'Announcements', id: 'LIST' },
            ]
          : [{ type: 'Announcements', id: 'LIST' }],
    }),

    /**
     * 2. getAnnouncementById: GET /api/v1/announcements/{id}
     * Access: Any logged-in user (records read receipt when published)
     */
    getAnnouncementById: builder.query<AnnouncementResponse, string>({
      query: (id) => `/api/v1/announcements/${id}`,
      transformResponse: (response: any) => (response?.data !== undefined ? response.data : response) as AnnouncementResponse,
      providesTags: (_result, _error, id) => [
        { type: 'AnnouncementDetail', id },
        'Announcements',
      ],
    }),

    /**
     * 3. createAnnouncement: POST /api/v1/announcements
     * Access: super_admin, hr_admin, it_admin
     */
    createAnnouncement: builder.mutation<AnnouncementResponse, CreateAnnouncementPayload>({
      query: (body) => ({
        url: '/api/v1/announcements',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Announcements', id: 'LIST' }, 'InternalDashboard'],
    }),

    /**
     * 4. updateAnnouncement: PUT /api/v1/announcements/{id}
     * Note: Full update requiring complete body payload.
     * Access: super_admin, hr_admin, it_admin
     */
    updateAnnouncement: builder.mutation<AnnouncementResponse, { id: string; data: UpdateAnnouncementPayload }>({
      query: ({ id, data }) => ({
        url: `/api/v1/announcements/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'AnnouncementDetail', id },
        { type: 'Announcements', id: 'LIST' },
        'InternalDashboard',
      ],
    }),

    /**
     * 5. deleteAnnouncement: DELETE /api/v1/announcements/{id}
     * Access: super_admin, hr_admin, it_admin (Soft delete)
     */
    deleteAnnouncement: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/v1/announcements/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'AnnouncementDetail', id },
        { type: 'Announcements', id: 'LIST' },
        'InternalDashboard',
      ],
    }),

    /**
     * 6. publishAnnouncement: PATCH /api/v1/announcements/{id}/publish
     * Sets status to PUBLISHED and sets publish_date to today.
     * Access: super_admin, hr_admin, it_admin
     */
    publishAnnouncement: builder.mutation<AnnouncementResponse, string>({
      query: (id) => ({
        url: `/api/v1/announcements/${id}/publish`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'AnnouncementDetail', id },
        { type: 'Announcements', id: 'LIST' },
        'InternalDashboard',
      ],
    }),

    /**
     * 7. archiveAnnouncement: PATCH /api/v1/announcements/{id}/archive
     * Sets status to ARCHIVED.
     * Access: super_admin, hr_admin, it_admin
     */
    archiveAnnouncement: builder.mutation<AnnouncementResponse, string>({
      query: (id) => ({
        url: `/api/v1/announcements/${id}/archive`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'AnnouncementDetail', id },
        { type: 'Announcements', id: 'LIST' },
        'InternalDashboard',
      ],
    }),

    // =========================================================================
    // SECTION B: SUPER ADMIN PLATFORM BROADCASTS (app/api/super_admin.py)
    // =========================================================================

    /**
     * 8. getSuperAdminAnnouncements: GET /api/v1/super-admin/announcements
     * Access: super_admin only (superadmin@ofc360.com)
     */
    getSuperAdminAnnouncements: builder.query<SuperAdminAnnouncementResponse[], void>({
      query: () => '/api/v1/super-admin/announcements',
      transformResponse: (response: any) => normalizeSuperAdminAnnouncements(response),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ ann_id }) => ({ type: 'SuperAdminAnnouncements' as const, id: ann_id })),
              { type: 'SuperAdminAnnouncements', id: 'LIST' },
            ]
          : [{ type: 'SuperAdminAnnouncements', id: 'LIST' }],
    }),

    /**
     * 9. createSuperAdminAnnouncement: POST /api/v1/super-admin/announcements
     * Body: { title, content, target_audience: 'ALL_TENANTS' }
     * Access: super_admin only
     */
    createSuperAdminAnnouncement: builder.mutation<SuperAdminAnnouncementResponse, SuperAdminAnnouncementPayload>({
      query: (body) => ({
        url: '/api/v1/super-admin/announcements',
        method: 'POST',
        body: {
          ...body,
          target_audience: body.target_audience || 'ALL_TENANTS',
        },
      }),
      invalidatesTags: [{ type: 'SuperAdminAnnouncements', id: 'LIST' }],
    }),

    /**
     * 10. updateSuperAdminAnnouncement: PATCH /api/v1/super-admin/announcements/{ann_id}
     * Note: ann_id is string
     * Access: super_admin only
     */
    updateSuperAdminAnnouncement: builder.mutation<
      SuperAdminAnnouncementResponse,
      { ann_id: string; data: UpdateSuperAdminAnnouncementPayload }
    >({
      query: ({ ann_id, data }) => ({
        url: `/api/v1/super-admin/announcements/${ann_id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { ann_id }) => [
        { type: 'SuperAdminAnnouncements', id: ann_id },
        { type: 'SuperAdminAnnouncements', id: 'LIST' },
      ],
    }),

    /**
     * 11. deleteSuperAdminAnnouncement: DELETE /api/v1/super-admin/announcements/{ann_id}
     * Note: ann_id is string
     * Access: super_admin only
     */
    deleteSuperAdminAnnouncement: builder.mutation<void, string>({
      query: (ann_id) => ({
        url: `/api/v1/super-admin/announcements/${ann_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, ann_id) => [
        { type: 'SuperAdminAnnouncements', id: ann_id },
        { type: 'SuperAdminAnnouncements', id: 'LIST' },
      ],
    }),

    // =========================================================================
    // SECTION C: UNIFIED DASHBOARD FEED (app/api/internal.py)
    // =========================================================================

    /**
     * 12. getInternalDashboardFeed: GET /api/v1/internal/dashboard
     * Returns: pinned announcements (max 5), recent announcements (max 10), news, events, polls
     * Access: Any logged-in user
     */
    getInternalDashboardFeed: builder.query<InternalDashboardFeedResponse, void>({
      query: () => '/api/v1/internal/dashboard',
      transformResponse: (response: any) => normalizeInternalDashboardFeed(response),
      providesTags: ['InternalDashboard'],
    }),
  }),
});

export const {
  useGetAnnouncementsQuery,
  useLazyGetAnnouncementsQuery,
  useGetAnnouncementByIdQuery,
  useLazyGetAnnouncementByIdQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
  usePublishAnnouncementMutation,
  useArchiveAnnouncementMutation,
  useGetSuperAdminAnnouncementsQuery,
  useLazyGetSuperAdminAnnouncementsQuery,
  useCreateSuperAdminAnnouncementMutation,
  useUpdateSuperAdminAnnouncementMutation,
  useDeleteSuperAdminAnnouncementMutation,
  useGetInternalDashboardFeedQuery,
  useLazyGetInternalDashboardFeedQuery,
} = announcementsApi;

