/**
 * @file leave.types.ts
 * @description Enterprise TypeScript models and interfaces for Leave Management,
 * Leave Balances, Leave Requests, Approval Workflows, and Team Calendars.
 */

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export type LeaveDuration = 'FULL_DAY' | 'HALF_DAY_FIRST_HALF' | 'HALF_DAY_SECOND_HALF';

export type LeaveRequestScope = 'MY' | 'TEAM' | 'ALL';

export interface LeaveEmployee {
  id: string;
  name: string;
  email: string;
  department?: string;
  designation?: string;
  avatarUrl?: string;
}

export interface LeaveTypeRef {
  id: string;
  name: string;
  code?: string;
  color?: string;
}

/**
 * Aggregate KPI metrics rendered at the top of the Leave Hub.
 */
export interface LeaveStats {
  onLeaveToday: number;
  pendingRequests: number;
  approvedThisMonth: number;
  rejectedThisMonth: number;
  totalRequestsThisYear: number;
  upcomingHolidays: number;
  teamAvailabilityPercent: number;
  myAvailableDays: number;
}

/**
 * Per leave-type accrual balance ledger for the authenticated employee.
 */
export interface LeaveBalance {
  leaveTypeId: string;
  leaveTypeName: string;
  code?: string;
  color?: string;
  totalQuota: number;
  usedDays: number;
  pendingDays: number;
  availableDays: number;
  carriedForwardDays: number;
  encashedDays: number;
  expiresOn?: string;
}

export interface LeaveRequest {
  id: string;
  requestNumber?: string;
  employeeId: string;
  employee: LeaveEmployee;
  leaveType: LeaveTypeRef;
  startDate: string;
  endDate: string;
  totalDays: number;
  duration: LeaveDuration;
  reason: string;
  status: LeaveStatus;
  contactDuringLeave?: string;
  attachmentUrls?: string[];
  approver?: LeaveEmployee;
  approverComments?: string;
  decidedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplyLeavePayload {
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  duration: LeaveDuration;
  reason: string;
  contactDuringLeave?: string;
  attachmentUrls?: string[];
}

export interface LeaveApprovalPayload {
  id: string;
  status: 'APPROVED' | 'REJECTED';
  comments?: string;
}

export interface CancelLeavePayload {
  id: string;
  reason?: string;
}

export interface LeaveFilterParams {
  search?: string;
  status?: LeaveStatus | 'ALL';
  leaveTypeId?: string;
  scope?: LeaveRequestScope;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface LeaveRequestListResponse {
  items: LeaveRequest[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Single day's occupancy record for the team leave calendar heatmap.
 */
export interface TeamCalendarItem {
  date: string;
  employee: LeaveEmployee;
  leaveType: LeaveTypeRef;
  status: LeaveStatus;
  duration: LeaveDuration;
  totalDays: number;
}

export interface LeaveCalendarResponse {
  items: TeamCalendarItem[];
  startDate: string;
  endDate: string;
}

export interface CompOffRequestPayload {
  workedDate: string;
  hoursWorked: number;
  reason: string;
}

export interface CompOffRequest {
  id: string;
  employeeId: string;
  workedDate: string;
  hoursWorked: number;
  creditedDays: number;
  reason: string;
  status: LeaveStatus;
  expiresOn?: string;
  createdAt: string;
}
