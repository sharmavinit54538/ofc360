/**
 * Google Analytics 4 (GA4) integration for OFC360.
 *
 * Requirements:
 * - Reads Measurement ID from import.meta.env.VITE_GA_MEASUREMENT_ID
 * - SPA route change tracking & initial page view tracking
 * - SSR/Hydration safe
 * - Excludes private routes (/dashboard, /onboarding, auth routes, etc.)
 * - Fail-safe if environment variable is missing
 */

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

const GA_MEASUREMENT_ID =
  typeof import.meta !== "undefined" && import.meta.env
    ? (import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined)
    : undefined;

let isInitialized = false;

/**
 * List of path prefixes that should NOT be tracked in Analytics
 * to protect sensitive user & company operational data.
 */
const PRIVATE_PATH_PREFIXES = [
  "/dashboard",
  "/onboarding",
  "/api",
  "/_auth",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/verify-reset-otp",
];

/**
 * Returns true if the given path is a public page eligible for analytics tracking.
 */
export function isPublicRoute(pathname: string): boolean {
  if (!pathname) return false;
  return !PRIVATE_PATH_PREFIXES.some((prefix) =>
    pathname === prefix || pathname.startsWith(`${prefix}/`) || (prefix !== "/" && pathname.startsWith(prefix))
  );
}

/**
 * Initializes GA4 script and dataLayer if not already initialized.
 */
export function initGA(): void {
  if (typeof window === "undefined") return; // SSR safe check
  if (isInitialized) return;
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID.trim() === "") return;

  const trimmedId = GA_MEASUREMENT_ID.trim();

  // Ensure script is injected only once into DOM
  const scriptId = "ga4-script";
  if (!document.getElementById(scriptId)) {
    const script = document.createElement("script");
    script.id = scriptId;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(trimmedId)}`;
    document.head.appendChild(script);
  }

  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
  }

  window.gtag("js", new Date());
  // Disable automatic page_view on config load to allow explicit SPA route tracking
  window.gtag("config", trimmedId, {
    send_page_view: false,
    anonymize_ip: true,
  });

  isInitialized = true;
}

/**
 * Tracks a page view for public SPA route navigation.
 */
export function trackPageView(pathname: string, title?: string): void {
  if (typeof window === "undefined") return;
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID.trim() === "") return;
  if (!isPublicRoute(pathname)) return;

  initGA();

  if (window.gtag) {
    const pageLocation = window.location.origin + pathname;
    const pageTitle = title || document.title || "OFC360";

    window.gtag("event", "page_view", {
      page_title: pageTitle,
      page_location: pageLocation,
      page_path: pathname,
    });
  }
}
