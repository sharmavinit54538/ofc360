/**
 * @file travel.types.ts
 * @description Enterprise TypeScript models and interfaces for Travel Requests,
 * Approval Workflows, Expense Settlements, and Requisition Queries.
 */

export type TravelStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
export type TravelType = 'DOMESTIC' | 'INTERNATIONAL';

export interface ExpenseBreakdown {
  flights: number;
  hotel: number;
  cabs: number;
  perDiem: number;
  other?: number;
  currency: string;
}

export interface TravelEmployee {
  id: string;
  name: string;
  email: string;
  department: string;
  avatarUrl?: string;
  designation?: string;
}

export interface TravelRequest {
  id: string;
  tripId: string;
  employeeId: string;
  employee: TravelEmployee;
  origin: string;
  destination: string;
  travelType: TravelType;
  startDate: string; // ISO date string (YYYY-MM-DD)
  endDate: string;   // ISO date string (YYYY-MM-DD)
  purpose: string;
  businessJustification?: string;
  estimatedCost: number;
  expenses: ExpenseBreakdown;
  status: TravelStatus;
  urgency?: 'LOW' | 'MEDIUM' | 'HIGH';
  emergencyContact?: string;
  notes?: string;
  approverComments?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTravelRequestPayload {
  origin: string;
  destination: string;
  travelType: TravelType;
  startDate: string;
  endDate: string;
  purpose: string;
  businessJustification?: string;
  urgency?: 'LOW' | 'MEDIUM' | 'HIGH';
  expenses: ExpenseBreakdown;
  emergencyContact?: string;
  notes?: string;
}

export interface UpdateTravelStatusPayload {
  id: string;
  status: 'APPROVED' | 'REJECTED';
  comments?: string;
}

export interface TravelRequestFilters {
  search?: string;
  status?: TravelStatus | 'ALL';
  travelType?: TravelType | 'ALL';
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface TravelSummaryMetrics {
  totalRequests: number;
  pendingApprovals: number;
  approvedTrips: number;
  rejectedTrips: number;
  totalEstimatedBudget: number;
  currency: string;
}

export interface TravelRequestListResponse {
  items: TravelRequest[];
  total: number;
  page: number;
  limit: number;
  summary?: TravelSummaryMetrics;
}
