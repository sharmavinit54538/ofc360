import { t as axios } from "../_libs/axios+[...].mjs";
import { j as apiInstance } from "./ofc360-store-CDoLj5BI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/client-DMi661Wn.js
var ApiError = class extends Error {
	status;
	data;
	constructor(message, status, data) {
		super(message);
		this.name = "ApiError";
		this.status = status;
		this.data = data;
	}
};
function normalizePath(path) {
	return path.replace(/^\//, "");
}
function toApiError(error) {
	if (error instanceof ApiError) return error;
	const axiosErr = error;
	if (axios.isAxiosError(error)) {
		if (axiosErr.message === "Network Error" || axiosErr.code === "ERR_NETWORK" || !axiosErr.response) return new ApiError("Network Error: Cannot connect to backend server. Please check if backend API is running or restart dev server.", 0, null);
		const data = axiosErr.response?.data;
		return new ApiError(data && typeof data === "object" && "message" in data && "message" in data && typeof data.message === "string" ? data.message : axiosErr.message || `Request failed with status ${axiosErr.response?.status ?? 500}`, axiosErr.response?.status ?? 500, data ?? null);
	}
	if (error instanceof Error) return new ApiError(error.message, 500, null);
	return new ApiError("Network Error: Cannot connect to backend server.", 500, null);
}
async function apiRequest(path, options = {}) {
	try {
		return (await apiInstance.request({
			method: options.method ?? "GET",
			url: normalizePath(path),
			data: options.data,
			headers: options.headers,
			timeout: options.timeout
		})).data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.message === "Failed to refresh session") throw new ApiError("Session expired. Please log in again.", 401, null);
		throw toApiError(error);
	}
}
/** Convenience methods — returns response body directly (same as legacy api-client). */
var api = {
	get: (path, options) => apiRequest(path, {
		...options,
		method: "GET"
	}),
	post: (path, data, options) => apiRequest(path, {
		...options,
		method: "POST",
		data
	}),
	put: (path, data, options) => apiRequest(path, {
		...options,
		method: "PUT",
		data
	}),
	patch: (path, data, options) => apiRequest(path, {
		...options,
		method: "PATCH",
		data
	}),
	delete: (path, options) => apiRequest(path, {
		...options,
		method: "DELETE"
	})
};
//#endregion
export { api as t };
