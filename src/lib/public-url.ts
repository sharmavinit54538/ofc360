/** Production domain – single source of truth for public-facing URLs. */
const PRODUCTION_URL = "https://www.ofc360.com";

/** Regex that matches localhost, 127.0.0.1, or any 192.168.x.x address. */
const LOCAL_URL_RE = /localhost|127\.0\.0\.1|192\.168\.\d+\.\d+/i;

/**
 * Helper to get the public application base URL.
 *
 * Uses VITE_PUBLIC_APP_URL when present, but **always** validates the result
 * and replaces any local-development URL with the production domain.
 * This guarantees that QR codes, sourcing links, and any other public-facing
 * URLs never contain localhost or local-network addresses — regardless of
 * build mode or runtime context.
 */
export function getPublicAppUrl(): string {
  const envUrl = (import.meta.env.VITE_PUBLIC_APP_URL as string) || "";

  // If the env var is set AND is not a local address, use it.
  if (envUrl && !LOCAL_URL_RE.test(envUrl)) {
    return envUrl.replace(/\/$/, "");
  }

  // Fallback: always return the production URL.
  return PRODUCTION_URL;
}

/**
 * Centralized function to generate production-safe public job application URLs.
 *
 * Always produces URLs rooted at the production domain.
 * Example output: https://www.ofc360.com/jobs/apply/c24e0c96
 */
export function getPublicJobApplicationUrl(codeOrUrl: string): string {
  if (!codeOrUrl) return getPublicAppUrl() + "/jobs/apply/";

  let code = codeOrUrl.trim();

  // Extract application code if a full URL or path was passed
  if (code.includes("/jobs/apply/")) {
    code = code.split("/jobs/apply/")[1]?.split("?")[0]?.split("#")[0] || code;
  } else if (code.startsWith("http://") || code.startsWith("https://")) {
    try {
      const parsed = new URL(code);
      const parts = parsed.pathname.split("/").filter(Boolean);
      code = parts[parts.length - 1] || code;
    } catch {
      // keep code as is
    }
  }

  const baseUrl = getPublicAppUrl();
  const fullUrl = `${baseUrl}/jobs/apply/${code}`;

  // Final safety net: if a local address somehow slipped through, force production.
  if (LOCAL_URL_RE.test(fullUrl)) {
    console.error("[public-url] Local address detected in job link — forcing production URL:", fullUrl);
    return `${PRODUCTION_URL}/jobs/apply/${code}`;
  }

  return fullUrl;
}
