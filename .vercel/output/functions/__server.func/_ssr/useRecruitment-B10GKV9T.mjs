import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { $t as upsertJob, Mt as optimisticUpsertInterview, P as archiveJob, Qt as upsertInterview, Zt as upsertCandidate, en as upsertOffer, ft as fetchRecruitmentData, it as duplicateJob, jt as optimisticMoveStage, k as addNote, kt as moveStage, st as fetchJobById, tt as deleteJob } from "./ofc360-store-CDoLj5BI.mjs";
import { n as useAppSelector, t as useAppDispatch } from "./hooks-BpVIWXzj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/useRecruitment-B10GKV9T.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function newId(prefix = "id") {
	return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}
function useRecruitmentBase() {
	const dispatch = useAppDispatch();
	const { jobs, candidates, interviews, offers, loading, submitting, error } = useAppSelector((state) => state.recruitment);
	const shouldFetch = !loading && jobs.length === 0 && candidates.length === 0 && interviews.length === 0 && offers.length === 0;
	(0, import_react.useEffect)(() => {
		if (shouldFetch) dispatch(fetchRecruitmentData());
	}, [dispatch, shouldFetch]);
	return {
		jobs,
		candidates,
		interviews,
		offers,
		loading,
		submitting,
		error,
		refreshAll: (0, import_react.useCallback)(() => {
			dispatch(fetchRecruitmentData());
		}, [dispatch]),
		getJob: (0, import_react.useCallback)(async (id) => {
			const result = await dispatch(fetchJobById(id));
			if (fetchJobById.fulfilled.match(result)) return result.payload;
			throw new Error(result.payload ?? "Job not found");
		}, [dispatch]),
		upsertJob: (0, import_react.useCallback)(async (job) => {
			const result = await dispatch(upsertJob(job));
			if (upsertJob.rejected.match(result)) throw new Error(result.payload ?? "Failed to save job");
			return result.payload;
		}, [dispatch]),
		deleteJob: (0, import_react.useCallback)(async (id) => {
			await dispatch(deleteJob(id));
		}, [dispatch]),
		archiveJob: (0, import_react.useCallback)(async (id) => {
			await dispatch(archiveJob(id));
		}, [dispatch]),
		duplicateJob: (0, import_react.useCallback)(async (id) => {
			await dispatch(duplicateJob(id));
		}, [dispatch]),
		upsertCandidate: (0, import_react.useCallback)(async (candidate) => {
			const result = await dispatch(upsertCandidate(candidate));
			if (upsertCandidate.rejected.match(result)) throw new Error(result.payload ?? "Failed to save candidate");
		}, [dispatch]),
		moveStage: (0, import_react.useCallback)((id, stage) => {
			dispatch(optimisticMoveStage({
				id,
				stage
			}));
			dispatch(moveStage({
				id,
				stage
			}));
		}, [dispatch]),
		addNote: (0, import_react.useCallback)((candidateId, text) => {
			dispatch(addNote({
				candidateId,
				text
			}));
		}, [dispatch]),
		upsertInterview: (0, import_react.useCallback)(async (interview) => {
			dispatch(optimisticUpsertInterview(interview));
			await dispatch(upsertInterview(interview));
		}, [dispatch]),
		upsertOffer: (0, import_react.useCallback)(async (offer) => {
			await dispatch(upsertOffer(offer));
		}, [dispatch])
	};
}
function useRecruitment(selector) {
	const base = useRecruitmentBase();
	const resources = {
		jobs: base.jobs,
		candidates: base.candidates,
		interviews: base.interviews,
		offers: base.offers
	};
	if (selector) return selector(resources);
	return base;
}
//#endregion
export { useRecruitment as n, newId as t };
