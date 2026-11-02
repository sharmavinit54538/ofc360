/**
 * @file aiToolsApi.ts
 * @description RTK Query API slice for AI Hub Tools (Explain & Narrative endpoints).
 */

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/shared/api/baseQuery';
import type { ExplainRequest, ExplainResponse } from '../types';

export const aiToolsApi = createApi({
  reducerPath: 'aiToolsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['AiExplain'],
  endpoints: (builder) => ({
    explainToolFindings: builder.mutation<
      ExplainResponse,
      { tool: 'capacity-planner' | 'shift-monitor' | 'payroll-audit'; payload: ExplainRequest }
    >({
      query: ({ tool, payload }) => ({
        url: `/ai-hub/${tool}/explain`,
        method: 'POST',
        body: payload,
      }),
      transformResponse: (res: any) => {
        if (res && typeof res === 'object' && 'data' in res && res.data) {
          return res.data as ExplainResponse;
        }
        return res as ExplainResponse;
      },
    }),
  }),
});

export const { useExplainToolFindingsMutation } = aiToolsApi;

