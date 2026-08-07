import { createApi, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import apiInstance from "@/api/apiInstance";
import type { AxiosRequestConfig, AxiosError } from "axios";

export interface CopilotMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
  metadata?: any;
  feedback?: "like" | "dislike";
}

export interface CopilotChatRequest {
  prompt: string;
  model?: string;
  context?: string;
}

export interface CopilotChatResponse {
  success: boolean;
  message: string;
  data: CopilotMessage;
}

export interface CopilotHistoryResponse {
  success: boolean;
  data: {
    messages: CopilotMessage[];
  };
}

const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
    },
    unknown,
    unknown
  > =>
  async ({ url, method = "GET", data, params }) => {
    try {
      const result = await apiInstance({
        url,
        method,
        data,
        params,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export const payrollCopilotApi = createApi({
  reducerPath: "payrollCopilotApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["PayrollCopilotHistory"],
  endpoints: (builder) => ({
    getHistory: builder.query<CopilotMessage[], void>({
      query: () => ({
        url: "/payroll/copilot/history",
        method: "GET",
      }),
      transformResponse: (response: CopilotHistoryResponse) => {
        return response?.data?.messages || [];
      },
      providesTags: ["PayrollCopilotHistory"],
    }),

    sendChatMessage: builder.mutation<CopilotMessage, CopilotChatRequest>({
      query: (body) => ({
        url: "/payroll/copilot/chat",
        method: "POST",
        data: body,
      }),
      transformResponse: (response: CopilotChatResponse) => {
        return response?.data;
      },
      invalidatesTags: ["PayrollCopilotHistory"],
    }),

    clearHistory: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: "/payroll/copilot/clear",
        method: "POST",
      }),
      invalidatesTags: ["PayrollCopilotHistory"],
    }),
  }),
});

export const {
  useGetHistoryQuery,
  useSendChatMessageMutation,
  useClearHistoryMutation,
} = payrollCopilotApi;
