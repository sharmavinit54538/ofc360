/**
 * @file visitors.types.ts
 * @description Enterprise TypeScript contracts and models for the Visitor Management Module,
 * including Visitor entities, Statuses, Host Approval, Analytics, and API payloads.
 */

export type VisitorStatus = 'EXPECTED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'REJECTED' | 'CANCELLED';

export type HostApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface HostEmployee {
  id: string;
  name: string;
  email: string;
  department?: string;
  designation?: string;
}

export interface Visitor {
  id: string;
  visitorCode: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  hostEmployeeId: string;
  hostName?: string;
  hostDepartment?: string;
  purpose: string;
  ndaSigned: boolean;
  status: VisitorStatus;
  hostApprovalStatus: HostApprovalStatus;
  badgeNumber?: string;
  checkInTime?: string;
  checkOutTime?: string;
  expectedArrival?: string;
  photoUrl?: string;
  idProofType?: string;
  idProofNumber?: string;
  notes?: string;
  isOverstay?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface VisitorAnalytics {
  currentlyOnPremises: number;
  expectedToday: number;
  totalToday: number;
  overstayAlerts: number;
  avgVisitDurationMinutes?: number;
  totalThisWeek?: number;
}

export interface RegisterVisitorPayload {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  hostEmployeeId: string;
  purpose: string;
  ndaSigned: boolean;
  expectedArrival?: string;
  notes?: string;
}

export interface CheckInVisitorPayload {
  id: string;
  badgeNumber?: string;
  idProofType?: string;
  idProofNumber?: string;
}

export interface CheckOutVisitorPayload {
  id: string;
  checkOutNotes?: string;
}

export interface UpdateHostApprovalPayload {
  id: string;
  status: HostApprovalStatus;
  remarks?: string;
}

export interface VisitorsListFilters {
  search?: string;
  status?: VisitorStatus | 'ALL';
  hostApprovalStatus?: HostApprovalStatus | 'ALL';
  date?: string;
  page?: number;
  limit?: number;
}

export interface VisitorsListResponse {
  items: Visitor[];
  total: number;
  page: number;
  limit: number;
  analytics?: VisitorAnalytics;
}
