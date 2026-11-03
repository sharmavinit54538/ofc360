/**
 * @file recruitmentSlice.ts
 * @description Enterprise Redux Slice for Recruitment with 22 async thunks,
 * request deduplication (fetch dedup) to prevent concurrent identical queries,
 * and a 30-second cache TTL to prevent redundant network calls.
 */

import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type {
  ApiList,
  Candidate,
  Interview,
  Job,
  Offer,
  ScreeningResult,
  Stage,
} from '../types';
import { recruitmentJobsApi } from '../api/jobEndpoints';
import { recruitmentCandidatesApi, type ApplicationOfferPayload, type ApplicationStagePayload } from '../api/candidateEndpoints';
import {
  recruitmentInterviewsApi,
  type InterviewFeedbackPayload,
  type InterviewQueryParams,
  type RescheduleInterviewPayload,
  type ScheduleInterviewPayload,
} from '../api/interviewEndpoints';
import { recruitmentOperationsApi } from '../api/operationsEndpoints';
import { recruitmentAiApi, type ScreeningDecisionPayload, type ScreeningRunPayload } from '../api/aiEndpoints';
import type { RecruitmentSearchParams } from '../api/confirmedEndpointUtils';

export interface RecruitmentState {
  jobs: Job[];
  totalJobs: number;
  selectedJob: Job | null;

  candidates: Candidate[];
  totalCandidates: number;
  selectedCandidate: Candidate | null;

  interviews: Interview[];
  totalInterviews: number;

  offers: Offer[];
  totalOffers: number;

  screeningResults: ScreeningResult[];

  activeRequests: Record<string, boolean>;
  cacheTimestamps: Record<string, number>;

  loading: {
    jobs: boolean;
    candidates: boolean;
    interviews: boolean;
    offers: boolean;
    screening: boolean;
  };
  error: string | null;

  filters: {
    search: string;
    department: string;
    stage: string;
    jobStatus: string;
  };
}

const initialState: RecruitmentState = {
  jobs: [],
  totalJobs: 0,
  selectedJob: null,

  candidates: [],
  totalCandidates: 0,
  selectedCandidate: null,

  interviews: [],
  totalInterviews: 0,

  offers: [],
  totalOffers: 0,

  screeningResults: [],

  activeRequests: {},
  cacheTimestamps: {},

  loading: {
    jobs: false,
    candidates: false,
    interviews: false,
    offers: false,
    screening: false,
  },
  error: null,

  filters: {
    search: '',
    department: '',
    stage: '',
    jobStatus: '',
  },
};

type AppStateWithRecruitment = { recruitment: RecruitmentState };

const CACHE_TTL_MS = 30_000;

function checkCacheAndDedup(
  key: string,
  state: RecruitmentState | undefined,
  force?: boolean
): boolean {
  if (!state) return true;
  if (state.activeRequests[key]) {
    return false; // In-flight dedup
  }
  const lastFetched = state.cacheTimestamps[key];
  if (lastFetched && Date.now() - lastFetched < CACHE_TTL_MS && !force) {
    return false; // 30s TTL cache hit
  }
  return true;
}

/* =========================================================================
   22 ASYNC THUNKS WITH DEDUP & 30-SECOND CACHE TTL
   ========================================================================= */

// 1. Fetch Jobs
export const fetchJobsThunk = createAsyncThunk<
  ApiList<Job>,
  { params?: RecruitmentSearchParams; force?: boolean } | void,
  { state: AppStateWithRecruitment }
>(
  'recruitment/fetchJobs',
  async (args, { dispatch }) => {
    const action = await dispatch(
      recruitmentJobsApi.endpoints.getAdminJobs.initiate(args?.params, { forceRefetch: true })
    );
    if ('error' in action && action.error) throw action.error;
    return action.data as ApiList<Job>;
  },
  {
    condition: (args, { getState }) => {
      const key = `jobs:${JSON.stringify(args?.params || {})}`;
      return checkCacheAndDedup(key, getState().recruitment, args?.force);
    },
  }
);

// 2. Fetch Job By Id
export const fetchJobByIdThunk = createAsyncThunk<
  Job,
  { id: string; force?: boolean },
  { state: AppStateWithRecruitment }
