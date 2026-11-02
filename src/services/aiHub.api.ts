/**
 * @file aiHub.api.ts
 * @description Enterprise RTK Query API slice for OFC360 AI Hub & Autonomous Tools.
 * Strictly binds to FastAPI backend routes mounted under /api/v1/ai-hub and /api/v1/ai.
 * Re-exports chatAssistantApi for backwards compatibility.
 */

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/shared/api/baseQuery';

export * from './chatAssistantApi';
export { chatAssistantApi as default } from './chatAssistantApi';

export interface ResumeMatchCandidate {
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  overallScore: number; // 0 - 100
  skillsMatchRate: number; // 0 - 100
  matchedSkills: string[];
  missingSkills: string[];
  experienceYears: number;
  educationMatch: boolean;
  rankingPosition: number;
  status: 'SHORTLISTED' | 'SCREENED' | 'UNDER_REVIEW' | 'REJECTED';
}

export interface ResumeMatchJobSummary {
  jobId: string;
  jobTitle: string;
  department: string;
  totalApplicants: number;
  averageMatchScore: number;
  topSkillsRequired: string[];
  candidates: ResumeMatchCandidate[];
}

export interface CapacityPlanningDepartment {
  departmentId: string;
  departmentName: string;
  totalHeadcount: number;
  activeWorkloadScore: number; // 0 - 100
  plannedLeavesCount: number;
  netAvailableCapacity: number; // percentage
  utilizationRisk: 'OPTIMAL' | 'MODERATE' | 'OVERLOADED' | 'UNDER_UTILIZED';
  recommendedActions: string[];
}

export interface ShiftAiCoverageMetric {
  shiftId: string;
  shiftName: string;
  startTime: string;
  endTime: string;
  scheduledCapacity: number;
  actualPunchCount: number;
  coverageRatio: number; // percentage
  overtimeHours: number;
  anomalyCount: number;
  status: 'ADEQUATE' | 'UNDERSTAFFED' | 'OVERTIME_SPIKE';
}

export interface PayrollAuditFinding {
  id: string;
  findingType: 'NET_PAY_SPIKE' | 'MISSING_PAN_UAN' | 'NEGATIVE_ADJUSTMENT' | 'TAX_MISMATCH' | 'OVERTIME_BURDEN';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  employeeId: string;
  employeeName: string;
  department: string;
  amountAtRisk?: number;
  amountFormatted?: string;
  description: string;
  suggestedCorrection: string;
  status: 'PENDING_AUDIT' | 'RESOLVED' | 'DISMISSED';
}

export interface AutonomousWorkflowExecution {
  workflowId: string;
  workflowName: string;
  triggerType: 'ONBOARDING' | 'EXIT' | 'APPROVAL' | 'ATTENDANCE_REGULARIZATION';
  totalRuns: number;
  successRate: number; // 0 - 100
  activeBottlenecksCount: number;
  lastRunTimestamp: string;
  recentLogs: Array<{
    id: string;
    timestamp: string;
    step: string;
    status: 'SUCCESS' | 'FAILED' | 'WAITING_APPROVAL';
    details: string;
  }>;
}

// Transform response helper
const transformResponse = <T>(response: any): T => {
  if (response && typeof response === 'object' && 'data' in response && response.data !== undefined) {
    return response.data as T;
  }
  return response as T;
};

export const aiHubApi = createApi({
  reducerPath: 'aiHubApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['AiHubResume', 'AiHubCapacity', 'AiHubShift', 'AiHubPayroll', 'AiHubWorkflows'],
  endpoints: (builder) => ({
    /**
     * Get candidate resume match results for selected job opening.
     */
    getResumeMatchResults: builder.query<ResumeMatchJobSummary, { jobId?: string } | void>({
      query: (arg) => {
        const jobId = arg?.jobId;
        return `/ai/recruiter/job/${jobId ? encodeURIComponent(jobId) : 'all'}/match`;
      },
      transformResponse: (response: any) => transformResponse<ResumeMatchJobSummary>(response),
      providesTags: ['AiHubResume'],
    }),

    /**
     * Get real capacity planning and workforce workload utilization by department.
     */
    getCapacityPlanningAnalysis: builder.query<CapacityPlanningDepartment[], { departmentId?: string } | void>({
      query: (arg) => {
        const dept = arg?.departmentId;
        return `/ai/workforce-planning/capacity${dept && dept !== 'ALL' ? `?departmentId=${encodeURIComponent(dept)}` : ''}`;
      },
      transformResponse: (response: any) => transformResponse<CapacityPlanningDepartment[]>(response),
      providesTags: ['AiHubCapacity'],
    }),

    /**
     * Get Shift AI Monitor real-time coverage gaps and overtime alerts.
     */
    getShiftAiAnomalies: builder.query<ShiftAiCoverageMetric[], void>({
      query: () => '/ai/attendance/shift-monitor',
      transformResponse: (response: any) => transformResponse<ShiftAiCoverageMetric[]>(response),
      providesTags: ['AiHubShift'],
    }),

    /**
     * Scan active or selected payroll run for anomalies.
     */
    getPayrollAuditFindings: builder.query<PayrollAuditFinding[], { runId?: string } | void>({
      query: (arg) => {
        const runId = arg?.runId;
        return `/ai/payroll/audit-scan${runId ? `?runId=${encodeURIComponent(runId)}` : ''}`;
      },
      transformResponse: (response: any) => transformResponse<PayrollAuditFinding[]>(response),
      providesTags: ['AiHubPayroll'],
    }),

    /**
     * Get autonomous workflows execution metrics and bottleneck logs.
     */
    getAutonomousWorkflowsStats: builder.query<AutonomousWorkflowExecution[], void>({
      query: () => '/ai/workflows/stats',
      transformResponse: (response: any) => transformResponse<AutonomousWorkflowExecution[]>(response),
      providesTags: ['AiHubWorkflows'],
    }),
  }),
});

export const {
  useGetResumeMatchResultsQuery,
  useGetCapacityPlanningAnalysisQuery,
  useGetShiftAiAnomaliesQuery,
  useGetPayrollAuditFindingsQuery,
  useGetAutonomousWorkflowsStatsQuery,
} = aiHubApi;
