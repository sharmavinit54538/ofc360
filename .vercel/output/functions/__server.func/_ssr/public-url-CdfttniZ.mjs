//#region node_modules/.nitro/vite/services/ssr/assets/public-url-CdfttniZ.js
/**
* Helper to get the public application base URL.
* Environment-aware: uses VITE_PUBLIC_APP_URL when present, or window.location.origin.
* Ensures localhost is never used in production.
*/
function getPublicAppUrl() {
	let baseUrl = "https://www.ofc360.com";
	typeof window !== "undefined" && window.location.hostname.includes("ofc360.com");
	if (baseUrl.includes("localhost") || baseUrl.includes("127.0.0.1")) baseUrl = "https://www.ofc360.com";
	return baseUrl.replace(/\/$/, "");
}
/**
* Centralized function to generate production-safe public job application URLs.
* Example production output: https://www.ofc360.com/jobs/apply/c24e0c96
* Example development output: http://localhost:8080/jobs/apply/c24e0c96
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
	if (fullUrl.includes("localhost")) {
		console.error("Production secure job link cannot contain localhost:", fullUrl);
		return `https://www.ofc360.com/jobs/apply/${code}`;
	}
	return fullUrl;
}
//#endregion
export { getPublicJobApplicationUrl as n, getPublicAppUrl as t };