>(
  'recruitment/fetchJobById',
  async ({ id }, { dispatch }) => {
    const action = await dispatch(
      recruitmentJobsApi.endpoints.getAdminJobById.initiate(id, { forceRefetch: true })
    );
    if ('error' in action && action.error) throw action.error;
    return action.data as Job;
  },
  {
    condition: ({ id, force }, { getState }) => {
      return checkCacheAndDedup(`job:${id}`, getState().recruitment, force);
    },
  }
);

// 3. Create Job
export const createJobThunk = createAsyncThunk<Job, Job>(
  'recruitment/createJob',
  async (job, { dispatch }) => {
    return await dispatch(recruitmentJobsApi.endpoints.createAdminJob.initiate(job)).unwrap();
  }
);

// 4. Update Job
export const updateJobThunk = createAsyncThunk<Job, { id: string; job: Job }>(
  'recruitment/updateJob',
  async ({ id, job }, { dispatch }) => {
    return await dispatch(recruitmentJobsApi.endpoints.updateAdminJob.initiate({ id, job })).unwrap();
  }
);

// 5. Close Job
export const closeJobThunk = createAsyncThunk<unknown, string>(
  'recruitment/closeJob',
  async (id, { dispatch }) => {
    return await dispatch(recruitmentJobsApi.endpoints.closeAdminJob.initiate(id)).unwrap();
  }
);

// 6. Fetch Candidates
export const fetchCandidatesThunk = createAsyncThunk<
  ApiList<Candidate>,
  { params?: RecruitmentSearchParams; force?: boolean } | void,
  { state: AppStateWithRecruitment }
>(
  'recruitment/fetchCandidates',
  async (args, { dispatch }) => {
    const action = await dispatch(
      recruitmentCandidatesApi.endpoints.getAdminCandidates.initiate(args?.params, { forceRefetch: true })
    );
    if ('error' in action && action.error) throw action.error;
    return action.data as ApiList<Candidate>;
  },
  {
    condition: (args, { getState }) => {
      const key = `candidates:${JSON.stringify(args?.params || {})}`;
      return checkCacheAndDedup(key, getState().recruitment, args?.force);
    },
  }
);

// 7. Fetch Candidate By Id
export const fetchCandidateByIdThunk = createAsyncThunk<
  Candidate,
  { id: string; force?: boolean },
  { state: AppStateWithRecruitment }
>(
  'recruitment/fetchCandidateById',
  async ({ id }, { dispatch }) => {
    const action = await dispatch(
      recruitmentCandidatesApi.endpoints.getAdminCandidateById.initiate(id, { forceRefetch: true })
    );
    if ('error' in action && action.error) throw action.error;
    return action.data as Candidate;
  },
  {
    condition: ({ id, force }, { getState }) => {
      return checkCacheAndDedup(`candidate:${id}`, getState().recruitment, force);
    },
  }
);

// 8. Create Candidate
export const createCandidateThunk = createAsyncThunk<Candidate, Candidate>(
  'recruitment/createCandidate',
  async (candidate, { dispatch }) => {
    return await dispatch(recruitmentCandidatesApi.endpoints.createAdminCandidate.initiate(candidate)).unwrap();
  }
);

// 9. Update Candidate Stage
export const updateCandidateStageThunk = createAsyncThunk<
  unknown,
  { applicationId: string; stage: Stage }
>(
  'recruitment/updateCandidateStage',
  async ({ applicationId, stage }, { dispatch }) => {
    return await dispatch(
      recruitmentCandidatesApi.endpoints.updateApplicationStage.initiate({
        applicationId,
        data: { stage },
      })
    ).unwrap();
  }
);

// 10. Fetch Interviews
export const fetchInterviewsThunk = createAsyncThunk<
  ApiList<Interview>,
  { params?: InterviewQueryParams; force?: boolean } | void,
  { state: AppStateWithRecruitment }
