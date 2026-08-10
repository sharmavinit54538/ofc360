/**
 * Centralized SEO constants and helpers for OFC360.
 *
 * Usage:
 *   import { buildMeta, SITE_URL } from "@/lib/seo";
 *   head: () => ({ meta: buildMeta({ title: "...", description: "..." }) })
 */

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

export const SITE_URL = "https://www.ofc360.com";
export const SITE_NAME = "OFC360";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;
export const TWITTER_HANDLE = "@OFC360";

/* ------------------------------------------------------------------ */
/*  buildMeta — generates meta + OG + Twitter tags for a page          */
/* ------------------------------------------------------------------ */

interface MetaOptions {
  /** Page title (will be used for og:title and twitter:title too) */
  title: string;
  /** Meta description (used for og:description and twitter:description) */
  description: string;
  /** Absolute or relative path — will be resolved to a full URL */
  url: string;
  /** og:type — defaults to "website" */
  ogType?: string;
  /** Full URL to the OG image — defaults to DEFAULT_OG_IMAGE */
  ogImage?: string;
  /** If true, adds robots noindex,nofollow */
  noindex?: boolean;
}

export function buildMeta({
  title,
  description,
  url,
  ogType = "website",
  ogImage = DEFAULT_OG_IMAGE,
  noindex = false,
}: MetaOptions) {
  const fullUrl = url.startsWith("http") ? url : `${SITE_URL}${url.startsWith("/") ? url : `/${url}`}`;
  const fullOgImage = ogImage.startsWith("http") ? ogImage : `${SITE_URL}${ogImage.startsWith("/") ? ogImage : `/${ogImage}`}`;

  const tags: Record<string, string>[] = [
    { title },
    { name: "description", content: description },
    // Open Graph
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: fullUrl },
    { property: "og:type", content: ogType },
    { property: "og:image", content: fullOgImage },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:site_name", content: SITE_NAME },
    // Twitter Card
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: TWITTER_HANDLE },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: fullOgImage },
  ];

  if (noindex) {
    tags.push({ name: "robots", content: "noindex, nofollow" });
  }

  return tags;
}

/* ------------------------------------------------------------------ */
/*  buildCanonical — returns canonical link descriptor                  */
/* ------------------------------------------------------------------ */

export function buildCanonical(path: string) {
  const href = path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  return [{ rel: "canonical" as const, href }];
}
