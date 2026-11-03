import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/shared/api/baseQuery';
import type { SidebarBadgesResponse } from '../types/sidebar.types';

export const sidebarBadgesApi = createApi({
  reducerPath: 'sidebarBadgesApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['SidebarBadges'],
  endpoints: (builder) => ({
    getSidebarBadges: builder.query<SidebarBadgesResponse, void>({
      query: () => '/sidebar/badges',
      transformResponse: (response: unknown): SidebarBadgesResponse => {
        if (response && typeof response === 'object' && 'data' in response) {
          return response.data as SidebarBadgesResponse;
        }
        return response as SidebarBadgesResponse;
      },
      providesTags: ['SidebarBadges'],
      keepUnusedDataFor: 60,
    }),
  }),
});

export const { useGetSidebarBadgesQuery } = sidebarBadgesApi;