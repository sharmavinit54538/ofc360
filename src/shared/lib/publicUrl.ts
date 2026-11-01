const DEFAULT_PUBLIC_ORIGIN = 'https://www.ofc360.com';
const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1', '[::1]']);

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

function isLocalHostname(hostname: string): boolean {
  return LOCAL_HOSTNAMES.has(hostname.toLowerCase()) || hostname.toLowerCase().endsWith('.localhost');
}

export function getPublicAppUrl(): string {
  const configured = import.meta.env.VITE_PUBLIC_APP_URL?.trim();
  if (configured) return trimTrailingSlash(configured);

  if (typeof window !== 'undefined' && window.location?.origin && !isLocalHostname(window.location.hostname)) {
    return trimTrailingSlash(window.location.origin);
  }

  return DEFAULT_PUBLIC_ORIGIN;
}

function encodePathSegment(value: string): string {
  return encodeURIComponent(value.trim());
}

export function getJobApplicationUrl(id: string): string {
  return `${getPublicAppUrl()}/jobs/apply/${encodePathSegment(id)}`;
}

/** Returns the local public-career route; callers can combine it with getPublicAppUrl when needed. */
export function getCareerSiteUrl(slug: string): string {
  return `/careers/${encodePathSegment(slug)}`;
}

export function getPublicJobUrl(jobIdOrUrl: string): string {
  const value = jobIdOrUrl.trim();
  if (!value) return getPublicAppUrl();
  if (/^https?:\/\//i.test(value)) return sanitizePublicUrl(value);
  return getJobApplicationUrl(value);
}

/** Referral URLs use the same public application route until a referral-specific route is defined. */
export function getReferralUrl(jobIdOrUrl: string): string {
  return getPublicJobUrl(jobIdOrUrl);
}

/** Replaces local development origins returned by the backend with the configured public origin. */
export function sanitizePublicUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return getPublicAppUrl();

  try {
    const parsed = new URL(trimmed, getPublicAppUrl());
    if (isLocalHostname(parsed.hostname)) {
      const publicUrl = new URL(getPublicAppUrl());
      parsed.protocol = publicUrl.protocol;
      parsed.hostname = publicUrl.hostname;
      parsed.port = publicUrl.port;
    }
    return parsed.toString();
  } catch {
    const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    return `${getPublicAppUrl()}${path}`;
  }
}