>(
  'recruitment/fetchInterviews',
  async (args, { dispatch }) => {
    const action = await dispatch(
      recruitmentInterviewsApi.endpoints.getAdminInterviews.initiate(args?.params, { forceRefetch: true })
    );
    if ('error' in action && action.error) throw action.error;
    return action.data as ApiList<Interview>;
  },
  {
    condition: (args, { getState }) => {
      const key = `interviews:${JSON.stringify(args?.params || {})}`;
      return checkCacheAndDedup(key, getState().recruitment, args?.force);
    },
  }
);

// 11. Schedule Interview
export const scheduleInterviewThunk = createAsyncThunk<
  unknown,
  { interviewId: string; roundId: string; data: ScheduleInterviewPayload }
>(
  'recruitment/scheduleInterview',
  async ({ interviewId, roundId, data }, { dispatch }) => {
    return await dispatch(
      recruitmentInterviewsApi.endpoints.scheduleRoundInterview.initiate({ interviewId, roundId, data })
    ).unwrap();
  }
);

// 12. Reschedule Interview
export const rescheduleInterviewThunk = createAsyncThunk<
  unknown,
  { scheduleId: string; data: RescheduleInterviewPayload }
>(
  'recruitment/rescheduleInterview',
  async ({ scheduleId, data }, { dispatch }) => {
    return await dispatch(
      recruitmentInterviewsApi.endpoints.rescheduleInterviewSchedule.initiate({ scheduleId, data })
    ).unwrap();
  }
);

// 13. Cancel Interview
export const cancelInterviewThunk = createAsyncThunk<
  unknown,
  { scheduleId: string; reason: string }
>(
  'recruitment/cancelInterview',
  async ({ scheduleId, reason }, { dispatch }) => {
    return await dispatch(
      recruitmentInterviewsApi.endpoints.cancelInterviewSchedule.initiate({ scheduleId, reason })
    ).unwrap();
  }
);

// 14. Send Interview Reminder
export const sendInterviewReminderThunk = createAsyncThunk<unknown, string>(
  'recruitment/sendInterviewReminder',
  async (scheduleId, { dispatch }) => {
    return await dispatch(
      recruitmentInterviewsApi.endpoints.sendInterviewReminder.initiate(scheduleId)
    ).unwrap();
  }
);

// 15. Mark Interview No Show
export const markInterviewNoShowThunk = createAsyncThunk<unknown, string>(
  'recruitment/markInterviewNoShow',
  async (scheduleId, { dispatch }) => {
    return await dispatch(
      recruitmentInterviewsApi.endpoints.markInterviewScheduleNoShow.initiate(scheduleId)
    ).unwrap();
  }
);

// 16. Submit Interview Feedback
export const submitInterviewFeedbackThunk = createAsyncThunk<
  unknown,
  { roundId: string; action: 'pass' | 'reject' | 'hold'; data: InterviewFeedbackPayload }
>(
  'recruitment/submitInterviewFeedback',
  async ({ roundId, action, data }, { dispatch }) => {
    return await dispatch(
      recruitmentInterviewsApi.endpoints.submitRoundFeedback.initiate({ roundId, action, data })
    ).unwrap();
  }
);

// 17. Fetch Offers
export const fetchOffersThunk = createAsyncThunk<
  ApiList<Offer>,
  { force?: boolean } | void,
  { state: AppStateWithRecruitment }
>(
  'recruitment/fetchOffers',
  async (_args, { dispatch }) => {
    const action = await dispatch(
      recruitmentOperationsApi.endpoints.getAdminOffers.initiate(undefined, { forceRefetch: true })
    );
    if ('error' in action && action.error) throw action.error;
    return action.data as ApiList<Offer>;
  },
  {
    condition: (args, { getState }) => {
      return checkCacheAndDedup('offers:all', getState().recruitment, args?.force);
    },
  }
);

// 18. Create Offer
export const createOfferThunk = createAsyncThunk<
  unknown,
  { applicationId: string; data: ApplicationOfferPayload }
>(
  'recruitment/createOffer',
  async ({ applicationId, data }, { dispatch }) => {
    return await dispatch(
      recruitmentCandidatesApi.endpoints.createApplicationOffer.initiate({ id: applicationId, data })
    ).unwrap();
  }
);

