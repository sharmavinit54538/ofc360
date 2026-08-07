import axios, { type AxiosError } from "axios";
import apiInstance from "./apiInstance";

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

function normalizePath(path: string) {
  return path.replace(/^\//, "");
}

function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  const axiosErr = error as AxiosError;
  if (axios.isAxiosError(error)) {
    const data = axiosErr.response?.data;
    const message =
      data && typeof data === "object" && "message" in data && "message" in (data as Record<string, unknown>) && typeof (data as Record<string, unknown>).message === "string"
        ? (data as Record<string, unknown>).message as string
        : axiosErr.message || `Request failed with status ${axiosErr.response?.status ?? 500}`;
    return new ApiError(message, axiosErr.response?.status ?? 500, data ?? null);
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 500, null);
  }

  return new ApiError("Network error", 500, null);
}

export interface RequestOptions {
  headers?: Record<string, string>;
  data?: unknown;
  timeout?: number;
}

export async function apiRequest<T = unknown>(
  path: string,
  options: RequestOptions & { method?: string } = {},
): Promise<T> {
  try {
    const response = await apiInstance.request<T>({
      method: options.method ?? "GET",
      url: normalizePath(path),
      data: options.data,
      headers: options.headers,
      timeout: options.timeout,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && (error as AxiosError).message === "Failed to refresh session") {
      throw new ApiError("Session expired. Please log in again.", 401, null);
    }
    throw toApiError(error);
  }
}

/** Convenience methods — returns response body directly (same as legacy api-client). */
export const api = {
  get: <T = unknown>(path: string, options?: RequestOptions) =>
    apiRequest<T>(path, { ...options, method: "GET" }),
  post: <T = unknown>(path: string, data?: unknown, options?: RequestOptions) =>
    apiRequest<T>(path, { ...options, method: "POST", data }),
  put: <T = unknown>(path: string, data?: unknown, options?: RequestOptions) =>
    apiRequest<T>(path, { ...options, method: "PUT", data }),
  patch: <T = unknown>(path: string, data?: unknown, options?: RequestOptions) =>
    apiRequest<T>(path, { ...options, method: "PATCH", data }),
  delete: <T = unknown>(path: string, options?: RequestOptions) =>
    apiRequest<T>(path, { ...options, method: "DELETE" }),
};
