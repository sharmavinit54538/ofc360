/**
 * @file index.ts
 * @description Central export file for the 8 Recruitment Service Modules.
 * Exposes RTK Query slices, injected endpoints, and typed async service wrappers.
 */

import { recruitmentApi } from '../api/recruitmentApi';
import { recruitmentJobsApi } from '../api/jobEndpoints';
import { recruitmentCandidatesApi } from '../api/candidateEndpoints';
import { recruitmentInterviewsApi } from '../api/interviewEndpoints';
import { recruitmentAiApi } from '../api/aiEndpoints';
import { interviewBotApi } from '../api/interviewBotEndpoints';
import { candidateBookingEndpoints } from '../api/bookingEndpoints';
import { recruitmentOperationsApi } from '../api/operationsEndpoints';
import { recruitmentOnboardingApi } from '../api/onboardingEndpoints';

// 1. Central Recruitment API
export { recruitmentApi };

// 2. Recruiter API (AI Dashboard, Funnel, Matching Distribution, Analytics)
export const recruiterApi = {
  endpoints: {
    getDashboard: recruitmentAiApi.endpoints.getRecruiterDashboard,
    getFunnel: recruitmentAiApi.endpoints.getRecruiterFunnel,
    getMatchDistribution: recruitmentAiApi.endpoints.getRecruiterMatchDistribution,
    getAnalytics: recruitmentAiApi.endpoints.getRecruiterAnalytics,
    getCandidateRecommendation: recruitmentAiApi.endpoints.getAiCandidateRecommendation,
    getCandidateScore: recruitmentAiApi.endpoints.getAiCandidateScore,
    getInterviewQuestions: recruitmentAiApi.endpoints.getAiInterviewQuestions,
    exportAnalytics: recruitmentAiApi.endpoints.exportRecruitmentAnalytics,
    exportReports: recruitmentAiApi.endpoints.exportRecruitmentReports,
  },
  useGetDashboardQuery: recruitmentAiApi.useGetRecruiterDashboardQuery,
  useGetFunnelQuery: recruitmentAiApi.useGetRecruiterFunnelQuery,
  useGetMatchDistributionQuery: recruitmentAiApi.useGetRecruiterMatchDistributionQuery,
  useGetAnalyticsQuery: recruitmentAiApi.useGetRecruiterAnalyticsQuery,
  useGetCandidateRecommendationQuery: recruitmentAiApi.useGetAiCandidateRecommendationQuery,
  useGetCandidateScoreQuery: recruitmentAiApi.useGetAiCandidateScoreQuery,
  useGetInterviewQuestionsMutation: recruitmentAiApi.useGetAiInterviewQuestionsMutation,
  useExportAnalyticsQuery: recruitmentAiApi.useExportRecruitmentAnalyticsQuery,
  useExportReportsQuery: recruitmentAiApi.useExportRecruitmentReportsQuery,
};

// 3. Screening API (AI Resume Screening, Results, Human Override)
export const screeningApi = {
  endpoints: {
    runScreening: recruitmentAiApi.endpoints.runJobScreening,
    getResults: recruitmentAiApi.endpoints.getJobScreeningResults,
    submitDecision: recruitmentAiApi.endpoints.submitScreeningDecision,
    getHistory: recruitmentAiApi.endpoints.getApplicationScreeningHistory,
    getTopCandidates: recruitmentAiApi.endpoints.getTopCandidatesByJob,
    getJobRanking: recruitmentAiApi.endpoints.getAiJobRanking,
  },
  useRunScreeningMutation: recruitmentAiApi.useRunJobScreeningMutation,
  useGetResultsQuery: recruitmentAiApi.useGetJobScreeningResultsQuery,
  useSubmitDecisionMutation: recruitmentAiApi.useSubmitScreeningDecisionMutation,
  useGetHistoryQuery: recruitmentAiApi.useGetApplicationScreeningHistoryQuery,
  useGetTopCandidatesQuery: recruitmentAiApi.useGetTopCandidatesByJobQuery,
  useGetJobRankingQuery: recruitmentAiApi.useGetAiJobRankingQuery,
};

// 4. Interview API (Interviews, Scheduling, Reschedule, Cancel, Feedback, Scorecards)
export const interviewApi = {
  endpoints: {
    getInterviews: recruitmentInterviewsApi.endpoints.getAdminInterviews,
    getInterviewers: recruitmentInterviewsApi.endpoints.getInterviewers,
    scheduleRound: recruitmentInterviewsApi.endpoints.scheduleRoundInterview,
    reschedule: recruitmentInterviewsApi.endpoints.rescheduleInterviewSchedule,
    cancel: recruitmentInterviewsApi.endpoints.cancelInterviewSchedule,
    sendReminder: recruitmentInterviewsApi.endpoints.sendInterviewReminder,
    markNoShow: recruitmentInterviewsApi.endpoints.markInterviewScheduleNoShow,
    submitFeedback: recruitmentInterviewsApi.endpoints.submitRoundFeedback,
    createScorecardSubmission: recruitmentInterviewsApi.endpoints.createScorecardSubmission,
    getScorecardSubmissions: recruitmentInterviewsApi.endpoints.getScorecardSubmissions,
    getScorecardTemplates: recruitmentInterviewsApi.endpoints.getScorecardTemplates,
    createScorecardTemplate: recruitmentInterviewsApi.endpoints.createScorecardTemplate,
  },
  useGetInterviewsQuery: recruitmentInterviewsApi.useGetAdminInterviewsQuery,
  useGetInterviewersQuery: recruitmentInterviewsApi.useGetInterviewersQuery,
  useScheduleRoundMutation: recruitmentInterviewsApi.useScheduleRoundInterviewMutation,
  useRescheduleMutation: recruitmentInterviewsApi.useRescheduleInterviewScheduleMutation,
  useCancelMutation: recruitmentInterviewsApi.useCancelInterviewScheduleMutation,
  useSendReminderMutation: recruitmentInterviewsApi.useSendInterviewReminderMutation,
  useMarkNoShowMutation: recruitmentInterviewsApi.useMarkInterviewScheduleNoShowMutation,
  useSubmitFeedbackMutation: recruitmentInterviewsApi.useSubmitRoundFeedbackMutation,
  useCreateScorecardSubmissionMutation: recruitmentInterviewsApi.useCreateScorecardSubmissionMutation,
  useGetScorecardSubmissionsQuery: recruitmentInterviewsApi.useGetScorecardSubmissionsQuery,
  useGetScorecardTemplatesQuery: recruitmentInterviewsApi.useGetScorecardTemplatesQuery,
  useCreateScorecardTemplateMutation: recruitmentInterviewsApi.useCreateScorecardTemplateMutation,
};