// 19. Accept Offer
export const acceptOfferThunk = createAsyncThunk<unknown, string>(
  'recruitment/acceptOffer',
  async (offerId, { dispatch }) => {
    return await dispatch(recruitmentOperationsApi.endpoints.acceptAdminOffer.initiate(offerId)).unwrap();
  }
);

// 20. Reject Offer
export const rejectOfferThunk = createAsyncThunk<unknown, string>(
  'recruitment/rejectOffer',
  async (offerId, { dispatch }) => {
    return await dispatch(recruitmentOperationsApi.endpoints.rejectAdminOffer.initiate(offerId)).unwrap();
  }
);

// 21. Run AI Screening
export const runScreeningThunk = createAsyncThunk<
  unknown,
  { jobId: string; data?: ScreeningRunPayload }
>(
  'recruitment/runScreening',
  async ({ jobId, data }, { dispatch }) => {
    return await dispatch(
      recruitmentAiApi.endpoints.runJobScreening.initiate({ jobId, data })
    ).unwrap();
  }
);

// 22. Submit AI Screening Decision
export const submitScreeningDecisionThunk = createAsyncThunk<
  unknown,
  { screeningId: string; data: ScreeningDecisionPayload }
>(
  'recruitment/submitScreeningDecision',
  async ({ screeningId, data }, { dispatch }) => {
    return await dispatch(
      recruitmentAiApi.endpoints.submitScreeningDecision.initiate({ screeningId, data })
    ).unwrap();
  }
);

/* =========================================================================
   RECRUITMENT SLICE DEFINITION
   ========================================================================= */

