/**
 * @file useRecruitmentCrossApp.ts
 * @description Cross-application hooks exposing recruitment data and metrics
 * for the Executive Dashboard, Manager Hub, Autopilot automation engine, and AI Assistant.
 */

import { useMemo } from 'react';
import { recruitmentJobsApi } from '../api/jobEndpoints';
import { recruitmentCandidatesApi } from '../api/candidateEndpoints';
import { recruitmentInterviewsApi } from '../api/interviewEndpoints';
import { recruitmentOperationsApi } from '../api/operationsEndpoints';
import { calculateOfferAcceptanceRate, calculateTimeToHireDays } from '../utils/dashboardCalculators';

/**
 * 1. Executive Dashboard KPI Hook
 * Aggregates high-level organizational hiring metrics for C-level and Executive views.
 */
export function useExecutiveRecruitmentKpis() {
  const { data: jobsData, isLoading: jobsLoading } = recruitmentJobsApi.useGetAdminJobsQuery();
  const { data: candidatesData, isLoading: candidatesLoading } = recruitmentCandidatesApi.useGetAdminCandidatesQuery();
  const { data: offersData, isLoading: offersLoading } = recruitmentOperationsApi.useGetAdminOffersQuery();

  const metrics = useMemo(() => {
    const jobs = jobsData?.items || [];
    const candidates = candidatesData?.items || [];
    const offers = offersData?.items || [];

    const activeJobs = jobs.filter((j) => j.status === 'active');
    const totalOpenings = activeJobs.reduce((sum, j) => sum + (j.vacancies || 1), 0);
    const activePipelineCount = candidates.filter((c) => c.stage !== 'hired' && c.stage !== 'rejected').length;
    const hiredCount = candidates.filter((c) => c.stage === 'hired').length;
    const avgTimeToHire = calculateTimeToHireDays(candidates);
    const offerAcceptance = calculateOfferAcceptanceRate(offers);

    return {
      activeJobsCount: activeJobs.length,
      totalOpenings,
      activePipelineCount,
      hiredCount,
      avgTimeToHireDays: avgTimeToHire,
      offerAcceptanceRatePercent: offerAcceptance.ratePercent,
      offersAcceptedCount: offerAcceptance.accepted,
      offersTotalCount: offerAcceptance.total,
    };
  }, [jobsData, candidatesData, offersData]);

  return {
    metrics,
    isLoading: jobsLoading || candidatesLoading || offersLoading,
  };
}

/**
 * 2. Hiring Manager Recruitment Summary Hook
 * Filters interviews, active job openings, and candidate actions for a specific department/manager.
 */
export function useManagerRecruitmentSummary(managerId?: string) {
  const { data: interviewsData, isLoading: interviewsLoading } = recruitmentInterviewsApi.useGetAdminInterviewsQuery({
    limit: 100,
  });
  const { data: jobsData, isLoading: jobsLoading } = recruitmentJobsApi.useGetAdminJobsQuery();
  const { data: candidatesData, isLoading: candidatesLoading } = recruitmentCandidatesApi.useGetAdminCandidatesQuery();

  const summary = useMemo(() => {
    const interviews = interviewsData?.items || [];
    const jobs = jobsData?.items || [];
    const candidates = candidatesData?.items || [];

    const managerInterviews = managerId
      ? interviews.filter((i) => i.interviewerId === managerId)
      : interviews;

    const upcomingInterviews = managerInterviews.filter((i) => i.status === 'SCHEDULED');
    const overdueInterviews = managerInterviews.filter((i) => i.isOverdue && i.status === 'SCHEDULED');
    const pendingFeedback = managerInterviews.filter((i) => i.status === 'COMPLETED' && !i.rating);

    const pendingApprovals = candidates.filter((c) => c.stage === 'interview' || c.stage === 'technical');

    return {
      upcomingInterviewsCount: upcomingInterviews.length,
      overdueInterviewsCount: overdueInterviews.length,
      pendingFeedbackCount: pendingFeedback.length,
      pendingApprovalsCount: pendingApprovals.length,
      activeJobsCount: jobs.filter((j) => j.status === 'active').length,
      upcomingInterviews,
    };
  }, [interviewsData, jobsData, candidatesData, managerId]);

  return {
    summary,
    isLoading: interviewsLoading || jobsLoading || candidatesLoading,
  };
}

/**
 * 3. Autopilot Screening Rule Integration Hook
 * Exposes screening configuration and background rule metadata for the OFC360 Autopilot engine.
 */
export function useAutopilotScreeningRule() {
  return useMemo(() => {
    return {
      ruleKey: 'recruitment_screening',
      ruleName: 'AI Resume Auto-Screening',
      description: 'Automatically trigger Gemini/LLM resume parsing and score ranking on new applicant ingest.',
      triggerEvent: 'application_received' as const,
      defaultThresholds: {
        shortlistScore: 80,
        rejectScore: 40,
      },
      isEnabled: true,
      supportedModels: ['gemini-2.0-flash', 'gemini-1.5-pro', 'ofc360-ats-v2'],
    };
  }, []);
}

/**
 * 4. AI Chat Assistant Recruitment Context Hook
 * Generates an up-to-date conversational context summary for the OFC360 floating AI Chatbot.
 */
export function useAiChatRecruitmentContext() {
  const { metrics, isLoading } = useExecutiveRecruitmentKpis();

  const chatContext = useMemo(() => {
    if (isLoading) return 'Recruitment data is currently synchronizing with the ATS service.';

    return `Current Recruitment & ATS State:
- Active Job Openings: ${metrics.activeJobsCount} roles (${metrics.totalOpenings} vacancies).
- Active Candidates in Pipeline: ${metrics.activePipelineCount} applicants.
- Total Hired This Cycle: ${metrics.hiredCount} employees.
- Average Time-to-Hire: ${metrics.avgTimeToHireDays} days.
- Offer Acceptance Rate: ${metrics.offerAcceptanceRatePercent}% (${metrics.offersAcceptedCount} accepted of ${metrics.offersTotalCount} issued).
- AI Screening Engine: Active and screening inbound applications against role benchmarks.`;
  }, [metrics, isLoading]);

  return {
    chatContext,
    isLoading,
  };
}

