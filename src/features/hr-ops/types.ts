/**
 * @file types.ts
 * @description Enterprise TypeScript models and interfaces for the HR Operations Command Center,
 * managing operational action items, lifecycle queues, clearances, and compliance oversight.
 */

export type HrOpsActionType =
  | 'ONBOARDING'
  | 'EXIT'
  | 'CLEARANCE'
  | 'DOCUMENT_VERIFICATION'
  | 'LEAVE_APPROVAL';

export type HrOpsPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type HrOpsStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';

export interface HrOpsMetrics {
  activeCases: number;
  pendingClearances: number;
  pendingOnboarding: number;
  complianceAlerts: number;
  pendingLeaves: number;
  unresolvedTickets: number;
}

export interface HrOpsActionItem {
  id: string;
  type: HrOpsActionType;
  title: string;
  description: string;
  assigneeId?: string;
  assigneeName?: string;
  priority: HrOpsPriority;
  dueDate: string; // ISO date string (YYYY-MM-DD)
  status: HrOpsStatus;
  link?: string;
  targetEmployeeId?: string;
  targetEmployeeName?: string;
  department?: string;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface HrOpsFilterParams {
  type?: HrOpsActionType | 'ALL';
  priority?: HrOpsPriority | 'ALL';
  status?: HrOpsStatus | 'ALL';
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface HrOpsQueueResponse {
  items: HrOpsActionItem[];
  total: number;
  page: number;
  limit: number;
  metrics?: HrOpsMetrics;
}

export interface UpdateActionItemStatusPayload {
  id: string;
  status: HrOpsStatus;
  resolutionNotes?: string;
}

export interface AssignActionItemPayload {
  id: string;
  assigneeId: string;
  assigneeName: string;
}
