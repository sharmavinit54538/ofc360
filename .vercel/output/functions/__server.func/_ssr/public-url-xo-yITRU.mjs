//#region node_modules/.nitro/vite/services/ssr/assets/public-url-xo-yITRU.js
/** Production domain – single source of truth for public-facing URLs. */
var PRODUCTION_URL = "https://www.ofc360.com";
/** Regex that matches localhost, 127.0.0.1, or any 192.168.x.x address. */
var LOCAL_URL_RE = /localhost|127\.0\.0\.1|192\.168\.\d+\.\d+/i;
/**
* Helper to get the public application base URL.
*
* Uses VITE_PUBLIC_APP_URL when present, but **always** validates the result
* and replaces any local-development URL with the production domain.
* This guarantees that QR codes, sourcing links, and any other public-facing
* URLs never contain localhost or local-network addresses — regardless of
* build mode or runtime context.
*/
function getPublicAppUrl() {
	const envUrl = "https://www.ofc360.com";
	if (!LOCAL_URL_RE.test(envUrl)) return envUrl.replace(/\/$/, "");
	return PRODUCTION_URL;
}
/**
* Centralized function to generate production-safe public job application URLs.
*
* Always produces URLs rooted at the production domain.
* Example output: https://www.ofc360.com/jobs/apply/c24e0c96
*/
function getPublicJobApplicationUrl(codeOrUrl) {
	if (!codeOrUrl) return getPublicAppUrl() + "/jobs/apply/";
	let code = codeOrUrl.trim();
	if (code.includes("/jobs/apply/")) code = code.split("/jobs/apply/")[1]?.split("?")[0]?.split("#")[0] || code;
	else if (code.startsWith("http://") || code.startsWith("https://")) try {
		const parts = new URL(code).pathname.split("/").filter(Boolean);
		code = parts[parts.length - 1] || code;
	} catch {}
	const fullUrl = `${getPublicAppUrl()}/jobs/apply/${code}`;
	if (LOCAL_URL_RE.test(fullUrl)) {
		console.error("[public-url] Local address detected in job link — forcing production URL:", fullUrl);
		return `${PRODUCTION_URL}/jobs/apply/${code}`;
	}
	return fullUrl;
}
//#endregion
export { getPublicJobApplicationUrl as n, getPublicAppUrl as t };
