/**
 * @file performance.types.ts
 * @description TypeScript contracts for the Performance & Appraisal domain:
 * KPI stats, review cycles, appraisal reviews, goals/OKRs, and peer feedback.
 */

/** Visibility scope for performance data. */
export type PerformanceScope = 'MY' | 'TEAM' | 'ALL';

export type ReviewCyclePeriod = 'QUARTERLY' | 'ANNUAL' | 'BI_ANNUAL';
export type ReviewCycleStatus = 'ACTIVE' | 'CLOSED' | 'UPCOMING';

export type ReviewStatus =
  | 'SELF_REVIEW_PENDING'
  | 'MANAGER_REVIEW_PENDING'
  | 'HR_REVIEW_PENDING'
  | 'COMPLETED'
  | 'PENDING'
  | 'IN_PROGRESS'
  | string;

/** Role submitting an appraisal review. */
export type ReviewRole = 'SELF' | 'MANAGER' | 'HR';

export type GoalCategory =
  | 'ORGANIZATIONAL'
  | 'DEPARTMENTAL'
  | 'INDIVIDUAL'
  | 'TECHNICAL'
  | 'PROFESSIONAL'
  | string;

export type GoalMetricType = 'PERCENTAGE' | 'NUMERIC' | 'BOOLEAN';
export type GoalPriority = 'LOW' | 'MEDIUM' | 'HIGH' | string;
export type GoalStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'AT_RISK'
  | string;

/**
 * Organization-wide aggregate performance KPI metrics.
 */
export interface PerformanceStats {
  averageRating: number;
  totalReviews: number;
  completedReviews: number;
  pendingReviews: number;
  goalsOnTrackPercentage: number;
  activePips: number;
  activeGoals?: number;
  goalsCompletionRate?: number;
  topPerformersCount?: number;
}

/**
 * A configured appraisal review cycle.
 */
export interface ReviewCycle {
  id: string;
  name: string;
  period: ReviewCyclePeriod;
  startDate: string;
  endDate: string;
  status: ReviewCycleStatus;
}

/**
 * Lightweight employee reference embedded in reviews.
 */
export interface PerformanceEmployeeRef {
  id: string;
  name: string;
  department?: string;
  designation?: string;
  avatarUrl?: string;
}

/**
 * One appraisal review assignment for an employee within a cycle.
 */
export interface AppraisalReview {
  id: string;
  employee: PerformanceEmployeeRef;
  cycleName: string;
  cycleId: string;
  selfRating?: number;
  managerRating?: number;
  finalScore?: number;
  status: ReviewStatus;
  dueDate: string;
  // Bi-directional / flattened properties for backend compatibility
  employeeId?: string;
  employeeName?: string;
  employeeCode?: string;
  department?: string;
  designation?: string;
  avatarUrl?: string | null;
  reviewerId?: string;
  reviewerName?: string;
  reviewCycle?: string;
  rating?: number;
  overallRating?: number;
  strengths?: string;
  improvements?: string;
  areasOfImprovement?: string;
  comments?: string;
  managerComments?: string;
  submittedAt?: string;
  createdAt?: string;
}

/**
 * Single competency line item of a review submission.
 */
export interface CompetencyRating {
  competencyId: string;
  name: string;
  rating: number;
  comments: string;
}

/**
 * Full detail of an appraisal review including competency-level ratings.
 */
export type ReviewDetail = AppraisalReview & {
  ratings: CompetencyRating[];
  strengths?: string;
  areasOfImprovement?: string;
  managerComments?: string;
};

/**
 * Payload for a self / manager / HR review submission.
 */
export interface SubmitReviewPayload {
  role?: ReviewRole;
  ratings?: CompetencyRating[];
  overallRating?: number;
  rating?: number;
  strengths?: string;
  areasOfImprovement?: string;
  improvements?: string;
  comments?: string;
  recommendedPromotion?: boolean;
  status?: string;
  employee_id?: string | null;
  reviewer_id?: string | null;
  review_period?: string;
  cycle?: string;
}

/**
 * Paginated response for appraisal review listings.
 */
export interface AppraisalReviewListResponse {
  items: AppraisalReview[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Filters accepted by the appraisal review listing endpoint.
 */
export interface PerformanceFilterParams {
  page?: number;
  limit?: number;
  cycleId?: string;
  status?: ReviewStatus | 'ALL';
  scope?: PerformanceScope;
  search?: string;
}

/**
 * Query params accepted by the aggregate stats endpoint.
 */
export interface PerformanceStatsQueryParams {
  cycleId?: string;
  departmentId?: string;
}

/**
 * A goal / OKR objective with live progress tracking.
 */
export interface GoalItem {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  metricType: GoalMetricType;
  targetValue: number;
  currentValue: number;
  progressPercentage: number;
  priority: GoalPriority;
  status: GoalStatus;
  targetDate: string;
  assignee: { id: string; name: string };
  // Bi-directional / flattened properties for backend compatibility
  employeeId?: string;
  employeeName?: string;
  progress?: number;
  dueDate?: string;
  startDate?: string;
  keyResults?: any[];
  createdAt?: string;
}

export interface CreateGoalPayload {
  title: string;
  description?: string;
  category?: GoalCategory;
  metricType?: GoalMetricType;
  targetValue?: number;
  currentValue?: number;
  priority?: GoalPriority;
  targetDate?: string;
  dueDate?: string;
  assigneeId?: string;
  employeeId?: string;
  progress?: number;
  status?: string;
  [key: string]: any;
}

export interface UpdateGoalProgressPayload {
  id: string;
  currentValue?: number;
  progress?: number;
  notes?: string;
  status?: string;
  [key: string]: any;
}

/**
 * Filters accepted by the goals listing endpoint.
 */
export interface GoalQueryParams {
  scope?: PerformanceScope;
  status?: GoalStatus | 'ALL';
  category?: GoalCategory | 'ALL';
}

/**
 * One 360-degree peer feedback submission.
 */
export interface PeerFeedbackItem {
  id: string;
  fromEmployee: { id: string; name: string };
  toEmployee: { id: string; name: string };
  cycleId: string;
  feedback: string;
  rating: number;
  createdAt: string;
}

export interface SubmitPeerFeedbackPayload {
  toEmployeeId: string;
  cycleId?: string;
  feedback: string;
  rating: number;
}