// 5. AI Interview Bot API (Candidate Public Bot & Admin Results)
export const aiInterviewBotApi = {
  endpoints: {
    invite: interviewBotApi.endpoints.inviteCandidateToBot,
    getResults: interviewBotApi.endpoints.getBotResultsByJob,
    submitDecision: interviewBotApi.endpoints.submitBotDecision,
    getPublicSession: interviewBotApi.endpoints.getPublicBotSession,
    startPublicSession: interviewBotApi.endpoints.startPublicBotSession,
    submitPublicAnswer: interviewBotApi.endpoints.submitPublicBotAnswer,
    finishPublicSession: interviewBotApi.endpoints.finishPublicBotSession,
    requestHuman: interviewBotApi.endpoints.requestHumanInterviewer,
  },
  useInviteMutation: interviewBotApi.useInviteCandidateToBotMutation,
  useGetResultsQuery: interviewBotApi.useGetBotResultsByJobQuery,
  useSubmitDecisionMutation: interviewBotApi.useSubmitBotDecisionMutation,
  useGetPublicSessionQuery: interviewBotApi.useGetPublicBotSessionQuery,
  useStartPublicSessionMutation: interviewBotApi.useStartPublicBotSessionMutation,
  useSubmitPublicAnswerMutation: interviewBotApi.useSubmitPublicAnswerMutation,
  useFinishPublicSessionMutation: interviewBotApi.useFinishPublicBotSessionMutation,
  useRequestHumanMutation: interviewBotApi.useRequestHumanInterviewerMutation,
};

// 6. Candidate Booking API (Public Self-Booking)
export const candidateBookingApi = {
  endpoints: {
    getSlotInfo: candidateBookingEndpoints.endpoints.getBookingSlotInfo,
    bookSlot: candidateBookingEndpoints.endpoints.bookInterviewSlot,
  },
  useGetSlotInfoQuery: candidateBookingEndpoints.useGetBookingSlotInfoQuery,
  useBookSlotMutation: candidateBookingEndpoints.useBookInterviewSlotMutation,
};

// 7. Automation API (No-code Automation Rules, Toggles, Test Execution)
export const automationApi = {
  endpoints: {
    getRules: recruitmentOperationsApi.endpoints.getAutomationRules,
    createRule: recruitmentOperationsApi.endpoints.createAutomationRule,
    toggleRule: recruitmentOperationsApi.endpoints.toggleAutomationRule,
    testRule: recruitmentOperationsApi.endpoints.testAutomationRule,
  },
  useGetRulesQuery: recruitmentOperationsApi.useGetAutomationRulesQuery,
  useCreateRuleMutation: recruitmentOperationsApi.useCreateAutomationRuleMutation,
  useToggleRuleMutation: recruitmentOperationsApi.useToggleAutomationRuleMutation,
  useTestRuleMutation: recruitmentOperationsApi.useTestAutomationRuleMutation,
};

// 8. Employee Onboarding API (Admin Onboarding Review & Employee Steps)
export const employeeOnboardingApi = {
  endpoints: {
    getAdminOnboardingList: recruitmentOnboardingApi.endpoints.getAdminEmployeeOnboarding,
    getAdminOnboardingById: recruitmentOnboardingApi.endpoints.getAdminEmployeeOnboardingById,
    verifyDocument: recruitmentOnboardingApi.endpoints.verifyAdminEmployeeOnboardingDocument,
    saveStep: recruitmentOnboardingApi.endpoints.saveEmployeeOnboardingStep,
    uploadStepEightDoc: recruitmentOnboardingApi.endpoints.uploadEmployeeOnboardingStepEight,
    deleteStepEightDoc: recruitmentOnboardingApi.endpoints.deleteEmployeeOnboardingStepEightDocument,
  },
  useGetAdminOnboardingListQuery: recruitmentOnboardingApi.useGetAdminEmployeeOnboardingQuery,
  useGetAdminOnboardingByIdQuery: recruitmentOnboardingApi.useGetAdminEmployeeOnboardingByIdQuery,
  useVerifyDocumentMutation: recruitmentOnboardingApi.useVerifyAdminEmployeeOnboardingDocumentMutation,
  useSaveStepMutation: recruitmentOnboardingApi.useSaveEmployeeOnboardingStepMutation,
  useUploadStepEightDocMutation: recruitmentOnboardingApi.useUploadEmployeeOnboardingStepEightMutation,
  useDeleteStepEightDocMutation: recruitmentOnboardingApi.useDeleteEmployeeOnboardingStepEightDocumentMutation,
};

// Also export Jobs, Candidates and Operations APIs
export { recruitmentJobsApi, recruitmentCandidatesApi, recruitmentOperationsApi };

