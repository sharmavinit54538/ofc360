/**
 * Helper to get the public application base URL.
 * Environment-aware: uses VITE_PUBLIC_APP_URL when present, or window.location.origin.
 * Ensures localhost is never used in production.
 */
export function getPublicAppUrl(): string {
  let baseUrl =
    (import.meta.env.VITE_PUBLIC_APP_URL as string) ||
    (typeof window !== "undefined" ? window.location.origin : "https://www.ofc360.com");

  const isProdHost =
    typeof window !== "undefined" && window.location.hostname.includes("ofc360.com");

  if (import.meta.env.PROD || isProdHost) {
    if (baseUrl.includes("localhost") || baseUrl.includes("127.0.0.1")) {
      baseUrl = "https://www.ofc360.com";
    }
  }

  return baseUrl.replace(/\/$/, "");
}

/**
 * Centralized function to generate production-safe public job application URLs.
 * Example production output: https://www.ofc360.com/jobs/apply/c24e0c96
 * Example development output: http://localhost:8080/jobs/apply/c24e0c96
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

  // Production safety check: prevent accidental localhost links
  if (import.meta.env.PROD && fullUrl.includes("localhost")) {
    console.error("Production secure job link cannot contain localhost:", fullUrl);
    return `https://www.ofc360.com/jobs/apply/${code}`;
  }

  return fullUrl;
}
