/**
 * @file assetsApi.ts
 * @description Enterprise RTK Query API slice for Asset Management, Hardware Inventory,
 * Employee Device Allocations, Return Protocols, Maintenance Schedules, and Real-Time Stats.
 * Plugs directly into OFC360 backend using baseQueryWithReauth.
 */

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/shared/api/baseQuery';
import type {
  Asset,
  AssetStats,
  CreateAssetPayload,
  UpdateAssetPayload,
  AssignAssetPayload,
  ReturnAssetPayload,
  MarkMaintenancePayload,
  AssetListFilters,
  AssetListResponse,
} from '@/features/assets/types';

// Helper to normalize backend API envelopes ({ data: ... } or raw payload)
const transformResponse = <T>(response: any): T => {
  if (response && typeof response === 'object' && 'data' in response && response.data !== undefined) {
    return response.data as T;
  }
  return response as T;
};

export const assetsApi = createApi({
  reducerPath: 'assetsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Assets', 'AssetStats'],
  endpoints: (builder) => ({
    /**
     * Retrieve paginated assets with search, category, and status filters.
     */
    getAssetsList: builder.query<AssetListResponse, AssetListFilters | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.search) params.append('search', filters.search);
        if (filters?.category && filters.category !== 'ALL') params.append('category', filters.category);
        if (filters?.status && filters.status !== 'ALL') params.append('status', filters.status);
        if (filters?.page) params.append('page', String(filters.page));
        if (filters?.limit) params.append('limit', String(filters.limit));

        const queryString = params.toString();
        return `/assets${queryString ? `?${queryString}` : ''}`;
      },
      transformResponse: (response: any): AssetListResponse => {
        const data = transformResponse<any>(response);
        if (Array.isArray(data)) {
          return {
            items: data,
            total: data.length,
            page: 1,
            limit: data.length,
          };
        }
        return {
          items: data?.items || data?.assets || [],
          total: data?.total || data?.count || (data?.items ? data.items.length : 0),
          page: data?.page || 1,
          limit: data?.limit || 20,
          stats: data?.stats,
        };
      },
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map(({ id }) => ({ type: 'Assets' as const, id })),
              { type: 'Assets', id: 'LIST' },
            ]
          : [{ type: 'Assets', id: 'LIST' }],
    }),

    /**
     * Fetch single asset by unique ID.
     */
    getAssetById: builder.query<Asset, string>({
      query: (id) => `/assets/${encodeURIComponent(id)}`,
      transformResponse: (response: any) => transformResponse<Asset>(response),
      providesTags: (_result, _error, id) => [{ type: 'Assets', id }],
    }),

    /**
     * Fetch KPI metrics (Total Assets, Allocated, Available In Stock, Under Maintenance).
     */
    getAssetStats: builder.query<AssetStats, void>({
      query: () => '/assets/stats',
      transformResponse: (response: any) => transformResponse<AssetStats>(response),
      providesTags: [{ type: 'AssetStats', id: 'METRICS' }],
    }),

    /**
     * Register a new corporate asset / piece of equipment.
     */
    createAsset: builder.mutation<Asset, CreateAssetPayload>({
      query: (payload) => ({
        url: '/assets',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response: any) => transformResponse<Asset>(response),
      invalidatesTags: [
        { type: 'Assets', id: 'LIST' },
        { type: 'AssetStats', id: 'METRICS' },
      ],
    }),

    /**
     * Update asset metadata or configuration.
     */
    updateAsset: builder.mutation<Asset, UpdateAssetPayload>({
      query: ({ id, ...body }) => ({
        url: `/assets/${encodeURIComponent(id)}`,
        method: 'PATCH',
        body,
      }),
      transformResponse: (response: any) => transformResponse<Asset>(response),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Assets', id },
        { type: 'Assets', id: 'LIST' },
        { type: 'AssetStats', id: 'METRICS' },
      ],
    }),

    /**
     * Assign an available equipment to an active staff member.
     */
    assignAsset: builder.mutation<Asset, AssignAssetPayload>({
      query: ({ assetId, ...body }) => ({
        url: `/assets/${encodeURIComponent(assetId)}/assign`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: any) => transformResponse<Asset>(response),
      invalidatesTags: (_result, _error, { assetId }) => [
        { type: 'Assets', id: assetId },
        { type: 'Assets', id: 'LIST' },
        { type: 'AssetStats', id: 'METRICS' },
      ],
    }),

    /**
     * Return an assigned asset back into inventory stock.
     */
    returnAsset: builder.mutation<Asset, ReturnAssetPayload>({
      query: ({ assetId, ...body }) => ({
        url: `/assets/${encodeURIComponent(assetId)}/return`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: any) => transformResponse<Asset>(response),
      invalidatesTags: (_result, _error, { assetId }) => [
        { type: 'Assets', id: assetId },
        { type: 'Assets', id: 'LIST' },
        { type: 'AssetStats', id: 'METRICS' },
      ],
    }),

    /**
     * Move asset into maintenance or repair workflow.
     */
    markAssetMaintenance: builder.mutation<Asset, MarkMaintenancePayload>({
      query: ({ assetId, ...body }) => ({
        url: `/assets/${encodeURIComponent(assetId)}/maintenance`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: any) => transformResponse<Asset>(response),
      invalidatesTags: (_result, _error, { assetId }) => [
        { type: 'Assets', id: assetId },
        { type: 'Assets', id: 'LIST' },
        { type: 'AssetStats', id: 'METRICS' },
      ],
    }),

    /**
     * Decommission or delete an asset record.
     */
    deleteAsset: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/assets/${encodeURIComponent(id)}`,
        method: 'DELETE',
      }),
      transformResponse: (response: any, _meta, id) => {
        const data = transformResponse<any>(response);
        return { success: Boolean(data?.success ?? true), id };
      },
      invalidatesTags: (_result, _error, id) => [
        { type: 'Assets', id },
        { type: 'Assets', id: 'LIST' },
        { type: 'AssetStats', id: 'METRICS' },
      ],
    }),
  }),
});

export const {
  useGetAssetsListQuery,
  useGetAssetByIdQuery,
  useGetAssetStatsQuery,
  useCreateAssetMutation,
  useUpdateAssetMutation,
  useAssignAssetMutation,
  useReturnAssetMutation,
  useMarkAssetMaintenanceMutation,
  useDeleteAssetMutation,
} = assetsApi;

export default assetsApi;
