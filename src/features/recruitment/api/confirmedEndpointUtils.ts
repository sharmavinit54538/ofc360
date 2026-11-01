import { unwrapApiResponse } from '../utils/apiMappers';

export type RecruitmentSearchParams = Record<string, string | number | boolean | null | undefined>;

export const isUuid = (value: string | null | undefined): boolean =>
  typeof value === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value.trim());

export const assertUuid = (value: string): void => {
  if (!isUuid(value)) throw new Error('This recruitment operation requires a UUID id.');
};

export const encodePathSegment = (value: string): string => encodeURIComponent(value);

export const withSearchParams = (path: string, params?: RecruitmentSearchParams): string => {
  if (!params) return path;
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `${path}?${query}` : path;
};

const getApiOrigin = (): string => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || 'https://api.ofc360.com/api/v1';
  try {
    return new URL(baseUrl).origin;
  } catch {
    return 'https://api.ofc360.com';
  }
};

/** Builds an absolute `/api/v2/...` URL from the origin configured for the API. */
export const apiV2Url = (path: string): string => {
  const trimmedPath = path.trim();
  const normalizedPath = trimmedPath.startsWith('/api/v2/') || trimmedPath === '/api/v2'
    ? trimmedPath
    : `/api/v2/${trimmedPath.replace(/^\/+/, '')}`;
  return `${getApiOrigin()}${normalizedPath}`;
};

export const unwrapRecruitmentResponse = (response: unknown): unknown =>
  unwrapApiResponse(response);

export const unwrapRecruitmentBlob = (response: Blob): Blob => response;
