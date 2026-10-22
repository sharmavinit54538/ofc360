/**
 * @file travelApi.ts
 * @description Enterprise RTK Query API service for Travel Requests, Trip Approvals,
 * Expense Settlement, and Travel Itinerary Management.
 * Plugs directly into OFC360 backend using baseQueryWithReauth.
 */

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/shared/api/baseQuery';
import type {
  TravelRequest,
  TravelRequestListResponse,
  TravelRequestFilters,
  CreateTravelRequestPayload,
  UpdateTravelStatusPayload,
  TravelSummaryMetrics,
} from '../types/travel.types';

// Helper to normalize backend FastAPI responses (supports envelope or direct payload)
const transformResponse = <T>(response: any): T => {
  if (response && typeof response === 'object' && 'data' in response && response.data !== undefined) {
    return response.data as T;
  }
  return response as T;
};

export const travelApi = createApi({
  reducerPath: 'travelApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['TravelRequests', 'TravelSummary'],
  endpoints: (builder) => ({
    /**
     * Retrieve paginated travel requests with optional filtering by status, search, and date.
     */
    getTravelRequests: builder.query<TravelRequestListResponse, TravelRequestFilters | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.search) params.append('search', filters.search);
        if (filters?.status && filters.status !== 'ALL') params.append('status', filters.status);
        if (filters?.travelType && filters.travelType !== 'ALL') params.append('travelType', filters.travelType);
        if (filters?.startDate) params.append('startDate', filters.startDate);
        if (filters?.endDate) params.append('endDate', filters.endDate);
        if (filters?.page) params.append('page', String(filters.page));
        if (filters?.limit) params.append('limit', String(filters.limit));

        const queryString = params.toString();
        return `/travel/requests${queryString ? `?${queryString}` : ''}`;
      },
      transformResponse: (response: any): TravelRequestListResponse => {
        const data = transformResponse<any>(response);
        // Handle array or wrapped response gracefully
        if (Array.isArray(data)) {
          return {
            items: data,
            total: data.length,
            page: 1,
            limit: data.length,
          };
        }
        return {
          items: data.items || data.requests || [],
          total: data.total || data.count || (data.items ? data.items.length : 0),
          page: data.page || 1,
          limit: data.limit || 20,
          summary: data.summary,
        };
      },
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map(({ id }) => ({ type: 'TravelRequests' as const, id })),
              { type: 'TravelRequests', id: 'LIST' },
            ]
          : [{ type: 'TravelRequests', id: 'LIST' }],
    }),

    /**
     * Fetch KPI metrics for Travel Overview (Total Trips, Pending Approvals, Budget).
     */
    getTravelSummary: builder.query<TravelSummaryMetrics, void>({
      query: () => '/travel/summary',
      transformResponse: (response: any) => transformResponse<TravelSummaryMetrics>(response),
      providesTags: [{ type: 'TravelSummary', id: 'METRICS' }],
    }),

    /**
     * Retrieve a specific travel request by ID.
     */
    getTravelRequestById: builder.query<TravelRequest, string>({
      query: (id) => `/travel/requests/${encodeURIComponent(id)}`,
      transformResponse: (response: any) => transformResponse<TravelRequest>(response),
      providesTags: (_result, _error, id) => [{ type: 'TravelRequests', id }],
    }),

    /**
     * Submit a new employee travel requisition.
     */
    createTravelRequest: builder.mutation<TravelRequest, CreateTravelRequestPayload>({
      query: (payload) => ({
        url: '/travel/requests',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response: any) => transformResponse<TravelRequest>(response),
      invalidatesTags: [
        { type: 'TravelRequests', id: 'LIST' },
        { type: 'TravelSummary', id: 'METRICS' },
      ],
    }),

    /**
     * Update approval status (Approve / Reject) for a travel request.
     */
    updateTravelRequestStatus: builder.mutation<TravelRequest, UpdateTravelStatusPayload>({
      query: ({ id, ...body }) => ({
        url: `/travel/requests/${encodeURIComponent(id)}/status`,
        method: 'PATCH',
        body,
      }),
      transformResponse: (response: any) => transformResponse<TravelRequest>(response),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'TravelRequests', id },
        { type: 'TravelRequests', id: 'LIST' },
        { type: 'TravelSummary', id: 'METRICS' },
      ],
    }),

    /**
     * Delete or withdraw a travel requisition.
     */
    deleteTravelRequest: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/travel/requests/${encodeURIComponent(id)}`,
        method: 'DELETE',
      }),
      transformResponse: (response: any, _meta, id) => {
        const data = transformResponse<any>(response);
        return { success: Boolean(data?.success ?? true), id };
      },
      invalidatesTags: (_result, _error, id) => [
        { type: 'TravelRequests', id },
        { type: 'TravelRequests', id: 'LIST' },
        { type: 'TravelSummary', id: 'METRICS' },
      ],
    }),
  }),
});

export const {
  useGetTravelRequestsQuery,
  useGetTravelSummaryQuery,
  useGetTravelRequestByIdQuery,
  useCreateTravelRequestMutation,
  useUpdateTravelRequestStatusMutation,
  useDeleteTravelRequestMutation,
} = travelApi;
