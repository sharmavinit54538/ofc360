/**
 * @file recruitment.types.ts
 * @description Domain types for the Recruitment module: hiring stats,
 * job openings, candidate pipeline entries, interview schedules and the
 * filter/payload DTOs exchanged with the backend RTK Query service.
 */

/** Employment category for a job requisition. */
export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN';

/** Lifecycle status of a job opening. */
export type JobOpeningStatus = 'DRAFT' | 'PUBLISHED' | 'ON_HOLD' | 'CLOSED';

/** Hiring pipeline stage for a candidate. */
export type CandidateStage = 'APPLIED' | 'SCREENING' | 'INTERVIEW' | 'OFFERED' | 'HIRED' | 'REJECTED';

/** How an interview conversation is conducted. */
export type MeetingType = 'ONLINE' | 'IN_PERSON';

/** Lifecycle status of a scheduled interview. */
export type InterviewStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';

/** Aggregate recruitment KPI metrics returned for the hub tiles. */
export interface RecruitmentStats {
  openPositions: number;
  totalApplications: number;
  activePipelineCandidates: number;
  interviewsThisWeek: number;
  offersAcceptedThisMonth: number;
  avgTimeToHireDays: number;
}

/** A single job requisition row. */
export interface JobOpening {
  id: string;
  jobCode: string;
  title: string;
  department: { id: string; name: string };
  location: string;
  jobType: JobType;
  openingsCount: number;
  applicantsCount: number;
  experienceRequired: string;
  salaryRange: { min: number; max: number; currency: string };
  status: JobOpeningStatus;
  hiringManager: { id: string; name: string };
  targetDate: string;
}

/** Paginated job openings response envelope. */
export interface JobListResponse {
  items: JobOpening[];
  total: number;
  page: number;
  limit: number;
}

/** Payload for creating a new job requisition. */
export interface CreateJobPayload {
  title: string;
  departmentId: string;
  location: string;
  jobType: string;
  openingsCount: number;
  experienceMinYears: number;
  experienceMaxYears: number;
  minSalary: number;
  maxSalary: number;
  currency: string;
  description: string;
  skills: string[];
  hiringManagerId: string;
  targetCloseDate: string;
}

/** Payload for changing the lifecycle status of a job. */
export interface UpdateJobStatusPayload {
  status: JobOpeningStatus;
  reason?: string;
}

/** A single candidate in the pipeline. */
export interface CandidateItem {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  appliedJob: { id: string; title: string };
  currentCompany?: string;
  experienceYears: number;
  noticePeriodDays: number;
  currentStage: CandidateStage;
  overallRating?: number;
  resumeUrl?: string;
  appliedDate: string;
}

/** Paginated candidate list response envelope. */
export interface CandidateListResponse {
  items: CandidateItem[];
  total: number;
  page: number;
  limit: number;
}

/** Payload for adding a candidate to the pipeline. */
export interface AddCandidatePayload {
  fullName: string;
  email: string;
  phone: string;
  jobId: string;
  currentCompany?: string;
  experienceYears: number;
  noticePeriodDays: number;
  resumeUrl?: string;
  source?: string;
}

/** Payload for moving a candidate between pipeline stages. */
export interface UpdateCandidateStagePayload {
  stage: CandidateStage;
  notes?: string;
  rejectionReason?: string;
}

/** A scheduled interview between a candidate and interviewers. */
export interface InterviewSchedule {
  id: string;
  candidateId: string;
  candidateName: string;
  jobTitle: string;
  roundName: string;
  roundNumber: number;
  interviewDate: string;
  startTime: string;
  endTime: string;
  interviewers: Array<{ id: string; name: string }>;
  meetingType: MeetingType;
  meetingLink?: string;
  status: InterviewStatus;
}

/** Payload for scheduling a new interview round. */
export interface ScheduleInterviewPayload {
  candidateId: string;
  jobId: string;
  roundName: string;
  roundNumber: number;
  interviewDate: string;
  startTime: string;
  endTime: string;
  interviewerIds: string[];
  meetingType: string;
  meetingLink?: string;
  instructions?: string;
}

/** Filter + pagination parameters shared by recruitment list endpoints. */
export interface RecruitmentFilterParams {
  page: number;
  limit: number;
  jobId?: string;
  departmentId?: string;
  stage?: string;
  status?: string;
  search?: string;
}

/** Optional query params for the aggregate stats endpoint. */
export interface RecruitmentStatsQueryParams {
  departmentId?: string;
}

/** Query params for the interviews list endpoint. */
export interface InterviewFilterParams {
  date?: string;
  status?: string;
}