export const recruitmentSlice = createSlice({
  name: 'recruitment',
  initialState,
  reducers: {
    setSelectedJob: (state, action: PayloadAction<Job | null>) => {
      state.selectedJob = action.payload;
    },
    setSelectedCandidate: (state, action: PayloadAction<Candidate | null>) => {
      state.selectedCandidate = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<RecruitmentState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearError: (state) => {
      state.error = null;
    },
    invalidateResourceCache: (state, action: PayloadAction<string>) => {
      delete state.cacheTimestamps[action.payload];
    },
    clearAllCache: (state) => {
      state.cacheTimestamps = {};
      state.activeRequests = {};
    },
  },
  extraReducers: (builder) => {
    // 1. Fetch Jobs
    builder
      .addCase(fetchJobsThunk.pending, (state, action) => {
        const key = `jobs:${JSON.stringify(action.meta.arg?.params || {})}`;
        state.activeRequests[key] = true;
        state.loading.jobs = true;
        state.error = null;
      })
      .addCase(fetchJobsThunk.fulfilled, (state, action) => {
        const key = `jobs:${JSON.stringify(action.meta.arg?.params || {})}`;
        delete state.activeRequests[key];
        state.cacheTimestamps[key] = Date.now();
        state.loading.jobs = false;
        state.jobs = action.payload.items;
        state.totalJobs = action.payload.total ?? action.payload.items.length;
      })
      .addCase(fetchJobsThunk.rejected, (state, action) => {
        const key = `jobs:${JSON.stringify(action.meta.arg?.params || {})}`;
        delete state.activeRequests[key];
        state.loading.jobs = false;
        state.error = action.error.message || 'Failed to fetch jobs';
      });

    // 2. Fetch Job By Id
    builder
      .addCase(fetchJobByIdThunk.pending, (state, action) => {
        state.activeRequests[`job:${action.meta.arg.id}`] = true;
      })
      .addCase(fetchJobByIdThunk.fulfilled, (state, action) => {
        delete state.activeRequests[`job:${action.meta.arg.id}`];
        state.cacheTimestamps[`job:${action.meta.arg.id}`] = Date.now();
        state.selectedJob = action.payload;
      })
      .addCase(fetchJobByIdThunk.rejected, (state, action) => {
        delete state.activeRequests[`job:${action.meta.arg.id}`];
      });

    // 6. Fetch Candidates
    builder
      .addCase(fetchCandidatesThunk.pending, (state, action) => {
        const key = `candidates:${JSON.stringify(action.meta.arg?.params || {})}`;
        state.activeRequests[key] = true;
        state.loading.candidates = true;
      })
      .addCase(fetchCandidatesThunk.fulfilled, (state, action) => {
        const key = `candidates:${JSON.stringify(action.meta.arg?.params || {})}`;
        delete state.activeRequests[key];
        state.cacheTimestamps[key] = Date.now();
        state.loading.candidates = false;
        state.candidates = action.payload.items;
        state.totalCandidates = action.payload.total ?? action.payload.items.length;
      })
      .addCase(fetchCandidatesThunk.rejected, (state, action) => {
        const key = `candidates:${JSON.stringify(action.meta.arg?.params || {})}`;
        delete state.activeRequests[key];
        state.loading.candidates = false;
        state.error = action.error.message || 'Failed to fetch candidates';
      });

    // 7. Fetch Candidate By Id
    builder
      .addCase(fetchCandidateByIdThunk.pending, (state, action) => {
        state.activeRequests[`candidate:${action.meta.arg.id}`] = true;
      })
      .addCase(fetchCandidateByIdThunk.fulfilled, (state, action) => {
        delete state.activeRequests[`candidate:${action.meta.arg.id}`];
        state.cacheTimestamps[`candidate:${action.meta.arg.id}`] = Date.now();
        state.selectedCandidate = action.payload;
      })
      .addCase(fetchCandidateByIdThunk.rejected, (state, action) => {
        delete state.activeRequests[`candidate:${action.meta.arg.id}`];
      });

    // 10. Fetch Interviews
    builder
      .addCase(fetchInterviewsThunk.pending, (state, action) => {
        const key = `interviews:${JSON.stringify(action.meta.arg?.params || {})}`;
        state.activeRequests[key] = true;
        state.loading.interviews = true;
      })
      .addCase(fetchInterviewsThunk.fulfilled, (state, action) => {
        const key = `interviews:${JSON.stringify(action.meta.arg?.params || {})}`;
        delete state.activeRequests[key];
        state.cacheTimestamps[key] = Date.now();
        state.loading.interviews = false;
        state.interviews = action.payload.items;
        state.totalInterviews = action.payload.total ?? action.payload.items.length;
      })
      .addCase(fetchInterviewsThunk.rejected, (state, action) => {
        const key = `interviews:${JSON.stringify(action.meta.arg?.params || {})}`;
        delete state.activeRequests[key];
        state.loading.interviews = false;
        state.error = action.error.message || 'Failed to fetch interviews';
      });

    // 17. Fetch Offers
    builder
      .addCase(fetchOffersThunk.pending, (state) => {
        state.activeRequests['offers:all'] = true;
        state.loading.offers = true;
      })
      .addCase(fetchOffersThunk.fulfilled, (state, action) => {
        delete state.activeRequests['offers:all'];
        state.cacheTimestamps['offers:all'] = Date.now();
        state.loading.offers = false;
        state.offers = action.payload.items;
        state.totalOffers = action.payload.total ?? action.payload.items.length;
      })
      .addCase(fetchOffersThunk.rejected, (state, action) => {
        delete state.activeRequests['offers:all'];
        state.loading.offers = false;
        state.error = action.error.message || 'Failed to fetch offers';
      });

    // Invalidate caches on mutations:
    builder
      .addCase(createJobThunk.fulfilled, (state) => {
        delete state.cacheTimestamps['jobs:{}'];
      })
      .addCase(createCandidateThunk.fulfilled, (state) => {
        delete state.cacheTimestamps['candidates:{}'];
      })
      .addCase(updateCandidateStageThunk.fulfilled, (state) => {
        delete state.cacheTimestamps['candidates:{}'];
      })
      .addCase(scheduleInterviewThunk.fulfilled, (state) => {
        delete state.cacheTimestamps['interviews:{}'];
      })
      .addCase(createOfferThunk.fulfilled, (state) => {
        delete state.cacheTimestamps['offers:all'];
      });
  },
});

export const {
  setSelectedJob,
  setSelectedCandidate,
  setFilters,
  clearFilters,
  clearError,
  invalidateResourceCache,
  clearAllCache,
} = recruitmentSlice.actions;

export default recruitmentSlice.reducer;

